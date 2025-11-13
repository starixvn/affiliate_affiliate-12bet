using System;
using System.Collections.Generic;
using System.Text;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel
{
    public class StatementHistoryViewModel
    {
        public DateTime MonthDate { get; set; }

        public int TransType { get; set; }

        public decimal Amount { get; set; }

        public string Status { get; set; }

        public string Description { get; set; }

        public byte? CalculatedType { get; set; }

        public string DateString => ShouldDisplayFullDate(TransType)
                ? MonthDate.ToString("MM-dd-yyyy")
                : MonthDate.ToString("MMMM-yyyy");

        public string DisplayStatus
        {
            get
            {
                switch (Status.ToLowerInvariant())
                {
                    case "running":
                    case "pending":
                        return Resources.Lang.Proccessing;

                    case "completed":
                        return Resources.Lang.Approved;

                    case "cancelled":
                        return Resources.Lang.Cancelled;

                    case "approved":
                        return Resources.Lang.Approved;

                    case "rejected":
                        return Resources.Lang.Rejected;

                    case "current":
                        return Resources.Lang.Current;

                    default:
                        return Status;
                }
            }
        }

        public string TransTypeString
        {
            get
            {
                switch (TransType)
                {
                    case Constants.TransType.Adjustment:
                        return Resources.Lang.Adjustment;
                    case Constants.TransType.MonthlyEarning:
                        return Resources.Lang.MonthlyEarning;
                    case Constants.TransType.Payment:
                        return Resources.Lang.PaymentRequest;
                    case Constants.TransType.SubAffiliateRevenueShare:
                        return Resources.Lang.SubAffiliateRevenueShare;
                    case Constants.TransType.AprrovedCpaEarning: case Constants.TransType.TentativeCpaEarning:
                        return Resources.Lang.CpaEarning;
                    case Constants.TransType.SubCpaEarning:
                        return Resources.Lang.SubCpaEarning;
                    case Constants.TransType.CpaAdjustment:
                        return Resources.Lang.CpaAdjustment;
                    case Constants.TransType.MonthlyTotal:
                        {
                            return GetMonthlyTotalTransType(CalculatedType);
                        }
                    default:
                        return Resources.Lang.Transaction;
                }
            }
        }

        public string DescriptionDisplay
        {
            get
            {
                switch (TransType)
                {
                    case Constants.TransType.MonthlyTotal:
                        return GetMonthlyTotalDescription(CalculatedType);
                    case Constants.TransType.MonthlyEarning:
                        return GetCommissionDescription(CalculatedType);
                    case Constants.TransType.Adjustment:
                        return GetAdjustmentDescription(Description);
                    case Constants.TransType.SubAffiliateRevenueShare:
                        return GetSubAffiliateRevenueShareDescription(CalculatedType);
                    case Constants.TransType.AprrovedCpaEarning:
                        return Resources.Lang.ApprovedCpaEarning;
                    case Constants.TransType.TentativeCpaEarning:
                        return Resources.Lang.TentativeCpaEarning;
                    case Constants.TransType.SubCpaEarning:
                        return Resources.Lang.ApprovedSubAffCpaEarning;
                    default:
                        return Description;
                }
            }
        }

        public IEnumerable<StatementHistoryViewModel> Children { get; set; } = new List<StatementHistoryViewModel>();

        private static string GetMonthlyTotalTransType(byte? calculatedType)
        {
            switch (calculatedType)
            {
                case Constants.CalculatedType.CalculatedMonth: case Constants.CalculatedType.UnCalculatedMonth:
                    return Resources.Lang.MonthlyTotal;
                default:
                    return Resources.Lang.Transaction;
            }
        }

        private string GetCommissionDescription(byte? calculatedType)
        {
            var description = new StringBuilder();

            switch (calculatedType)
            {
                case Constants.CalculatedType.CalculatedMonth:
                    description.Append(Resources.Lang.MonthlyEarning);
                    break;
                case Constants.CalculatedType.UnCalculatedMonth:
                    description.Append(Resources.Lang.UncalculatedMonthlyEarning);
                    break;
                default:
                    description.Append(Resources.Lang.CurrentMonthlyEarning);
                    break;
            }

            description.Append(Description.Contains(Constants.CommByGroupType.Winloss)
                ? $" ({Resources.Lang.RevenueShareByWinloss})"
                : $" ({Resources.Lang.RevenueShareByTurnover})");

            return description.ToString();
        }

        private static string GetSubAffiliateRevenueShareDescription(byte? calculatedType)
        {
            switch (calculatedType)
            {
                case Constants.CalculatedType.CalculatedMonth:
                    return Resources.Lang.Commission;
                case Constants.CalculatedType.UnCalculatedMonth:
                    return Resources.Lang.UncalculatedCommission;
                default:
                    return Resources.Lang.TentativeCommission;
            }
        }

        private static string GetMonthlyTotalDescription(byte? calculatedType)
        {
            switch (calculatedType)
            {
                case Constants.CalculatedType.CalculatedMonth:
                    return Resources.Lang.MonthlyTotal;
                case Constants.CalculatedType.UnCalculatedMonth:
                    return Resources.Lang.UncalculatedMonth;
                default:
                    return Resources.Lang.CurrentMonthStatistics;
            }
        }

        private static string GetAdjustmentDescription(string description)
        {
            const string desc = "Account balance carried forward from the previous system.";

            return description.Trim().Equals(desc, StringComparison.InvariantCultureIgnoreCase)
                ? Resources.Lang.PreviousSystemBalanceDescription
                : string.Empty;
        }

        private static bool ShouldDisplayFullDate(int transType)
        {
            return transType == Constants.TransType.Payment
                || transType == Constants.TransType.Adjustment
                || transType == Constants.TransType.CpaAdjustment;
        }
    }
}
