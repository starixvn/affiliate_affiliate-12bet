using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Common;
using Fanex.Affiliate.Admin.Core.DTO.LinkGenerator;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.ViewModels.LinkGenerator
{
    public class LinkManagementViewModel
    {
        public IEnumerable<TargetCountry> TargetCountryList { get; set; }

        public IEnumerable<Language> LanguageList { get; set; }

        public IEnumerable<Event> EventList { get; set; }

        public IEnumerable<Group> GroupList { get; set; }

        public IEnumerable<Channel> ChannelList { get; set; }

        public IEnumerable<Agency> AgencyList { get; set; }

        public IEnumerable<Type> TypeList { get; set; }

    }
}
