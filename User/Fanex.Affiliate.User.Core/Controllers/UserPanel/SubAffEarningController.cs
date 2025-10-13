namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using CoreService;
    using Fanex.Affiliate.User.Core.Filters;
    using Fanex.Affiliate.User.Core.Utilities;
    using MetalModels.UserPanel;
    using System;
    using System.Linq;
    using System.Web.Mvc;
    using ViewModels.UserPanel;

    [CustomAuthorize]
    public class SubAffEarningController : BaseController
    {
        private readonly IStatementHistoryService _statementHistoryService;

        public SubAffEarningController(
            ISessionService sessionService,
            ISystemService systemsService,
            IStatementHistoryService statementHistoryService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _statementHistoryService = statementHistoryService;
        }

        [AjaxOnly]
        public ActionResult Index(SubAffComParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            param.IsInternal = SessionService.IsInternal;
            param.MonthDate = param.MonthDate ?? DateTimeHelper.Gmt8Now.AddDays(-1);

            var subAffComm = _statementHistoryService.GetSubAffCommission(param);
            var requestPage = param.RequestPage;
            var vms = subAffComm.Select(s => new SubAffComViewModel
            {
                Commission = s.Commission,
                SubAffCommission = s.SubAffCommission,
                SubAffUserName = s.UserName
            });

            if (!Constants.RequestPage.Links.TryGetValue(requestPage, out var breadcrumb))
            {
                breadcrumb = Constants.RequestPage.Links[Constants.RequestPage.StatementHistory];
            }

            breadcrumb.Url = $"{breadcrumb.Url}?baseCurrency={param.BaseCurrency}";

            ViewBag.MonthDate = param.MonthDate;
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.BaseCurrencies = SystemService.GetBaseCurrencyList();
            ViewBag.SelectedBaseCurrency = param.BaseCurrency;

            var path = param.IsOnlyContent
                ? "~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_SubAffEarningContent.cshtml"
                : "~/Views/UserPanel/StatementHistory/SubAffEarning.cshtml";

            return View(path, vms);
        }
    }
}
