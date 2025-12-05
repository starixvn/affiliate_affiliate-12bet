namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel.CPAReport
{
    using System;
    using Constants;

    public class PaymentCPAReportParam
    {
        public int AffId { get; set; }

        public int StatusId { get; set; }

        public int ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int PageIndex { get; set; } = Page.PageIndex;

        public int PageSize { get; set; } = Page.PageSize;

        public string Status
        {
            get
            {
                switch (StatusId)
                {
                    case PaymentCPAStatus.Monitoring:
                        return "Monitoring";
                    case PaymentCPAStatus.NotQualified:
                        return "NotQualified";
                    case PaymentCPAStatus.Qualified:
                        return "Qualified";
                    case PaymentCPAStatus.Empty:
                        return "Empty";
                    default:
                        return "Monitoring,Not Qualified,Qualified,Empty";
                }
            }
        }
    }
}
