using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.LinkGenerator;
using Fanex.Affiliate.Admin.Core.MetaModels.LinkGenerator;
using Fanex.Data.Repository;
using System.Collections.Generic;


namespace Fanex.Affiliate.Admin.Core.Services.LinkGenerator
{
    public class LinkManagementService : BaseDynamicService, ILinkManagementService
    {
        public LinkManagementService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        
        public EntityResult<LinkManagement> GetLinkManagementList(LinkManagementParam param)
        {
            //var criteria = param.MapTo<LinkManagementParam, GetLinkManagementCriteria>();
            //return FetchEntityResult<LinkManagement>(criteria);

            var sampleData = new List<LinkManagement>
            {
                new LinkManagement
                {
                    LinkId = 1,
                    AffiliateName = "SportsBet Pro",
                    LinkName = "Main Sports Link",
                    LinkCode = "SPB001",
                    AffiliateMediaLink = "https://12bet.com/sports?ref=SPB001",
                    CreatedDate = "2024-01-15",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 2,
                    AffiliateName = "CasinoMax",
                    LinkName = "Casino Landing",
                    LinkCode = "CMX002",
                    AffiliateMediaLink = "https://12bet.com/casino?ref=CMX002",
                    CreatedDate = "2024-01-16",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 3,
                    AffiliateName = "LiveBet Asia",
                    LinkName = "Live Sports Link",
                    LinkCode = "LBA003",
                    AffiliateMediaLink = "https://12bet.com/live?ref=LBA003",
                    CreatedDate = "2024-01-17",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 4,
                    AffiliateName = "VIP Gaming",
                    LinkName = "VIP Sports Link",
                    LinkCode = "VIP004",
                    AffiliateMediaLink = "https://12bet.com/vip?ref=VIP004",
                    CreatedDate = "2024-01-18",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 5,
                    AffiliateName = "BetMaster Pro",
                    LinkName = "Master Sports Link",
                    LinkCode = "BMP005",
                    AffiliateMediaLink = "https://12bet.com/master?ref=BMP005",
                    CreatedDate = "2024-01-19",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 6,
                    AffiliateName = "Golden Casino",
                    LinkName = "Golden Games Link",
                    LinkCode = "GC006",
                    AffiliateMediaLink = "https://12bet.com/golden?ref=GC006",
                    CreatedDate = "2024-01-20",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 7,
                    AffiliateName = "Elite Sports",
                    LinkName = "Elite Betting Link",
                    LinkCode = "ES007",
                    AffiliateMediaLink = "https://12bet.com/elite?ref=ES007",
                    CreatedDate = "2024-01-21",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 8,
                    AffiliateName = "Mega Casino",
                    LinkName = "Mega Games Link",
                    LinkCode = "MC008",
                    AffiliateMediaLink = "https://12bet.com/mega?ref=MC008",
                    CreatedDate = "2024-01-22",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 9,
                    AffiliateName = "Pro Betting",
                    LinkName = "Pro Sports Link",
                    LinkCode = "PB009",
                    AffiliateMediaLink = "https://12bet.com/pro?ref=PB009",
                    CreatedDate = "2024-01-23",
                    CreatedBy = "admin"
                },
                new LinkManagement
                {
                    LinkId = 10,
                    AffiliateName = "Ultimate Gaming",
                    LinkName = "Ultimate Link",
                    LinkCode = "UG010",
                    AffiliateMediaLink = "https://12bet.com/ultimate?ref=UG010",
                    CreatedDate = "2024-01-24",
                    CreatedBy = "admin"
                }
            };

            return new EntityResult<LinkManagement>
            {
                MainData = sampleData
            };
        }

