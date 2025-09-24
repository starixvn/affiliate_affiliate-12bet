using Fanex.Affiliate.Admin.Core.Criterias.LandingPage;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Campaign;
using Fanex.Affiliate.Admin.Core.DTO.Common;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.LandingPage;
using Fanex.Data.Repository;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.Services.LinkGenerator
{
    public class LinkGeneratorService : BaseDynamicService, ILinkGeneratorService
    {
        private readonly ISystemService _systemService;

        public LinkGeneratorService(
            IDynamicRepository dynamicRepository,
            ISystemService systemService) : base(dynamicRepository)
        {
            _systemService = systemService;
        }

        public IEnumerable<CampaignInfo> GetCampaignInfoList()
        {
            return FetchTData<CampaignInfo>(new GetCampaignInfoCriteria());
        }

        public IEnumerable<Language> GetAllLanguagesInSystem()
        {
            return _systemService.GetAllLanguagesInSystem();
        }

        public IEnumerable<TargetCountry> GetTargetCountryList()
        {
            return _systemService.GetTargetCountryList();
        }
    }
}
