using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.LinkGenerator;
using Fanex.Affiliate.Admin.Core.MetaModels.LinkGenerator;

namespace Fanex.Affiliate.Admin.Core.Services.LinkGenerator
{
    public interface ILinkManagementService
    {
        EntityResult<LinkManagement> GetLinkManagementList(LinkManagementParam param);
    }
}
