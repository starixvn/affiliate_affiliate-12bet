namespace Fanex.Affiliate.Admin.Core.Controllers.Report
{
    using System.Linq;
    using Fanex.Affiliate.Admin.Core.Attributes;
    using Fanex.Affiliate.Admin.Core.Constants;
    using Fanex.Affiliate.Admin.Core.MetaModels.Report;
    using Fanex.Affiliate.Admin.Core.Services.Common;
    using Fanex.Affiliate.Admin.Core.Services.Report;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Fanex.Affiliate.Admin.Core.Extensions;
    using MetaModels.Operation;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using Services.Operation;

    [FunctionAuthorize(FunctionName = Function.AffReport)]
    public class PlayerCpaReportController : ReadOnlySessionBaseController
    {
        private readonly IPlayerCpaService _playerCpaService;
        private readonly ICommonDealService _commonDealService;

        private readonly JsonSerializerSettings _jsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        public PlayerCpaReportController(
            ISessionService sessionService,
            IPlayerCpaService playerCpaService,
            ICommonDealService commonDealService) : base(sessionService)
        {
            _playerCpaService = playerCpaService;
            _commonDealService = commonDealService;
        }


        [HttpGet]
        public ActionResult Index()
        {
            var dealList = _commonDealService.GetNormalDealList(new GetNormalDealParam());
            ViewBag.Deals = dealList.Where(d => d.GroupTypeId != DealType.RevenueShare);

            return View("~/Areas/Portal/Views/Report/PlayerCpaReport.cshtml");
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public async Task<ActionResult> GetData(PlayerCpaReportRequest request)
        {
            return new JsonNetResult
            {
                Data = await _playerCpaService.GetDataAsync(request),
                SerializerSettings = _jsonSettings
            };
        }

        [HttpGet]
        public async Task<ActionResult> GetTurnoverDetail(int memberCpaId)
        {
            return new JsonNetResult
            {
                Data = await _playerCpaService.GetTurnoverDetailAsync(memberCpaId),
                SerializerSettings = _jsonSettings
            };
        }
    }
}
