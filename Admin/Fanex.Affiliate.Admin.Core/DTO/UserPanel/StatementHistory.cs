using System;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.DTO.UserPanel
{
    [Serializable]
    public class StatementHistory
    {
        public long TransId { get; set; }


        public DateTime MonthDate { get; set; }

        public int TransType { get; set; }

        public decimal Amount { get; set; }

        public string Status { get; set; }

        public string Creator { get; set; }

        public string Description { get; set; }

        public byte? CalculatedType { get; set; }

        public string DateText => ShouldDisplayFullDate(TransType) ? MonthDate.ToString("dd-MMM-yyyy") : MonthDate.ToString("MMM-yyyy");

        public string NormalizeDateText => MonthDate.ToString("yyyy-MM-dd");

        public string DescriptionDisplay
        {
            get
            {
                if (TransType == Constants.TransType.MonthlyTotal)
                {
                    return GetMonthlyTotalDescription(CalculatedType);
                }

                return Description;
            }
        }

        public string TransTypeDisplayText
        {
            get
            {
                switch (TransType)
                {
                    case Constants.TransType.MonthlyTotal:
                        return "Transaction";
                    case Constants.TransType.MonthlyEarning:
                        return "Revenue Share";
                    case Constants.TransType.PaymentRequest:
                        return "Payment Request";
                    case Constants.TransType.Adjustment:
                        return "Adjustment";
                    case Constants.TransType.SubAffiliateRevenueShare:
                        return "Sub-Affiliate Revenue Share";
                    case Constants.TransType.AprrovedCpaEarning: case Constants.TransType.TentativeCpaEarning:
                        return "CPA Earning";
                    case Constants.TransType.SubCpaEarning:
                        return "Sub-Affiliate CPA";
                    case Constants.TransType.CpaAdjustment:
                        return "CPA Adjustment";
                    default:
                        return "Monthly Earning";
                }
            }
        }

        public IEnumerable<StatementHistory> Children { get; set; } = new List<StatementHistory>();

        private static string GetMonthlyTotalDescription(byte? calculatedType)
        {
            switch (calculatedType)
            {
                case Constants.CalculatedType.CalculatedMonth:
                    return "Monthly Total";
                case Constants.CalculatedType.UnCalculatedMonth:
                    return "Uncalculated Month";
                default:
                    return "Current Month Statistics";
            }
        }

        private static bool ShouldDisplayFullDate(int transType)
        {
            return transType == Constants.TransType.PaymentRequest
                || transType == Constants.TransType.Adjustment
                || transType == Constants.TransType.CpaAdjustment;
        }
    }
}
