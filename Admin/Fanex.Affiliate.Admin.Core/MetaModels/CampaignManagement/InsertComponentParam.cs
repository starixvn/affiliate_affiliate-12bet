namespace Fanex.Affiliate.Admin.Core.MetaModels.CampaignManagement
{
    public class InsertComponentParam : UserInfoParam
    {
        public string ComponentName { get; set; }

        public string ComponentCode => ComponentName.Trim().ToLowerInvariant().Replace(" ", "-");

        public int ComponentTypeId { get; set; }

        public int StatusId { get; set; }
    }
}