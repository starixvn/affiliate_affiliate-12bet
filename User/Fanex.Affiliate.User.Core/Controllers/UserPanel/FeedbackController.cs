using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.Extensions;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.Resources;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
using System.Linq;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    [CustomAuthorize]
    public class FeedbackController : BaseController
    {
        private const int ClosedFeedback = -1;
        private readonly IFeedbackService _feedbackService;
        public FeedbackController(
            ISessionService sessionService,
            ISystemService languageService,
            IFeedbackService feedbackService) : base(sessionService, languageService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index(bool isClickLogout = false)
        {
            if (SessionService.IsPreventDBModification)
            {
                return new EmptyResult();
            }

            if (!SessionService.IsOpenedFeedback && IsValidAffToShowFeedback(isClickLogout))
            {
                SessionService.IsOpenedFeedback = true;
                var model = new FeedbackViewModel
                {
                    RateList = _feedbackService.GetRateList().Where(r => r.RateId != 0),
                    UserName = SessionService.UserSession.UserName,
                    IsClickLogout = isClickLogout
                };

                return View("~/Views/UserPanel/Feedback/Index.cshtml", model);
            }

            return new EmptyResult();
        }

        [HttpPost]
        [AjaxOnly]
        [PreventAccess]
        public ActionResult Insert(FeedbackParam param)
        {
            if (SessionService.IsPreventDBModification)
            {
                return Json(GetErrorResult(Lang.ErrAuthorized));
            }

            if (IsValidAffToAddFeedback(param.IsClickLogout))
            {
                if (ModelState.IsValid && param.IsValid)
                {
                    param.AffId = SessionService.UserSession.AffId;
                    param.Message = string.IsNullOrEmpty(param.Message) ? string.Empty : Server.HtmlEncode(param.Message.Trim());
                    param.Ip = Request.GetClientIP();

                    return Json(_feedbackService.Insert(param));
                }

                return Json(new ResultInfo { Message = ModelState.IsValid ? Error.InvalidFeedback : string.Join("<br>", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)) });
            }

            return Json(GetErrorResult(Lang.ErrAuthorized));
        }

        [HttpPost]
        [AjaxOnly]
        [PreventAccess]
        public ActionResult CloseFeedback(bool isClickLogout = false)
        {
            if (SessionService.IsPreventDBModification)
            {
                return Json(GetErrorResult(Lang.ErrAuthorized));
            }

            if (IsValidAffToAddFeedback(isClickLogout))
            {
                var param = new FeedbackParam
                {
                    RateId = ClosedFeedback,
                    AffId = SessionService.UserSession.AffId,
                    Ip = Request.GetClientIP()
                };

                return Json(_feedbackService.Insert(param));
            }

            return Json(GetErrorResult(Lang.ErrAuthorized));
        }

        private bool IsValidAffToAddFeedback(bool isClickLogout)
        {
            return SessionService.IsOpenedFeedback && IsValidAffToShowFeedback(isClickLogout);
        }

        private bool IsValidAffToShowFeedback(bool isClickLogout)
        {
            var isInvalidIdleTime = isClickLogout || !_feedbackService.IsValidIdleTime(SessionService.LastestRequestTime);

            return _feedbackService.IsValidAff(SessionService.UserSession.AffId) && isInvalidIdleTime;
        }
    }
}
