namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using Constants;
    using CoreService;
    using DTO;
    using Extensions;
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

    [CustomAuthorize]
    public class PaymentRequestController : BaseController
    {
        private readonly IPaymentService _paymentService;
        private readonly IAppSetting _appSetting;
        public PaymentRequestController(ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemsService,
            IPaymentService paymentService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _paymentService = paymentService;
            _appSetting = appSetting;
        }
        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            return View("~/Views/UserPanel/PaymentRequest/Index.cshtml", GetViewModel(DateTimeHelper.Gmt8Now.Year));
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult GetPaymentListByYear(int year)
        {
            var viewModel = year >= 2009 && year <= DateTimeHelper.Gmt8CurrentYear ? GetViewModel(year) : GetViewModel(DateTimeHelper.Gmt8CurrentYear);

            return PartialView("~/Views/UserPanel/PaymentRequest/PaymentPartial/_PaymentList.cshtml", viewModel);
        }
        [HttpGet]
        [AjaxOnly]
        public ActionResult PaymentRequestPartial()
        {
            return PartialView("~/Views/UserPanel/PaymentRequest/PaymentPartial/_Main.cshtml", GetViewModel(DateTimeHelper.Gmt8CurrentYear));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> CreatePaymentRequest(PaymentCreationParam paymentCreationParam)
        {
            var resultInfo = new ResultInfo { IsOk = true };

            if (SessionService.IsUnauthorized)
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
                paymentCreationParam.IsLocalTest = _appSetting.IsLocal || _appSetting.IsDev;
                paymentCreationParam.TransDate = paymentCreationParam.TransDate ?? DateTimeHelper.Gmt8Now;

                var emailParam = new PaymentEmailParam
                {
                    MailContact = _appSetting.MailContactByCountry(SessionService.UserSession?.TargetCountryCode ?? SystemLanguage.DefaultCountryCode),
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
        public ActionResult CancelPaymentRequest(PaymentCancelParam cancelParam)
        {
            var resultInfo = new ResultInfo { IsOk = false };

            if (SessionService.IsUnauthorized)
            {
                resultInfo.Message = Lang.ErrAuthorized;
            }
            else
            {
                cancelParam.AffId = SessionService.UserSession.AffId;
                cancelParam.Language = SessionService.CurrentLanguage;
                cancelParam.Ip = Request.GetClientIP();

                var emailParam = new PaymentEmailParam
                {
                    MailContact = _appSetting.MailContactByCountry(SessionService.UserSession?.TargetCountryCode ?? SystemLanguage.DefaultCountryCode),
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
                IsMarketingAccount = SessionService.UserSession.IsMarketingAccount,
                PendingPayment = paymentList.FirstOrDefault(p => p.Status.MatchWith(PaymentStatus.Processing)),
                IsValidDate = _paymentService.IsInDateRange() || _appSetting.IsLocal || _appSetting.IsDev,
            };

            return viewModel;
        }
    }
}