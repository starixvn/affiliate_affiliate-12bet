using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels;
using Fanex.Affiliate.Admin.Core.MetaModels.Customer;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.Customer;
using Fanex.Affiliate.Admin.Core.Utilities;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers
{
    [FunctionAuthorize(FunctionName = Function.Affiliate)]
    public class CustomerLeftPanelController : BaseController
    {
        private readonly ICustomerLeftPanelService _customerLeftPanelService;
        private readonly ISessionService _sessionService;

        public CustomerLeftPanelController(
            ISessionService sessionService,
            ICustomerLeftPanelService customerLeftPanelService
            )
        {
            _customerLeftPanelService = customerLeftPanelService;
            _sessionService = sessionService;
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        [UnauthorizedPropertyCensor]
        public ActionResult GetAffiliateInfo(string affUsername)
        {
            if (string.IsNullOrEmpty(affUsername))
            {
                return new JsonNetResult();
            }

            var accId = _sessionService.UserId.ToString();
            var accOnId = _sessionService.OnUserId.ToString();
            var sessionId = Session.SessionID;
            var affiliateInfo = _customerLeftPanelService.GetAffiliateInfoOnLeftPanel(affUsername, accId, accOnId, sessionId);
            _sessionService.AffName = affUsername;

            return GenerateJsonNetResult(affiliateInfo);
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        public ActionResult GetOnlineList(string affUsername)
        {
            if (string.IsNullOrEmpty(affUsername))
            {
                return new JsonNetResult();
            }

            return GenerateJsonNetResult(_customerLeftPanelService.GetOnlineList(affUsername));
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        [FunctionAuthorize(FunctionName = Function.TransferPlayerSetting)]
        public ActionResult GetTransferLimitSetting(string affId)
        {
            if (string.IsNullOrEmpty(affId) || !int.TryParse(affId, out int parsedId))
            {
                return new JsonNetResult();
            }

            return GenerateJsonNetResult(_customerLeftPanelService.GetTransferLimitSetting(parsedId));
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        [FunctionAuthorize(FunctionName = Function.TransferPlayerSetting, IsHost = true)]
        public ActionResult UpdateTransferLimitSetting(TransferLimitSettingParam param)
        {
            if (ModelState.IsValid)
            {
                AssignUserInfoParam(param);

                return GenerateJsonNetResult(_customerLeftPanelService.UpdateTransferLimitSetting(param));
            }
            return GenerateModelStateErrResult();
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        [FunctionAuthorize(FunctionName = Function.EditAffDetails, IsHost = true)]
        public ActionResult UpdateLanguage(UpdateLanguageParam param)
        {
            if (ModelState.IsValid)
            {
                var updateLanguageParam = new UpdateLanguageParam
                {
                    AffId = param.AffId,
                    PreferredLanguage = Server.HtmlEncode(param.PreferredLanguage)
                };
                AssignUserInfoParam(updateLanguageParam);

                return GenerateJsonNetResult(_customerLeftPanelService.UpdateLanguage(updateLanguageParam));
            }
            return GenerateErrResult("Update Language is failed!");
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        [FunctionAuthorize(FunctionName = Function.Affiliate, IsHost = true)]
        public ActionResult UpdateAffType(UpdateAffTypeParam param)
        {
            if (ModelState.IsValid)
            {
                AssignUserInfoParam(param);

                return GenerateJsonNetResult(_customerLeftPanelService.UpdateAffType(param));
            }
            return GenerateErrResult("Update Affiliate Type is failed!");
        }

        [ValidateAntiForgeryHeader]
        [HttpPost]
        [FunctionAuthorize(FunctionName = Function.EditAffStatus, IsHost = true)]
        public async Task<ActionResult> UpdateStatus(UpdateStatusParam param)
        {
            if (ModelState.IsValid)
            {
                var updateStatusParam = new UpdateStatusParam
                {
                    AffId = param.AffId,
                    Status = Server.HtmlEncode(param.Status)
                };
                AssignUserInfoParam(updateStatusParam);

                var emailParam = new AffInformationEmail
                {
                    RootUrl = SiteDomainHelper.GetRootUrl(this)
                };

                return GenerateJsonNetResult(await _customerLeftPanelService.UpdateStatusAsync(updateStatusParam, emailParam));
            }

            return GenerateModelStateErrResult();
        }

        private void AssignUserInfoParam(UserInfoParam param)
        {
            param.UserId = _sessionService.UserId;
            param.Ip = Request.GetClientIP();
        }
    }
}
