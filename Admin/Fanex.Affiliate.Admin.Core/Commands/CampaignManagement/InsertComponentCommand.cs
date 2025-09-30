namespace Fanex.Affiliate.Admin.Core.Commands.CampaignManagement
{
    public class InsertComponentCommand : BaseNonQueryCommand
    {
        public string ComponentName { get; set; }

        public string ComponentCode { get; set; }

        public int ComponentTypeId { get; set; }

        public int StatusId { get; set; }

        public override string GetSettingKey() => "Aff_LandingPage_Component_Ins";

        public override bool IsValid()
        {
            return StatusId >= 0
                   && ComponentTypeId > 0
                   && !string.IsNullOrWhiteSpace(ComponentName)
                   && !string.IsNullOrWhiteSpace(ComponentCode);
        }
    }
}