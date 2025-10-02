import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MultipleSelect from '@/components/multiple-select';
import { DatePicker } from '@9softstudio/react-datepicker';
import { handleChangeMultipleSelected, handleAfterChangeFromDate, handleAfterChangeToDate } from '@/modules/utils';
import { minDate, sixMonth } from '@/modules/constants';

import { setParam } from '../actions';
import { globalResource } from '../libs/constants';

export const Filter = ({
    today,
    pagingOption, 
    setParam,
    targetCountryList,
    languageList,
    eventList,
    groupList,
    channelList,
    agencyList,
    typeList,
    ...props
}) => {
    const now = new Date(today);
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const nowString = `${currentMonth}/${now.getDate()}/${currentYear}`;


    // State for multiple select lists
    const [targetCountrySelectList, setTargetCountrySelectList] = useState(targetCountryList);
    const [languageSelectList, setLanguageSelectList] = useState(languageList);
    const [eventSelectList, setEventSelectList] = useState(eventList);
    const [groupSelectList, setGroupSelectList] = useState(groupList);
    const [channelSelectList, setChannelSelectList] = useState(channelList);
    const [agencySelectList, setAgencySelectList] = useState(agencyList);
    const [typeSelectList, setTypeSelectList] = useState(typeList);

    const [filters, setFilters] = useState({
        linkName: '',
        campaignName: '',
        affiliateName: '',
        targetCountryCodes: targetCountrySelectList ? targetCountrySelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        language: languageSelectList ? languageSelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        event: eventSelectList ? eventSelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        group: groupSelectList ? groupSelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        channel: channelSelectList ? channelSelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        agency: agencySelectList ? agencySelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        type: typeSelectList ? typeSelectList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
        fromDate: `${currentMonth}/01/${currentYear}`,
        toDate: nowString,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeTargetCountry = (item, selectedTargetCountryList) => {
        setTargetCountrySelectList(handleChangeMultipleSelected(targetCountrySelectList, selectedTargetCountryList));
        setFilters({ ...filters, targetCountryCodes: selectedTargetCountryList });
    };

    const handleChangeLanguage = (item, selectedLanguageList) => {
        setLanguageSelectList(handleChangeMultipleSelected(languageSelectList, selectedLanguageList));
        setFilters({ ...filters, language: selectedLanguageList });
    };

    const handleChangeEvent = (item, selectedEventList) => {
        setEventSelectList(handleChangeMultipleSelected(eventSelectList, selectedEventList));
        setFilters({ ...filters, event: selectedEventList });
    };

    const handleChangeGroup = (item, selectedGroupList) => {
        setGroupSelectList(handleChangeMultipleSelected(groupSelectList, selectedGroupList));
        setFilters({ ...filters, group: selectedGroupList });
    };

    const handleChangeChannel = (item, selectedChannelList) => {
        setChannelSelectList(handleChangeMultipleSelected(channelSelectList, selectedChannelList));
        setFilters({ ...filters, channel: selectedChannelList });
    };

    const handleChangeAgency = (item, selectedAgencyList) => {
        setAgencySelectList(handleChangeMultipleSelected(agencySelectList, selectedAgencyList));
        setFilters({ ...filters, agency: selectedAgencyList });
    };

    const handleChangeType = (item, selectedTypeList) => {
        setTypeSelectList(handleChangeMultipleSelected(typeSelectList, selectedTypeList));
        setFilters({ ...filters, type: selectedTypeList });
    };

    const handleChangeFromDate = (momentDate) => {
        const updatedDates = handleAfterChangeFromDate(momentDate, filters.toDate, sixMonth);
        setFilters(prev => ({
            ...prev,
            fromDate: updatedDates.fromDate,
            toDate: updatedDates.toDate
        }));
    };

    const handleChangeToDate = (momentDate) => {
        const updatedDates = handleAfterChangeToDate(momentDate, filters.fromDate, sixMonth);
        setFilters(prev => ({
            ...prev,
            fromDate: updatedDates.fromDate,
            toDate: updatedDates.toDate
        }));
    };

    const handleSearch = () => {
        const { 
            linkName, 
            campaignName, 
            affiliateName, 
            targetCountryCodes, 
            language, 
            event, 
            group, 
            channel, 
            agency, 
            type, 
            fromDate, 
            toDate 
        } = filters;

        const newParam = {
            linkName: linkName.trim(),
            campaignName: campaignName.trim(),
            affiliateName: affiliateName.trim(),
            targetCountryCodes: targetCountryCodes,
            language: language === 'all' ? 'all' : language,
            event: event === 'all' ? 'all' : event,
            group: group === 'all' ? 'all' : group,
            channel: channel === 'all' ? 'all' : channel,
            agency: agency === 'all' ? 'all' : agency,
            type: type === 'all' ? 'all' : type,
            fromDate: fromDate,
            toDate: toDate,
            PageIndex: 1,
            PageSize: pagingOption.PageSize,
        };

        setParam(newParam);
    };

    return (
        <div className="filter-container my-2 pb-0">
            <Form inline tag="div">
                <div className="d-flex flex-wrap mb-2">
                    <FormGroup className='mr-sm-3 pb-2'>
                        <Label htmlFor="linkName" className="mr-sm-2">Link Name</Label>
                        <Input 
                            type="text" 
                            name="linkName" 
                            id="linkName" 
                            value={filters.linkName} 
                            onChange={handleChange}
                            placeholder="Search link name"
                        />
                    </FormGroup>

                    <FormGroup className='mr-sm-3 pb-2'>
                        <Label htmlFor="campaignName" className="mr-sm-2">Campaign</Label>
                        <Input 
                            type="text" 
                            name="campaignName" 
                            id="campaignName" 
                            value={filters.campaignName} 
                            onChange={handleChange}
                            placeholder="Search campaign name/code"
                        />
                    </FormGroup>

                    <FormGroup className='mr-sm-3 pb-2'>
                        <Label htmlFor="affiliateName" className="mr-sm-2">Affiliate Name</Label>
                        <Input 
                            type="text" 
                            name="affiliateName" 
                            id="affiliateName" 
                            value={filters.affiliateName} 
                            onChange={handleChange}
                            placeholder="Search affiliate name/code"
                        />
                    </FormGroup>

                    <FormGroup className='mr-sm-3 pb-2'>
                        <Label htmlFor="fromDate" className="mr-sm-2">From</Label>
                        <DatePicker
                            minDate={minDate}
                            maxDate={nowString}
                            date={filters.fromDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={handleChangeFromDate}
                        />
                    </FormGroup>

                    <FormGroup className='mr-sm-3 pb-2'>
                        <Label htmlFor="toDate" className="mr-sm-2">To</Label>
                        <DatePicker
                            minDate={filters.fromDate}
                            maxDate={nowString}
                            date={filters.toDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={handleChangeToDate}
                        />
                    </FormGroup>
                </div>
                <div className="d-flex flex-wrap mb-2">
                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.targetCountryCodes ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="targetCountry" className="mr-sm-2">Target Country</Label>
                        <MultipleSelect
                            id="targetCountry"
                            dataSource={targetCountrySelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeTargetCountry} />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.language ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="language" className="mr-sm-2">Language</Label>
                        <MultipleSelect
                            id="language"
                            dataSource={languageSelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeLanguage} />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.event ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="event" className="mr-sm-2">Event</Label>
                        <MultipleSelect
                            id="event"
                            dataSource={eventSelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeEvent} />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.group ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="group" className="mr-sm-2">Group</Label>
                        <MultipleSelect
                            id="group"
                            dataSource={groupSelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeGroup} />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.channel ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="channel" className="mr-sm-2">Channel</Label>
                        <MultipleSelect
                            id="channel"
                            dataSource={channelSelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeChannel} />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.agency ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="agency" className="mr-sm-2">Agency</Label>
                        <MultipleSelect
                            id="agency"
                            dataSource={agencySelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeAgency} />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.type ? '' : 'multiple-select-wrapper is-invalid'}`}>
                        <Label htmlFor="type" className="mr-sm-2">Type</Label>
                        <MultipleSelect
                            id="type"
                            dataSource={typeSelectList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please select"
                            selectedAllLabel="All"
                            onChange={handleChangeType} />
                    </FormGroup>

                    <Button outline color="primary" type="button" disabled={!filters.targetCountryCodes} className="mb-2" onClick={handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

function mapStateToProps({ today, targetCountryList, languageList, eventList, groupList, channelList, agencyList, typeList, pagingOption }) {
    return {
        today,
        targetCountryList,
        languageList,
        eventList,
        groupList,
        channelList,
        agencyList,
        typeList,
        pagingOption,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        setParam,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));