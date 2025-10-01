namespace Fanex.Affiliate.Admin.Core.Services.CampaignManagement
{
    using System.Collections.Generic;
    using Commands.CampaignManagement;
    using Criterias.CampaignManagement;
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
    }
}