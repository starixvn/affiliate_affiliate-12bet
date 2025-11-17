using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    [CustomAuthorize]
    public class SummaryController : BaseController
    {
        private readonly IAccountOverviewService _accountOverviewService;

        public SummaryController(ISessionService sessionService,
            ISystemService systemsService,
            IAccountOverviewService accountOverviewService
            ) : base(sessionService, systemsService)
        {
            _accountOverviewService = accountOverviewService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var userSession = SessionService.UserSession;
            var now = DateTimeHelper.Gmt8Now;
            var viewModel = new SummaryViewModel
            {
                IsMaxLevel = userSession.IsMaxSubLevel,
                FromDate = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1),
                ToDate = now,
                GroupTypeName = userSession.GroupNameType
            };

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Dashboard(AccountOverviewParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var model = _accountOverviewService.GetUserOverviewSummary(param);
            ViewBag.IsCurrentMonth = IsCurrentMonth(param.ToDate);

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/Dashboard.cshtml", model);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Overview(AccountOverviewParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var (groupTypeName, dataList) = _accountOverviewService.GetUserOverviewDetailList(param);

            var itemTotal = new OverviewDetail
            {
                Signups = dataList.Sum(item => item.Signups),
                Deposit = dataList.Sum(item => item.Deposit),
                ActiveMembers = dataList.Sum(item => item.ActiveMembers),
                Turnover = dataList.Sum(item => item.Turnover),
                Withdrawal = dataList.Sum(item => item.Withdrawal),
                DepositedMembers = dataList.Sum(item => item.DepositedMembers),
                QualifiedActiveMembers = dataList.Sum(item => item.QualifiedActiveMembers),
                GGR = dataList.Sum(item => item.GGR)
            };

            var model = new OverviewDetailViewModel
            {
                GroupTypeName = groupTypeName,
                OverviewDetailList = dataList.Concat(new List<OverviewDetail> { itemTotal })
            };

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/Overview.cshtml", model);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult PlayersDetails(PlayerDetailParam param)
        {
            var model = GetPlayerDetailViewModel(param);

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/PlayersDetails.cshtml", model);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult PlayersDetailsContent(PlayerDetailParam param)
        {
            var model = GetPlayerDetailViewModel(param);

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/PlayersDetailsContent.cshtml", model);
        }


        [HttpPost]
        [AjaxOnly]
        public ActionResult SubAffDetails(AccountOverviewParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var (groupTypeName, dataList) = _accountOverviewService.GetSubAffDetails(param);

            var model = new SubAffDetailViewModel
            {
                GroupTypeName = groupTypeName,
                IsGetMonthly = param.IsGetMonthly,
                SubAffDetailList = dataList
            };

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/SubAffDetails.cshtml", model);
        }

        private PlayerDetailViewModel GetPlayerDetailViewModel(PlayerDetailParam param)
        {
            var userSession = SessionService.UserSession;

            param.AffId = userSession.AffId;
            var (groupTypeName, playerDetailList) = _accountOverviewService.GetPlayerDetailList(param);

            return new PlayerDetailViewModel
            {
                PlayerDetailList = playerDetailList,
                TotalItem = param.NRows,
                StartRowNumber = (param.PageIndex - 1) * param.PageSize + 1,
                GroupTypeName = groupTypeName,
                IsDepositFeePercent = userSession.IsDepositFeePercent,
                IsWithdrawalFeePercent = userSession.IsWithdrawalFeePercent
            };
        }

        private static bool IsCurrentMonth(DateTime toDate)
        {
            var now = DateTimeHelper.Gmt8Now;

            return toDate.Month == now.Month && toDate.Year == now.Year; 
        }
    }
}
