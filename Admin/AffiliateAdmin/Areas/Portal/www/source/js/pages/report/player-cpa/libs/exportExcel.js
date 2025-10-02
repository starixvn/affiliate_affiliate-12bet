import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../../modules/excelStyleConstant';
import { formatDateTime } from '../../../../modules/utils';
import { formatDecimal } from '../../../../modules/numberFormat';
import { reportName, row1, row2, TotalText } from './constants';
import { dataKey } from './constants';

const resource = {
    reportName: reportName,
    space: ' ',
    dash: ' - '
};

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 3;
const TOTAL_MERGE_COLUMNS = 3;

const MAIN_SECTION_STYLE = 'mainSectionStyle';
const COL_WIDTH = 'wpx';

const colConfig = {
    [dataKey.No]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 60
    },
    [dataKey.Affiliate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [COL_WIDTH]: 150
    },
    [dataKey.Player]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [COL_WIDTH]: 150
    },
    [dataKey.RegistrationDate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.DealName]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [COL_WIDTH]: 150
    },
    [dataKey.PaymentFrequency]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 120
    },
    [dataKey.FTD]: {
        [MAIN_SECTION_STYLE]: { ...bodyCellStyle.decimal, ...bodyCellStyle.right },
        [COL_WIDTH]: 100
    },
    [dataKey.TotalDeposit]: {
        [MAIN_SECTION_STYLE]: { ...bodyCellStyle.decimal, ...bodyCellStyle.right },
        [COL_WIDTH]: 150
    },
    [dataKey.Turnover]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.ActiveQualifiedDate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.CPAAmount]: {
        [MAIN_SECTION_STYLE]: { ...bodyCellStyle.decimal, ...bodyCellStyle.right },
        [COL_WIDTH]: 150
    },
    [dataKey.BetTicket]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.HoldingQualifiedDate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.HoldingExpiredDate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.EstimatedCPAAmount]: {
        [MAIN_SECTION_STYLE]: { ...bodyCellStyle.decimal, ...bodyCellStyle.right },
        [COL_WIDTH]: 150
    },
    [dataKey.FirstDepositDate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.ReDepositDays]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.ExpiredRedepositDate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.IsRedeposit]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [dataKey.CPAStatus]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    }
};

const GENERAL_COLUMNS = 6;
const NUMBER_ACTIVE_COLUMNS = 5;
const NUMBER_HOLDING_COLUMNS = 4;
const NUMBER_REDEPOSIT_QUALIFIED_COLUMNS = 4;

export default class ExportExcel {
    constructor(data, title, total) {
        this.worksheet = {};
        this.title = title;
        this.data = data;
        this.total = total;

        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.columnConfigs = this._getColumnConfigs();
        this.totalColumn = this.columnConfigs.length;
        this.lastColumnIndex = this.totalColumn - 1;
    }

    export() {
        Excel.process(() => {
            this._createTitle();
            this._createHeader();
            this._createBodyData();
            this._createTotalRow();
            this._createExcelConfig();

            const fileName = resource.reportName + resource.space + resource.dash + formatDateTime(new Date(), 'MM.dd.yyyy hh.mm.ss');
            Excel.export(this.worksheet, fileName);
        });
    }

    _createTitle() {
        this.mergeConfig.push({
            s: { r: TITLE_ROW_INDEX, c: 0 },
            e: { r: TITLE_ROW_INDEX, c: this.lastColumnIndex }
        });
        const address = Excel.getCellAddress({ c: 0, r: TITLE_ROW_INDEX });
        this.worksheet[address] = {
            t: "s",
            v: this.title,
            s: titleCellStyle
        };
    }

    /**
     * Creates the Excel header with merged cells and proper styling
     * @private
     */
    _createHeader() {
        // Create general columns in first row
        this._createFirstRowHeaders();

        // Create period columns in first row
        const periodColumns = [
            { title: "Active Period", count: NUMBER_ACTIVE_COLUMNS, startCol: GENERAL_COLUMNS },
            { title: "Holding Period", count: NUMBER_HOLDING_COLUMNS, startCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS },
            { title: "Redeposit Qualified Period", count: NUMBER_REDEPOSIT_QUALIFIED_COLUMNS, startCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS + NUMBER_HOLDING_COLUMNS }
        ];

        periodColumns.forEach(period => {
            this._createPeriodHeader(period.title, period.startCol, period.count);
        });

        // Create second row headers
        this._createSecondRowHeaders();

        // Merge period headers
        this._mergePeriodHeaders();
    }

    /**
     * Creates the first row general headers
     * @private
     */
    _createFirstRowHeaders() {
        row1.forEach((cel) => {
            if (cel.columnSpan) {
                this._createSpannedHeader(cel, cel.startCol);
            } else {
                this._createSingleHeader(cel, cel.startCol);
            }
        });
    }

    /**
     * Creates a header cell that spans multiple columns
     * @private
     */
    _createSpannedHeader(cell, startIdx) {
        for (let i = 0; i < cell.columnSpan; i++) {
            const address = Excel.getCellAddress({ c: startIdx + i, r: HEADER_ROW_INDEX });
            this.worksheet[address] = {
                t: "s",
                v: cell.text || cell.title,
                s: headerCellStyle
            };
        }
    }

