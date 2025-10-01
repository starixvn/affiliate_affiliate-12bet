namespace Fanex.Affiliate.Admin.Core.Services.CampaignManagement
{
    using System.Collections.Generic;
    using DTO;
    using DTO.Component;
    using MetaModels.CampaignManagement;

    public interface IComponentService
    {
        IEnumerable<ComponentStatus> GetAllComponentStatus();

        IEnumerable<ComponentType> GetAllComponentTypes();

        IEnumerable<ComponentDetailInfo> GetComponentList(GetComponentListParam param);

        ResultInfo UpdateComponent(UpdateComponentParam param);

        ResultInfo InsertComponent(InsertComponentParam param);
    }
}
