using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Constants;
using Fanex.Affiliate.User.Core.Controllers;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO.Auth;
using Fanex.Affiliate.User.Core.DTO.UserPanel;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.UnitTests.TestHelper;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
using NSubstitute;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.User.Core.UnitTests.Controllers.UserPanel
{

    public class StatementHistoryControllerTest
    {
        private readonly ISessionService SessionService;
        private readonly ISystemService LanguageService;
        private readonly IAppSetting AppSetting;
        private readonly IStatementHistoryService Repo;

        public StatementHistoryControllerTest()
        {
            SessionService = NSubstituteMockingHelper.FakeSessionService();
            LanguageService = NSubstituteMockingHelper.FakeLanguageService();
            AppSetting = Substitute.For<IAppSetting>();
            Repo = Substitute.For<IStatementHistoryService>();
        }

        [Theory]
        [InlineData("123")]
        [InlineData("abc")]
        public void Index_WhenCallWithNoParm_ReturnCorrectViewWithDefaultValue(string baseCurrency)
        {
            LanguageService.GetBaseCurrencyList().Returns(new List<Currency> { new Currency { ExchangeId = 123, Code = "USD" } });
            var defaultParam = new StatementHistoryParam
            {
                AffId = SessionService.UserSession.AffId,
                IsInternal = SessionService.IsInternal,
                PageSize = 20
            };
            Repo.GetStatementHistory(Arg.Compat.Any<StatementHistoryParam>()).Returns(new List<StatementHistory>());

            var controller = CreateController();
            var result = controller.Index(baseCurrency) as ViewResult;

            Repo.Received().GetStatementHistory(Arg.Compat.Is<StatementHistoryParam>(param =>
                param.AffId == defaultParam.AffId &&
                param.IsInternal == defaultParam.IsInternal &&
                param.PageSize == defaultParam.PageSize));
            Assert.Equal("~/Views/UserPanel/StatementHistory/Index.cshtml", result.ViewName);
        }

        [Fact]
        public void Index_WhenCallWithParam_ReturnPartialView()
        {
            var controller = CreateController();
            var param = new StatementHistoryParam
            {
                PageIndex = 1
            };
            Repo.When(a => a.GetStatementHistory(Arg.Compat.Any<StatementHistoryParam>()))
                .Do(a =>
                {
                    param.NRows = 10;
                    param.PageSize = 10;
                });
            var result = controller.Index(param) as PartialViewResult;

            var startRowNumber = (param.PageIndex - 1) * param.PageSize + 1;
            Assert.Equal("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", result.ViewName);
            Assert.Equal(param.NRows, result.ViewBag.TotalItem);
            Assert.Equal(startRowNumber, result.ViewBag.StartRowNumber);
        }

        [Fact]
        public void Index_WhenCallWithIsMaxSubLevelAndNullData_ReturnPartialView()
        {
            var controller = CreateController();
            SessionService.UserSession.Returns(new UserSession { AffId = 123, IsMaxSubLevel = true });

            var param = new StatementHistoryParam
            {
                PageIndex = 1,
                PageSize = 20
            };

            var result = controller.Index(param) as PartialViewResult;
            var model = result.Model as List<StatementHistoryViewModel>;

            Assert.Equal("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", result.ViewName);
            Assert.Empty(model);
        }

        [Theory]
        [InlineData(TransType.MonthlyEarning, "running", "December-2020", "Processing", "Monthly Earning", "Current Monthly Earning (Calculate Revenue Share by Turnover)", 0)]
        [InlineData(TransType.MonthlyEarning, "pending", "December-2020", "Processing", "Monthly Earning", "Uncalculated Monthly Earning (Calculate Revenue Share by Turnover)", 1)]
        [InlineData(TransType.MonthlyEarning, "completed", "December-2020", "Approved", "Monthly Earning", "Monthly Earning (Calculate Revenue Share by Turnover)", 2)]
        //[InlineData(TransType.SubAffBonus, "cancelled", "December-2020", "Cancelled", "Sub-Affiliate", "Current Revenue Share", 0)]
        //[InlineData(TransType.SubAffBonus, "approved", "December-2020", "Approved", "Sub-Affiliate", "Uncalculated Revenue Share", 1)]
        //[InlineData(TransType.SubAffBonus, "rejected", "December-2020", "Rejected", "Sub-Affiliate", "Revenue Share", 2)]
        [InlineData(TransType.MonthlyTotal, "current", "December-2020", "Current", "Transaction", "Current Month Statistics", 0)]
        [InlineData(TransType.MonthlyTotal, "test", "December-2020", "test", "Monthly Total", "Uncalculated Month", 1)]
        [InlineData(TransType.MonthlyTotal, "current", "December-2020", "Current", "Monthly Total", "Monthly Total", 2)]
        [InlineData(TransType.Payment, "current", "12-07-2020", "Current", "Payment Request", "test", 0)]
        [InlineData(TransType.Adjustment, "current", "12-07-2020", "Current", "Adjustment", "", 0)]
        [InlineData(TransType.Adjustment, "CURRENT", "12-07-2020", "Current", "Adjustment", "", 0)]
        [InlineData(123, "abc", "December-2020", "abc", "Transaction", "test", 0)]
        [InlineData(123, "", "December-2020", "", "Transaction", "test", 0)]
        public void Index_WhenCallWithIsMaxSubLevel_ReturnPartialView(int transType, string status, string dateString, string displayStatus,
            string transTypeString, string descriptionDisplay, byte calculatedType)
        {
            var controller = CreateController();
            SessionService.UserSession.Returns(new UserSession { AffId = 123, IsMaxSubLevel = false });

            var param = new StatementHistoryParam
            {
                PageIndex = 1,
                PageSize = 20
            };
            Repo.When(a => a.GetStatementHistory(Arg.Compat.Any<StatementHistoryParam>()))
                .Do(a =>
                {
                    param.NRows = 1;
                });
            Repo.GetStatementHistory(Arg.Any<StatementHistoryParam>()).Returns(new List<StatementHistory> {
            new StatementHistory { TransType = transType, MonthDate = DateTimeHelper.CreateDateTime(2020, 12, 07), Status = status, CalculatedType = calculatedType, Description = "test" }
        });

            var result = controller.Index(param) as PartialViewResult;
            var model = result.Model as List<StatementHistoryViewModel>;
            var item = model.FirstOrDefault();

            var startRowNumber = (param.PageIndex - 1) * param.PageSize + 1;
            Assert.Equal("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", result.ViewName);
            Assert.Equal(param.NRows, result.ViewBag.TotalItem);
            Assert.Equal(startRowNumber, result.ViewBag.StartRowNumber);
            Assert.Equal(dateString, item.DateString);
            Assert.Equal(displayStatus, item.DisplayStatus);
            Assert.Equal(transTypeString, item.TransTypeString);
            Assert.Equal(descriptionDisplay, item.DescriptionDisplay);
        }

        [Theory]
        [InlineData(TransType.MonthlyEarning, "running", "December-2020", "Processing", "Monthly Earning", "Current Monthly Earning (Calculate Revenue Share by Turnover)")]
        //[InlineData(TransType.SubAffBonus, "cancelled", "December-2020", "Cancelled", "Sub-Affiliate", "Current Revenue Share")]
        [InlineData(TransType.MonthlyTotal, "current", "December-2020", "Current", "Transaction", "Current Month Statistics")]
        public void Index_WhenCallWithIsMaxSubLevelAndCalculatedTypeNull_ReturnPartialView(int transType, string status, string dateString, string displayStatus,
            string transTypeString, string descriptionDisplay)
        {
            var controller = CreateController();
            SessionService.UserSession.Returns(new UserSession { AffId = 123, IsMaxSubLevel = false });

            var param = new StatementHistoryParam
            {
                PageIndex = 1,
                PageSize = 20
            };
            Repo.When(a => a.GetStatementHistory(Arg.Compat.Any<StatementHistoryParam>()))
                .Do(a =>
                {
                    param.NRows = 1;
                });
            Repo.GetStatementHistory(Arg.Any<StatementHistoryParam>()).Returns(new List<StatementHistory> {
            new StatementHistory { TransType = transType, MonthDate = DateTimeHelper.CreateDateTime(2020, 12, 07), Status = status, CalculatedType = null, Description = "test" }
        });

            var result = controller.Index(param) as PartialViewResult;
            var model = result.Model as List<StatementHistoryViewModel>;
            var item = model.FirstOrDefault();

            var startRowNumber = (param.PageIndex - 1) * param.PageSize + 1;
            Assert.Equal("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", result.ViewName);
            Assert.Equal(param.NRows, result.ViewBag.TotalItem);
            Assert.Equal(startRowNumber, result.ViewBag.StartRowNumber);
            Assert.Equal(dateString, item.DateString);
            Assert.Equal(displayStatus, item.DisplayStatus);
            Assert.Equal(transTypeString, item.TransTypeString);
            Assert.Equal(descriptionDisplay, item.DescriptionDisplay);
        }

        [Fact]
        public void Index_WhenCallWithNotMaxSubLevelAndNullData_ReturnPartialView()
        {
            var controller = CreateController();

            var param = new StatementHistoryParam
            {
                PageIndex = 1,
                PageSize = 20
            };

            var result = controller.Index(param) as PartialViewResult;
            var model = result.Model as List<StatementHistoryViewModel>;

            Assert.Equal("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", result.ViewName);
            Assert.Empty(model);
        }

        [Fact]
        public void Index_WhenCallWithNotMaxLevel_ReturnPartialViews()
        {
            var controller = CreateController();

            var param = new StatementHistoryParam
            {
                PageIndex = 1
            };
            Repo.When(a => a.GetStatementHistory(Arg.Compat.Any<StatementHistoryParam>()))
                .Do(a =>
                {
                    param.NRows = 4;
                });
            Repo.GetStatementHistory(Arg.Any<StatementHistoryParam>()).Returns(new List<StatementHistory> {
                    new StatementHistory { TransType = TransType.SubAffiliateRevenueShare, MonthDate = DateTimeHelper.CreateDateTime(2020, 09, 10), Status = null, CalculatedType = null },

                    new StatementHistory { TransType = TransType.MonthlyEarning, MonthDate = DateTimeHelper.CreateDateTime(2020, 07, 10), Status = null, CalculatedType = null },

                    new StatementHistory { TransType = TransType.MonthlyEarning, MonthDate = DateTimeHelper.CreateDateTime(2020, 06, 10), Status = null, CalculatedType = null },
                    new StatementHistory { TransType = TransType.SubAffiliateRevenueShare, MonthDate = DateTimeHelper.CreateDateTime(2020, 06, 10), Status = null, CalculatedType = null },

                    new StatementHistory { TransType = TransType.MonthlyEarning, MonthDate = DateTimeHelper.CreateDateTime(2020, 05, 10), Status = null, CalculatedType = null },
                    new StatementHistory { TransType = TransType.SubAffiliateRevenueShare, MonthDate = DateTimeHelper.CreateDateTime(2020, 05, 10), Status = "Current", CalculatedType = 1 },

                    new StatementHistory { TransType = TransType.MonthlyEarning, MonthDate = DateTimeHelper.CreateDateTime(2020, 04, 10), Status = "Current", CalculatedType = 1 },
                    new StatementHistory { TransType = TransType.SubAffiliateRevenueShare, MonthDate = DateTimeHelper.CreateDateTime(2020, 04, 10), Status = "Current", CalculatedType = 1 },

                    new StatementHistory { TransType = TransType.Payment, MonthDate = DateTimeHelper.CreateDateTime(2020, 03, 10), Status = "Current", CalculatedType = 0 }
                });

            var result = controller.Index(param) as PartialViewResult;

            var startRowNumber = (param.PageIndex - 1) * param.PageSize + 1;
            Assert.Equal("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", result.ViewName);
            Assert.Equal(param.NRows, result.ViewBag.TotalItem);
            Assert.Equal(startRowNumber, result.ViewBag.StartRowNumber);
        }

        private StatementHistoryController CreateController()
            => new StatementHistoryController(SessionService, LanguageService, AppSetting, Repo);
    }
}
