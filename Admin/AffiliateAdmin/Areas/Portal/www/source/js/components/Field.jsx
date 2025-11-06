import React from 'react'
import { FormGroup, Label, Input } from 'reactstrap';

export default function Field({
    label,
    name,
    value,
    selectedValue,
    defaultValue,
    onChange,
    type = 'text',
    placeholder,
    maxLength,
    selectOptions,
    className,
    onPressEnter = null
}) {
    return (
        <FormGroup className={className}>
            <Label htmlFor={label} className="mr-sm-2">{label}</Label>
            <Input
                type={type}
                name={name}
                id={label}
                maxLength={maxLength}
                onChange={onChange}
                value={selectedValue !== undefined ? selectedValue : value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onKeyPress={onPressEnter}
            >
                {selectOptions && selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </Input>
        </FormGroup>
    )
}
