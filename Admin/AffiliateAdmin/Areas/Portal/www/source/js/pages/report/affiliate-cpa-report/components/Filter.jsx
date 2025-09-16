import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import MultipleSelect from '../../../../components/multiple-select';

import { setParams, toggleSubmit } from '../actions';
import { globalResource } from '../../../../modules/globalResource';
import { viewByOptions, defaultParams } from '../libs/constants';
import { formatUnit, handleAfterChangeFromDate, handleAfterChangeToDate, handleChangeMultipleSelected } from '../../../../modules/utils';
import { minDate, sixMonth, defaultPagingOption } from '../../../../modules/constants';

const Filter = ({ setParams, params, toggleSubmit, today, deals, triggerSubmit }) => {
    const [nowString, setNowString] = useState('');
    const [dealList, setDealList] = useState(deals);

    useEffect(() => {
        const now = new Date(today);

        const currentMonth = now.getMonth() + 1;
        const currentMonthString = formatUnit(currentMonth);
        const currentYear = now.getFullYear();

        let nowString = `${currentMonthString}/${formatUnit(now.getDate())}/${currentYear}`;

        let fromDate = `${currentMonthString}/01/${currentYear}`;
        let toDate = nowString;

        if (params.fromDate) {
            fromDate = params.fromDate;
        }
        if (params.toDate) {
            toDate = params.toDate;
        }

        setNowString(nowString);
        setParams({
            fromDate,
            toDate
        });
    }, []);

    useEffect(() => {
        if (!params.dealName && deals && deals.length > 0) {
            const dealIds = deals.map(deal => deal.key).join(',');
            setParams({
                dealName: dealIds
            });
        }
    }, []);

    useEffect(() => {
        if (triggerSubmit) {
            toggleSubmit();
        }
    }, [triggerSubmit]);

    const onEnterPress = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();
            onSearch();
        }
    }

    const onChange = (event) => {
        const { name, value } = event.target;
        setParams({ [name]: value });
    }

    const handleChangeFromDate = (date) => {
        setParams({ ...handleAfterChangeFromDate(date, params.toDate, sixMonth) });
    }
    const handleChangeToDate = (date) => {
        setParams({ ...handleAfterChangeToDate(date, params.fromDate, sixMonth) });
    }

    const handleChangeDeals = (item, selectedDeals) => {
        setDealList(handleChangeMultipleSelected(dealList, selectedDeals));
        setParams({
            dealName: selectedDeals
        });
    }

    const onSearch = () => {
        resetParams();
        toggleSubmit();
    }

    const resetParams = () => {
        setParams({
            pageIndex: defaultPagingOption.PageIndex,
            pageSize: defaultPagingOption.PageSize,
            sortType: defaultParams.sortType,
            sortDirectionType: defaultParams.sortDirectionType
        });
    }

    return (
        <div className="filter-container">
            <Form inline tag="div">
                <FormGroup className="my-sm-1 mr-sm-4">
                    <Label htmlFor="Affiliate" className="mr-sm-2">Affiliate</Label>
                    <Input type="text" name="username" id="Affiliate" maxLength="30"
                        onKeyPress={onEnterPress}
                        onChange={onChange}
                        value={params.username} />
                </FormGroup>
                <FormGroup className="my-sm-1 mr-sm-4">
                    <Label htmlFor="Deal" className="mr-sm-2">Deal Name</Label>
                    <MultipleSelect
                        dataSource={dealList}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        selectedAllLabel="All Deals"
                        hasInputOption={true}
                        onChange={handleChangeDeals} />
                </FormGroup>
                <FormGroup className="my-sm-1 mr-sm-4">
                    <Label htmlFor="ViewBy" className="mr-sm-2">View By</Label>
                    <Input type="select" name="viewBy" id="ViewBy"
                        onKeyPress={onEnterPress}
                        onChange={onChange}
                        value={params.viewBy} >
                        {
                            viewByOptions.map(v => <option key={v.value} value={v.value}>{v.label}</option>)
                        }
                    </Input>
                </FormGroup>

                <FormGroup className="my-sm-1 mr-sm-4">
                    <Label className="mr-sm-2">{globalResource.From}</Label>
                    <DatePicker
                        minDate={minDate}
                        maxDate={nowString}
                        date={params.fromDate}
                        onChange={handleChangeFromDate}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)} />

                </FormGroup>
                <FormGroup className="my-sm-1 mr-sm-4"
                    key={`${params.fromDate}-${params.toDate}`}>
                    <Label className="mr-sm-2">{globalResource.To}</Label>
                    <DatePicker
                        minDate={params.fromDate}
                        maxDate={nowString}
                        date={params.toDate}
                        onChange={handleChangeToDate}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)} />

                </FormGroup>
                <Button outline color="primary" type="button" onClick={onSearch}>
                    <span className="oi oi-magnifying-glass"></span> Search
                </Button>
            </Form>
        </div>
    )
}

function mapStateToProps(state) {
    return Object.assign({}, {
        pagingOption: state.pagingOption,
        isProduction: state.isProduction,
        today: state.today,
        params: state.params,
        deals: state.deals,
        triggerSubmit: state.triggerSubmit
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams, toggleSubmit }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);