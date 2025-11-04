using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.BusinessService.CPAReport;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel.CPAReport;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    public class PlayerCPAReportController : BaseController
    {
        private readonly IPlayerCPAReportService _reportService;

        public PlayerCPAReportController(
            ISessionService sessionService,
            ISystemService systemService,
            IPlayerCPAReportService reportService) : base(sessionService, systemService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var now = DateTimeHelper.Gmt8Now;
            var viewModel = new CPAReportViewModel
            {
                FromDate = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1),
                ToDate = now
            };

            return View("~/Views/UserPanel/CPAReport/PlayerCPAReport/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetPlayerCPAReport(PlayerCPAReportParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            var viewModel = _reportService.GetPlayerCPAData(param);

            return Json(viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetPlayerCPATurnOverReport(PlayerCPATurnOverParam param)
        {
            var viewModel = _reportService.GetPlayerCPATurnOverData(param);

            return Json(viewModel);
        }
    }
}
