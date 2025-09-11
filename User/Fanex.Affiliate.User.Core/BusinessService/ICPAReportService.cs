namespace Fanex.Affiliate.User.Core.BusinessService
{
    using MetalModels.UserPanel;
    using ViewModels.UserPanel.CPAReport;

    public interface ICPAReportService
    {
        RedepositCPAReportDataViewModel GetRedepositCPAReportData(RedepositCPAReportParam param);
    }
}