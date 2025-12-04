using Fanex.Data.Repository;

namespace Fanex.Affiliate.Admin.Core.Commands.Apis
{
    public class UpdateJobTrackerCommand : NonQueryCommand
    {
        private const string SP_NAME = "Task_API_PushDataTracker_Upd";

        public override string GetSettingKey() => SP_NAME;

        public override bool IsValid() => true;

        public long PushTrackerId { get; set; }

        public int StatusId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }
    }
}
