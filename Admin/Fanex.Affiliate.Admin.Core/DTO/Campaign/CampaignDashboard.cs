namespace Fanex.Affiliate.Admin.Core.DTO.Campaign
{
    public class CampaignDashboard
    {
        public int TotalCampaigns { get; set; }

        public int DraftCampaigns { get; set; }

        public int ActiveCampaigns { get; set; }

        public int InactiveCampaigns { get; set; }

        public int PausedCampaigns { get; set; }
    }
}
