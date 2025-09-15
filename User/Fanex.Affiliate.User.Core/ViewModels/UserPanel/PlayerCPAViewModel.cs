using Fanex.Affiliate.User.Core.DTO.UserPanel;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel
{
    public class PlayerCPAViewModel
    {
        public List<PlayerCPA> PlayerCPA { get; set; }

        public PlayerCPA PlayerCPATotal { get; set; }  

        public int TotalRows { get; set; }
    }
}