        public IEnumerable<Event> GetEvent()
        {
            var sampleData = new List<Event>
            {
                new Event { EventId = 1, EventName = "FIFA World Cup 2024" },
                new Event { EventId = 2, EventName = "UEFA Champions League" },
                new Event { EventId = 3, EventName = "NBA Finals" },
                new Event { EventId = 4, EventName = "Wimbledon Tennis" },
                new Event { EventId = 5, EventName = "Olympic Games 2024" },
                new Event { EventId = 6, EventName = "Formula 1 Grand Prix" },
                new Event { EventId = 7, EventName = "Boxing Championship" },
                new Event { EventId = 8, EventName = "Cricket World Cup" },
                new Event { EventId = 9, EventName = "Golf Masters" },
                new Event { EventId = 10, EventName = "Rugby World Cup" }
            };

            return sampleData;
        }

        public IEnumerable<Channel> GetChannel()
        {
            var sampleData = new List<Channel>
            {
                new Channel { ChannelId = 1, ChannelName = "Sports Betting" },
                new Channel { ChannelId = 2, ChannelName = "Live Casino" },
                new Channel { ChannelId = 3, ChannelName = "Online Casino" },
                new Channel { ChannelId = 4, ChannelName = "Virtual Sports" },
                new Channel { ChannelId = 5, ChannelName = "Lottery" },
                new Channel { ChannelId = 6, ChannelName = "Poker" },
                new Channel { ChannelId = 7, ChannelName = "Bingo" },
                new Channel { ChannelId = 8, ChannelName = "Esports" },
                new Channel { ChannelId = 9, ChannelName = "Live Dealer" },
                new Channel { ChannelId = 10, ChannelName = "Mobile Gaming" }
            };

            return sampleData;
        }

        public IEnumerable<Group> GetGroup()
        {
            var sampleData = new List<Group>
            {
                new Group { GroupId = 1, GroupName = "VIP Members" },
                new Group { GroupId = 2, GroupName = "Premium Users" },
                new Group { GroupId = 3, GroupName = "Standard Users" },
                new Group { GroupId = 4, GroupName = "New Members" },
                new Group { GroupId = 5, GroupName = "High Rollers" },
                new Group { GroupId = 6, GroupName = "Casual Players" },
                new Group { GroupId = 7, GroupName = "Sports Enthusiasts" },
                new Group { GroupId = 8, GroupName = "Casino Lovers" },
                new Group { GroupId = 9, GroupName = "Live Betting Fans" },
                new Group { GroupId = 10, GroupName = "Mobile Users" }
            };

            return sampleData;
        }

        public IEnumerable<Agency> GetAgency()
        {
            var sampleData = new List<Agency>
            {
                new Agency { AgencyId = 1, AgencyName = "SportsBet Pro" },
                new Agency { AgencyId = 2, AgencyName = "CasinoMax" },
                new Agency { AgencyId = 3, AgencyName = "LiveBet Asia" },
                new Agency { AgencyId = 4, AgencyName = "VIP Gaming" },
                new Agency { AgencyId = 5, AgencyName = "BetMaster Pro" },
                new Agency { AgencyId = 6, AgencyName = "Golden Casino" },
                new Agency { AgencyId = 7, AgencyName = "Elite Sports" },
                new Agency { AgencyId = 8, AgencyName = "Mega Casino" },
                new Agency { AgencyId = 9, AgencyName = "Pro Betting" },
                new Agency { AgencyId = 10, AgencyName = "Ultimate Gaming" }
            };

            return sampleData;
        }

        public IEnumerable<Type> GetType()
        {
            var sampleData = new List<Type>
            {
                new Type { TypeId = 1, TypeName = "Sports" },
                new Type { TypeId = 2, TypeName = "Casino" },
                new Type { TypeId = 3, TypeName = "Live Casino" },
                new Type { TypeId = 4, TypeName = "Virtual Sports" },
                new Type { TypeId = 5, TypeName = "Lottery" },
                new Type { TypeId = 6, TypeName = "Poker" },
                new Type { TypeId = 7, TypeName = "Bingo" },
                new Type { TypeId = 8, TypeName = "Esports" },
                new Type { TypeId = 9, TypeName = "Live Betting" },
                new Type { TypeId = 10, TypeName = "Mobile Games" }
            };

            return sampleData;
        }
    }
}
