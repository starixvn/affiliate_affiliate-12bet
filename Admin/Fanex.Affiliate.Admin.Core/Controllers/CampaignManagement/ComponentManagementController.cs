namespace Fanex.Affiliate.Admin.Core.Controllers.CampaignManagement
{
    using System.Web.Mvc;
    using Attributes;
    using Constants;
    using MetaModels.CampaignManagement;
    using Services.CampaignManagement;
    using Services.Common;
    using Services.Operation;

    public class ComponentManagementController : ReadOnlySessionBaseController
    {
        private readonly IComponentService _componentService;
        private readonly ICommonDealService _commonDealService;

        public ComponentManagementController(
            IComponentService componentService,
            ICommonDealService commonDealService,
            ISessionService sessionService) : base(sessionService)
        {
            _componentService = componentService;
            _commonDealService = commonDealService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult GetSettings()
        {
            var result = new
            {
                StatusList = _componentService.GetAllComponentStatus(),
                ComponentTypes = _componentService.GetAllComponentTypes(),
                DealTypes = _commonDealService.GetDealTypes()
            };
            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult GetComponentList(GetComponentListParam param)
        {
            param.ComponentName = param.ComponentName?.Trim();
            var result = _componentService.GetComponentList(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult InsertComponent(InsertComponentParam param)
        {
            AssignUserInfoParam(param);
            var result = _componentService.InsertComponent(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult UpdateComponent(UpdateComponentParam param)
        {
            AssignUserInfoParam(param);
            var result = _componentService.UpdateComponent(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult GetDealList(GetDealListParam param)
        {
            param.DealName = param.DealName?.Trim();
            var result = _componentService.GetDealList(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult GetAssignDealList(GetAssignDealListParam param)
        {
            var result = _componentService.GetAssignDealList(param);
            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult InsertDeal(InsertDealParam param)
        {
            AssignUserInfoParam(param);
            var result = _componentService.InsertDeal(param);

            return GenerateJsonNetResult(result);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.ComponentManagement)]
        public ActionResult UpdateDeal(UpdateDealParam param)
        {
            AssignUserInfoParam(param);
            var result = _componentService.UpdateDeal(param);

            return GenerateJsonNetResult(result);
        }
    }
}