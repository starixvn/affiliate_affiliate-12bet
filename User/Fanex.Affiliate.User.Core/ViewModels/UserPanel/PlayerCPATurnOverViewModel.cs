using Fanex.Affiliate.User.Core.DTO.UserPanel;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel
{
    public class PlayerCPATurnOverViewModel
    {
        public List<PlayerCPATurnOverGroup> Groups { get; set; }

        public PlayerCPATurnOverItem Total { get; set; }
    }
}
