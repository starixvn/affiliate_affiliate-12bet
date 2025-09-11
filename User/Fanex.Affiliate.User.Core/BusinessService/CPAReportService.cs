namespace Fanex.Affiliate.User.Core.BusinessService
{
    using System.Collections.Generic;
    using System.Linq;
    using Constants;
    using CoreService;
    using Criterias.CPAReport;
    using Data.Repository;
    using DTO.UserPanel.CPAReport;
    using MetalModels.UserPanel;
    using Resources;
    using Utilities;
    using ViewModels.UserPanel.CPAReport;

    public class CPAReportService : BaseDynamicService, ICPAReportService
    {
        private const int PercentageUnit = 100;

        private const string DefaultText = "-";

        private Dictionary<int, string> StatusMapper => new Dictionary<int, string>
        {
            {RedepositCPAStatus.Monitoring, Lang.Monitoring},
            {RedepositCPAStatus.NotQualified, Lang.NotQualified},
            {RedepositCPAStatus.Qualified, Lang.Qualified},
        };

        public CPAReportService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public RedepositCPAReportDataViewModel GetRedepositCPAReportData(RedepositCPAReportParam param)
        {
            var criteria = param.MapTo<RedepositCPAReportParam, GetRedepositCPAReportCriteria>();

            var rawData = FetchEntityResultWithPaging<RedepositCPAReportItem>(criteria, param);

            foreach (var item in rawData.MainDataList)
            {
                item.RedepositRate *= PercentageUnit;
                item.Status = StatusMapper.TryGetValue(item.StatusId, out string statusName) ? statusName : DefaultText;
            }

            var dataGroup = rawData.MainDataList
                .GroupBy(e => e.DealId)
                .OrderBy(e => e.Min(i => i.RowIdx))
                .Select(g => g.OrderBy(e=>e.RowIdx).ToList())
                .ToList();

            return new RedepositCPAReportDataViewModel
            {
                Data = dataGroup,
                Total = rawData.Total,
                RowNumber = param.NRows
            };
        }
    }
}
