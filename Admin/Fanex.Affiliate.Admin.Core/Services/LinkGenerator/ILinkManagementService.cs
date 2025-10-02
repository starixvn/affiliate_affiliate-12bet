using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.LinkGenerator;
using Fanex.Affiliate.Admin.Core.MetaModels.LinkGenerator;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.Services.LinkGenerator
{
    public interface ILinkManagementService
    {
        EntityResult<LinkManagement> GetLinkManagementList(LinkManagementParam param);
        IEnumerable<Event> GetEvent();
        IEnumerable<Channel> GetChannel();
        IEnumerable<Group> GetGroup();
        IEnumerable<Agency> GetAgency();
        IEnumerable<Type> GetType();
    }
}
