using System;

namespace Fanex.Affiliate.User.Core.DTO.UserPanel
{
    public class PlayerCPA
    {
        public int MemberCPAId { get; set; }

        public int CustId { get; set; }

        public string CustUserName { get; set; }

        public DateTime RegisteredDate { get; set; }

        public string RegisteredDateText
        {
            get
            {
                return this.RegisteredDate.ToString("MM-dd-yyyy");
            }
        }

        public decimal FTD { get; set;}

        public decimal TotalDeposit { get; set; }

        public DateTime AQD { get; set; }

        public string AQDText
        {
            get
            {
                return this.AQD.ToString("MM-dd-yyyy");
            }
        }

        public decimal CPAAmount { get; set; }

        public decimal HoldingBetTickets { get; set; }

        public decimal HoldingTickets { get; set; }

        public DateTime HQD { get; set; }

        public string HQDText
        {
            get
            {
                return this.HQD.ToString("MM-dd-yyyy");
            }
        }

        public DateTime HED { get; set; }

        public string HEDText
        {
            get
            {
                return this.HED.ToString("MM-dd-yyyy");
            }
        }


        public decimal EstimatedCPAAmount { get; set; }

        public decimal ApprovedCPAAmount { get; set; }

        public string CPAStatus { get; set; }

        public DateTime CPADate { get; set; }

        public string CPADateText
        {
            get
            {
                return this.CPADate.ToString("MM-dd-yyyy");
            }
        }

        public bool IsAbnormal { get; set; }

        public string Description { get; set; }

        public bool IsTO { get; set; }
    }
}
