namespace Fanex.Affiliate.Admin.Core.Commands.CampaignManagement
{
    public class InsertDealCommand : BaseNonQueryCommand
    {
        public int DealId { get; set; }

        public int StatusId { get; set; }

        public override string GetSettingKey() => "Aff_LandingPage_Deal_Ins";

        public override bool IsValid()
        {
            return StatusId >= 0 && DealId > 0;
        }
    }
}
