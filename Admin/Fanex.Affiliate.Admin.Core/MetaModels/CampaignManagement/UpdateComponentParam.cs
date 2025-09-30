namespace Fanex.Affiliate.Admin.Core.MetaModels.CampaignManagement
{
    public class UpdateComponentParam : UserInfoParam
    {
        public string ComponentName { get; set; }

        public int ComponentId { get; set; }

        public int ComponentTypeId { get; set; }

        public int StatusId { get; set; }
    }
}