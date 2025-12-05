using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    public class OverviewDetailViewModel : BaseGroupTypeId
    {
        public IEnumerable<OverviewDetail> OverviewDetailList { get; set; }
    }
}
