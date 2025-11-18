using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using System;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    public class SummaryViewModel : BaseGroupTypeId
    {
        public bool IsMaxLevel { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
