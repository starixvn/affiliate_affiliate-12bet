namespace Fanex.Affiliate.Admin.Core.Controllers.CampaignManagement
{
    using System.Web.Mvc;
    using MetaModels.CampaignManagement;
    using Services.CampaignManagement;
    using Services.Common;

    public class ComponentManagementController : ReadOnlySessionBaseController
    {
        private readonly IComponentService _componentService;

        public ComponentManagementController(
            IComponentService componentService,
            ISessionService sessionService) : base(sessionService)
        {
            _componentService = componentService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetSettings()
        {
            var result = new
            {
                StatusList = _componentService.GetAllComponentStatus(),
                ComponentTypes = _componentService.GetAllComponentTypes()
            };
            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        public ActionResult GetComponentList(GetComponentListParam param)
        {
            param.ComponentName = param.ComponentName?.Trim();
            var result = _componentService.GetComponentList(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        public ActionResult InsertComponent(InsertComponentParam param)
        {
            AssignUserInfoParam(param);
            var result = _componentService.InsertComponent(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        public ActionResult UpdateComponent(UpdateComponentParam param)
        {
            AssignUserInfoParam(param);
            var result = _componentService.UpdateComponent(param);

            return GenerateJsonNetResult(result);
        }
    }
}