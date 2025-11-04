namespace Fanex.Affiliate.User.Core.UnitTests.BusinessService
{
    using Commands.Marketing;
    using Criterias;
    using Data.Repository;
    using DTO;
    using DTO.UserPanel;
    using DTO.UserPanel.MediaGallery;
    using Enum;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.Constants;
    using Fanex.Affiliate.User.Core.CoreService;
    using Fanex.Affiliate.User.Core.Utilities;
    using MetalModels;
    using MetalModels.UserPanel;
    using NSubstitute;
    using NSubstitute.ReturnsExtensions;
    using System.Collections.Generic;
    using TestHelper;
    using Xunit;

    public class MarketingServiceTest
    {
        private readonly IDynamicRepository Repo;
        private readonly IMemoryCacheService CacheService;
        private readonly ISystemService LanguageService;
        private readonly IAppSetting AppSetting;

        public MarketingServiceTest()
        {
            Repo = Substitute.For<IDynamicRepository>();
            CacheService = Substitute.For<IMemoryCacheService>();
            LanguageService = NSubstituteMockingHelper.FakeLanguageService();
            AppSetting = Substitute.For<IAppSetting>();
        }

        [Fact]
        public void GetCategoryList_WhenHaveInfoInCache_NotCallRepoToQueryInfo()
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<CategoryType>>(null).ReturnsForAnyArgs(Constant.CategoryList);

            service.GetCategoryList(false, AffiliateLinkType.AffiliateLink, false);

            Repo.DidNotReceiveWithAnyArgs().Fetch<CategoryType>(Arg.Any<GetCategoryListCriteria>());
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void GetCategoryList_WhenNotHaveInfoInBothCacheAndRepo_ReturnEmptyList(bool isMediaPage)
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<CategoryType>>(null).ReturnsNullForAnyArgs();
            Repo.Fetch<CategoryType>(Arg.Any<GetCategoryListCriteria>()).ReturnsNullForAnyArgs();

            var result = service.GetCategoryList(isMediaPage, AffiliateLinkType.AffiliateLink, false);

            Repo.ReceivedWithAnyArgs().Fetch<CategoryType>(Arg.Any<GetCategoryListCriteria>());
            CacheService.ReceivedWithAnyArgs().Set(null, default(IEnumerable<CategoryType>));
            Assert.Empty(result);
        }

        [Fact]
        public void GetCurrencyList_WhenNotHaveInfoInCache_CallInfoFromRepo()
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<CurrencyType>>(CacheKey.CurrencyList).ReturnsNull();
            Repo.Fetch<CurrencyType>(Arg.Any<GetCurrencyListCriteria>()).ReturnsForAnyArgs(Constant.CurrencyType);

            service.GetCurrencyList(false);

            Repo.Received().Fetch<CurrencyType>(Arg.Any<GetCurrencyListCriteria>());
            CacheService.Received().Set(CacheKey.CurrencyList, Arg.Compat.Any<IEnumerable<CurrencyType>>());
        }

        [Fact]
        public void GetCurrencyList_WhenNotHaveInfoInBothCacheAndRepo_ReturnEmptyList()
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<CurrencyType>>(CacheKey.CurrencyList).ReturnsNull();
            Repo.Fetch<CurrencyType>(Arg.Any<GetCurrencyListCriteria>()).ReturnsNullForAnyArgs();

            var result = service.GetCurrencyList(false);

            Assert.Empty(result);
        }

        [Fact]
        public void GetCurrencyList_WhenHaveInfoInCache_NotCallInfoFromRepo()
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<CurrencyType>>(CacheKey.CurrencyList).Returns(Constant.CurrencyType);

            service.GetCurrencyList(false);

            Repo.DidNotReceive().Fetch<CurrencyType>(Arg.Any<GetCurrencyListCriteria>());
            CacheService.DidNotReceive().Set(CacheKey.CurrencyList, Arg.Compat.Any<IEnumerable<CurrencyType>>());
        }

        [Fact]
        public void GetSizeList_WhenCall_RepoCallGetSize()
        {
            var service = CreateService();
            var param = new SizeParam
            {
                AffType = "asia",
                Category = "cate",
                Currency = "USD",
                DeviceType = 1,
                ImageType = "png",
                Language = "vi-VN",
                SubCategory = "sub",
                TargetId = AffiliateLinkType.AffiliateLink
            };

            service.GetSizeList(param, false);

            Repo.Received().Fetch<SizeType>(Arg.Any<GetSizeListCriteria>());
        }

        [Fact]
        public void GetAvailableDomainList_WhenCacheNotHaveDomainInfo_RepoCall()
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<Domain>>(CacheKey.DomainList).ReturnsNull();
            Repo.Fetch<Domain>(Arg.Any<GetAffDomainListCriteria>()).ReturnsForAnyArgs(Constant.DomainList);

            var result = service.GetAvailableDomainList(new AvailableDomainParam());

            Repo.Received().Fetch<Domain>(Arg.Any<GetAffDomainListCriteria>());
            CacheService.Received().Set(CacheKey.DomainList, Arg.Compat.Any<IEnumerable<Domain>>(), Number.Ten);
            Assert.NotEmpty(result);
        }

        [Fact]
        public void GetAvailableDomainList_WhenBothCacheAndRepoNotHaveDomainInfo_ReturnEmptyList()
        {
            var service = CreateService();
            CacheService.Get<IEnumerable<Domain>>(CacheKey.SubDomainList).ReturnsNull();
            Repo.Fetch<Domain>(Arg.Any<GetSubAffDomainListCriteria>()).ReturnsNullForAnyArgs();

            var result = service.GetAvailableDomainList(new AvailableDomainParam { LinkType = AffiliateLinkType.SubAffiliateLink });

            Repo.Received().Fetch<Domain>(Arg.Any<GetSubAffDomainListCriteria>());
            CacheService.Received().Set(CacheKey.SubDomainList, Arg.Compat.Any<IEnumerable<Domain>>(), Number.Ten);
            Assert.Empty(result);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void GenerateLinkList_WhenSelectAllLanguagesAndLanguagesInSystemNotEmpty_ReturnNotEmptyList(bool isSsl)
        {
            var service = CreateService();
            LanguageService.GetLanguageList().Returns(GetLanguageList());
            var param = CreateLinkGenerationParam(isSsl);
            param.SelectedLanguage = null;

            var result = service.GenerateLinkList(param);

            Assert.NotEmpty(result);
        }

        [Fact]
        public void GenerateLinkList_WhenSelectedLanguageNotEmpty_ReturnEmpty()
        {
            var service = CreateService();
            LanguageService.GetLanguageList().Returns(GetLanguageList());
            var param = CreateLinkGenerationParam();
            param.SelectedLanguage = "abc";

            var result = service.GenerateLinkList(param);

            Assert.Empty(result);
        }

        [Fact]
        public void GenerateLinkList_WhenSelectedLanguageNotEmpty_ReturnNotEmpty()
        {
            var service = CreateService();
            LanguageService.GetLanguageList().Returns(GetLanguageList());
            var param = CreateLinkGenerationParam();

            var result = service.GenerateLinkList(param);

            Assert.NotEmpty(result);
        }

        [Fact]
        public void GenerateLinkList_WhenSelectedLanguageEmpty_ReturnEmpty()
        {
            var service = CreateService();
            LanguageService.GetLanguageList().Returns(new List<Language>());
            var param = CreateLinkGenerationParam();

            var result = service.GenerateLinkList(param);

            Assert.Empty(result);
        }

        [Theory]
        [InlineData("English")]
        [InlineData("Thai")]
        public void GetBannerList_WhenCall_RepoCall(string language)
        {
            var service = CreateService();
            var param = CreateMarketingBannerParam();
            var bannerList = CreateMarketingItemList(language);
            Repo.Fetch<MarketingItem>(Arg.Any<GetBannerListCriteria>()).Returns(bannerList);
            LanguageService.GetLanguageList().Returns(GetLanguageList());

            var result = service.GetBannerList(param);

            Repo.Received().Fetch<MarketingItem>(Arg.Any<GetBannerListCriteria>());
            Assert.Equal(bannerList, result);
        }

        [Fact]
        public void GetBannerList_WhenCall_RepoCallReturnNull()
        {
            var service = CreateService();
            var param = CreateMarketingBannerParam();
            Repo.Fetch<MarketingItem>(Arg.Any<GetBannerListCriteria>()).Returns(new List<MarketingItem>());
            LanguageService.GetLanguageList().Returns(GetLanguageList());

            var result = service.GetBannerList(param);

            Repo.Received().Fetch<MarketingItem>(Arg.Any<GetBannerListCriteria>());
            Assert.Empty(result);
        }

        [Fact]
        public void GetLandingPageList_WhenCall_RepoCall()
        {
            var service = CreateService();

            service.GetLandingPageList(new LandingPageParam());

            Repo.Received().Fetch<LandingPage>(Arg.Any<GetLandingPageListCriteria>());
        }

        [Fact]
        public void GetLandingPageList_WhenCallWithSubAff_ReturnNotEmptyData()
        {
            var service = CreateService();

            var result = service.GetLandingPageList(new LandingPageParam { LinkType = AffiliateLinkType.SubAffiliateLink});

            Assert.NotEmpty(result);
        }

        [Fact]
        public void GetTextLinkTemplate_WhenCallWithTargetToMember_ReturnCorrectData()
        {
            AppSetting.TextLinkTemplate.Returns("TargetToMember");
            var service = CreateService();

            var result = service.GetTextLinkTemplate(AffiliateLinkType.AffiliateLink);

            Assert.Equal("TargetToMember", result);
        }

        [Fact]
        public void GetTextLinkTemplate_WhenCallWithTargetToSubAff_ReturnCorrectData()
        {
            AppSetting.SubAffTextLinkTemplate.Returns("TargetToSubAff");
            var service = CreateService();

            var result = service.GetTextLinkTemplate(AffiliateLinkType.SubAffiliateLink);

            Assert.Equal("TargetToSubAff", result);
        }

        [Fact]
        public void GetTextLinkTemplate_WhenCallWithInvalidTarget_ReturnCorrectData()
        {
            AppSetting.TextLinkTemplate.Returns("InvalidTarget");
            var service = CreateService();

            var result = service.GetTextLinkTemplate(0);

            Assert.Equal("InvalidTarget", result);
        }

        [Theory]
        [InlineData(ErrCodes.OneHundredOne, "", false)]
        [InlineData(ErrCodes.OneHundredTwo, "", false)]
        [InlineData(ErrCodes.OneHundredThree, "", false)]
        [InlineData(123, "Abc", false)]
        [InlineData(0, "", true)]
        public void AddMarketingChannel_WhenCall_RepoCall(int code, string errMsg, bool isOk)
        {
            var service = CreateService();
            Repo.Execute(Arg.Any<AddMarketingChannelCommand>())
                .Returns(0)
                .AndDoes(call =>
                {
                    var command = call.Arg<AddMarketingChannelCommand>();
                    command.ErrMsg = errMsg;
                    command.ErrCode = code;
                });

            var result = service.AddMarketingChannel(1, "xyz");

            Repo.Received().Execute(Arg.Any<AddMarketingChannelCommand>());
            Assert.Equal(isOk, result.IsOk);
        }

        [Fact]
        public void GetChannels_WhenCall_RepoCall()
        {
            var service = CreateService();

            service.GetChannels(123);

            Repo.Received().Fetch<MarketingChannel>(Arg.Any<GetMarketingChannelsCriteria>());
        }

        [Theory]
        [InlineData(ErrCodes.OneHundredOne, "", false)]
        [InlineData(ErrCodes.OneHundredTwo, "", false)]
        [InlineData(123, "Abc", false)]
        [InlineData(0, "", true)]
        public void ToggleMarketingLink_WhenCall_RepoCall(int code, string errMsg, bool isOk)
        {
            var service = CreateService();
            var param = new MarketingLinkParam();
            Repo.Execute(Arg.Any<ToggleMarketingLinkCommand>())
                .Returns(0)
                .AndDoes(call =>
                {
                    var command = call.Arg<ToggleMarketingLinkCommand>();
                    command.ErrMsg = errMsg;
                    command.ErrCode = code;
                });

            var result = service.ToggleMarketingLink(param);

            Repo.Received().Execute(Arg.Any<ToggleMarketingLinkCommand>());
            Assert.Equal(isOk, result.IsOk);
        }

        [Fact]
        public void GetUsingMarketingLinks_WhenCall_RepoCall()
        {
            var service = CreateService();

            service.GetUsingMarketingLinks(123);

            Repo.Received().Fetch<MarketingChannelLink>(Arg.Any<GetUsingMarketingLinkCriteria>());
        }

        private MarketingBannerParam CreateMarketingBannerParam()
            => new MarketingBannerParam
            {
                AffId = 1,
                AffType = "asia",
                BannerDomain = "abc.com",
                Category = "cate",
                Currency = "USD",
                DeviceType = 1,
                IsInternal = false,
                Language = "English",
                NRows = 19,
                PageIndex = 1,
                PageSize = 20,
                SelectedDomain = new Domain { DomainId = 1, DomainName = "abc.com", IsSsl = true },
                SelectedDomainId = 1,
                SelectedPage = "SignUp",
                Size = "1020x90",
                SubCategory = "sub",
                TextLinkTemplate = "{scheme}://{domain}/{custid}/{target}/{lang}/index.html"
            };

        private IEnumerable<MarketingItem> CreateMarketingItemList(string language)
            => new List<MarketingItem>
            {
             new MarketingItem
             {
                 BannerId = 1,
                 Category = "cate",
                 Currency = "USD",
                 DeviceType = "mobile",
                 FileName = "abc.png",
                 Height = 1090,
                 ImageType = "png",
                 Language = language,
                 LastUpdate = DateTimeHelper.Gmt8Now,
                 Message = "abc",
                 RedirectLink = "abc.com",
                 ScriptSrc = "banner.com/script",
                 SelectedDomainName = "SignUp",
                 Size = "1090x90",
                 TextId = 2,
                 Width = 90
             },
             new MarketingItem
             {
                 BannerId = 1,
                 Category = "cate",
                 Currency = "USD",
                 DeviceType = "mobile",
                 FileName = "abc.png",
                 Height = 1090,
                 ImageType = "png",
                 Language = "English",
                 LastUpdate = DateTimeHelper.Gmt8Now,
                 Message = "abc",
                 RedirectLink = "abc.com",
                 ScriptSrc = "banner.com/script",
                 SelectedDomainName = "SignUp",
                 Size = string.Empty,
                 TextId = 2,
                 Width = 90
             }
            };

        private LinkGeneratingParam CreateLinkGenerationParam(bool isSsl = false)
            => new LinkGeneratingParam
            {
                AffId = 1,
                DomainId = 1,
                IsInternal = false,
                PreferredLanguage = "vi-VN",
                SelectedDomain = new Domain { DomainId = 1, DomainName = "abc.com", IsSsl = isSsl },
                SelectedDomainId = 1,
                SelectedLanguage = "vi-VN",
                SelectedPage = "SignUp",
                TextLinkTemplate = "{scheme}://{domain}/{custid}/{target}/{lang}/index.html"
            };

        private IEnumerable<Language> GetLanguageList()
            => new List<Language>
            {
             new Language{DisplayName="VietNam", Code="vi-VN", EnglishName="VietNam", NativeName="Viet Nam", ShortedCode="vn"},
             new Language { DisplayName="English", Code="en-US", EnglishName="English", NativeName="English", ShortedCode="en" }
            };

        private MarketingService CreateService()
            => new MarketingService(Repo, CacheService, AppSetting, LanguageService);
    }
}
