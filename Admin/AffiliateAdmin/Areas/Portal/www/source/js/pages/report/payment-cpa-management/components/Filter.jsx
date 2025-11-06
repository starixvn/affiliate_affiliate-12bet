import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Label, Button, Input } from 'reactstrap';

import Field from '../../../../components/Field';
import MultipleSelect from '../../../../components/multiple-select';
import { DatePicker } from '@9softstudio/react-datepicker';

import { setParams, toggleSubmit } from '../actions';
import { getCookie, handleAfterChangeFromDate, handleAfterChangeToDate, handleChangeMultipleSelected, getFirstDayOfMonth } from '../../../../modules/utils';
import { globalResource } from '../../../../modules/globalResource';
import { defaultPagingOption, minDate, sixMonth } from '../../../../modules/constants';
import { statusOptions, viewByOptions } from '../libs/constants';
import { relativePath } from '../../libs/constants';

export const Filter = ({ params, setParams, today, deals, toggleSubmit }) => {
    const [dealList, setDealList] = useState(deals);
    const [statusList, setStatusList] = useState(statusOptions);

    useEffect(() => {
        const now = new Date(today);

        let dealIds = '';
        if (deals && deals.length > 0) {
            dealIds = deals.map(deal => deal.key).join(',');
        }

        let selectedStatus = '';
        if (statusList && statusList.length > 0) {
            selectedStatus = statusList.map(status => status.key).join(',');
        }

        let initialParams = {
            fromDate: getFirstDayOfMonth(now),
            toDate: today,
            dealIds,
            status: selectedStatus
        }

        const paramFromOtherReport = getCookie('paramForPaymentCPAManagement');
        if (paramFromOtherReport) {
            const param = JSON.parse(paramFromOtherReport);

            initialParams = {
                ...initialParams,
                userName: param.affName,
                viewBy: param.viewBy,
                fromDate: param.fromDate,
                toDate: param.toDate
            };

            if (param.status) {
                initialParams.status = param.status;
                setStatusList(handleChangeMultipleSelected(statusList, `${param.status}`));
            }

            if (param.dealIds) {
                initialParams.dealIds = `${param.dealIds}`;
                setDealList(handleChangeMultipleSelected(dealList, `${param.dealIds}`));
            }

            document.cookie = `paramForPaymentCPAManagement=; path=${relativePath.paymentCpaManagement}`;
        }

        setParams(initialParams);
        paramFromOtherReport && handleClickSearch();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams({
            [name]: value
        });
    }

    const handleChangeDeals = (item, selectedDeals) => {
        setDealList(handleChangeMultipleSelected(dealList, selectedDeals));
        setParams({
            dealIds: selectedDeals
        });
    }

    const handleChangeStatus = (item, selectedStatus) => {
        setStatusList(handleChangeMultipleSelected(statusList, selectedStatus));
        setParams({
            status: selectedStatus
        })
    }

    const handleChangeFromDate = (date) => {
        setParams({ ...handleAfterChangeFromDate(date, params.toDate, sixMonth) });
    }
    const handleChangeToDate = (date) => {
        setParams({ ...handleAfterChangeToDate(date, params.fromDate, sixMonth) });
    }

    const handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();

            handleClickSearch();
        }
    }

    const handleClickSearch = () => {
        resetParams();
        toggleSubmit(true);
    }

    const resetParams = () => {
        setParams({
            pageIndex: defaultPagingOption.PageIndex,
            pageSize: defaultPagingOption.PageSize
        });
    }

    return (
        <React.Fragment>
            <div className="filter-container">
                <Form inline tag="div">
                    <Field
                        className="my-sm-1 mr-sm-4"
                        name="userName"
                        value={params.userName}
                        onChange={handleChange}
                        label="Affiliate"
                        onPressEnter={handlePressEnter}
                    />
                    <FormGroup className="my-sm-2 mr-sm-4">
                        <Label className="mr-sm-2">Deal Name</Label>
                        <MultipleSelect
                            dataSource={dealList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            noneSelectedLabel="Please Select"
                            selectedAllLabel="All Deals"
                            hasInputOption={true}
                            onChange={handleChangeDeals} />
                    </FormGroup>
                    <FormGroup className="my-sm-2 mr-sm-4">
                        <Label className="mr-sm-2">Status</Label>
                        <MultipleSelect
                            dataSource={statusList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            noneSelectedLabel="Please Select"
                            selectedAllLabel="All Status"
                            hasInputOption={false}
                            onChange={handleChangeStatus} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-4">
                        <Label className="mr-sm-2">View By</Label>
                        <Input type="select" name="viewBy" id="ViewBy" value={params.viewBy} onChange={handleChange}>
                            {Object.entries(viewByOptions).map(([key, value]) => (
                                <option key={`view-by-${key}`} value={key}>
                                    {value}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-4">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker
                            minDate={minDate}
                            maxDate={today}
                            date={params.fromDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-4">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker
                            minDate={params.fromDate}
                            maxDate={today}
                            date={params.toDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={handleChangeToDate} />
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={handleClickSearch}>
                        <span className="oi oi-magnifying-glass"></span> Search
                    </Button>
                </Form>
            </div>
        </React.Fragment>
    )
};

const mapStateToProps = ({ params, today, deals }) => {
    return {
        params,
        today,
        deals
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setParams,
        toggleSubmit
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));