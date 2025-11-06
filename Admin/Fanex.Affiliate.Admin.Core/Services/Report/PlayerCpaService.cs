namespace Fanex.Affiliate.Admin.Core.Services.Report
{
    using System.Linq;
    using System.Threading.Tasks;
    using Fanex.Affiliate.Admin.Core.Criterias.Report;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Report;
    using Fanex.Affiliate.Admin.Core.Extensions;
    using Fanex.Affiliate.Admin.Core.MetaModels.Report;
    using Fanex.Data.Repository;

    public class PlayerCpaService : BaseDynamicService, IPlayerCpaService
    {
        private readonly IDynamicRepository _dynamicRepository;

        public PlayerCpaService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
            _dynamicRepository = dynamicRepository;
        }

        public async Task<EntityResult<PlayerCpaReport>> GetDataAsync(PlayerCpaReportParam request)
        {
            return await FetchFromDatabaseAsync(request);
        }

        public async Task<TurnoverDetailModel> GetTurnoverDetailAsync(int memberCpaId)
        {
            var criteria = new TurnoverCpaDetailCriteria { MemberCpaId = memberCpaId };

            var (groupByProducts, groupByProductDetails, total) = await _dynamicRepository
                .FetchMultipleAsync<TurnoverGroupByProduct, TurnoverGroupByProductDetail, TurnoverGroupByProduct>(criteria);

            groupByProducts = groupByProducts.Select(group =>
            {
                group.Products = groupByProductDetails.Where(detail =>
                    detail.MemberCPAId == group.MemberCPAId
                    && detail.MemberCPATierId == group.MemberCPATierId
                    && detail.GroupProductId == group.GroupProductId);
                return group;
            });

            return new TurnoverDetailModel
            {
                Total = total.FirstOrDefault(),
                Groups = groupByProducts
            };
        }

        private async Task<EntityResult<PlayerCpaReport>> FetchFromDatabaseAsync(PlayerCpaReportParam param)
        {
            var criteria = param.MapTo<PlayerCpaReportParam, PlayerCpaReportCriteria>();
            var (reports, total) =
                await _dynamicRepository.FetchMultipleAsync<PlayerCpaReport, PlayerCpaReport>(criteria);

            return new EntityResult<PlayerCpaReport>
            {
                MainData = reports,
                Total = total.FirstOrDefault(),
                TotalItem = criteria.NRows
            };
        }
    }
}
