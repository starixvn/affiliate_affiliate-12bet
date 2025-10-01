namespace Fanex.Affiliate.Admin.Core.Services.CampaignManagement
{
    using System.Collections.Generic;
    using DTO;
    using DTO.Campaign;
    using MetaModels.CampaignManagement;

    public interface ICampaignService
    {
        CampaignDashboard GetCampaignDashboard();

        IEnumerable<CampaignStatus> GetAllCampaignStatus();

        EntityResult<CampaignDetailInfo> GetCampaignList(GetCampaignListParam param);

        ResultInfo UpdateCampaign(UpdateCampaignParam param);

        ResultInfo InsertCampaign(InsertCampaignParam param);
    }
}
