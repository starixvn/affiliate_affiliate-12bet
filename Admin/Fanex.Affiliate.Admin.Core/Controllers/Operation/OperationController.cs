namespace Fanex.Affiliate.Admin.Core.Controllers.Operation
{
    using System.Linq;
    using System.Web.Mvc;
    using Extensions;
    using Fanex.Affiliate.Admin.Core.Attributes;
    using Fanex.Affiliate.Admin.Core.Constants;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
    using Fanex.Affiliate.Admin.Core.Services.Common;
    using Fanex.Affiliate.Admin.Core.Services.Operation;
    using Fanex.Affiliate.Admin.Core.ViewModels.Operation;

    [FunctionAuthorize(FunctionName = Function.Deal)]
    public class OperationController : ReadOnlySessionBaseController
    {
        private readonly ICommonDealService _commonDealService;
        private readonly IOperationService _operationService;
        private readonly ISystemService _systemService;

        public OperationController(
            ISessionService sessionService,
            ICommonDealService commonDealService,
            IOperationService operationService,
            ISystemService systemService) : base(sessionService)
        {
            _commonDealService = commonDealService;
            _operationService = operationService;
            _systemService = systemService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var viewModel = GetOperationViewModel();
            return View("~/Areas/Portal/Views/Operation/Deal.cshtml", viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetDeals(DealParam param)
        {
            if (ModelState.IsValid)
            {
                return GenerateJsonNetResult(_commonDealService.GetDeals(param));
            }

            return GenerateModelStateErrResult();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetDealDetail(int groupId)
        {
            if (ModelState.IsValid)
            {
                return GenerateJsonNetResult(_commonDealService.GetDealSettingDetail(groupId));
            }

            return GenerateModelStateErrResult();
        }

        [FunctionAuthorize(FunctionName = Function.Deal, IsHost = true)]
        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult AddDeal(DealSettingParam param)
        {
            if (!ModelState.IsValid)
            {
                return GenerateModelStateErrResult();
            }

            AssignUserInfoParam(param);
            param.DealName = Server.HtmlDecode(param.DealName);
            param.Description = Server.HtmlDecode(param.Description);

            return GenerateJsonNetResult(_operationService.AddDeal(param));
        }

        [FunctionAuthorize(FunctionName = Function.Deal, IsHost = true)]
        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult UpdateDeal(DealSettingParam param)
        {
            if (!ModelState.IsValid)
            {
                return GenerateModelStateErrResult();
            }

            AssignUserInfoParam(param);
            param.DealName = Server.HtmlDecode(param.DealName);
            param.Description = Server.HtmlDecode(param.Description);
            return GenerateJsonNetResult(_operationService.UpdateDeal(param));
        }

        [FunctionAuthorize(FunctionName = Function.Deal, IsHost = true)]
        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult DeleteDeal(DeleteDealParam param)
        {
            if (!ModelState.IsValid)
            {
                return GenerateErrResult();
            }

            AssignUserInfoParam(param);

            return GenerateJsonNetResult(_operationService.DeleteDeal(param));
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetDealCommonInfo()
        {
            var viewModel = GetOperationViewModel();
            return GenerateJsonNetResult(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetRevenueDealList()
        {
            var deals = _commonDealService.GetNormalDealList(new GetNormalDealParam());
            var revenueDeals = deals.Where(d => d.GroupTypeId == DealType.RevenueShare);

            return GenerateJsonNetResult(revenueDeals);
        }

        private OperationViewModel GetOperationViewModel()
        {
            return new OperationViewModel
            {
                DealTypes = _commonDealService.GetDealTypes(),
                PaymentFrequencies = _commonDealService.GetPaymentFrequency(),
                Deductions = _commonDealService.GetDeductionList(),
                TargetCountries = _commonDealService.GetPlayerTargetCountry(),
                Products = _systemService.GetProductList()
            };
        }

        private void AssignUserInfoParam(DealSettingParam param)
        {
            param.UserId = SessionService.UserId;
            param.Ip = Request.GetClientIP();
        }
    }
}
