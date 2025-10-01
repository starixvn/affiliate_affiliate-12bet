namespace Fanex.Affiliate.Admin.Core.Services.CampaignManagement
{
    using System.Collections.Generic;
    using Commands.CampaignManagement;
    using Criterias.CampaignManagement;
    using Data.Repository;
    using DTO;
    using DTO.Campaign;
    using Extensions;
    using MetaModels.CampaignManagement;

    public class CampaignService : BaseDynamicService, ICampaignService
    {
        public CampaignService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public CampaignDashboard GetCampaignDashboard()
        {
            return GetTData<CampaignDashboard>(new GetCampaignDashboardCriteria());
        }

        public IEnumerable<CampaignStatus> GetAllCampaignStatus()
        {
            return FetchTData<CampaignStatus>(new GetAllCampaignStatusCriteria());
        }

        public EntityResult<CampaignDetailInfo> GetCampaignList(GetCampaignListParam param)
        {
            var criteria = param.MapTo<GetCampaignListParam, GetCampaignListCriteria>();
            return FetchEntityResult<CampaignDetailInfo>(criteria);
        }

        public ResultInfo UpdateCampaign(UpdateCampaignParam param)
        {
            var command = param.MapTo<UpdateCampaignParam, UpdateCampaignCommand>();

            return ExecuteReturnResultInfo(command);
        }

        public ResultInfo InsertCampaign(InsertCampaignParam param)
        {
            var command = param.MapTo<InsertCampaignParam, InsertCampaignCommand>();

            return ExecuteReturnResultInfo(command);
        }
    }
}
