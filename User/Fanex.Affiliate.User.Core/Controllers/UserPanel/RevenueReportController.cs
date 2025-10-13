namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using BusinessService;
    using CoreService;
    using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
    using Filters;
    using MetalModels.UserPanel;
    using System.Web.Mvc;
    using Utilities;

    [CustomAuthorize]
    public class RevenueReportController : BaseController
    {
        private readonly ICommissionReportService _commissionReportService;

        public RevenueReportController(
            ISessionService sessionService,
            ISystemService systemsService,
            ICommissionReportService commissionReportService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _commissionReportService = commissionReportService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index(int? baseCurrency)
        {
            ViewBag.BaseCurrencies = SystemService.GetBaseCurrencyList();
            ViewBag.DefaultBaseCurrency = baseCurrency ?? SessionService.UserSession.BaseCurrency;

            return View("~/Views/UserPanel/CommissionReport/Index.cshtml", SessionService.UserSession.IsMaxSubLevel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(int year, int baseCurrency = 0)
        {
            var currency = baseCurrency == 0 ? SessionService.UserSession.BaseCurrency : baseCurrency;
            var viewModel = year >= 2009 && year <= DateTimeHelper.Gmt8CurrentYear
                ? _commissionReportService.GenerateCommissionReportData(new CommissionReportParam
                {
                    AffId = SessionService.UserSession.AffId,
                    WinLostDate = DateTimeHelper.CreateDateTime(year, 1, 1),
                    BaseCurrency = currency
                })
                : new CommissionReportDataViewModel();

            return Json(viewModel);
        }
    }
}