using Fanex.Data.Repository;

namespace Fanex.Affiliate.Admin.Core.Commands.Apis
{
    public class InsertJobTrackerCommand : NonQueryCommand
    {
        private const string SP_NAME = "Task_API_PushDataTracker_Import";

        public override string GetSettingKey() => SP_NAME;

        public override bool IsValid() => true;

        public int PushDataType { get; set; }

        public string PushDataInfo { get; set; }

        public long PushTrackerId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }
    }
}