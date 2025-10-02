export const claimResource = {
    WritePermission: 'Write',

    UserControl: "[UserControl]",
    Affiliate: "[Affiliate]",
    Payment: "[Payment]",
    EmailHistory: "[EmailHistory]",
    Media: "[Media]",
    LandingPage: "[Media]",
    PageManagement: "[PageBuilder]",
    AssetUploader: "[AssetUploader]",
    RegistrationFormUploader: "[RegistrationFormUploader]",
    AllCampaigns: "[AllCampaigns]",
    ComponentManagement: "[ComponentManagement]",
    LinkGenerator: "[LinkGenerator]",
    AffExRate: "[AffEx.Rate]",
    HotNews: "[HotNews]",
    RevenueGroup: "[RevenueGroup]",
    AffReport: "[AffReport]",
    Domain: "[Domain]",
    MemberEmail: "[MemberEmail]",
    Player: "[Player]",
    AffPersonalInfo: "[AffPersonalInfo]",
    Note: "[Note]",
    MarketingTeamNote: "[MarketingTeamNote]",
    SecurityQA: "[SecurityQA]",
    EditAffStatus: "[EditAffiliateStatus]",
    EditAffDetails: "[EditAffiliateDetails]",
    TransferPlayerSetting: "[HideTransferPlayerSetting]", //Hide Transfer Player
    TransferPlayerReport: "[HideTransferPlayerReport]", //Hide Transfer Player,
    DisabledFunction: "[DisabledFunction]",
    CreateMarketingAccount: "[AddMarketingAccount]",
    Deal: '[Deal]',
}

export const claimTypes = {
    AuthenticationInstant: "http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant",
    DenyOnlySid: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid",
    Email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    Gender: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender",
    GivenName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
    Hash: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/hash",
    HomePhone: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/homephone",
    Locality: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality",
    MobilePhone: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone",
    Name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    NameIdentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    OtherPhone: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/otherphone",
    PostalCode: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode",
    Rsa: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/rsa",
    Sid: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid",
    Spn: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn",
    StateOrProvince: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/stateorprovince",
    StreetAddress: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress",
    Surname: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
    System: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/system",
    Thumbprint: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/thumbprint",
    Upn: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn",
    Uri: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri",
    Webpage: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/webpage",
    Dns: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dns",
    DateOfBirth: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth",
    Country: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country",
    AuthorizationDecision: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision",
    AuthenticationMethod: "http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod",
    CookiePath: "http://schemas.microsoft.com/ws/2008/06/identity/claims/cookiepath",
    DenyOnlyPrimarySid: "http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid",
    DenyOnlyPrimaryGroupSid: "http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid",
    DenyOnlyWindowsDeviceGroup: "http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup",
    Dsa: "http://schemas.microsoft.com/ws/2008/06/identity/claims/dsa",
    Expiration: "http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration",
    Expired: "http://schemas.microsoft.com/ws/2008/06/identity/claims/expired",
    GroupSid: "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid",
    IsPersistent: "http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent",
    PrimaryGroupSid: "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid",
    X500DistinguishedName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname",
    PrimarySid: "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid",
    SerialNumber: "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber",
    UserData: "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata",
    Version: "http://schemas.microsoft.com/ws/2008/06/identity/claims/version",
    WindowsAccountName: "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname",
    WindowsDeviceClaim: "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim",
    WindowsDeviceGroup: "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup",
    WindowsUserClaim: "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim",
    WindowsFqbnVersion: "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion",
    WindowsSubAuthority: "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority",
    Anonymous: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/anonymous",
    Authentication: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication",
    Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    Actor: "http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor"
}

export class Claim {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export default class ClaimPrincipal {
    constructor(claims) {
        this.claims = claims;
    }

    static get currentClaimPrincipal() {
        let claims = window.globalVariables.claims || window.initialState.claims || {};
        return new ClaimPrincipal(claims);
    }

    hasReadClaim(claimType) {
        if (typeof claimType === 'string') {
            return this.claims[claimType] !== undefined
        }
        return false;
    }

    hasWriteClaim(claimType) {
        if (typeof claimType === 'string' && this.claims[claimType] !== undefined) {
            const found = this.claims[claimType].find(c => c === claimResource.WritePermission);
            return !!found;
        }
        return false;
    }

    hasClaim(claim) {
        if (typeof claim === 'string') {
            return this.hasReadClaim(claim);
        }
        return this.claims[claim.type] !== undefined
            && (claim.value === undefined || !!this.claims[claim.type].find(value => value === claim.value))
    }
}