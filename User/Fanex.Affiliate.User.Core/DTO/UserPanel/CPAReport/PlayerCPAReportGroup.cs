using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport
{
    public class PlayerCPATurnOverGroup
    {
        public PlayerCPATurnOverItem Total { get; set; }

        public List<PlayerCPATurnOverItem> Players { get; set; }
    }
}
