using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Message;
using Fanex.Affiliate.Admin.Core.MetaModels.Message;
using Fanex.Affiliate.Admin.Core.Resources;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.Message;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers
{
    [FunctionAuthorize(FunctionName = Function.HotNews)]
    public class MessageController : ReadOnlySessionBaseController
    {
        private const int threeMilliSecond = 3;
        private static readonly IReadOnlyList<string> _unsupportedMessageLanguages = new List<string> { "en-GB", "en-IN", "bn-BD", "ja-JP", "te-IN", "en-PH" };

        private readonly IMessageService _messageSevice;
        private readonly ISystemService _languageService;
        
        public MessageController(
            ISessionService sessionService,
            IMessageService messageSevice,
            ISystemService languageService) : base(sessionService)
        {
            _messageSevice = messageSevice;
            _languageService = languageService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var mode = _languageService.GetLanguageList().Where(l => !_unsupportedMessageLanguages.Contains(l.LanguageCode));

            return View(mode);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetMessageList(MessageParam param)
        {
            if (ModelState.IsValid)
            {
                param.ToDate = param.ToDate.AddDays(1).AddMilliseconds(-threeMilliSecond);

                return GenerateJsonNetResult(_messageSevice.GetMessageList(param));
            }

            return GenerateJsonNetResult(new EntityResult<MessageInfo>
            {
                MainData = new List<MessageInfo>(),
                TotalItem = 0
            });
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetMessageDetail(int selectedMessageId)
        {
            return GenerateJsonNetResult(_messageSevice.GetMessageDetail(selectedMessageId));
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.HotNews, IsHost = true)]
        public ActionResult InsertMessage(InsertUpdateMessageParam param)
        {
            if (param.IsValid())
            {
                var encodeParam = EncodeParam(param);
                AssignUserInfoParam(encodeParam);

                return GenerateJsonNetResult(_messageSevice.InsertMessage(encodeParam));
            }

            return GenerateErrResult(Lang.PleaseEnterContent);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.HotNews, IsHost = true)]
        public ActionResult UpdateMessage(InsertUpdateMessageParam param)
        {
            var isValidMessageId = param.MessageId >= Validation.MinId;
            if (param.IsValid() && isValidMessageId)
            {
                var encodeParam = EncodeParam(param);
                AssignUserInfoParam(encodeParam);

                return GenerateJsonNetResult(_messageSevice.UpdateMessage(encodeParam));
            }

            return GenerateErrResult(!isValidMessageId ? Lang.MessageIdIsInvalid : Lang.PleaseEnterContent);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.HotNews, IsHost = true)]
        public ActionResult DeleteMessages(DeleteMessageParam param)
        {
            if (ModelState.IsValid)
            {
                AssignUserInfoParam(param);

                return GenerateJsonNetResult(_messageSevice.DeleteMessages(param));
            }

            return GenerateErrResult(Lang.PleaseSelectMessage);
        }

        private InsertUpdateMessageParam EncodeParam(InsertUpdateMessageParam param)
        {
            return new InsertUpdateMessageParam
            {
                MessageId = param.MessageId,
                Important = param.Important,
                Message_en = Server.HtmlEncode(param.Message_en),
                Message_cs = Server.HtmlEncode(param.Message_cs),
                Message_th = Server.HtmlEncode(param.Message_th),
                Message_vn = Server.HtmlEncode(param.Message_vn),
                Message_id = Server.HtmlEncode(param.Message_id),
                Message_ko = Server.HtmlEncode(param.Message_ko),
            };
        }
    }
}
