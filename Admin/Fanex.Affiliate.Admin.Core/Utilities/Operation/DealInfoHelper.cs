namespace Fanex.Affiliate.Admin.Core.Utilities.Operation
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.Affiliate.Admin.Core.DTO.Operation;

    public static class DealInfoHelper
    {
        private const string OPEN_ROOT = "<root>";
        private const string CLOSE_ROOT = "</root>";
        private const int MAX_VERIFICATION_METHODS = 1;

        public static string BuildRevenueShareTierSettingXml(IEnumerable<RevenueTierSetting> tierSettingParamList, IEnumerable<RevenueDeductionSetting> platformFeeList)
        {
            var result = new StringBuilder(OPEN_ROOT);

            foreach (var platformFee in platformFeeList)
            {
                var tierSettings = tierSettingParamList.Where(t => t.GroupProductId == platformFee.GroupProductId);
                var tierId = 1;

                foreach (var item in tierSettings)
                {
                    var productIds = platformFeeList.FirstOrDefault(p => p.GroupProductId == item.GroupProductId)?.ProductIds;

                    var row = $"<row id=\"{tierId}\" minamount=\"{item.MinAmount}\"" +
                        $" minqm=\"{item.MinQm}\" commission=\"{item.Commission}\" productids=\"{productIds}\" />";

                    result.Append(row);
                    tierId++;
                }
            }

            result.Append(CLOSE_ROOT);

            return result.ToString();
        }

        public static string BuildRevenueShareTierDeductionSettingXml(IEnumerable<RevenueDeductionSetting> feeDeductionSettingList)
        {
            var result = new StringBuilder(OPEN_ROOT);

            foreach (var item in feeDeductionSettingList)
            {
                var row = $"<row id=\"{item.DeductionId}\" productids=\"{item.ProductIds}\" percent=\"{item.DeductedPercentage}\"" +
                    $" amount=\"{item.DeductedAmount}\" isdeductedpercent=\"{item.IsDeductedPercent}\" />";
                result.Append(row);
            }

            result.Append(CLOSE_ROOT);

            return result.ToString();
        }

        public static string BuildCpaTierListXml(IEnumerable<CpaTierSetting> cpaTierSettingParams, bool checkedMinFdm, bool checkedMinTotalDeposit, bool checkedMinTurnover)
        {
            var result = new StringBuilder(OPEN_ROOT);
            var groupProductId = 0;
            var currentGroupProductId = 0;
            var tierId = 0;

            foreach (var item in cpaTierSettingParams.OrderBy(g => g.GroupProductId).ThenBy(g => g.TierId))
            {
                if (item.GroupProductId != currentGroupProductId)
                {
                    tierId = 0;
                    currentGroupProductId = item.GroupProductId;
                    groupProductId++;
                }

                result.AppendFormat("<row groupproductid=\"{0}\" tierid=\"{1}\" {2} {3} {4} cpaamount=\"{5}\" />",
                    groupProductId,
                    ++tierId,
                    checkedMinFdm ? $"minfdm=\"{item.MinFdm}\"" : "",
                    checkedMinTotalDeposit ? $"mintotaldeposit=\"{item.MinTotalDeposit}\"" : "",
                    checkedMinTurnover ? $"minto=\"{item.MinTO}\"" : "",
                    item.CpaAmount);
            }

            result.Append(CLOSE_ROOT);

            return result.ToString();
        }

        public static string BuildCpaProductListXml(IEnumerable<CpaGroupProduct> cpaProductGroups, bool checkedMinTO)
        {
            if (!checkedMinTO)
            {
                return null;
            }

            var result = new StringBuilder(OPEN_ROOT);
            var groupProductId = 0;

            foreach (var item in cpaProductGroups.OrderBy(p => p.GroupProductId))
            {
                result.AppendFormat("<row groupproductid=\"{0}\" productids=\"{1}\" />", ++groupProductId, item.ProductIds);
            }
            result.Append(CLOSE_ROOT);

            return result.ToString();
        }

        public static string ConvertDealVerifyFlagsToVerificationMethods(int dealVerifyFlags)
        {
            var methods = new List<string>();
            
            for (int i = 0; i < MAX_VERIFICATION_METHODS; i++)
            {
                if ((dealVerifyFlags & (1 << i)) != 0)
                {
                    methods.Add((i + 1).ToString());
                }
            }
            
            return string.Join(",", methods);
        }

        public static int ConvertVerificationMethodsToDealVerifyFlags(string verificationMethods)
        {
            if (string.IsNullOrWhiteSpace(verificationMethods))
            {
                return 0;
            }

            var dealVerifyFlags = 0;
            var methods = verificationMethods.Split(',');

            foreach (var method in methods)
            {
                if (int.TryParse(method.Trim(), out int methodNumber) && methodNumber >= 1 && methodNumber <= MAX_VERIFICATION_METHODS)
                {
                    dealVerifyFlags |= (1 << (methodNumber - 1));
                }
            }

            return dealVerifyFlags;
        }
    }
}
