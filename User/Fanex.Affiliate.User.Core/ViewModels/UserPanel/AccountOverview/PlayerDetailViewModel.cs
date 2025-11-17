namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
    using System.Collections.Generic;

    public class PlayerDetailViewModel : BaseGroupTypeName
    {
        public IEnumerable<PlayerDetail> PlayerDetailList { get; set; }

        public int TotalItem { get; set; }

        public int StartRowNumber { get; set; }

        public bool IsDepositFeePercent { get; set; }

        public bool IsWithdrawalFeePercent { get; set; }
    }
}
