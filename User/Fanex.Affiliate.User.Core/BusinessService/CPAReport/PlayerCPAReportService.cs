using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Criterias.CPAReport;
using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel.CPAReport;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport;
using Fanex.Data.Repository;
using System.Collections.Generic;
using System.Linq;

namespace Fanex.Affiliate.User.Core.BusinessService.CPAReport
{
    public class PlayerCPAReportService : BaseDynamicService, IPlayerCPAReportService
    {
        public PlayerCPAReportService(IDynamicRepository repository) : base(repository) 
        {
        }

        public EntityResult<PlayerCPA> GetPlayerCPAData(PlayerCPAReportParam param)
        {
            var criteria = param.MapTo<PlayerCPAReportParam, GetPlayerCPAReportCriteria>();

            return FetchEntityResultWithPaging<PlayerCPA>(criteria);
        }

        public PlayerCPATurnOverViewModel GetPlayerCPATurnOverData(PlayerCPATurnOverParam param)
        {
            var result = new PlayerCPATurnOverViewModel
            {
                Groups = new List<PlayerCPATurnOverGroup>(),
                Total = new PlayerCPATurnOverItem()
            };

            var criteria = new GetPlayerCPATurnOverCriteria();
            criteria.MemberCPAID = param.MemberCPAID;

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
