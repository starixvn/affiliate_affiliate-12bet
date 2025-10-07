namespace Fanex.Affiliate.Admin.Core.Controllers.Report
{
    using System.Linq;
    using System.Web.Mvc;
    using Attributes;
    using Constants;
    using MetaModels.Operation;
    using MetaModels.Report;
    using Services.Common;
    using Services.Operation;
    using Services.Report;

    [FunctionAuthorize(FunctionName = Function.AffReport)]
    public class RedepositCpaReportController : ReadOnlySessionBaseController
    {
        private readonly IRedepositCpaReportService _redepositService;
        private readonly ICommonDealService _commonDealService;

        public RedepositCpaReportController(
            ISessionService sessionService,
            IRedepositCpaReportService redepositService,
            ICommonDealService commonDealService) : base(sessionService)
        {
            _redepositService = redepositService;
            _commonDealService = commonDealService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var deals = _commonDealService.GetNormalDealList(new GetNormalDealParam ());
            ViewBag.Deals = deals.Where(d => d.GroupTypeId != DealType.RevenueShare);

            return View("~/Areas/Portal/Views/Report/RedepositCpaReport.cshtml");
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetData(RedepositCpaReportParam param)
        {
            return GenerateJsonNetResult(_redepositService.GetReportData(param));
        }

        [FunctionAuthorize(FunctionName = Function.Payment, IsHost = true)]
        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult AdjustmentAmount(AdjustmentAmountParam param)
        {
            if (!ModelState.IsValid)
            {
                return GenerateModelStateErrResult();
            }

            AssignUserInfoParam(param);
            return GenerateJsonNetResult(_redepositService.AdjustmentAmount(param));
        }
    }
}