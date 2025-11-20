namespace Fanex.Affiliate.Admin.Core.Services.Operation
{
    using System.Threading.Tasks;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Email;
    using MetaModels.Operation;

    public interface IDealAssignmentService
    {
        Task<ResultInfo> AssignDealAsync(AssignDealParam param, AffInfoParam affInfo, AffInformationEmail emailParam);

        bool HasPermissionAssignOnAff(int userId, int affId);
    }
}
