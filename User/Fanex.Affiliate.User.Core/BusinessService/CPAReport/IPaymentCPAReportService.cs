namespace Fanex.Affiliate.User.Core.BusinessService.CPAReport
{
    using MetalModels.UserPanel.CPAReport;
    using ViewModels.UserPanel.CPAReport;

    public interface IPaymentCPAReportService
    {
        PaymentCPAReportDataViewModel GetPaymentCPAReportData(PaymentCPAReportParam param);
    }
}