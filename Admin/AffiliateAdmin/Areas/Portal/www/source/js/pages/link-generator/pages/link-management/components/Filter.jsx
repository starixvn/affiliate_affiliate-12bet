import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MultipleSelect from '@/components/multiple-select';
import { handleChangeMultipleSelected } from '@/modules/utils';

import { setParam } from '../actions';
import { globalResource } from '../libs/constants';

export const Filter = ({
    pagingOption, 
    setParam,
    ...props
}) => {
    const [targetCountryList, setTargetCountryList] = useState(props.targetCountryList);


    const [filters, setFilters] = useState({
        linkName: '',
        campaignName: '',
        targetCountryCodes: targetCountryList ? targetCountryList.filter(item => item.checked).map(item => item.key).join(',') : 'all',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeTargetCountry = (item, selectedTargetCountryList) => {
        setFilters({ ...filters, targetCountryCodes: selectedTargetCountryList });
        setTargetCountryList(handleChangeMultipleSelected(targetCountryList, selectedTargetCountryList));
    };

    const handleSearch = () => {
        const { linkName, campaignName, targetCountryCodes } = filters;

        const newParam = {
            linkName: linkName.trim(),
            campaignName: campaignName.trim(),
            targetCountryCodes: targetCountryCodes,
            PageIndex: 1,
            PageSize: pagingOption.PageSize,
        };

        setParam(newParam);
    };

    return (
        <div className="filter-container my-2 pb-0">
            <Form inline tag="div">
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
                    <Label htmlFor="campaignName" className="mr-sm-2">Campaign Name</Label>
                    <Input 
                        type="text" 
                        name="campaignName" 
                        id="campaignName" 
                        value={filters.campaignName} 
                        onChange={handleChange}
                        placeholder="Search campaign name"
                    />
                </FormGroup>

                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.targetCountryCodes ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="targetCountry" className="mr-sm-2">Target Country</Label>
                    <MultipleSelect
                        id="targetCountry"
                        dataSource={targetCountryList || []}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeTargetCountry} />
                </FormGroup>

                <Button outline color="primary" type="button" disabled={!filters.targetCountryCodes} className="mb-2" onClick={handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                </Button>
            </Form>
        </div>
    );
};

function mapStateToProps({ targetCountryList, pagingOption }) {
    return {
        targetCountryList,
        pagingOption,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        setParam,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));