import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { globalResource, minDate } from '../modules/constants';
import { getDateRange, getSixMonthAgoFromNow } from '@/modules/utils';
import { setParam } from '../actions';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        const { today, param } = this.props;
        const now = new Date(today);

        this.nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

        const fromDate = getSixMonthAgoFromNow(today);

        this.state = param || {
            isGetAll: false,
            fromDate,
            toDate: this.nowString,
        }
    }

    componentDidMount() {
        const { isBack, scrollTop } = this.props.param || { isBack: false, scrollTop: 0 }
        this.search(isBack, scrollTop);
    }

    handleSearch = (e) => {
        this.search(false, 0);
    }

    search = (isBack, scrollTop) => {
        const { isGetAll, fromDate, toDate } = this.state;
        const newParam = Object.assign({}, {
            isGetAll,
            fromDate,
            toDate,
            isBack,
            scrollTop
        });
        this.props.setParam(newParam);
    }

    handleChecked = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(getDateRange(momentDate, this.state.toDate));
    }

    handleChangeToDate = (momentDate) => {
        this.setState({ toDate: momentDate.format("MM/DD/YYYY") });
    }

    render() {
        const { isGetAll, fromDate, toDate } = this.state;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate} isEnable={!isGetAll}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate} isEnable={!isGetAll}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                        <FormGroup check>
                            <Label check>
                                {globalResource.GetAll}
                                <Input name="isGetAll" className="ml-1 mr-2" type="checkbox" checked={isGetAll} onChange={this.handleChecked} />
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({ today, statementHistory }) {
    const { param } = statementHistory;

    return Object.assign({}, { today, param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);