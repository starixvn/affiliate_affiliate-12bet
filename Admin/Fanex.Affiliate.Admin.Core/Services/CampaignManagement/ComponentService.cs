namespace Fanex.Affiliate.Admin.Core.Services.CampaignManagement
{
    using System.Collections.Generic;
    using Commands.CampaignManagement;
    using Criterias.CampaignManagement;
    using Criterias.Operation;
    using Data.Repository;
    using DTO;
    using DTO.Component;
    using Extensions;
    using MetaModels.CampaignManagement;

    public class ComponentService : BaseDynamicService, IComponentService
    {
        public ComponentService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public IEnumerable<ComponentStatus> GetAllComponentStatus()
        {
            return FetchTData<ComponentStatus>(new GetAllComponentStatusCriteria());
        }

        public IEnumerable<ComponentType> GetAllComponentTypes()
        {
            return FetchTData<ComponentType>(new GetAllComponentTypeCriteria());
        }

        public IEnumerable<ComponentDetailInfo> GetComponentList(GetComponentListParam param)
        {
            var criteria = param.MapTo<GetComponentListParam, GetComponentListCriteria>();
            return FetchTData<ComponentDetailInfo>(criteria);
        }

        public ResultInfo UpdateComponent(UpdateComponentParam param)
        {
            var command = param.MapTo<UpdateComponentParam, UpdateComponentCommand>();

            return ExecuteReturnResultInfo(command);
        }

        public ResultInfo InsertComponent(InsertComponentParam param)
        {
            var command = param.MapTo<InsertComponentParam, InsertComponentCommand>();

            return ExecuteReturnResultInfo(command);
        }

        public IEnumerable<ComponentDealInfo> GetDealList(GetDealListParam param)
        {
            var criteria = param.MapTo<GetDealListParam, GetDealListCriteria>();
            return FetchTData<ComponentDealInfo>(criteria);
        }

        public IEnumerable<AssignDealInfo> GetAssignDealList(GetAssignDealListParam param)
        {
            var criteria = param.MapTo<GetAssignDealListParam, GetAssignDealCriteria>();
            criteria.IsOnlyRevenue = false;

            var data = FetchTData<AssignDealInfo>(criteria);
            param.GroupId = criteria.GroupId;

            return data;
        }

        public ResultInfo InsertDeal(InsertDealParam param)
        {
            var command = param.MapTo<InsertDealParam, InsertDealCommand>();

            return ExecuteReturnResultInfo(command);
        }

        public ResultInfo UpdateDeal(UpdateDealParam param)
        {
            var command = param.MapTo<UpdateDealParam, UpdateDealCommand>();

            return ExecuteReturnResultInfo(command);
        }
    }
}