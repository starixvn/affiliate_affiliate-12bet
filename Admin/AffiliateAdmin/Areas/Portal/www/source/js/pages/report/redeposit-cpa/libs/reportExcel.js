import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../../modules/excelStyleConstant';
import { totalText, resource, reportKey as fields, headerText, headerConfigs } from './constants';
import { formatDecimal } from '../../../../modules/numberFormat';
import { formatDateTime } from '../../../../modules/utils';

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_START_ROW_INDEX = 3;

const COL_WIDTH = 'wpx';
const CELL_TYPE_STRING = 's';

// Column configuration
const columnConfig = {
    [fields.RowIdx]: {
        style: bodyCellStyle.center,
        width: 50,
        header: headerText[fields.RowIdx]
    },
    [fields.AffUserName]: {
        style: bodyCellStyle.left,
        width: 150,
        header: headerText[fields.AffUserName]
    },
    [fields.DealName]: {
        style: bodyCellStyle.left,
        width: 120,
        header: headerText[fields.DealName]
    },
    [fields.PaymentFrequency]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.PaymentFrequency]
    },
    [fields.StartFromStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.StartFromStr]
    },
    [fields.ApprovalDateStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.ApprovalDateStr]
    },
    [fields.RecheckDays]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.RecheckDays]
    },
    [fields.ExpiredRedepositDateStr]: {
        style: bodyCellStyle.center,
        width: 150,
        header: headerText[fields.ExpiredRedepositDateStr]
    },
    [fields.ApprovedCpaPlayer]: {
        style: bodyCellStyle.number,
        width: 150,
        header: headerText[fields.ApprovedCpaPlayer]
    },
    [fields.RedepositRate]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.RedepositRate]
    },
    [fields.NumOfPlayerRedeposit]: {
        style: bodyCellStyle.center,
        width: 150,
        header: headerText[fields.NumOfPlayerRedeposit]
    },
    [fields.TotalSettledCpaAmount]: {
        style: bodyCellStyle.decimal,
        width: 180,
        header: headerText[fields.TotalSettledCpaAmount]
    },
    [fields.Status]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.Status]
    },
    [fields.AutoApprovedAmount]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.AutoApprovedAmount]
    },
    [fields.AutoApprovedDateStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.AutoApprovedDateStr]
    },
    [fields.ManualAdjustedAmount]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.ManualAdjustedAmount]
    },
    [fields.ManualAdjustedDateStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.ManualAdjustedDateStr]
    },
    [fields.ManualAdjustedDescription]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.ManualAdjustedDescription]
    },
    [fields.FinalCpaAmount]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.FinalCpaAmount]
    }
};

/**
 * Builds column order from headerConfigs recursively
 * @returns {Array} Array of column keys in order
 */
function buildColumnOrder() {
    const columns = [];

    Object.keys(headerConfigs).forEach(key => {
        const config = headerConfigs[key];

        if (config.cols) {
            // Add sub-columns
            Object.keys(config.cols).forEach(subKey => {
                columns.push(subKey);
            });
        } else {
            // Add single column
            if (typeof config.isShowable !== 'function' || config.isShowable(true)) {
                columns.push(key);
            }
        }
    });

    console.log(columns);
    return columns;
}

// Column order derived from headerConfigs
const columnOrder = buildColumnOrder();

/**
 * Simple ReportExcel class for generating Excel reports
 */
export default class ReportExcel {
    /**
     * Creates a new ReportExcel instance
     * @param {Object} data - The data to export
     * @param {string} title - The report title
     * @param {Object} options - Additional options for customization
     */
    constructor(data, title, options = {}) {
        this.worksheet = {};
        this.title = title;
        this.data = data;
        this.options = {
            showTotal: true,
            ...options
        };
        this.currentRowIndex = DATA_START_ROW_INDEX;
        this.mergeConfig = [];
    }

    /**
     * Exports the report to Excel
     */
    export() {
        Excel.process(() => {
            this._buildExcelContent();
            this._exportFile();
        });
    }

    /**
     * Builds the complete Excel content
     * @private
     */
    _buildExcelContent() {
        this._createTitle();
        this._createHeader();
        this._createBodyData();
        if (this.options.showTotal) {
            this._createTotalRow();
        }
        this._createExcelConfig();
    }

    /**
     * Exports the Excel file
     * @private
     */
    _exportFile() {
        const fileName = this._generateFileName();
        Excel.export(this.worksheet, fileName);
    }

    /**
     * Generates the Excel file name with timestamp
     * @private
     * @returns {string} The generated file name
     */
    _generateFileName() {
        const timestamp = formatDateTime(new Date(), 'MM.dd.yyyy hh.mm.ss');
        return `${resource.reportName}${resource.space}${timestamp}`;
    }

    /**
     * Creates the title section
     * @private
     */
    _createTitle() {
        this.mergeConfig.push({
            s: { r: TITLE_ROW_INDEX, c: 0 },
            e: { r: TITLE_ROW_INDEX, c: columnOrder.length - 1 }
        });

        const address = Excel.getCellAddress({ c: 0, r: TITLE_ROW_INDEX });
        this.worksheet[address] = {
            t: CELL_TYPE_STRING,
            v: this.title,
            s: titleCellStyle
        };
    }

