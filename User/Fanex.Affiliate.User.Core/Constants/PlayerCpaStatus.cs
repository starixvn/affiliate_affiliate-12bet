using System.Collections.Generic;
using System.Web.Mvc;
using Fanex.Affiliate.User.Core.Resources;

namespace Fanex.Affiliate.User.Core.Constants
{
    public static class PlayerCpaStatus
    {
        public const string ALL_STATUSES = "2,3,1,4,5,0,6";

        public static IEnumerable<SelectListItem> StattusList => new List<SelectListItem>
        {
            new SelectListItem { Value = "2", Text = Lang.Eligible, Selected = true },
            new SelectListItem { Value = "3", Text = Lang.Settled, Selected = true },
            new SelectListItem { Value = "1", Text = Lang.Ineligible, Selected = true },
            new SelectListItem { Value = "4", Text = Lang.Rejected, Selected = true },
            new SelectListItem { Value = "5", Text = Lang.QuotaExceeded, Selected = true },
            new SelectListItem { Value = "0", Text = Lang.Pending, Selected = true },
            new SelectListItem { Value = "6", Text = Lang.RedepositFailed, Selected = true },  
        };
    }
}
