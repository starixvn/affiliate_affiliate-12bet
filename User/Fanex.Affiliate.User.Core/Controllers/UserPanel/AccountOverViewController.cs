namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using BusinessService;
    using CoreService;
    using Filters;
    using System.Web.Mvc;
    using ViewModels.UserPanel.AccountOverview;

    [CustomAuthorize]
    public class AccountOverviewController : BaseController
    {
        private readonly IAccountOverviewService _accountOverviewService;

        public AccountOverviewController(
            ISessionService sessionService,
            ISystemService systemsService,
            IAccountOverviewService accountOverviewService)
            : base(sessionService, systemsService)
        {
            _accountOverviewService = accountOverviewService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var lastLoginInfo = _accountOverviewService.GetLastLoginInfo(SessionService.UserSession.AffId);

            var model = new AccountOverviewViewModel
            {
                LastLoginInfo = lastLoginInfo,
                IsMaxSubLevel = SessionService.UserSession.IsMaxSubLevel
            };

            return View("~/Views/UserPanel/AccountOverView/Index.cshtml", model);
        }
    }
}