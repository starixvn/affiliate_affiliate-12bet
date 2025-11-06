using System;
using System.Collections.Generic;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Operation;

namespace Fanex.Affiliate.Admin.Core.ViewModels.Report
{
    public class AffiliateReportViewModel : ReportCommonViewModel
    {
        public IEnumerable<Language> LanguageList { get; set; }

        public IEnumerable<Currency> CurrencyList { get; set; }

        public IEnumerable<Currency> PaymentCurrencyList { get; set; }

        public IEnumerable<DealType> DealTypeList { get; set; }

        public IEnumerable<NormalDeal> DealList { get; set; }

        public DateTime ReportCutOffDate { get; set; }
    }
}
