import ReportExcel from '../reportExcel';
import Excel from '../../../../../modules/excel';
import { reportKey as fields } from '../constants';

// Mock Excel module
jest.mock('../../../../../modules/excel');

describe('ReportExcel', () => {
    let mockData;
    let mockTitle;

    beforeEach(() => {
        mockData = {
            MainData: [
                {
                    AffUserName: '12BETAFF001',
                    DealName: 'CPA_06',
                    PaymentFrequency: 'Daily',
                    StartFromStr: '08/05/2025',
                    ApprovalDateStr: '08/06/2025',
                    RecheckDays: 20,
                    ExpiredRedepositDateStr: '08/25/2025',
                    ApprovedCpaPlayer: 22,
                    RedepositRate: 0.5055,
                    NumOfPlayerRedeposit: '0/11',
                    TotalSettledCpaAmount: 7164.00,
                    Status: 'Not qualified'
                },
                {
                    AffUserName: '12BETAFF10899',
                    DealName: 'CPA_06',
                    PaymentFrequency: 'Daily',
                    StartFromStr: '08/27/2025',
                    ApprovalDateStr: '08/28/2025',
                    RecheckDays: 20,
                    ExpiredRedepositDateStr: '09/16/2025',
                    ApprovedCpaPlayer: 3,
                    RedepositRate: 0.5055,
                    NumOfPlayerRedeposit: '0/1',
                    TotalSettledCpaAmount: 900.00,
                    Status: 'Monitoring'
                }
            ],
            Total: {
                ApprovedCpaPlayer: 25,
                TotalSettledCpaAmount: 8064.00
            }
        };

        mockTitle = 'Redeposit CPA Report - Test';

        // Mock Excel methods
        Excel.process = jest.fn((callback) => callback());
        Excel.getCellAddress = jest.fn(({ c, r }) => `${String.fromCharCode(65 + c)}${r + 1}`);
        Excel.getCellType = jest.fn(() => 's');
        Excel.export = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should create instance with correct properties', () => {
            const instance = new ReportExcel(mockData, mockTitle);

            expect(instance.worksheet).toEqual({});
            expect(instance.title).toBe(mockTitle);
            expect(instance.data).toBe(mockData);
            expect(instance.currentRowIndex).toBe(4);
            expect(instance.mergeConfig).toEqual([]);
            expect(instance.options.showTotal).toBe(true);
        });
    });



    describe('export', () => {
        it('should call Excel.process and export file', () => {
            const instance = new ReportExcel(mockData, mockTitle);
            instance.export();

            expect(Excel.process).toHaveBeenCalled();
            expect(Excel.export).toHaveBeenCalled();
        });
    });

    describe('_formatCellValue', () => {
        it('should format data correctly', () => {
            const instance = new ReportExcel(mockData, mockTitle);
            const item = mockData.MainData[0];

            expect(instance._formatCellValue(fields.RowIdx, null, item)).toBe(1);
            expect(instance._formatCellValue(fields.RedepositRate, item.RedepositRate, item)).toBe('50.55%');
            expect(instance._formatCellValue(fields.RecheckDays, item.RecheckDays, item)).toBe('20 days');
            expect(instance._formatCellValue(fields.TotalSettledCpaAmount, item.TotalSettledCpaAmount, item)).toBe('7,164.00');
            expect(instance._formatCellValue(fields.ApprovedCpaPlayer, item.ApprovedCpaPlayer, item)).toBe(22);
        });

        it('should handle null values', () => {
            const instance = new ReportExcel(mockData, mockTitle);

            expect(instance._formatCellValue(fields.RedepositRate, null, {})).toBe('N/A');
            expect(instance._formatCellValue(fields.NumOfPlayerRedeposit, null, {})).toBe('N/A');
            expect(instance._formatCellValue(fields.Status, null, {})).toBe('N/A');
            expect(instance._formatCellValue(fields.TotalSettledCpaAmount, null, {})).toBe('');
        });


    });
});
