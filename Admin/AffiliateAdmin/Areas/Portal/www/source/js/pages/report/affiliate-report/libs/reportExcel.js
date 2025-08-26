import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../../modules/excelStyleConstant';
import { totalText, resource, reportKey as fields } from './constants';
import { formatDecimal } from '../../../../modules/numberFormat';
import { formatDateTime } from '../../../../modules/utils';
import { AggregateHeaderColumn } from './headerConfigs';

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;

const MAIN_SECTION_STYLE = 'mainSectionStyle';
const MULTI_COMM_GROUP_SECTION_STYLE = 'multiCommGroupSectionStyle';
const TOTAL_SECTION_STYLE = 'totalSectionStyle';
const COL_WIDTH = 'wpx';

// Excel cell types
const CELL_TYPE_STRING = 's';

// Default values
const DEFAULT_PAYMENT_CURRENCY = '';
const DEFAULT_COMMISSION_RATE = 'N/A';
const DEFAULT_PAYMENT_FREQUENCY = '';

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
        [COL_WIDTH]: 120
    },
    [fields.PaymentCurrency]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [TOTAL_SECTION_STYLE]: totalCellStyle.center,
        [COL_WIDTH]: 120
    },
    [fields.CommGroupName]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [TOTAL_SECTION_STYLE]: totalCellStyle.default,
        [COL_WIDTH]: 150
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
        [COL_WIDTH]: 120
    },
    [fields.ActivePlayer]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.QualifiedMember]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.NoOfSubAff]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.TotalDeposit]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [TOTAL_SECTION_STYLE]: totalCellStyle.number,
        [COL_WIDTH]: 120
    },
    [fields.Deposit]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
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
    [fields.CpaAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.TotalMainEarning]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.SubAffEarning]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.SubCpaAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [fields.TotalSubEarning]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal,
        [COL_WIDTH]: 120
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

/**
 * ReportExcel class for generating Excel reports with multi-level headers
 */
export default class ReportExcel {
    /**
     * Creates a new ReportExcel instance
     * @param {Object} data - The data to export
     * @param {string} title - The report title
     * @param {boolean} isMainView - Whether this is the main view
     * @param {HeaderRow} header - The header configuration
     * @param {Object} languageList - Language mappings
     */
    constructor(data, title, isMainView, header, languageList) {
        this._initializeProperties(data, title, isMainView, header, languageList);
        this._setupColumnConfigs();
    }

    /**
     * Initializes class properties
     * @private
     */
    _initializeProperties(data, title, isMainView, header, languageList) {
        this.worksheet = {};
        this.title = this._buildTitle(title, isMainView);
        this.data = data;
        this.isMainView = isMainView;
        this.header = header;
        this.languageList = languageList;
        this.currentRowIndex = HEADER_ROW_INDEX + this.header.totalRow;
        this.mergeConfig = [];
    }

    /**
     * Builds the title based on view type
     * @private
     */
    _buildTitle(title, isMainView) {
        return isMainView ? title : `${resource.reportName} > ${title}`;
    }

    /**
     * Sets up column configurations
     * @private
     */
    _setupColumnConfigs() {
        this.columnConfigs = this._getColumnConfigs(this.header);
        this.totalColumn = this.columnConfigs.length;
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
        this._createTotalRow();
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
        const detailSuffix = this.isMainView ? '' : `${resource.space}${resource.reportDetailName}`;
        return `${resource.reportName}${detailSuffix}${resource.space}${timestamp}`;
    }

    /**
     * Creates the title section
     * @private
     */
    _createTitle() {
        this._addTitleMerge();
        this._createTitleCell();
    }

    /**
     * Adds merge configuration for title row
     * @private
     */
    _addTitleMerge() {
        this.mergeConfig.push({
            s: { r: TITLE_ROW_INDEX, c: 0 },
            e: { r: TITLE_ROW_INDEX, c: this.totalColumn - 1 }
        });
    }

    /**
     * Creates the title cell
     * @private
     */
    _createTitleCell() {
        const address = Excel.getCellAddress({ c: 0, r: TITLE_ROW_INDEX });
        this.worksheet[address] = {
            t: CELL_TYPE_STRING,
            v: this.title,
            s: titleCellStyle
        };
    }

    /**
     * Creates the header section with multi-level support
     * @private
     */
    _createHeader() {
        const showableCells = this.header.childHeader.filter(c => c.isShowable);
        let curColIndex = 0;

        showableCells.forEach(cell => {
            if (cell instanceof AggregateHeaderColumn) {
                this._buildColspanColumnRecursive(HEADER_ROW_INDEX, curColIndex, cell, 0);
                curColIndex += cell.totalShowableCol;
            } else {
                this._createSingleHeaderCell(curColIndex, cell);
                curColIndex++;
            }
        });
    }

