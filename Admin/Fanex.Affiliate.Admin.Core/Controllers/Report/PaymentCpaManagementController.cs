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
    public class PaymentCpaManagementController : ReadOnlySessionBaseController
    {
        private readonly IPaymentCpaManagementService _paymentManagementService;
        private readonly ICommonDealService _commonDealService;

        public PaymentCpaManagementController(
            ISessionService sessionService,
            IPaymentCpaManagementService paymentManagementService,
            ICommonDealService commonDealService) : base(sessionService)
        {
            _paymentManagementService = paymentManagementService;
            _commonDealService = commonDealService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var deals = _commonDealService.GetNormalDealList(new GetNormalDealParam { IsOnlyRevenue = false });
            ViewBag.Deals = deals.Where(d => d.GroupTypeId != DealType.RevenueShare);

            return View("~/Areas/Portal/Views/Report/PaymentCpaManagement.cshtml");
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetData(PaymentCpaManagementParam param)
        {
            param.UserName = param.UserName.Trim();
            return GenerateJsonNetResult(_paymentManagementService.GetReportData(param));
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

            param.TransDesc = param.TransDesc.Trim();
            AssignUserInfoParam(param);
            return GenerateJsonNetResult(_paymentManagementService.AdjustmentAmount(param));
        }
    }
}