using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.ChangeAdminPassword;
using Fanex.Affiliate.Admin.Core.Services.ChangeAdminPassword;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Utilities;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers
{
    public class ChangeAdminPasswordController : ReadOnlySessionBaseController
    {
        private readonly IChangeAdminPasswordService _changeAdminPasswordService;

        public ChangeAdminPasswordController(
            ISessionService sessionService,
            IChangeAdminPasswordService changeAdminPasswordService) : base(sessionService)
        {
            _changeAdminPasswordService = changeAdminPasswordService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult ChangePassword(ChangeAdminPasswordParam param)
        {
            if (ModelState.IsValid)
            {
                param.OldPassword = CryptographyHelper.Encrypt(param.OldPassword.Trim());
                param.NewPassword = CryptographyHelper.Encrypt(param.NewPassword.Trim());
                AssignUserInfoParam(param);

                return new JsonNetResult
                {
                    Data = _changeAdminPasswordService.ChangePassword(param)
                };
            }

            return ModelState.GenerateErrorResult();
        }
    }
}
