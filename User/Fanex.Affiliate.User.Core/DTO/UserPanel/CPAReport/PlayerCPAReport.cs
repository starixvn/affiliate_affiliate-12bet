using Fanex.Affiliate.User.Core.Constants;
using System;

namespace Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport
{
    public class PlayerCPA
    {
        private const string HYPHEN = "-";

        public int RowNum { get; set; }
        public int MemberCPA_ID { get; set; }
        public string Player { get; set; }
        public DateTime? RegisteredDate { get; set; }

        public string DisplayRegisteredDate => RegisteredDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? HYPHEN;

        public decimal FTD { get; set;}

        public bool IsFTD { get; set;}

        public decimal TotalDeposit { get; set; }

        public bool IsTotalDeposit { get; set; }

        public bool IsTO { get; set; }

        public DateTime? ActiveQualifiedDate { get; set; }

        public string DisplayActiveQualifiedDate => ActiveQualifiedDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? HYPHEN;

        public decimal CPAAmount { get; set; }

        public bool IsHolding { get; set; }

        public string BetTicket { get; set; }

        public DateTime? HoldingQualifiedDate { get; set; }

        public string DisplayHoldingQualifiedDate => HoldingQualifiedDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? HYPHEN;

        public DateTime? HoldingExpiredDate { get; set; }

        public string DisplayHoldingExpiredDate => HoldingExpiredDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? HYPHEN;

        public decimal EstimatedCPAAmount { get; set; }

        public DateTime? FirstDepositDate { get; set; }

        public string DisplayFirstDepositDate => FirstDepositDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? HYPHEN;

        public int RecheckDays { get; set; }

        public DateTime? ExpiredRedepositDate { get; set; }

        public string DisplayExpiredRedepositDate => ExpiredRedepositDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? HYPHEN;

        public bool IsRedeposit { get; set; }

        public string CPAStatus { get; set; }

        public bool IsAbnormal { get; set; }

        public string Description { get; set; }
    }
}
