using Fanex.Affiliate.User.Core.DTO.UserPanel;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel
{
    public class MonthlyCPAViewModel
    {
        public List<MonthlyCPA> MonthlyCPA { get; set; }

        public MonthlyCPA MonthlyCPATotal { get; set; }

        public int TotalRows { get; set; }
    }
}
