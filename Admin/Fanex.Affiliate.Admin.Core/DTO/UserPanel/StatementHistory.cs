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

        public string DateText => IsMonthlyTransType(TransType) ? MonthDate.ToString("MMM-yyyy") : MonthDate.ToString("dd-MMM-yyyy");

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

        private static bool IsMonthlyTransType(int transType)
        {
            return transType == Constants.TransType.MonthlyEarning
                || transType == Constants.TransType.MonthlyTotal
                || transType == Constants.TransType.SubAffiliate
                || transType == Constants.TransType.CpaEarning;
        }
    }
}
