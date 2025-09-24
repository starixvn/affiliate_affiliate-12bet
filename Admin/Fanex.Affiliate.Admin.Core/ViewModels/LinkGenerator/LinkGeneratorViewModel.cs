using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Common;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.ViewModels.LinkGenerator
{
    public class LinkGeneratorViewModel
    {
        public IEnumerable<TargetCountry> TargetCountryList { get; set; }

        public IEnumerable<Language> AllLanguagesInSystem { get; set; }
    }
}
