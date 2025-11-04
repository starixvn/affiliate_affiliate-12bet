namespace Fanex.Affiliate.User.Core.Controllers
{
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.Constants;
    using Fanex.Affiliate.User.Core.CoreService;
    using Fanex.Affiliate.User.Core.DTO.UserPanel;
    using Fanex.Affiliate.User.Core.Utilities;
    using Fanex.Affiliate.User.Core.ViewModels.UserPanel;
    using Filters;
    using MetalModels.UserPanel;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

    [CustomAuthorize]
    public class StatementHistoryController : BaseController
    {
        private const int DefaultPageSize = 20;
        private readonly IAppSetting _appSetting;
        private readonly IStatementHistoryService _statementHistoryService;

        public StatementHistoryController(ISessionService sessionService,
            ISystemService systemsService,
            IAppSetting appSetting,
            IStatementHistoryService statementHistoryService
            ) : base(sessionService, systemsService)
        {
            _appSetting = appSetting;
            _statementHistoryService = statementHistoryService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index(string baseCurrency)
        {
            var baseCurrencies = SystemService.GetBaseCurrencyList();
            var isClickBreadcrumb = false;
            var baseCurrencyId = SessionService.UserSession.BaseCurrency;

            if (!string.IsNullOrEmpty(baseCurrency) && int.TryParse(baseCurrency, out var currencyId) && baseCurrencies.Any(b => b.ExchangeId == currencyId))
            {
                isClickBreadcrumb = true;
                baseCurrencyId = currencyId;
            }

            var param = new StatementHistoryParam
            {
                AffId = SessionService.UserSession.AffId,
                IsInternal = SessionService.IsInternal,
                PageSize = DefaultPageSize,
                BaseCurrency = baseCurrencyId
            };

            var statementHistoryList = GetStatementHistoryViewModel(param);
            ViewBag.TotalItem = param.NRows;
            ViewBag.StartRowNumber = 1;
            ViewBag.AvailableFromDate = _appSetting.StatementAvailableFrom;
            ViewBag.BaseCurrencies = baseCurrencies;
            ViewBag.DefaultBaseCurrency = baseCurrencyId;
            ViewBag.IsClickBreadcumb = isClickBreadcrumb.ToString();

            return View("~/Views/UserPanel/StatementHistory/Index.cshtml", statementHistoryList);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(StatementHistoryParam param)
        {
            param.AffId = SessionService.UserSession.AffId;
            param.IsInternal = SessionService.IsInternal;
            param.PageSize = param.PageSize ?? DefaultPageSize;

            var statementHistoryList = GetStatementHistoryViewModel(param);
            ViewBag.TotalItem = param.NRows;
            ViewBag.StartRowNumber = (param.PageIndex - 1) * param.PageSize + 1;
            ViewBag.AvailableFromDate = _appSetting.StatementAvailableFrom;

            return PartialView("~/Views/UserPanel/StatementHistory/StatementHistoryPartial/_StatementHistoryContent.cshtml", statementHistoryList);
        }

        private IEnumerable<StatementHistoryViewModel> GetStatementHistoryViewModel(StatementHistoryParam param)
        {
            var vms = new List<StatementHistoryViewModel>();
            var statementHistoryList = _statementHistoryService.GetStatementHistory(param);

            if (SessionService.UserSession.IsMaxSubLevel)
            {
                vms.AddRange(statementHistoryList.Select(CreateViewModelFromStatementHistoryItem));

                return vms;
            }

            foreach (var item in statementHistoryList)
            {
                if (IsUnderMonthlyGroup(item.TransType))
                {
                    if (CheckIfExistMonthlyTotal(item.MonthDate, vms))
                    {
                        continue;
                    }
                    vms.Add(CreateMonthlyTotal(item.MonthDate, statementHistoryList));
                }
                else
                {
                    vms.Add(CreateViewModelFromStatementHistoryItem(item));
                }
            }

            return vms;
        }

        private static StatementHistoryViewModel CreateMonthlyTotal(DateTime monthDate, IEnumerable<StatementHistory> statementHistoryList)
        {
            var transItems = statementHistoryList.Where(s => s.MonthDate == monthDate)
                .Where(s => IsUnderMonthlyGroup(s.TransType));

            var monthlyCom = transItems.FirstOrDefault(s => s.TransType == TransType.MonthlyEarning);
            var children = transItems.Select(CreateViewModelFromStatementHistoryItem);

            var monthlyTotal = new StatementHistoryViewModel
            {
                Amount = transItems.Sum(s => s.Amount),
                MonthDate = monthDate,
                Children = children,
                Status = monthlyCom?.Status ?? children.FirstOrDefault().Status,
                TransType = TransType.MonthlyTotal,
                CalculatedType = monthlyCom?.CalculatedType ?? children.FirstOrDefault().CalculatedType
            };

            return monthlyTotal;
        }

        private static bool CheckIfExistMonthlyTotal(DateTime monthDate, List<StatementHistoryViewModel> statementHistoryViews)
        {
            return statementHistoryViews.Exists(m => m.MonthDate == monthDate && m.TransType == TransType.MonthlyTotal);
        }

        private static bool IsUnderMonthlyGroup(int transType)
        {
            return transType == TransType.MonthlyEarning
                || transType == TransType.SubAffiliateRevenueShare
                || IsCPAEarningGroup(transType)
                || transType == TransType.SubCpaEarning;
        }

        private static bool IsCPAEarningGroup(int transType)
        {
            return transType == TransType.AprrovedCpaEarning
                || transType == TransType.TentativeCpaEarning;
        }

        private static StatementHistoryViewModel CreateViewModelFromStatementHistoryItem(StatementHistory item)
        {
            return new StatementHistoryViewModel
            {
                Amount = item.Amount,
                Description = item.Description,
                MonthDate = item.MonthDate,
                Status = item.Status,
                TransType = item.TransType,
                CalculatedType = item.CalculatedType
            };
        }
    }
}