import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../../modules/excelStyleConstant';
import { totalText, resource, reportKey as fields } from './constants';
import { formatDecimal } from '../../../../modules/numberFormat';
import { formatDateTime } from '../../../../modules/utils';
import { AggregateHeaderColumn } from './headerConfigs';

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 4;

const MAIN_SECTION_STYLE = 'mainSectionStyle';
const MULTI_COMM_GROUP_SECTION_STYLE = 'multiCommGroupSectionStyle';
const TOTAL_SECTION_STYLE = 'totalSectionStyle';
const COL_WIDTH = 'wpx';

const colConfig =
{
    [fields.UserName]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [TOTAL_SECTION_STYLE]: totalCellStyle.default,
        [COL_WIDTH]: 150
    },
    [fields.MonthDateString]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [TOTAL_SECTION_STYLE]: totalCellStyle.default,
        [COL_WIDTH]: 150
    },
    [fields.Status]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [TOTAL_SECTION_STYLE]: totalCellStyle.center,
        [COL_WIDTH]: 120
    },
    [fields.PreferredLanguage]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [TOTAL_SECTION_STYLE]: totalCellStyle.default,
        [COL_WIDTH]: 150
    },
    [fields.PaymentCurrency]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [TOTAL_SECTION_STYLE]: totalCellStyle.center,
        [COL_WIDTH]: 175
    },
    [fields.CommGroupName]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [TOTAL_SECTION_STYLE]: totalCellStyle.default,
        [COL_WIDTH]: 175
    },
    [fields.PaymentFrequency]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [TOTAL_SECTION_STYLE]: totalCellStyle.default,
        [COL_WIDTH]: 150
    },
    [fields.TotalClick]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.UniqueClick]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.Signup]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.Fdm]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.Fdm_Amount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.FDM_TotalDeposit]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 150
    },
    [fields.ActivePlayer]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.QualifiedMember]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 175
    },
    [fields.QualifiedCPAMember]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 175
    },
    [fields.NoOfSubAff]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.TotalDeposit]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 150
    },
    [fields.Deposit]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 150
    },
    [fields.Withdrawal]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.Turnover]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.Ggr]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.Bonus]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.Rebate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.PlatformFee]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.DepositFee]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.WithdrawalFee]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.TotalFee]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.CommissionRate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.right,
        [MULTI_COMM_GROUP_SECTION_STYLE]: bodyCellStyle.rightHighlight,
        [TOTAL_SECTION_STYLE]: totalCellStyle.right,
        [COL_WIDTH]: 120
    },
    [fields.Earning]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.ApprovedCPAAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 200
    },
    [fields.AdjustedCPAAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 150
    },
    [fields.SubAffEarning]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 140
    },
    [fields.TotalEarning]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.AffWithdrawal]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.AffAdjustment]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.BalanceBf]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 150
    },
    [fields.CurrentBBF]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 150
    }
};

export default class ReportExcel {
    constructor(data, title, isMainView, header, languageList, isCheckedDatePicker) {
        this.worksheet = {};
        this.title = isMainView ? title : resource.reportName + ' > ' + title;
        this.data = data;
        this.isMainView = isMainView;
        this.header = header;
        this.languageList = languageList;
        this.isCheckedDatePicker = isCheckedDatePicker;

        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.columnConfigs = this._getColumnConfigs(header);
        this.totalColumn = this.columnConfigs.length;
    }

    export() {
        Excel.process(() => {
            this._createTitle();
            this._createHeader();
            this._createBodyData();
            this._createTotalRow();
            this._createExcelConfig();

            const fileName = resource.reportName + (this.isMainView ? '' : resource.space + resource.reportDetailName) + resource.space + formatDateTime(new Date(), 'MM.dd.yyyy hh.mm.ss');
            Excel.export(this.worksheet, fileName);
        })
    }

    _createTitle() {
        this.mergeConfig.push({
            s: {
                r: TITLE_ROW_INDEX,
                c: 0
            },
            e: {
                r: TITLE_ROW_INDEX,
                c: this.totalColumn - 1
            }
        });
        const address = Excel.getCellAddress({
            c: 0,
            r: TITLE_ROW_INDEX
        });
        this.worksheet[address] = {
            t: "s",
            v: this.title,
            s: titleCellStyle
        }
    }

    _createHeader() {
        const showableCells = this.header.childHeader.filter(c => c.isShowable);
        let curColIndex = 0;

        showableCells.forEach(cell => {
            if (cell instanceof AggregateHeaderColumn) {
                this._buildAggregateHeader(HEADER_ROW_INDEX, curColIndex, cell);
                curColIndex += cell.totalShowableCol;
            }
            else {
                let address = Excel.getCellAddress({
                    c: curColIndex,
                    r: HEADER_ROW_INDEX
                });
                this.worksheet[address] = {
                    t: "s",
                    v: cell.text,
                    s: headerCellStyle
                }

                this.mergeConfig.push({
                    s: {
                        r: HEADER_ROW_INDEX,
                        c: curColIndex
                    },
                    e: {
                        r: HEADER_ROW_INDEX + 2,
                        c: curColIndex
                    }
                });

                curColIndex++;
            }
        })
    }

