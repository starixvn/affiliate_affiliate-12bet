namespace Fanex.Affiliate.Admin.Core.Controllers.Report
{
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.Affiliate.Admin.Core.Attributes;
    using Fanex.Affiliate.Admin.Core.Constants;
    using Fanex.Affiliate.Admin.Core.Extensions;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
    using Fanex.Affiliate.Admin.Core.MetaModels.Report;
    using Fanex.Affiliate.Admin.Core.Services.Common;
    using Fanex.Affiliate.Admin.Core.Services.Operation;
    using Fanex.Affiliate.Admin.Core.Services.Report;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    [FunctionAuthorize(FunctionName = Function.AffReport)]
    public class AffiliateCpaReportController : ReadOnlySessionBaseController
    {
        private readonly IAffiliateCpaReportService _affiliateCpaReportService;
        private readonly ICommonDealService _commonDealService;

        private readonly JsonSerializerSettings _jsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        public AffiliateCpaReportController(
            ISessionService sessionService,
            IAffiliateCpaReportService affiliateCpaReportService,
            ICommonDealService commonDealService) : base(sessionService)
        {
            _affiliateCpaReportService = affiliateCpaReportService;
            _commonDealService = commonDealService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var dealList = _commonDealService.GetNormalDealList(new GetNormalDealParam());
            ViewBag.Deals = dealList.Where(d => d.GroupTypeId != DealType.RevenueShare);

            return View("~/Areas/Portal/Views/Report/AffiliateCpaReport.cshtml");
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetData(AffiliateCpaRequest request)
        {
            if (!ModelState.IsValid)
            {
                return GenerateModelStateErrResult();
            }

            return new JsonNetResult(_jsonSettings)
            {
                Data = _affiliateCpaReportService.GetData(request)
            };
        }
    }
}
