using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel.CPAReport;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport;

namespace Fanex.Affiliate.User.Core.BusinessService.CPAReport
{
    public interface IPlayerCPAReportService
    {
        EntityResult<PlayerCPA> GetPlayerCPAData(PlayerCPAReportParam param);

        PlayerCPATurnOverViewModel GetPlayerCPATurnOverData(PlayerCPATurnOverParam param);
    }
}
