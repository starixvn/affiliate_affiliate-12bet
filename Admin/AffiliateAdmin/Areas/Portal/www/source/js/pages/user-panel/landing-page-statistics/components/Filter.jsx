import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DatePicker } from '@9softstudio/react-datepicker';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { getDateRange } from '../../../../modules/utils';
import { headerTitle, deviceTypes, globalResource, minDate, AllDevices } from '../modules/constants';
import { setSelectedPage, setParam, getPageList } from '../actions';
import { htmlDecode } from '../../../../modules/htmlHelper';

export class Filter extends React.Component {
    constructor(props) {
        super(props);

        const { today } = this.props;
        const now = new Date(today);

        this.nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

        this.state = {
            selectedPage: '',
            languageCode: '',
            fromDate: `${now.getMonth() + 1}/01/${now.getFullYear()}`,
            toDate: this.nowString,
            deviceType: AllDevices,
            pageList: null
        };
    }

    componentDidMount() {
        if (!this.state.pageList) {
            this.handleGetPageList();
        }
    }

    handleGetPageList = async () => {
        const pageList = await this.props.getPageList();

        this.setState({ pageList });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(getDateRange(momentDate, this.state.toDate));
    }

    handleChangeToDate = (momentDate) => {
        this.setState({ toDate: momentDate.format("MM/DD/YYYY") });
    }

    handleSearch = () => {
        const { selectedPage, languageCode, fromDate, toDate, deviceType } = this.state;
        const param = Object.assign({}, { selectedPage, languageCode, fromDate, toDate, deviceType, affId: this.props.affId });

        this.props.setParam(param);
        this.props.setSelectedPage(null);
    }

    render() {
        const { languageList } = this.props;
        const { selectedPage, languageCode, deviceType, fromDate, toDate, pageList } = this.state;

        return pageList && (
            <div className="filter-container py-0">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2 my-2">
                        <Label htmlFor="selectedPage" className="mr-sm-2">{headerTitle.Page}</Label>
                        <Input type="select" name="selectedPage" id="selectedPage" value={selectedPage} onChange={this.handleChange}>
                            <option value="">{globalResource.All}</option>
                            {
                                pageList.map(page => {
                                    return (<option key={`page-${page.PageCode}`} value={page.PageCode}>{htmlDecode(page.PageName)}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="mr-sm-2 my-2">
                        <Label htmlFor="languageCode" className="mr-sm-2">{headerTitle.Language}</Label>
                        <Input type="select" name="languageCode" id="languageCode" value={languageCode} onChange={this.handleChange}>
                            <option value="">{globalResource.All}</option>
                            {
                                Object.keys(languageList).map(key => {
                                    return (<option key={`language-${key}`} value={key}>{languageList[key]}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="mr-sm-2 my-2">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2 my-2">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2 my-2">
                        <Label htmlFor="deviceType" className="mr-sm-2">{headerTitle.Device}</Label>
                        <Input type="select" name="deviceType" id="deviceType" value={deviceType} onChange={this.handleChange}>
                            {
                                Object.keys(deviceTypes).map(key => {
                                    return (<option key={`deviceType-${deviceTypes[key]}`} value={deviceTypes[key]}>{key}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <Button outline className="my-2" color="primary" type="button" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({ today, affCommonInfo, languageList }) {
    const { affId } = affCommonInfo;

    return Object.assign({}, {
        today,
        affId,
        languageList
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedPage, setParam, getPageList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);