using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using System;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    public class AffiliateCPAReportController : BaseController
    {
        private readonly IAffiliateCPAReportService _reportService;

        public AffiliateCPAReportController(
            ISessionService sessionService,
            ISystemService systemService,
            IAffiliateCPAReportService reportService) : base(sessionService, systemService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            ViewBag.FromDate = DateTime.Now.AddMonths(-6).ToString("MM/dd/yyyy");
            ViewBag.ToDate = DateTime.Now.ToString("MM/dd/yyyy");
            return View("~/Views/UserPanel/AffiliateCPAReport/Index.cshtml");
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(CPAReportParam reportParams)
        {
            reportParams.AffId = SessionService.UserSession.AffId;
            var viewModel = _reportService.GetCPAReportData(reportParams);

            return Json(viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetMonthlyReport(CPAReportParam reportParams)
        {
            reportParams.AffId = SessionService.UserSession.AffId;
            var viewModel = _reportService.GetMonthlyData(reportParams);

            return Json(viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetPlayerCPAReport(CPAReportParam reportParams)
        {
            reportParams.AffId = SessionService.UserSession.AffId;
            var viewModel = _reportService.GetPlayerData(reportParams);

            return Json(viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetPlayerCPATurnOverReport(PlayerCPATurnOverParam reportParams)
        {
            var viewModel = _reportService.GetPlayerCPATurnOverData(reportParams);

            return Json(viewModel);
        }
    }
}
