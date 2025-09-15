using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Criterias.CPAReport;
using Fanex.Affiliate.User.Core.DTO.UserPanel;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
using Fanex.Common.Extensions;
using Fanex.Data.Repository;
using System;
using System.Collections.Generic;
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
            bool isGetDataFromMonthLink = string.IsNullOrEmpty(reportParams.Month);
            
            var fromDate = reportParams.FromDate;
            var toDate = reportParams.ToDate;

            if (!isGetDataFromMonthLink)
            {
                var monthDate = DateTime.ParseExact(reportParams.Month, "MM/yyyy", CultureInfo.InvariantCulture);
                fromDate = monthDate.FirstDayOfMonth();
                toDate = monthDate.LastDayOfMonth();
            }

            var playerCPACriteria = new AffiliatePlayerCPACriteria
            {
                AffId = reportParams.AffId,
                StatusId = reportParams.StatusId,
                ViewBy = reportParams.ViewBy,
                FromDate = fromDate,
                ToDate = toDate,
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

        public PlayerCPATurnOverViewModel GetPlayerCPATurnOverData(PlayerCPATurnOverParam reportParams)
        {
            var result = new PlayerCPATurnOverViewModel
            {
                Groups = new List<PlayerCPATurnOverGroup>(),
                Total = new PlayerCPATurnOverItem()
            };

            var criteria = new AffiliatePlayerCPATurnOverCriteria();
            criteria.MemberCPAID = reportParams.MemberCPAID;

            var data = FetchMultipleEntityResult<PlayerCPATurnOverItem>(criteria);

            foreach (var parentItem in data.FirstDataList)
            {
                var groupPlayerCPATurnOver = new PlayerCPATurnOverGroup
                {
                    Total = parentItem,
                    Players = data.SecondDataList.Where(
                        x => x.GroupProductId == parentItem.GroupProductId &&
                        x.MemberCPATierId == parentItem.MemberCPATierId).ToList()
                };
               
                result.Groups.Add(groupPlayerCPATurnOver);
            }

            result.Total = data.Total;

            return result;
        }
    }
}
