using Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport
{
    public class PlayerCPATurnOverViewModel
    {
        public List<PlayerCPATurnOverGroup> Groups { get; set; }

        public PlayerCPATurnOverItem Total { get; set; }
    }
}
