using System.Web.Mvc;
using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
using Fanex.Affiliate.Admin.Core.MetaModels.Report;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.Operation;
using Fanex.Affiliate.Admin.Core.Services.Report;
using Fanex.Affiliate.Admin.Core.ViewModels.Report;

namespace Fanex.Affiliate.Admin.Core.Controllers.Report
{
    [FunctionAuthorize(FunctionName = Function.AffReport)]
    public class ReportController : ReadOnlySessionBaseController
    {
        private readonly ISystemService _systemService;

        private readonly IAffiliateReportService _affiliateReportService;

        private readonly ICommonDealService _commonDealService;

        public ReportController(
            ISessionService sessionService,
            ISystemService systemService,
            IAffiliateReportService affiliateReportService,
            ICommonDealService commonDealService) : base(sessionService)
        {
            _systemService = systemService;
            _affiliateReportService = affiliateReportService;
            _commonDealService = commonDealService;
        }

        [HttpGet]
        [AllowByPassFunctionAuthorize]
        public ActionResult Index()
        {
            var viewModel = new AffiliateReportViewModel
            {
                ReportCutOffDate = _affiliateReportService.GetReportCutOffDate(),
                ProductList = _systemService.GetProductList(),
                LanguageList = _systemService.GetLanguageList(),
                CurrencyList = _systemService.GetCurrencies(),
                BaseCurrencyList = _systemService.GetBaseCurrencies(),
                PaymentCurrencyList = _systemService.GetPaymentCurrencies(),
                DealTypeList = _commonDealService.GetDealTypes(),
                DealList = _commonDealService.GetNormalDealList(new GetNormalDealParam()),
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetMainData(AffiliateReportParam param)
        {
            return GenerateJsonNetResult(_affiliateReportService.GetMainReportData(param));
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetDetailData(AffiliateReportParam param)
        {
            return GenerateJsonNetResult(_affiliateReportService.GetDetailReportData(param));
        }
    }
}