    /**
     * Creates a single header cell with vertical merge
     * @private
     */
    _createSingleHeader(cell, idx) {
        const address = Excel.getCellAddress({ c: idx, r: HEADER_ROW_INDEX });
        this.worksheet[address] = {
            t: "s",
            v: cell.text || cell.title,
            s: headerCellStyle
        };
        this._mergeCell(HEADER_ROW_INDEX, idx, HEADER_ROW_INDEX + 1, idx);
    }

    /**
     * Creates period headers in the first row
     * @private
     */
    _createPeriodHeader(title, startCol, columnCount) {
        for (let i = 0; i < columnCount; i++) {
            const address = Excel.getCellAddress({ c: startCol + i, r: HEADER_ROW_INDEX });
            this.worksheet[address] = {
                t: "s",
                v: title,
                s: headerCellStyle
            };
        }
    }

    /**
     * Creates the second row headers
     * @private
     */
    _createSecondRowHeaders() {
        row2.forEach((cel, celIdx) => {
            const address = Excel.getCellAddress({
                c: celIdx + GENERAL_COLUMNS,
                r: HEADER_ROW_INDEX + 1
            });
            this.worksheet[address] = {
                t: "s",
                v: cel.text || cel.title,
                s: headerCellStyle
            };
        });
    }

    /**
     * Merges the period headers in the first row
     * @private
     */
    _mergePeriodHeaders() {
        const mergeRanges = [
            {
                startCol: GENERAL_COLUMNS,
                endCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS - 1
            },
            {
                startCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS,
                endCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS + NUMBER_HOLDING_COLUMNS - 1
            },
            {
                startCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS + NUMBER_HOLDING_COLUMNS,
                endCol: GENERAL_COLUMNS + NUMBER_ACTIVE_COLUMNS + NUMBER_HOLDING_COLUMNS + NUMBER_REDEPOSIT_QUALIFIED_COLUMNS - 1
            }
        ];

        mergeRanges.forEach(range => {
            this._mergeCell(HEADER_ROW_INDEX, range.startCol, HEADER_ROW_INDEX, range.endCol);
        });
    }

    _createBodyData() {
        const mainData = Array.isArray(this.data) ? this.data : this.data.mainData;
        if (!mainData) return;

        const _buildDataRow = (item, sectionStyleName, colIndex, hasSettingRedeposit) => {
            const columnConfig = this.columnConfigs[colIndex];
            let value = item[columnConfig.field];

            if (columnConfig.field === dataKey.Turnover) {
                value = value ? "Yes" : "No";
            }

            if (columnConfig.field === dataKey.ReDepositDays) {
                value = hasSettingRedeposit ? value : "-";
            }
            if (columnConfig.field === dataKey.IsRedeposit) {
                value = hasSettingRedeposit ? (value ? "Yes" : "No") : "-";
            }

            return {
                t: Excel.getCellType(value),
                v: value,
                s: columnConfig[sectionStyleName]
            };
        }

        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];
            item.no = i + 1;
            const hasSettingRedeposit = !!item.expiredRedepositDate;

            for (let j = 0; j < this.totalColumn; j++) {
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = _buildDataRow(item, MAIN_SECTION_STYLE, j, hasSettingRedeposit);
            }

            this.currentRowIndex++;
        }
    }

    _createTotalRow() {
        const total = this.total;
        if (!total) return;

        const cellValues = [
            { colIndex: 0, value: TotalText, style: bodyCellStyle.left },
            { colIndex: 6, value: formatDecimal(total.ftd), style: totalCellStyle.decimal },
            { colIndex: 7, value: formatDecimal(total.totalDeposit), style: totalCellStyle.decimal },
            { colIndex: 10, value: formatDecimal(total.cpaAmount), style: totalCellStyle.decimal },
            { colIndex: 14, value: formatDecimal(total.estimatedCPAAmount), style: totalCellStyle.decimal }
        ]

        for (let i = 0; i < this.totalColumn; i++) {
            const address = Excel.getCellAddress({ c: i, r: this.currentRowIndex });
            this.worksheet[address] = {
                t: "s",
                v: "",
                s: { ...totalCellStyle.default, ...totalCellStyle.left }
            };
        }

        // Merge the "Total" cells
        cellValues.forEach(cell => {
            const address = Excel.getCellAddress({ c: cell.colIndex, r: this.currentRowIndex });
            this.worksheet[address] = {
                t: Excel.getCellType(cell.value),
                v: cell.value,
                s: { ...totalCellStyle.right, ...cell.style }
            };
        })

        this._mergeCell(this.currentRowIndex, 0, this.currentRowIndex, TOTAL_MERGE_COLUMNS - 1);

    }

    _createExcelConfig() {
        const cellStart = Excel.getCellAddress({ r: 0, c: 0 });
        const cellEnd = Excel.getCellAddress({ r: this.currentRowIndex, c: this.lastColumnIndex });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;
        this.worksheet['!cols'] = this.columnConfigs.map(item => {
            return { [COL_WIDTH]: item[COL_WIDTH] };
        });
    }

    _getColumnConfigs() {
        return Object.keys(colConfig).map(key => {
            return {
                field: key,
                [MAIN_SECTION_STYLE]: colConfig[key] ? colConfig[key][MAIN_SECTION_STYLE] : bodyCellStyle.left,
                [COL_WIDTH]: colConfig[key] ? colConfig[key][COL_WIDTH] : 120
            };
        });
    }

    _mergeCell(startRow, startCol, endRow, endCol) {
        this.mergeConfig.push({
            s: { r: startRow, c: startCol },
            e: { r: endRow, c: endCol }
        });
    }
}
