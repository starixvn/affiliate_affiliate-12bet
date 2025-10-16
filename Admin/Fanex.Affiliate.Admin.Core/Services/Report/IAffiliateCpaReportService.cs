namespace Fanex.Affiliate.Admin.Core.Services.Report
{
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Report;
    using Fanex.Affiliate.Admin.Core.MetaModels.Report;

    public interface IAffiliateCpaReportService
    {
        EntityResult<AffiliateCpaReport> GetData(AffiliateCpaParam param);
    }
}
