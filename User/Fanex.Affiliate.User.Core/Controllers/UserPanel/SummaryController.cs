using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.Summary;
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
            var now = DateTimeHelper.Gmt8Now;
            var viewModel = new SummaryViewModel
            {
                IsMaxLevel = SessionService.UserSession.IsMaxSubLevel,
                FromDate = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1),
                ToDate = now,
            };

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Dashboard(AccountOverviewParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var model = _accountOverviewService.GetUserOverviewSummary(param);

            model.IsGetMonthly = param.IsGetMonthly;

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/Dashboard.cshtml", model);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Overview(AccountOverviewParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var model = _accountOverviewService.GetUserOverviewDetailList(param);

            var itemTotal = new OverviewDetail
            {
                Signups = model.Sum(item => item.Signups),
                Deposit = model.Sum(item => item.Deposit),
                ActiveMembers = model.Sum(item => item.ActiveMembers),
                Turnover = model.Sum(item => item.Turnover),
                Withdrawal = model.Sum(item => item.Withdrawal),
                DepositedMembers = model.Sum(item => item.DepositedMembers),
                QualifiedActiveMembers = model.Sum(item => item.QualifiedActiveMembers),
                GGR = model.Sum(item => item.GGR)
            };

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/Overview.cshtml", model.Concat(new List<OverviewDetail> { itemTotal }));
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
            var model = _accountOverviewService.GetSubAffDetails(param);

            return PartialView("~/Views/UserPanel/AccountOverView/Summary/SubAffDetails.cshtml", model);
        }

        private PlayerDetailViewModel GetPlayerDetailViewModel(PlayerDetailParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var playerDetailList = _accountOverviewService.GetPlayerDetailList(param);

            return new PlayerDetailViewModel
            {
                PlayerDetailList = playerDetailList,
                TotalItem = param.NRows,
                StartRowNumber = (param.PageIndex - 1) * param.PageSize + 1,
                IsDepositFeePercent = SessionService.UserSession.IsDepositFeePercent,
                IsWithdrawalFeePercent = SessionService.UserSession.IsWithdrawalFeePercent
            };
        }
    }
}
