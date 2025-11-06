import Excel from '../../../../modules/excel';
import { htmlDecode } from '../../../../modules/htmlHelper';
import {
    headerCellStyle,
    bodyCellStyle
} from '../../../../modules/excelStyleConstant';
import {
    headerText
} from './constants';

const HEADER_ROW_INDEX = 0;
const DATA_ROW_INDEX = 1;

const TOTAL_COLUMN = 15;

const MAIN_SECTION_STYLE = 'mainSectionStyle';

const fields = {
    Index: 'Index',
    UserName: 'UserName',
    IbcUserName: 'IbcUserName',
    RegisteredDateText: 'RegisteredDateText',
    FirstDepositDateText: 'FirstDepositDateText',
    FirstDepositAmount: 'FirstDepositAmount',
    Turnover: 'Turnover',
    Ggr: 'Ggr',
    Deposit: 'Deposit',
    Withdrawal: 'Withdrawal',
    Bonus: 'Bonus',
    Rebate: 'Rebate',
    DepositFee: 'DepositFee',
    WithdrawalFee: 'WithdrawalFee',
    DepositCount: 'DepositCount',
}

export default class ReportExcel {
    constructor(data, title, isDepositFeePercent, isWithdrawalPercent) {
        this.data = data;
        this.title = title;
        this.isDepositFeePercent = isDepositFeePercent;
        this.isWithdrawalPercent = isWithdrawalPercent;
        this.column = 2 - (isDepositFeePercent ? 1 : 0) - (isWithdrawalPercent ? 1 : 0);

        this.worksheet = {};
        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.columnConfigs = this._getcolumnConfigs(isDepositFeePercent, isWithdrawalPercent);
    }

    export() {
        Excel.process(() => {
            this._createHeader(this.column);
            this._createBodyData(this.column);
            this._createExcelConfig(this.isDepositFeePercent, this.isWithdrawalPercent, this.column);

            Excel.export(this.worksheet, this.title);
        })
    }

    _createHeader(column) {
        for (let i = 0; i < TOTAL_COLUMN - column; i++) {
            const fieldName = this.columnConfigs[i].field;

            let address = Excel.getCellAddress({
                c: i,
                r: HEADER_ROW_INDEX
            });
            this.worksheet[address] = {
                t: "s",
                v: headerText[fieldName],
                s: headerCellStyle
            }
        }
    }

    _createBodyData(column) {
        const mainData = this.data.MainData;

        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];

            for (let j = 0; j < TOTAL_COLUMN - column; j++) {
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = this._buildDataRow(item, MAIN_SECTION_STYLE, i, j);
            }

            this.currentRowIndex++;
        }
    }

    _buildDataRow(item, sectionStyleName, rowIndex, colIndex) {
        const columnConfig = this.columnConfigs[colIndex];
        const fieldName = columnConfig.field;
        let value = fieldName === fields.Index ? rowIndex + 1 : item[fieldName];

        if (fieldName === fields.FirstDepositAmount || fieldName === fields.IbcUserName) {
            value = value === null ? '' : value
        }

        return {
            t: Excel.getCellType(value),
            v: htmlDecode(value),
            s: columnConfig[sectionStyleName]
        }
    }

    _createExcelConfig(isDepositFeePercent, isWithdrawalPercent, column) {
        const cellStart = Excel.getCellAddress({
            r: 0,
            c: 0
        });
        const cellEnd = Excel.getCellAddress({
            r: this.currentRowIndex,
            c: TOTAL_COLUMN - column
        });

        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;

        const columnList = [{
            wpx: 70
        }, {
            wpx: 200
        }, {
            wpx: 200
        }, {
            wpx: 200
        }, {
            wpx: 200
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }];

        if (isDepositFeePercent) {
            columnList.push({
                wpx: 150
            })
        }

        if (isWithdrawalPercent) {
            columnList.push({
                wpx: 150
            })
        }

        this.worksheet['!cols'] = columnList;
    }

    _getcolumnConfigs(isDepositFeePercent, isWithdrawalPercent) {
        const columnlist = [{
            field: fields.Index,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center
        }, {
            field: fields.UserName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left
        }, {
            field: fields.IbcUserName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left
        }, {
            field: fields.RegisteredDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center
        }, {
            field: fields.FirstDepositDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center
        }, {
            field: fields.FirstDepositAmount,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }, {
            field: fields.Turnover,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }, {
            field: fields.Ggr,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }, {
            field: fields.DepositCount,
            [MAIN_SECTION_STYLE]: bodyCellStyle.right
        }, {
            field: fields.Deposit,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }, {
            field: fields.Withdrawal,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }, {
            field: fields.Bonus,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        },{
            field: fields.Rebate,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }, {
            field: fields.DepositFee,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        },{
            field: fields.WithdrawalFee,
            [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
        }];

        if (isDepositFeePercent) {
            columnlist.push({
                field: fields.DepositFee,
                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
            });
        }

        if (isWithdrawalPercent) {
            columnlist.push({
                field: fields.WithdrawalFee,
                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal
            });
        }

        return columnlist;
    }
}