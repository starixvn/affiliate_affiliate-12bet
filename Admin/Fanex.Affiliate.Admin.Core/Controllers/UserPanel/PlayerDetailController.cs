using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.UserPanel;
using Fanex.Affiliate.Admin.Core.ViewModels.Customer;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers.UserPanel
{
    [FunctionAuthorize(FunctionName = Function.Player)]
    public class PlayerDetailController : ReadOnlySessionBaseController
    {
        private readonly IPlayerDetailService _playerDetailService;

        public PlayerDetailController(
            ISessionService sessionService,
            IPlayerDetailService playerDetailService) : base(sessionService)
        {
            _playerDetailService = playerDetailService;
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetChannels()
        {
            return GenerateJsonNetResult(_playerDetailService.GetChannels());
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetPlayerDetailList(PlayerDetailParam param)
        {
            if (ModelState.IsValid)
            {
                var (isCPADealOnly, data) = _playerDetailService.GetPlayerDetailList(param);
                var model = new PlayerDetailViewModel
                {
                    IsCPADealOnly = isCPADealOnly,
                    Data = data
                };

                return GenerateJsonNetResult(model);
            }

            return new JsonNetResult();
        }
    }
}