    /**
     * Creates a single header cell with rowspan
     * @private
     * @param {number} colIndex - Column index
     * @param {Object} cell - Cell configuration
     */
    _createSingleHeaderCell(colIndex, cell) {
        const currentRow = HEADER_ROW_INDEX;
        const address = Excel.getCellAddress({
            c: colIndex,
            r: currentRow
        });

        this.worksheet[address] = {
            t: CELL_TYPE_STRING,
            v: cell.text,
            s: headerCellStyle
        };

        this._addRowspanMerge(currentRow, colIndex, this.header.totalRow);
    }

    /**
     * Recursively builds colspan columns for multi-level headers
     * @private
     * @param {number} rowIndex - Starting row index
     * @param {number} colIndex - Starting column index
     * @param {Object} headerCell - Header cell configuration
     * @param {number} depth - Current depth level
     */
    _buildColspanColumnRecursive(rowIndex, colIndex, headerCell, depth) {
        const childCells = headerCell.childHeader.filter(c => c.isShowable);
        const currentRow = rowIndex + depth;

        // Create cell for current header
        this._createHeaderCell(colIndex, currentRow, headerCell.text);

        // Calculate and create colspan for current header
        const totalColSpan = this._calculateTotalColSpan(childCells);
        this._addColspanMerge(currentRow, colIndex, totalColSpan);

        // Process child cells
        this._processChildCells(rowIndex, colIndex, childCells, depth);
    }

    /**
     * Creates a header cell
     * @private
     * @param {number} colIndex - Column index
     * @param {number} row - Row index
     * @param {string} text - Cell text
     */
    _createHeaderCell(colIndex, row, text) {
        const address = Excel.getCellAddress({ c: colIndex, r: row });
        this.worksheet[address] = {
            t: CELL_TYPE_STRING,
            v: text,
            s: headerCellStyle
        };
    }

    /**
     * Calculates total colspan for child cells
     * @private
     * @param {Array} childCells - Array of child cells
     * @returns {number} Total colspan
     */
    _calculateTotalColSpan(childCells) {
        return childCells.reduce((total, cell) => {
            return total + (cell instanceof AggregateHeaderColumn ? cell.totalShowableCol : 1);
        }, 0);
    }

    /**
     * Adds colspan merge configuration
     * @private
     * @param {number} row - Row index
     * @param {number} colIndex - Column index
     * @param {number} totalColSpan - Total colspan
     */
    _addColspanMerge(row, colIndex, totalColSpan) {
        if (totalColSpan > 1) {
            this.mergeConfig.push({
                s: { r: row, c: colIndex },
                e: { r: row, c: colIndex + totalColSpan - 1 }
            });
        }
    }

    /**
     * Adds rowspan merge configuration
     * @private
     * @param {number} startRow - Starting row index
     * @param {number} colIndex - Column index
     * @param {number} rowspan - Rowspan value
     */
    _addRowspanMerge(startRow, colIndex, rowspan) {
        if (rowspan > 1) {
            this.mergeConfig.push({
                s: { r: startRow, c: colIndex },
                e: { r: startRow + rowspan - 1, c: colIndex }
            });
        }
    }

    /**
     * Processes child cells recursively
     * @private
     * @param {number} rowIndex - Starting row index
     * @param {number} colIndex - Starting column index
     * @param {Array} childCells - Array of child cells
     * @param {number} depth - Current depth level
     */
    _processChildCells(rowIndex, colIndex, childCells, depth) {
        let curIndex = colIndex;

        childCells.forEach(cell => {
            if (cell instanceof AggregateHeaderColumn) {
                this._buildColspanColumnRecursive(rowIndex, curIndex, cell, depth + 1);
                curIndex += cell.totalShowableCol;
            } else {
                this._createChildHeaderCell(rowIndex, curIndex, cell, depth);
                curIndex++;
            }
        });
    }

    /**
     * Creates a child header cell with calculated rowspan
     * @private
     * @param {number} rowIndex - Starting row index
     * @param {number} colIndex - Column index
     * @param {Object} cell - Cell configuration
     * @param {number} depth - Current depth level
     */
    _createChildHeaderCell(rowIndex, colIndex, cell, depth) {
        const currentRow = rowIndex + depth + 1;
        const rowspan = this.header.totalRow - (depth + 1);

        this._createHeaderCell(colIndex, currentRow, cell.text || '');
        this._addRowspanMerge(currentRow, colIndex, rowspan);
    }

    /**
     * Creates the body data section
     * @private
     */
    _createBodyData() {
        const mainData = this.data.MainData;

        mainData.forEach(item => {
            this._processDataItem(item);
            this._createDataRow(item);
            this.currentRowIndex++;
        });
    }

    /**
     * Processes individual data item
     * @private
     * @param {Object} item - Data item to process
     */
    _processDataItem(item) {
        item.CommissionRate = formatDecimal(item.CommissionRate * 100) + '%';

        if (!this.isMainView) {
            const { MonthDateString, Description } = item;
            item.MonthDateString = Description ? `${MonthDateString} (${Description})` : MonthDateString;
        }
    }

