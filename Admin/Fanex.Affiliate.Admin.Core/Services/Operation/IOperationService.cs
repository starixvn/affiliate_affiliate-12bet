namespace Fanex.Affiliate.Admin.Core.Services.Operation
{
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
    using System.Threading.Tasks;

    public interface IOperationService
    {
        ResultInfo AddDeal(DealSettingParam param);

        ResultInfo DeleteDeal(DeleteDealParam param);

        Task<ResultInfo> UpdateDealAsync(DealSettingParam param);
    }
}
