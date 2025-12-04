namespace Fanex.Affiliate.Admin.Core.Commands.Operation
{
    using System;

    public class InsertDealCommand : BaseDealCommand
    {
        public byte GroupTypeId { get; set; }

        public DateTime StartDate { get; set; }

        public byte ScheduleId { get; set; }

        public override string GetSettingKey() => "Aff_Admin_Deal_Ins";

        public override bool IsValid() => true;
    }
}
