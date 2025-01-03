namespace Fanex.Affiliate.User.Core.Controllers
{
    using Constants;
    using DTO;
    using DTO.UserPanel;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.CoreService;
    using Fanex.Affiliate.User.Core.Extensions;
    using Fanex.Affiliate.User.Core.Repository.UserPanel;
    using Fanex.Affiliate.User.Core.Utilities;
    using Filters;
    using MetalModels;
    using Newtonsoft.Json;
    using Resources;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

    [CustomAuthorize]
    public class MyAccountController : BaseController
    {
        private const string SimplifiedChineseCode = "zh-CN";
        private const string TraditionalChineseCode = "zh-TW";
        private readonly ISessionService _sessionService;
        private readonly IAccountRepository _accountRepository;
        public MyAccountController(ISessionService sessionService,
            ISystemService languageService, IAccountRepository accountRepository)
            : base(sessionService, languageService)
        {
            _sessionService = sessionService;
            _accountRepository = accountRepository;
        }
        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var model = _accountRepository.GetAccountInfo(_sessionService.UserSession.AffId);
            var accountInformation = new AccountInformation
            {
                AffId = model.AffId,
                UserName = model.UserName,
                Gender = model.Gender,
                Email = Server.HtmlDecode(model.Email),
                Phone = Server.HtmlDecode(model.Phone),
                ContactApps = Server.HtmlDecode(model.ContactApps),
                Address = Server.HtmlDecode(model.Address),
                City = Server.HtmlDecode(model.City),
                State = Server.HtmlDecode(model.State),
                Country = Server.HtmlDecode(model.Country),
                SiteUrl = Server.HtmlDecode(model.SiteUrl),
                MoreSiteUrls = Server.HtmlDecode(model.MoreSiteUrls),
                PreferredPayment = Server.HtmlDecode(model.PreferredPayment),
                PlayerUsername = Server.HtmlDecode(model.PlayerUsername),
                Postal = Server.HtmlDecode(model.Postal),
                TargetCountryCode = model.TargetCountryCode,
                PreferredLanguage = model.PreferredLanguage,
                NoSiteDesc = Server.HtmlDecode(model.NoSiteDesc),
                IsRenderState = _sessionService.CurrentLanguage == SimplifiedChineseCode || _sessionService.CurrentLanguage == TraditionalChineseCode,
                HasWebSite = model.HasWebSite
            };

            if (!string.IsNullOrEmpty(accountInformation.ContactApps))
            {
                accountInformation.ContactAppList = JsonConvert.DeserializeObject<IEnumerable<ContactApp>>(accountInformation.ContactApps).OrderBy(p => p.Order);
            }

            var preferredLanguage = accountInformation.PreferredLanguage;
            var languageName = SystemService.GetSystemTargetLanguages().FirstOrDefault(l => l.LanguageCode.Equals(preferredLanguage))?.LanguageName ?? preferredLanguage;
            accountInformation.LanguageName = SystemHelper.GetLanguageText(languageName);

            return View("~/Views/UserPanel/MyAccount/index.cshtml", accountInformation);
        }

        [HttpPost]
        [AjaxOnly]
        [ValidateAntiForgeryToken]
        [PreventAccess]
        public ActionResult Index(AccountInformation model)
        {
            if (_sessionService.IsInternal)
            {
                return Json(new ResultInfo { IsOk = false, Message = Lang.ErrAuthorized });
            }

            if (!IsValidAppContactList(model.ContactAppList))
            {
                return Json(new ResultInfo { IsOk = false, Message = Error.RequireIMAccount });
            }

            var userSession = _sessionService.UserSession;
            var userAccount = _accountRepository.GetAccountInfo(userSession.AffId);
            model.PlayerUsername = !string.IsNullOrEmpty(userAccount?.PlayerUsername) ?
                userAccount.PlayerUsername :
                Server.HtmlEncode(model.PlayerUsername);

            var depositAccount = _accountRepository.GetDepositPlayerAccount(model.PlayerUsername);

            if (!depositAccount.IsValid)
            {
                return Json(new ResultInfo { IsOk = false, Message = Lang.errDepositDBConnectFailed });
            }

            var accountUpdateParam = new UpdateAccountParam
            {
                AffId = userSession.AffId,
                Phone = Server.HtmlEncode(model.Phone),
                SiteUrl = Server.HtmlEncode(model.SiteUrl ?? string.Empty),
                MoreSiteUrls = Server.HtmlEncode(model.MoreSiteUrls ?? string.Empty),
                NoSiteDesc = Server.HtmlEncode(model.NoSiteDesc ?? string.Empty),
                TargetCountryCode = Server.HtmlEncode(model.TargetCountryCode),
                Player_UserName = model.PlayerUsername,
                Ip = Request.GetClientIP(),
                Language = _sessionService.CurrentLanguage,
                ContactApps = JsonConvert.SerializeObject(model.ContactAppList.Select(p => new ContactApp
                {
                    Name = Server.HtmlEncode(p.Name),
                    Value = Server.HtmlEncode(p.Value),
                    Order = p.Order
                })),
            };

            var updatingResult = _accountRepository.UpdateAccountInformation(accountUpdateParam);

            return Json(updatingResult);
        }

        private static bool IsValidAppContactList(IEnumerable<ContactApp> contactAppList)
        {
            return contactAppList != null && !contactAppList.All(c => string.IsNullOrEmpty(c.Value));
        }
    }
}