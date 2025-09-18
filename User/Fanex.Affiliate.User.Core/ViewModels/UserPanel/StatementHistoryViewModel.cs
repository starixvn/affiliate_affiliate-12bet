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

        public string DateString => TransType == Constants.TransType.Payment || TransType == Constants.TransType.Adjustment
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
                    case Constants.TransType.CpaEarning:
                        return Resources.Lang.CpaEarning;
                    case Constants.TransType.SubCpaEarning:
                        return Resources.Lang.CpaEarning;
                    case Constants.TransType.MonthlyTotal:
                        {
                            if (CalculatedType == Constants.CalculatedType.CalculatedMonth || CalculatedType == Constants.CalculatedType.UnCalculatedMonth)
                            {
                                return Resources.Lang.MonthlyTotal;
                            }

                            return Resources.Lang.Transaction;
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
                    case Constants.TransType.MonthlyEarning:
                        return GetCommissionDescription(CalculatedType);
                    case Constants.TransType.SubAffiliateRevenueShare:
                        return GetSubAffiliateDescription(CalculatedType);
                    case Constants.TransType.MonthlyTotal:
                        return GetMonthlyTotalDescription(CalculatedType);
                    case Constants.TransType.Adjustment:
                        return GetAdjustmentDescription(Description);
                    default:
                        return Description;
                }
            }
        }

        public IEnumerable<StatementHistoryViewModel> Children { get; set; } = new List<StatementHistoryViewModel>();

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

        private static string GetSubAffiliateDescription(byte? calculatedType)
        {
            switch (calculatedType)
            {
                case Constants.CalculatedType.CalculatedMonth:
                    return Resources.Lang.Commission;
                case Constants.CalculatedType.UnCalculatedMonth:
                    return Resources.Lang.UncalculatedCommission;
                default:
                    return Resources.Lang.CurrentCommission;
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
    }
}
