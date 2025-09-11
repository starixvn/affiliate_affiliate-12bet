namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using System.Web.Mvc;
    using BusinessService;
    using CoreService;
    using Filters;
    using MetalModels.UserPanel;
    using Utilities;
    using ViewModels.UserPanel.CPAReport;

    [CustomAuthorize]
    public class RedepositCPAReportController : BaseController
    {
        private readonly ICPAReportService _cpaReportService;
        public RedepositCPAReportController(
            ISessionService sessionService, 
            ISystemService systemService,
            ICPAReportService cpaReportService) : base(sessionService, systemService)
        {
            _cpaReportService = cpaReportService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var now = DateTimeHelper.Gmt8Now;
            var viewModel = new RedepositCPAReportViewModel
            {
                FromDate = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1),
                ToDate = now
            };
            return View("~/Views/UserPanel/CPAReport/RedepositCPAReport/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(RedepositCPAReportParam param)
        {
            param.AffId = SessionService.UserSession.AffId;

            var viewModel = _cpaReportService.GetRedepositCPAReportData(param);
            return Json(viewModel);
        }
    }
}
