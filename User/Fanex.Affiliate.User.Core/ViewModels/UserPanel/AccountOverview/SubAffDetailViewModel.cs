using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    public class SubAffDetailViewModel : BaseGroupTypeId
    {
        public IEnumerable<SubAffDetail> SubAffDetailList { get; set; }

        public bool IsGetMonthly { get; set; }
    }
}
