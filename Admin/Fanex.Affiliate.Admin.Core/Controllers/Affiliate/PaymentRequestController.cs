using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels;
using Fanex.Affiliate.Admin.Core.MetaModels.Payment;
using Fanex.Affiliate.Admin.Core.Resources;
using Fanex.Affiliate.Admin.Core.Services.Auth;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.Payment;
using Fanex.Affiliate.Admin.Core.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers.Affiliate
{
    [FunctionAuthorize(FunctionName = Function.Affiliate)]
    public class PaymentRequestController : ReadOnlySessionBaseController
    {
        private readonly IPaymentService _paymentRequestService;
        private readonly IAuthService _authService;

        public PaymentRequestController(
            ISessionService sessionService,
            IPaymentService paymentRequestService,
            IAuthService authService) : base(sessionService)
        {
            _paymentRequestService = paymentRequestService;
            _authService = authService;
        }

        [FunctionAuthorize(FunctionName = Function.Payment)]
        public ActionResult Index(PaymentRequestParamFromHome param)
        {
            var subMenu = new List<SubMenu>
            {
                new SubMenu { Name = Lang.AffiliateInfo, Url = Url.Content("~/Portal/Affiliate"), FunctionName = Function.Affiliate },
                new SubMenu { Name = Lang.PaymentRequest, Url = Url.Content("~/Portal/PaymentRequest"), FunctionName = Function.Payment, IsActive = true },
                new SubMenu { Name = Lang.EmailHistory, Url = Url.Content("~/Portal/EmailHistory"), FunctionName = Function.EmailHistory },
                new SubMenu { Name = Lang.MarketingAccount, Url = Url.Content("~/Portal/MarketingAccount"), FunctionName = Function.Affiliate }
            };

            param.SubMenuList = subMenu;

            return View("~/Areas/Portal/Views/Affiliate/PaymentRequest.cshtml", param);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.Payment)]
        public ActionResult GetPaymentRequestList(PaymentRequestParam param)
        {
            if (ModelState.IsValid)
            {
                return GenerateJsonNetResult(_paymentRequestService.GetPaymentRequestList(param));
            }

            return new JsonNetResult();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.Payment)]
        public ActionResult GetPaymentRequestDetail(long transId)
        {
            if (transId >= Validation.MinId)
            {
                return GenerateJsonNetResult(_paymentRequestService.GetPaymentRequestDetail(transId));
            }

            return new JsonNetResult();
        }

        [FunctionAuthorize(FunctionName = Function.Payment, IsHost = true)]
        [HttpPost]
        [ValidateAntiForgeryHeader]
        public async Task<ActionResult> UpdatePaymentRequest(PaymentRequestUpdateParam param)
        {
            if (ModelState.IsValid)
            {
                var permissionParam = new CheckPermissionParam
                {
                    CustId = SessionService.UserId,
                    FuncName = Function.Payment
                };

                var result = _authService.CheckPermission(permissionParam);
                if (!result.IsSuccessful)
                {
                    return GenerateJsonNetResult(result);
                }

                var paymentRequestUpdateParam = new PaymentRequestUpdateParam
                {
                    TransId = param.TransId,
                    IsApproved = param.IsApproved,
                    AdminDesc = Server.HtmlEncode(param.AdminDesc),
                    AffDesc = Server.HtmlEncode(param.AffDesc),
                };
                AssignUserInfoParam(paymentRequestUpdateParam);

                var emailParam = new PaymentRequestUpdateEmail
                {
                    RootUrl = SiteDomainHelper.GetRootUrl(this),
                };

                return GenerateJsonNetResult(await _paymentRequestService.HandlePaymentRequestAsync(paymentRequestUpdateParam, emailParam));
            }

            return GenerateErrResult("Transaction not exists!");
        }
    }
}