    /**
     * Creates a data row
     * @private
     * @param {Object} item - Data item
     */
    _createDataRow(item) {
        for (let j = 0; j < this.totalColumn; j++) {
            const address = Excel.getCellAddress({
                c: j,
                r: this.currentRowIndex
            });

            this.worksheet[address] = this._buildDataRow(item, MAIN_SECTION_STYLE, j);
        }
    }

    /**
     * Creates the total row section
     * @private
     */
    _createTotalRow() {
        const totalData = this.data.Total;
        if (!totalData) return;

        const total = this._buildTotalData(totalData);
        this._createTotalDataRow(total);
    }

    /**
     * Builds total data object
     * @private
     * @param {Object} totalData - Total data from source
     * @returns {Object} Combined total data
     */
    _buildTotalData(totalData) {
        const commonTotalData = {
            [fields.CommGroupName]: '',
            [fields.CommissionRate]: DEFAULT_COMMISSION_RATE,
            [fields.PaymentFrequency]: DEFAULT_PAYMENT_FREQUENCY
        };

        const customTotalData = this.isMainView ? {
            [fields.UserName]: totalText,
            [fields.Status]: '',
            [fields.PaymentCurrency]: DEFAULT_PAYMENT_CURRENCY
        } : {
            [fields.MonthDateString]: totalText
        };

        return { ...totalData, ...customTotalData, ...commonTotalData };
    }

    /**
     * Creates total data row
     * @private
     * @param {Object} total - Total data object
     */
    _createTotalDataRow(total) {
        for (let j = 0; j < this.totalColumn; j++) {
            const address = Excel.getCellAddress({
                c: j,
                r: this.currentRowIndex
            });

            this.worksheet[address] = this._buildDataRow(total, TOTAL_SECTION_STYLE, j);
        }
    }

    /**
     * Builds a data row cell
     * @private
     * @param {Object} item - Data item
     * @param {string} sectionStyleName - Style section name
     * @param {number} colIndex - Column index
     * @returns {Object} Cell configuration
     */
    _buildDataRow(item, sectionStyleName, colIndex) {
        const columnConfig = this.columnConfigs[colIndex];
        let value = this._getCellValue(item, columnConfig);

        return {
            t: Excel.getCellType(value),
            v: value,
            s: this._getCellStyle(columnConfig, item, sectionStyleName)
        };
    }

    /**
     * Gets cell value with special handling for language fields
     * @private
     * @param {Object} item - Data item
     * @param {Object} columnConfig - Column configuration
     * @returns {*} Cell value
     */
    _getCellValue(item, columnConfig) {
        let value = item[columnConfig.field];

        if (columnConfig.field === fields.PreferredLanguage) {
            value = this.languageList[value] || '';
        } else if (columnConfig.field === fields.PaymentFrequency) {
            value = value ? value.replace(/ - /g, '\n') : '';
        } else if (columnConfig.field === fields.PaymentCurrency) {
            value = value || DEFAULT_PAYMENT_CURRENCY;
        }

        return value;
    }

    /**
     * Gets cell style based on column and item configuration
     * @private
     * @param {Object} columnConfig - Column configuration
     * @param {Object} item - Data item
     * @param {string} sectionStyleName - Style section name
     * @returns {Object} Cell style
     */
    _getCellStyle(columnConfig, item, sectionStyleName) {
        const isMultiGroupCommission = columnConfig.field === fields.CommissionRate && item.IsMultiGroupProduct;
        return isMultiGroupCommission ? bodyCellStyle.rightHighlight : columnConfig[sectionStyleName];
    }

    /**
     * Creates Excel configuration (merges, range, column widths)
     * @private
     */
    _createExcelConfig() {
        const cellStart = Excel.getCellAddress({ r: 0, c: 0 });
        const cellEnd = Excel.getCellAddress({ r: this.currentRowIndex, c: this.totalColumn });

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
        return this.columnConfigs.map(item => ({ [COL_WIDTH]: item[COL_WIDTH] }));
    }

    /**
     * Gets column configurations from header
     * @private
     * @param {HeaderRow} header - Header configuration
     * @returns {Array} Array of column configurations
     */
    _getColumnConfigs(header) {
        const showableCols = header.getCols().filter(item => item.isShowable);
        return showableCols.map(col => this._buildColumnConfig(col));
    }

    /**
     * Builds column configuration object
     * @private
     * @param {Object} col - Column object
     * @returns {Object} Column configuration
     */
    _buildColumnConfig(col) {
        return {
            field: col.key,
            [MAIN_SECTION_STYLE]: colConfig[col.key][MAIN_SECTION_STYLE],
            [TOTAL_SECTION_STYLE]: colConfig[col.key][TOTAL_SECTION_STYLE],
            [COL_WIDTH]: colConfig[col.key][COL_WIDTH]
        };
    }
}