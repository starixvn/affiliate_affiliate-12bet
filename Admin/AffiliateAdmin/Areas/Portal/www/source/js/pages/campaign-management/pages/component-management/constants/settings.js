export const headerText = {
    Index: '#',
    Code: 'Code',
    Name: 'Name',
    CreatedDate: 'Created Date',
    CreatedBy: 'Created By',
    LastModifiedDate: 'Last Modified Date',
    LastModifiedBy: 'Last Modified By',
    Status: 'Status',
    Edit: 'Edit'
}

export const defaultState = {
    ComponentTypeId: null,
    StatusIds: '',
    Search: ''
}

export const statusOptions = [
    { value: '1', label: 'Active', type: 'active', className: 'status-select--active' },
    { value: '2', label: 'Inactive', type: 'inactive', className: 'status-select--inactive' }
];

export const confirmPopupContent = {
    title: "Confirm this Action",
    content: [
        "Are you sure you want to change status of this component?"
    ]
}

export const formPopupNote = "Code is auto-filled from the name and will appear in the generated link. It cannot be changed once created."
