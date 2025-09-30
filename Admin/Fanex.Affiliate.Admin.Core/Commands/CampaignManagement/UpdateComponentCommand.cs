namespace Fanex.Affiliate.Admin.Core.Commands.CampaignManagement
{
    public class UpdateComponentCommand : BaseNonQueryCommand
    {
        public string ComponentName { get; set; }

        public int ComponentId { get; set; }

        public int ComponentTypeId { get; set; }

        public int StatusId { get; set; }

        public override string GetSettingKey() => "Aff_LandingPage_Component_Upd";

        public override bool IsValid()
        {
            return StatusId >= 0
                   && ComponentTypeId > 0
                   && ComponentId > 0
                   && !string.IsNullOrWhiteSpace(ComponentName);
        }
    }
}