    _buildAggregateHeader(rowIndex, colIndex, headerCell) {
        const showableCells = headerCell.childHeader.filter(c => c.isShowable);
        let curColIndex = colIndex;

        const colSpanCellAddress = Excel.getCellAddress({
            c: colIndex,
            r: rowIndex
        });
        this.worksheet[colSpanCellAddress] = {
            t: "s",
            v: headerCell.text,
            s: headerCellStyle
        }
        
        const totalColumn = colIndex + headerCell.totalShowableCol;
        this.mergeConfig.push({
            s: {
                r: rowIndex,
                c: colIndex
            },
            e: {
                r: rowIndex,
                c: totalColumn - 1
            }
        });

        showableCells.forEach(cell => {
            if (cell instanceof AggregateHeaderColumn) {
                this._buildColspanColumn(rowIndex + 1, curColIndex, cell);
                curColIndex += cell.totalShowableCol;
            }
            else {
                let address = Excel.getCellAddress({
                    c: curColIndex,
                    r: rowIndex + 1
                });
                this.worksheet[address] = {
                    t: "s",
                    v: cell.text,
                    s: headerCellStyle
                }

                this.mergeConfig.push({
                    s: {
                        r: rowIndex + 1,
                        c: curColIndex
                    },
                    e: {
                        r: rowIndex + 2,
                        c: curColIndex
                    }
                });

                curColIndex++;
            }
        })
    }

    _buildColspanColumn(rowIndex, colIndex, headerCell) {
        let childCells = headerCell.childHeader.filter(c => c.isShowable);
        const colSpan = childCells.length;

        const colSpanCellAddress = Excel.getCellAddress({
            c: colIndex,
            r: rowIndex
        });
        this.worksheet[colSpanCellAddress] = {
            t: "s",
            v: headerCell.text,
            s: headerCellStyle
        }

        const totalColumn = colIndex + colSpan;
        this.mergeConfig.push({
            s: {
                r: rowIndex,
                c: colIndex
            },
            e: {
                r: rowIndex,
                c: totalColumn - 1
            }
        });

        let curIndex = colIndex;
        childCells.forEach(cell => {
            const address = Excel.getCellAddress({
                c: curIndex,
                r: rowIndex + 1
            });

            this.worksheet[address] = {
                t: "s",
                v: cell.text || '',
                s: headerCellStyle
            }
            curIndex++;
        });
    }

    _createBodyData() {
        const mainData = this.data.MainData;

        for (let item of mainData) {
            item.CommissionRate = formatDecimal(item.CommissionRate * 100) + '%';

            if (!this.isMainView) {
                const {
                    MonthDateString,
                    Description
                } = item;
                item.MonthDateString = Description ? `${MonthDateString} (${Description})` : MonthDateString;
            }

            for (let j = 0; j < this.totalColumn; j++) {
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = this._buildDataRow(item, MAIN_SECTION_STYLE, j);
            }

            this.currentRowIndex++;
        }
    }

    _createTotalRow() {
        const totalData = this.data.Total;
        if (totalData) {
            const commonTotalData = {
                [fields.CommGroupName]: '',
                [fields.PaymentFrequency]: '',
                [fields.CommissionRate]: "N/A"
            };

            const customTotalData = this.isMainView ? {
                [fields.UserName]: totalText,
                [fields.Status]: '',
                [fields.PaymentCurrency]: ''
            } : {
                [fields.MonthDateString]: totalText,
                [fields.EarningBy]: 'N/A'
            };

            const total = { ...totalData, ...customTotalData, ...commonTotalData };

            for (let j = 0; j < this.totalColumn; j++) {
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = this._buildDataRow(total, TOTAL_SECTION_STYLE, j);
            }
        }
    }

    _buildDataRow(item, sectionStyleName, colIndex) {
        const columnConfig = this.columnConfigs[colIndex];
        let value = item[columnConfig.field];

        if (columnConfig.field === fields.PreferredLanguage) {
            value = this.languageList[value] || '';
        }

        return {
            t: Excel.getCellType(value),
            v: value,
            s: columnConfig.field === fields.CommissionRate && item.IsMultiGroupProduct ? bodyCellStyle.rightHighlight : columnConfig[sectionStyleName]
        }
    }

    _createExcelConfig() {
        const cellStart = Excel.getCellAddress({
            r: 0,
            c: 0
        });
        const cellEnd = Excel.getCellAddress({
            r: this.currentRowIndex,
            c: this.totalColumn
        });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;
        this.worksheet['!cols'] = this.columnConfigs.map(item => {
            return { [COL_WIDTH]: item[COL_WIDTH] }
        })
    }

    _getColumnConfigs(header) {
        const showableCols = header.getCols().filter(item => item.isShowable);
        return showableCols.map(col => {
            return {
                field: col.key,
                [MAIN_SECTION_STYLE]: colConfig[col.key][MAIN_SECTION_STYLE],
                [TOTAL_SECTION_STYLE]: colConfig[col.key][TOTAL_SECTION_STYLE],
                [COL_WIDTH]: colConfig[col.key][COL_WIDTH]
            };
        });
    }
}