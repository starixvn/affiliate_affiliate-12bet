using Fanex.Affiliate.Admin.Core.Criterias.UserPanel;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Data.Repository;
using System.Linq;

namespace Fanex.Affiliate.Admin.Core.Services.UserPanel
{
    public class PlayerDetailService : BaseDynamicService, IPlayerDetailService
    {
        public PlayerDetailService(
            IDynamicRepository dynamicRepository) : base(dynamicRepository) { }

        public (bool, EntityResult<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param)
        {
            var criteria = new PlayerDetailCriteria
            {
                AffId = param.AffId,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize,
                ProductId = param.ProductId,
                FromDate = param.FromDate,
                ToDate = param.ToDate,
                IsSortAsc = param.IsSortAsc,
                IsExportExcel = param.IsExportExcel,
                SortById = param.SortById,
                BaseCurrencyId = param.BaseCurrencyId,
                CurrencyIds = param.CurrencyIds,
                IsIncludeRemovedPlayer = param.IsIncludeRemovedPlayer
            };

            var dataItems = DynamicRepository.FetchMultiple<bool, PlayerDetail>(criteria);

            return (dataItems.Item1.FirstOrDefault(), new EntityResult<PlayerDetail>
            {
                MainData = dataItems.Item2,
                TotalItem = criteria.TotalItem,
            });
        }
    }
}
