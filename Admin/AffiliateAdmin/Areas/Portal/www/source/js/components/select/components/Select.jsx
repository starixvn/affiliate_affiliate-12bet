import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import SelectLabel from './SelectLabel';
import SelectOptionList from './SelectOptionList';

const KEY_NAME = "key";
const VALUE_NAME = "value";

let id = 1;

export default class Select extends Component {
    constructor(props) {
        super(props);
        this.id = `select-${props.id || id++}`;
        this.selectOptionsRef = createRef();

        const { dataSource, keyField, valueField, selectedKey } = props;

        const selectedItem = dataSource.filter(i => i[keyField] == selectedKey)[0] || {};

        this.state = {
            showOptionList: false,
            inputOption: '',
            selectedItem: {
                [KEY_NAME]: selectedItem[keyField],
                [VALUE_NAME]: selectedItem[valueField]
            }
        }
    }

    static propTypes = {
        dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
        keyField: PropTypes.string,
        valueField: PropTypes.string,
        selectedKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        onChange: PropTypes.func,
        hasInputOption: PropTypes.bool,
        isDisable: PropTypes.bool,
        unselectedText: PropTypes.string
    }

    static defaultProps = {
        keyField: KEY_NAME,
        valueField: VALUE_NAME,
        hasInputOption: false,
        isDisable: false,
        unselectedText: 'Please select!'
    }

    componentDidMount() {
        document.addEventListener('click', this._handleDocumentClick)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._handleDocumentClick)
    }

    onChangeHandler = (selectedItem) => {
        this.onToggle();

        this.setState({ selectedItem });

        this._callBackToParent(selectedItem.key);
    }

    onToggle = () => {
        this.setState((prevState) => { return { showOptionList: !prevState.showOptionList, inputOption: '' } })
    }

    _handleChangeInput = (event) => {
        const { target } = event;

        this.setState({ [target.name]: target.value });
    }

    _callBackToParent(selectedKey) {
        this.props.onChange && this.props.onChange(selectedKey);
    }

    _convertDataSource(inputOption) {
        const { keyField, valueField, dataSource } = this.props;

        const dataSourceAfterFilter = dataSource.filter(i => i[valueField].toLowerCase().includes(inputOption || ''));

        return dataSourceAfterFilter.map(item => {
            return {
                [KEY_NAME]: item[keyField],
                [VALUE_NAME]: item[valueField]
            }
        })
    }

    _close = () => {
        this.setState({ showOptionList: false, inputOption: '' });
    }

    _handleDocumentClick = (event) => {
        const clickOutside = this.wrapper && !this.wrapper.contains(event.target);

        if (clickOutside && this.state.showOptionList) {
            this.selectOptionsRef.current._resetSelectingOption();
            this._close();
        }
    }

    render() {
        const { inputOption, selectedItem } = this.state;
        const { isDisable, hasInputOption, unselectedText } = this.props;
        const dataSource = this._convertDataSource(inputOption.trim().toLowerCase());
        const displayText = selectedItem.value || unselectedText;

        return (
            <div className="select-container" id={this.id} ref={element => this.wrapper = element}>
                <SelectLabel
                    selectedText={displayText}
                    onToggle={this.onToggle}
                    isDisable={isDisable} />

                <div className="select-options-container"
                    style={{ display: this.state.showOptionList ? "block" : "none" }}>
                    {
                        hasInputOption &&
                        <ul className="select-options">
                            <input type="text" name="inputOption" value={inputOption} className="w-100" onChange={this._handleChangeInput} />
                        </ul>
                    }

                    <SelectOptionList
                        id={this.id}
                        ref={this.selectOptionsRef}
                        dataSource={dataSource}
                        onChange={this.onChangeHandler} />
                </div>
            </div>
        )
    }
}