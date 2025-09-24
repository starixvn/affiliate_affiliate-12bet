using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Campaign;
using Fanex.Affiliate.Admin.Core.DTO.Common;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.Services.LandingPage
{
    public interface ILinkGeneratorService
    {
        IEnumerable<CampaignInfo> GetCampaignInfoList();

        IEnumerable<Language> GetAllLanguagesInSystem();

        IEnumerable<TargetCountry> GetTargetCountryList();
    }
}
