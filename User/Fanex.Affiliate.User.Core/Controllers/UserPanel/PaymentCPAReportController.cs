namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using System.Web.Mvc;
    using BusinessService;
    using CoreService;
    using Fanex.Affiliate.User.Core.BusinessService.CPAReport;
    using Fanex.Affiliate.User.Core.Constants;
    using Fanex.Affiliate.User.Core.Extensions;
    using Filters;
    using MetalModels.UserPanel.CPAReport;
    using Utilities;
    using ViewModels.UserPanel.CPAReport;

    [CustomAuthorize]
    public class PaymentCPAReportController : BaseController
    {
        private readonly IPaymentCPAReportService _cpaReportService;
        public PaymentCPAReportController(
            ISessionService sessionService, 
            ISystemService systemService,
            IPaymentCPAReportService cpaReportService) : base(sessionService, systemService)
        {
            _cpaReportService = cpaReportService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            if (SessionService.UserSession.GroupTypeId == GroupType.RevenueShareTypeId)
            {
                return Json(new
                {
                    success = false,
                    redirectUrl = Url.RenderLanguageContent("~/UserPanel/Main/#AccountOverview")
                }, JsonRequestBehavior.AllowGet);
            }

            var now = DateTimeHelper.Gmt8Now;
            var viewModel = new CPAReportViewModel
            {
                FromDate = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1),
                ToDate = now
            };
            return View("~/Views/UserPanel/CPAReport/PaymentCPAReport/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(PaymentCPAReportParam param)
        {
            param.AffId = SessionService.UserSession.AffId;

            var viewModel = _cpaReportService.GetPaymentCPAReportData(param);
            return Json(viewModel);
        }
    }
}
