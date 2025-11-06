namespace Fanex.Affiliate.Admin.Core.Services.Report
{
    using System.Threading.Tasks;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Report;
    using Fanex.Affiliate.Admin.Core.MetaModels.Report;

    public interface IPlayerCpaService
    {
        Task<EntityResult<PlayerCpaReport>> GetDataAsync(PlayerCpaReportParam request);

        Task<TurnoverDetailModel> GetTurnoverDetailAsync(int memberCpaId);
    }
}
