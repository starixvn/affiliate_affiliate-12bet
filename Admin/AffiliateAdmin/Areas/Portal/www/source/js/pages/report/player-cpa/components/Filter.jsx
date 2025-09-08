import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button, Form, FormGroup, Label } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import Field from '../../../../components/Field';
import MultipleSelect from '../../../../components/multiple-select';

import { setReportTitle, setParams, setPlayerCpaData, setPagingOption } from '../actions';
import { reportName, statusOptions, viewByOptions, defaultParams } from '../libs/constants';
import { formatUnit, handleAfterChangeFromDate, handleAfterChangeToDate, handleChangeMultipleSelected } from '../../../../modules/utils';
import { globalResource } from '../../../../modules/globalResource';
import { defaultPagingOption, minDate, sixMonth } from '../../../../modules/constants';
import { getPlayerCpaData } from '../libs/service';
import { toggleLoader } from '../../../../actions/loaderAction';

const Filter = ({
    params,
    setParams,
    setPlayerCpaData,
    setPagingOption,
    pagingOption,
    today,
    deals,
    toggleLoader,
    setReportTitle,
    shouldTriggerSearch
}) => {
    const [nowString, setNowString] = useState('');
    const [dealList, setDealList] = useState(deals);

    useEffect(() => {
        const now = new Date(today);
        const currentMonth = now.getMonth() + 1;
        const currentMonthString = formatUnit(currentMonth);
        const currentYear = now.getFullYear();

        const nowStr = `${currentMonthString}/${formatUnit(now.getDate())}/${currentYear}`;
        setNowString(nowStr);

        if (!shouldTriggerSearch) {
            setParams({
                fromDate: `${currentMonthString}/01/${currentYear}`,
                toDate: nowStr
            });
        }
    }, []);

    useEffect(() => {
        if (!shouldTriggerSearch && deals && deals.length > 0) {
            const dealIds = deals.map(deal => deal.key).join(',');
            setParams({
                dealName: dealIds
            });
        }
    }, []);

    useEffect(() => {
        if (shouldTriggerSearch) {
            handleClickSearch();
        }
    }, [shouldTriggerSearch]);

    const handleChange = (e) => {
        setParams({
            [e.target.name]: e.target.value
        })
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

    const handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();

            handleClickSearch();
        }
    }

    const handleClickSearch = () => {
        const newParams = {
            ...params,
            sortColumn: defaultParams.sortColumn,
            isAscending: defaultParams.isAscending
        };

        setParams(newParams);
        fetchData(newParams);
    };

    const fetchData = async (currentParams = params) => {
        toggleLoader(true);

        const data = await getPlayerCpaData(currentParams);
        if (data) {
            setPagingOption({
                PageIndex: defaultPagingOption.PageIndex,
                PageSize: defaultPagingOption.PageSize,
                TotalItem: data?.totalItem
            });
            setReportTitle(getTitle());
            setPlayerCpaData(data);
        }

        toggleLoader(false);
    };

    const getTitle = () => {
        let title = reportName;
        title += ` - View By ${viewByOptions[+params.viewBy - 1].label}`;
        title += ` - From ${params.fromDate} To ${params.toDate}`;

        return title;
    }

    return (
        <div className="filter-container">
            <Form inline tag="div">
                <Field className="my-sm-1 mr-sm-4" name="userName" value={params.userName} onChange={handleChange} label="Affiliate" onPressEnter={handlePressEnter} />
                <Field className="my-sm-1 mr-sm-4" name="custName" value={params.custName} onChange={handleChange} label="Player" onPressEnter={handlePressEnter} />
                <FormGroup className="my-sm-1 mr-sm-4">
                    <Label htmlFor="Deal" className="mr-sm-2">Deal Name</Label>
                    <MultipleSelect
                        dataSource={dealList}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        noneSelectedLabel="None Select"
                        selectedAllLabel="All Deals"
                        hasInputOption={true}
                        onChange={handleChangeDeals} />
                </FormGroup>
                <Field className="my-sm-1 mr-sm-2" name="statusId" selectedValue={params.statusId} onChange={handleChange} label="Status" selectOptions={statusOptions} type='select' />
                <Field className="my-sm-1 mr-sm-2" name="viewBy" selectedValue={params.viewBy} onChange={handleChange} label="View By" selectOptions={viewByOptions} type='select' />
                <FormGroup className="my-sm-1 mr-sm-2">
                    <Label className="mr-sm-2">{globalResource.From}</Label>
                    <DatePicker
                        minDate={minDate}
                        maxDate={nowString}
                        date={params.fromDate}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={handleChangeFromDate} />
                </FormGroup>
                <FormGroup className="my-sm-1 mr-sm-4">
                    <Label className="mr-sm-2">{globalResource.To}</Label>
                    <DatePicker
                        minDate={params.fromDate}
                        maxDate={nowString}
                        date={params.toDate}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={handleChangeToDate} />
                </FormGroup>
                <Button outline color="primary" type="button" onClick={handleClickSearch}>
                    <span className="oi oi-magnifying-glass"></span> Search
                </Button>
            </Form>
        </div>
    )
}
function mapStateToProps({ playerCpaData, params, today, deals, pagingOption, shouldTriggerSearch }) {
    return Object.assign({}, {
        playerCpaData,
        params,
        today,
        deals,
        pagingOption,
        shouldTriggerSearch
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setReportTitle,
        setParams,
        setPlayerCpaData,
        setPagingOption,
        toggleLoader
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));