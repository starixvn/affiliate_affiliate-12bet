namespace Fanex.Affiliate.User.Core.Controllers
{
    using Constants;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.CoreService;
    using Filters;
    using MetalModels.UserPanel;
    using System.Web.Mvc;
    using Utilities;
    using ViewModels.UserPanel;

    [CustomAuthorize]
    public class DailyEarningController : BaseController
    {
        private readonly IStatementHistoryService _statementHistoryService;

        public DailyEarningController(
            ISessionService sessionService,
            ISystemService systemsService,
            IStatementHistoryService statementHistoryService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _statementHistoryService = statementHistoryService;
        }

        [AjaxOnly]
        public ActionResult Index(DailyEarningParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            param.IsInternal = SessionService.IsInternal;
            param.ProductId = param.ProductId ?? Product.Sportsbook;
            param.MonthDate = param.MonthDate ?? DateTimeHelper.Gmt8Now.AddDays(-1);

            var viewModel = new DailyEarningViewModel
            {
                ProductList = param.IsOnlyContent ? null : _statementHistoryService.GetProductList(param.IsInternal),
                Data = _statementHistoryService.GetDailyEarning(param),
                SelectedProduct = param.ProductId.Value
            };

            ViewBag.MonthDate = param.MonthDate;
            ViewBag.BaseCurrencies = SystemService.GetBaseCurrencyList();
            ViewBag.SelectedBaseCurrency = param.BaseCurrency;

            var viewPath = param.IsOnlyContent
                ? "~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_DailyEarningContent.cshtml"
                : "~/Views/UserPanel/StatementHistory/DailyEarning.cshtml";

            return View(viewPath, viewModel);

        }
    }
}