    /**
     * Creates multi-level header with merge cells using recursive config
     * @private
     */
    _createHeader() {
        this._createHeaderRecursive(headerConfigs, 0, HEADER_ROW_INDEX);
    }

    /**
     * Creates header recursively based on config structure
     * @private
     * @param {Object} config - Header configuration object
     * @param {number} startColIndex - Starting column index
     * @param {number} rowIndex - Current row index
     * @returns {number} Next column index
     */
    _createHeaderRecursive(config, startColIndex, rowIndex) {
        let colIndex = startColIndex;

        Object.keys(config).forEach(key => {
            const headerConfig = config[key];

            if (typeof headerConfig.isShowable === 'function' && !headerConfig.isShowable(true)) {
                return;
            }

            if (headerConfig.cols) {
                // Group with sub-columns - create horizontal merge
                const subColumns = Object.keys(headerConfig.cols);
                const colspan = subColumns.length;

                // Create main header cell
                this._createHeaderCell(colIndex, rowIndex, headerConfig.label, headerCellStyle);

                // Add horizontal merge
                this.mergeConfig.push({
                    s: { r: rowIndex, c: colIndex },
                    e: { r: rowIndex, c: colIndex + colspan - 1 }
                });

                // Create sub-headers in next row
                subColumns.forEach((subKey, subIndex) => {
                    const subConfig = headerConfig.cols[subKey];
                    this._createHeaderCell(colIndex + subIndex, rowIndex + 1, subConfig.label, headerCellStyle);
                });

                colIndex += colspan;
            } else {
                // Single column - create vertical merge
                this._createHeaderCell(colIndex, rowIndex, headerConfig.label, headerCellStyle);

                // Add vertical merge
                this.mergeConfig.push({
                    s: { r: rowIndex, c: colIndex },
                    e: { r: rowIndex + 1, c: colIndex }
                });

                colIndex += 1;
            }
        });

        return colIndex;
    }

    /**
     * Creates a header cell
     * @private
     * @param {number} colIndex - Column index
     * @param {number} row - Row index
     * @param {string} text - Cell text
     * @param {Object} style - Cell style
     */
    _createHeaderCell(colIndex, row, text, style) {
        const address = Excel.getCellAddress({ c: colIndex, r: row });
        this.worksheet[address] = {
            t: CELL_TYPE_STRING,
            v: text,
            s: style
        };
    }

    /**
     * Creates the body data section
     * @private
     */
    _createBodyData() {
        const mainData = this.data.MainData || [];
        mainData.forEach((item, index) => {
            const dataItem = { ...item, rowIndex: index + 1 };
            this._createDataRow(dataItem);
            this.currentRowIndex++;
        });
    }

    /**
     * Creates a data row
     * @private
     * @param {Object} item - Data item
     */
    _createDataRow(item) {
        columnOrder.forEach((field, colIndex) => {
            const address = Excel.getCellAddress({
                c: colIndex,
                r: this.currentRowIndex
            });

            const config = columnConfig[field];
            const value = this._formatCellValue(field, item[field], item);

            this.worksheet[address] = {
                t: Excel.getCellType(value),
                v: value,
                s: config.style
            };
        });
    }

    /**
     * Formats cell value using default formatting
     * @private
     * @param {string} field - Field name
     * @param {*} value - Raw value
     * @param {Object} item - Data item
     * @returns {*} Formatted value
     */
    _formatCellValue(field, value, item) {
        switch (field) {
            case fields.RecheckDays:
                return value ? `${value} days` : '';
            case fields.RedepositRate:
                return value !== null && value !== undefined ? `${formatDecimal(value * 100)}%` : '';
            case fields.NumOfPlayerRedeposit:
                return value || '';
            case fields.Status:
                return value || '';
            default:
                return value || '';
        }
    }

    /**
     * Creates the total row section
     * @private
     */
    _createTotalRow() {
        const totalData = this.data.Total;
        if (!totalData) return;

        columnOrder.forEach((field, colIndex) => {
            const address = Excel.getCellAddress({
                c: colIndex,
                r: this.currentRowIndex
            });

            let value = '';
            let style = totalCellStyle.default;

            if (field === fields.ExpiredRedepositDateStr) {
                value = totalText;
                style = totalCellStyle.right;
            } else if (field === fields.ApprovedCpaPlayer) {
                value = totalData[field] || 0;
                style = totalCellStyle.number;
            } else if (field === fields.TotalSettledCpaAmount) {
                value = totalData[field] || 0;
                style = totalCellStyle.decimal;
            } else {
                value = '';
                style = totalCellStyle.center;
            }

            this.worksheet[address] = {
                t: Excel.getCellType(value),
                v: value,
                s: style
            };
        });
    }

    /**
     * Creates Excel configuration (merges, range, column widths)
     * @private
     */
    _createExcelConfig() {
        const cellStart = Excel.getCellAddress({ r: 0, c: 0 });
        const cellEnd = Excel.getCellAddress({ r: this.currentRowIndex, c: columnOrder.length - 1 });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;
        this.worksheet['!cols'] = this._getColumnWidths();
    }

    /**
     * Gets column widths configuration
     * @private
     * @returns {Array} Array of column width configurations
     */
    _getColumnWidths() {
        return columnOrder.map(field => ({
            [COL_WIDTH]: columnConfig[field].width
        }));
    }
}