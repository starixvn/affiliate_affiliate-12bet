using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Criterias.CPAReport;
using Fanex.Affiliate.User.Core.DTO.UserPanel;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
using Fanex.Common.Extensions;
using Fanex.Data.Repository;
using Microsoft.SqlServer.Server;
using System;
using System.Globalization;
using System.Linq;

namespace Fanex.Affiliate.User.Core.BusinessService
{
    public class AffiliateCPAReportService : BaseDynamicService, IAffiliateCPAReportService
    {
        public AffiliateCPAReportService(IDynamicRepository repository) : base(repository) 
        {
        }

        public CPAReportViewModel GetCPAReportData(CPAReportParam reportParams)
        {
            var monthlyCPAViewModel = GetMonthlyData(reportParams);
            var playerViewModel = GetPlayerData(reportParams);

            return new CPAReportViewModel
            {
                MonthlyCPAViewModel = monthlyCPAViewModel,
                PlayerCPAViewModel = playerViewModel
            };
        }

        public MonthlyCPAViewModel GetMonthlyData(CPAReportParam reportParams)
        {
            var monthlyCPACriteria = new AffiliateCPACriteria
            {
                AffId = reportParams.AffId,
                StatusId = reportParams.StatusId,
                ViewBy = reportParams.ViewBy,
                FromDate = reportParams.FromDate,
                ToDate = reportParams.ToDate,
                SortType = reportParams.SortType,
                SortDirectionType = reportParams.SortDirectionType
            };

            var monthlyCPA = FetchEntityResult<MonthlyCPA>(monthlyCPACriteria);

            return new MonthlyCPAViewModel
            {
                MonthlyCPA = monthlyCPA.MainDataList.ToList(),
                MonthlyCPATotal = monthlyCPA.Total,
                TotalRows = monthlyCPACriteria.TotalRows
            };
        }

        public PlayerCPAViewModel GetPlayerData(CPAReportParam reportParams)
        {
            var playerCPACriteria = new AffiliatePlayerCPACriteria
            {
                AffId = reportParams.AffId,
                StatusId = reportParams.StatusId,
                ViewBy = reportParams.ViewBy,
                FromDate = reportParams.FromDate,
                ToDate = reportParams.ToDate,
                PageIndex = reportParams.PageIndex,
                PageSize = reportParams.PageSize
            };

            var playerCPA = FetchEntityResultWithPaging<PlayerCPA>(playerCPACriteria, reportParams);

            return new PlayerCPAViewModel
            {
                PlayerCPA = playerCPA.MainDataList.ToList(),
                PlayerCPATotal = playerCPA.Total,
                TotalRows = playerCPACriteria.TotalRows
            };
        }

        public PlayerCPAViewModel GetPlayerDataByMonth(PlayerCPAReportParam reportParams)
        {
            var monthDate = DateTime.ParseExact(reportParams.Month, "MM-yyyy", CultureInfo.InvariantCulture);

            var playerCPACriteria = new AffiliatePlayerCPACriteria
            {
                AffId = reportParams.AffId,
                StatusId = reportParams.StatusId,
                ViewBy = reportParams.ViewBy,
                FromDate = monthDate.FirstDayOfMonth(),
                ToDate = monthDate.LastDayOfMonth(),
                PageIndex = reportParams.PageIndex,
                PageSize = reportParams.PageSize
            };

            var playerCPA = FetchEntityResultWithPaging<PlayerCPA>(playerCPACriteria, reportParams);

            return new PlayerCPAViewModel
            {
                PlayerCPA = playerCPA.MainDataList.ToList(),
                PlayerCPATotal = playerCPA.Total,
                TotalRows = playerCPACriteria.TotalRows
            };
        }
    }
}
