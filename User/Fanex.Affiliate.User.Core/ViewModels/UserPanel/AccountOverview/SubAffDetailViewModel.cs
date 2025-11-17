using Fanex.Affiliate.User.Core.DTO.UserPanel;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    public class SubAffDetailViewModel : BaseOverviewViewModel
    {
        public IEnumerable<SubAffDetail> SubAffDetailList { get; set; }

        public bool IsGetMonthly { get; set; }
    }
}
