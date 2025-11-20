using Fanex.Affiliate.Admin.Core.Commands.Apis;
using Fanex.Affiliate.Admin.Core.Criterias.Apis;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Data.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Apis
{
    public class ApiAffService : IApiAffService
    {
        private readonly IDynamicRepository _dynamicRepository;

        public ApiAffService(
            IDynamicRepository dynamicRepository)
        {
            _dynamicRepository = dynamicRepository;
        }

        public (long, ResultInfo) InsertDataTracker(InsertJobTrackerCommand command)
        {
            _dynamicRepository.Execute(command);

            var resultInfo = new ResultInfo(command.ErrCode, command.ErrMsg);

            return (command.PushTrackerId, resultInfo);
        }

        public ResultInfo UpdateDataTracker(UpdateJobTrackerCommand command)
        {
            _dynamicRepository.Execute(command);

            return new ResultInfo(command.ErrCode, command.ErrMsg);
        }

        public async Task<IEnumerable<ApiAffInfo>> GetApiAffInfosAsync(GetApiAffInfosCriteria criteria)
            => await _dynamicRepository.FetchAsync<ApiAffInfo>(criteria);
    }
}
