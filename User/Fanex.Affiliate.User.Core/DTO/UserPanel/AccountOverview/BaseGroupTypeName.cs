using System;

namespace Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview
{
    public class BaseGroupTypeName
    {
        public string GroupTypeName { get; set; }

        public bool IsHybridAff => GroupTypeName.StartsWith("Hybrid", StringComparison.OrdinalIgnoreCase);
        public bool IsCPAAff => string.Equals(GroupTypeName, "CPA", StringComparison.OrdinalIgnoreCase);
        public bool IsRevenueShareAff => string.Equals(GroupTypeName, "Revenue Share", StringComparison.OrdinalIgnoreCase);
    }
}
