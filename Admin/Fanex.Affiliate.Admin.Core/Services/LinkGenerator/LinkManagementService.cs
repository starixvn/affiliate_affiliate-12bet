using Fanex.Affiliate.Admin.Core.Criterias.LinkGenerator;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.LinkGenerator;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.LinkGenerator;
using Fanex.Data.Repository;
using System.Collections.Generic;


namespace Fanex.Affiliate.Admin.Core.Services.LinkGenerator
{
    public class LinkManagementService : BaseDynamicService, ILinkManagementService
    {
        public LinkManagementService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public EntityResult<LinkManagement> GetLinkManagementList(LinkManagementParam param)
        {
            //var criteria = param.MapTo<LinkManagementParam, GetLinkManagementCriteria>();
            //return FetchEntityResult<LinkManagement>(criteria);

            return new EntityResult<LinkManagement>
            {
                MainData = new List<LinkManagement>()
            };
        }
    }
}
