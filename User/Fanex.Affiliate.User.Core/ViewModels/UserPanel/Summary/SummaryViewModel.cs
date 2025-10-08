using System;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.Summary
{
    public class SummaryViewModel
    {
        public bool IsMaxLevel { get; set; }

        public bool IsCPAAff { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
