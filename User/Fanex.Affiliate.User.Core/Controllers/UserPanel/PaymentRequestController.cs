namespace Fanex.Affiliate.User.Core.Controllers
{
    using Constants;
    using DTO;
    using Extensions;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.CoreService;
    using Filters;
    using MetalModels.Email;
    using MetalModels.UserPanel;
    using Resources;
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Utilities;
    using ViewModels.UserPanel;

    [CustomAuthorize(PermissionName = ClaimConstant.PaymentRequest)]
    public class PaymentRequestController : BaseController
    {
        private readonly IPaymentService _paymentService;
        private readonly IAppSetting _appSetting;
        public PaymentRequestController(ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService languageService,
            IPaymentService paymentService) : base(sessionService, languageService)
        {
            _paymentService = paymentService;
            _appSetting = appSetting;
        }
        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            return View("~/Views/UserPanel/PaymentRequest/Index.cshtml", GetViewModel(DateTime.Now.Year));
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetPaymentListByYear(int year)
        {
            var viewModel = year >= 2009 && year <= DateTime.Now.Year ? GetViewModel(year) : GetViewModel(DateTime.Now.Year);

            return PartialView("~/Views/UserPanel/PaymentRequest/PaymentPartial/_PaymentList.cshtml", viewModel);
        }
        [HttpGet]
        [AjaxOnly]
        public ActionResult PaymentRequestPartial()
        {
            return PartialView("~/Views/UserPanel/PaymentRequest/PaymentPartial/_Main.cshtml", GetViewModel(DateTime.Now.Year));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [PreventAccess]
        public async Task<ActionResult> CreatePaymentRequest(PaymentCreationParam paymentCreationParam)
        {
            if (SessionService.IsPreventDBModification)
            {
                return Json(GetErrorResult(Lang.ErrAuthorized));
            }

            var resultInfo = new ResultInfo { IsOk = true };

            if (SessionService.IsInternal)
            {
                resultInfo.IsOk = false;
                resultInfo.Message = Lang.ErrAuthorized;
            }

            if (resultInfo.IsOk)
            {
                paymentCreationParam.AffId = SessionService.UserSession.AffId;
                paymentCreationParam.Language = SessionService.CurrentLanguage;
                paymentCreationParam.Ip = Request.GetClientIP();
                paymentCreationParam.IsInternal = SessionService.IsInternal;
                paymentCreationParam.IsLocalTest = !_appSetting.IsProduction;

                var emailParam = new PaymentEmailParam
                {
                    MailContact = _appSetting.MailContact,
                    RootDomain = SiteDomainHelper.GetRootUrl(this, _appSetting),
                    CurrentLanguage = SessionService.CurrentLanguage
                };

                resultInfo = await _paymentService.CreatePaymentRequestAsync(paymentCreationParam, emailParam);

                if (resultInfo.IsOk)
                {
                    resultInfo.Message = $"{Lang.RequestPayoutSucc}<br>{Lang.AConfirmationEmail}<br>{Lang.ForAnyReason.Replace("{0}", Url.RenderLanguageContent("~/ContactUs"))}";
                }
            }

            return Json(resultInfo);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [PreventAccess]
        public ActionResult CancelPaymentRequest(PaymentCancelParam cancelParam)
        {
            if (SessionService.IsPreventDBModification)
            {
                return Json(GetErrorResult(Lang.ErrAuthorized));
            }

            var resultInfo = new ResultInfo { IsOk = false };

            if (SessionService.IsInternal)
            {
                resultInfo.Message = Lang.ErrAuthorized;
            }
            else
            {
                cancelParam.UserId = SessionService.UserSession.AffId;
                cancelParam.Language = SessionService.CurrentLanguage;
                cancelParam.Ip = Request.GetClientIP();

                var emailParam = new PaymentEmailParam
                {
                    MailContact = _appSetting.MailContact,
                    RootDomain = SiteDomainHelper.GetRootUrl(this, _appSetting),
                    Amount = cancelParam.Amount,
                    RequestDate = cancelParam.RequestDate,
                    TransId = cancelParam.TransId,
                    CurrentLanguage = SessionService.CurrentLanguage
                };

                resultInfo = _paymentService.CancelPaymentRequest(cancelParam, emailParam);

                if (resultInfo.IsOk)
                {
                    resultInfo.Message = $"{Lang.CancelPayoutSucc}<br>{Lang.AConfirmationEmail}<br>{Lang.ForAnyReason.Replace("{0}", Url.RenderLanguageContent("~/ContactUs"))}";
                }
            }

            return Json(resultInfo);
        }

        private PaymentViewModel GetViewModel(int year)
        {
            var paymentParam = new PaymentParam
            {
                AffId = SessionService.UserSession.AffId,
                IsInternal = SessionService.IsInternal,
                Year = year
            };
            var paymentList = _paymentService.GetPaymentList(paymentParam);


            var viewModel = new PaymentViewModel
            {
                PaymentList = paymentList,
                BalBroughtForward = paymentParam.BalBroughtForward,
                MinAmount = paymentParam.MinAmount,
                PreferredPayment = paymentParam.PreferredPayment,
                PendingPayment = paymentList.FirstOrDefault(p => p.Status.MatchWith(PaymentStatus.Pending)),
                IsValidDate = _paymentService.IsInDateRange() || !_appSetting.IsProduction
            };

            return viewModel;
        }

    }
}