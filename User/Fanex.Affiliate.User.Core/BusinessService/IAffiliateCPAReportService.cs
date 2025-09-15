using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel;

namespace Fanex.Affiliate.User.Core.BusinessService
{
    public interface IAffiliateCPAReportService
    {
        CPAReportViewModel GetCPAReportData(CPAReportParam reportParams);

        MonthlyCPAViewModel GetMonthlyData(CPAReportParam reportParams);

        PlayerCPAViewModel GetPlayerData(CPAReportParam reportParams);

        PlayerCPATurnOverViewModel GetPlayerCPATurnOverData(PlayerCPATurnOverParam reportParams);
    }
}
