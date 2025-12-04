using Fanex.Affiliate.Admin.Core.Commands.Apis;
using Fanex.Affiliate.Admin.Core.Criterias.Apis;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Apis
{
    public interface IApiAffService
    {
        (long, ResultInfo) InsertDataTracker(InsertJobTrackerCommand command);

        ResultInfo UpdateDataTracker(UpdateJobTrackerCommand command);

        Task<IEnumerable<ApiAffInfo>> GetApiAffInfosAsync(GetApiAffInfosCriteria criteria);
    }
}
