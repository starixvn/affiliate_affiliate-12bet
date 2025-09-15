namespace Fanex.Affiliate.User.Core.DTO.UserPanel
{
    public class MonthlyCPA
    {
        public string Month { get; set; }

        public string Quota { get; set; }

        public decimal CPAAmount { get; set; }

        public decimal EstimatedCPAAmount { get; set; }

        public decimal ApprovedCPAAmount { get; set; }
    }
}
