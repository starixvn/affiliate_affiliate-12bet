import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../../modules/excelStyleConstant';
import { totalText, resource, reportKey as fields, headerText, headerConfigs } from './constants';
import { formatDecimal } from '../../../../modules/numberFormat';
import { formatDateTime } from '../../../../modules/utils';
import { groupData } from './service';

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
    [fields.StartScheduleStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.StartScheduleStr]
    },
    [fields.EndScheduleStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.EndScheduleStr]
    },
    [fields.TotalEligiblePlayers]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.TotalEligiblePlayers]
    },
    [fields.RedepositDays]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.RedepositDays]
    },
    [fields.ExpiredRedepositDateStr]: {
        style: bodyCellStyle.center,
        width: 150,
        header: headerText[fields.ExpiredRedepositDateStr]
    },
    [fields.RedepositRate]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.RedepositRate]
    },
    [fields.NoOfRedepositPlayers]: {
        style: bodyCellStyle.center,
        width: 150,
        header: headerText[fields.NoOfRedepositPlayers]
    },
    [fields.EstimateAmount]: {
        style: bodyCellStyle.decimal,
        width: 180,
        header: headerText[fields.EstimateAmount]
    },
    [fields.Status]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.Status]
    },
    [fields.ApprovedAmount]: {
        style: bodyCellStyle.decimal,
        width: 120,
        header: headerText[fields.ApprovedAmount]
    },
    [fields.ApprovedDateStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.ApprovedDateStr]
    },
    [fields.AdjustedAmount]: {
        style: bodyCellStyle.decimal,
        width: 120,
        header: headerText[fields.AdjustedAmount]
    },
    [fields.AdjustedDateStr]: {
        style: bodyCellStyle.center,
        width: 120,
        header: headerText[fields.AdjustedDateStr]
    },
    [fields.Description]: {
        style: bodyCellStyle.left,
        width: 120,
        header: headerText[fields.Description]
    },
    [fields.FinalCpaAmount]: {
        style: bodyCellStyle.decimal,
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
     * Creates the body data section with merged rows
     * @private
     */
    _createBodyData() {
        const mainData = this.data.MainData || [];
        const groupedData = groupData(mainData);

        groupedData.forEach((group) => {
            group.subEntries.forEach((item, rowIndex) => {
                this._createDataRow(item, group.subEntries.length, rowIndex);
                this.currentRowIndex++;
            });
        });
    }

    /**
     * Creates a data row with merge logic for AffUserName and DealName
     * @private
     * @param {Object} item - Data item
     * @param {number} groupRowCount - Number of rows in the group
     * @param {number} rowIndexInGroup - Index of current row within the group
     */
    _createDataRow(item, groupRowCount = 1, rowIndexInGroup = 0) {
        columnOrder.forEach((field, colIndex) => {
            const address = Excel.getCellAddress({
                c: colIndex,
                r: this.currentRowIndex
            });

            const config = columnConfig[field];
            let value = this._formatCellValue(field, item[field], item);

            // Handle merge for specific columns
            const mergeColumns = [
                fields.RowIdx,
                fields.AffUserName,
                fields.DealName,
                fields.PaymentFrequency,
                fields.RedepositDays,
                fields.RedepositRate
            ];

            if (mergeColumns.includes(field) && groupRowCount > 1) {
                // Only show value in the first row of the group
                if (rowIndexInGroup === 0) {
                    const cellStyle = this._getCellStyle(field, value, config);
                    this.worksheet[address] = {
                        t: Excel.getCellType(value),
                        v: value,
                        s: cellStyle
                    };

                    // Add merge configuration for vertical merge
                    if (groupRowCount > 1) {
                        this.mergeConfig.push({
                            s: { r: this.currentRowIndex, c: colIndex },
                            e: { r: this.currentRowIndex + groupRowCount - 1, c: colIndex }
                        });
                    }
                }
                // Skip creating cell for subsequent rows in the group
                return;
            }

            // Create normal cell for other columns
            const cellStyle = this._getCellStyle(field, value, config);
            this.worksheet[address] = {
                t: Excel.getCellType(value),
                v: value,
                s: cellStyle
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
            case fields.RedepositDays:
                return value ? `${value} days` : '-';
            case fields.RedepositRate:
                return value !== null && value !== undefined ? `${formatDecimal(value * 100)}%` : '-';
            case fields.NoOfRedepositPlayers:
                return value || '-';
            default:
                return value !== null && value !== undefined ? value : '';
        }
    }

    /**
     * Gets cell style based on field and value
     * @private
     * @param {string} field - Field name
     * @param {*} value - Cell value
     * @param {Object} config - Column configuration
     * @returns {Object} Cell style
     */
    _getCellStyle(field, value, config) {
        if (field === fields.Status) {
            return this._getStatusStyle(value);
        }
        return config.style;
    }

    /**
     * Gets status-specific style with text colors only
     * @private
     * @param {string} status - Status value
     * @returns {Object} Status style with text color
     */
    _getStatusStyle(status) {
        const baseStyle = { ...bodyCellStyle.center };

        switch (status?.toLowerCase()) {
            case 'monitoring':
                return {
                    ...baseStyle,
                    font: { ...baseStyle.font, color: { rgb: 'B8860B' } } // Dark goldenrod
                };
            case 'not qualified':
                return {
                    ...baseStyle,
                    font: { ...baseStyle.font, color: { rgb: 'DC143C' } } // Crimson
                };
            case 'qualified':
                return {
                    ...baseStyle,
                    font: { ...baseStyle.font, color: { rgb: '006400' } } // Dark green
                };
            default:
                return baseStyle;
        }
    }

    /**
     * Creates the total row section
     * @private
     */
    _createTotalRow() {
        const totalData = this.data.Total;
        if (!totalData) return;

        // Mapping configuration for total row fields
        const totalFieldConfig = {
            [fields.DealName]: {
                getValue: () => totalText,
                style: totalCellStyle.right
            },
            [fields.TotalEligiblePlayers]: {
                getValue: (data) => data[fields.TotalEligiblePlayers] || 0,
                style: totalCellStyle.center
            },
            [fields.EstimateAmount]: {
                getValue: (data) => data[fields.EstimateAmount] || 0,
                style: totalCellStyle.decimal
            },
            [fields.ApprovedAmount]: {
                getValue: (data) => data[fields.ApprovedAmount] || 0,
                style: totalCellStyle.decimal
            },
            [fields.AdjustedAmount]: {
                getValue: (data) => data[fields.AdjustedAmount] || 0,
                style: totalCellStyle.decimal
            },
            [fields.FinalCpaAmount]: {
                getValue: (data) => data[fields.FinalCpaAmount] || 0,
                style: totalCellStyle.decimal
            }
        };

        columnOrder.forEach((field, colIndex) => {
            const cellConfig = this._getTotalCellConfig(field, totalData, totalFieldConfig);
            this._createTotalCell(colIndex, cellConfig);
        });
    }

    /**
     * Gets configuration for a total cell
     * @private
     * @param {string} field - Field name
     * @param {Object} totalData - Total data object
     * @param {Object} fieldConfig - Field configuration mapping
     * @returns {Object} Cell configuration with value and style
     */
    _getTotalCellConfig(field, totalData, fieldConfig) {
        const config = fieldConfig[field];

        if (config) {
            return {
                value: config.getValue(totalData),
                style: config.style
            };
        }

        // Default configuration for fields not in mapping
        return {
            value: '',
            style: totalCellStyle.center
        };
    }

    /**
     * Creates a total cell in the worksheet
     * @private
     * @param {number} colIndex - Column index
     * @param {Object} cellConfig - Cell configuration with value and style
     */
    _createTotalCell(colIndex, cellConfig) {
        const address = Excel.getCellAddress({
            c: colIndex,
            r: this.currentRowIndex
        });

        this.worksheet[address] = {
            t: Excel.getCellType(cellConfig.value),
            v: cellConfig.value,
            s: cellConfig.style
        };
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