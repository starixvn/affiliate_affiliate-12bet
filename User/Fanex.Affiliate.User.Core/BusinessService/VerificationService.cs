namespace Fanex.Affiliate.User.Core.BusinessService
{
    using Commands;
    using Constants;
    using CoreService;
    using Criterias;
    using Data.Repository;
    using DTO.VerificationAccount;
    using Extensions;
    using MetalModels;
    using MetalModels.Email;
    using OtpNet;
    using System.Security.Cryptography;
    using Utilities;

    public class VerificationService : BaseDynamicService, IVerificationService
    {
        private const int SecretKeyExistedCode = 101;

        private readonly ITwoFactorAuthService _twoFactorAuthService;
        private readonly IAccountService _accountService;
        private readonly IEmailService _mailService;
        private readonly ICryptographyService _cryptographyService;
        private readonly IWrapperUtility _wrapperUtility;
        private readonly IAppSetting _appSetting;

        public VerificationService(
            IDynamicRepository dynamicRepository,
            ITwoFactorAuthService twoFactorAuthService,
            IEmailService mailService,
            ICryptographyService cryptographyService,
            IWrapperUtility wrapperUtility,
            IAccountService accountService,
            IAppSetting appSetting) : base(dynamicRepository)
        {
            _twoFactorAuthService = twoFactorAuthService;
            _accountService = accountService;
            _mailService = mailService;
            _cryptographyService = cryptographyService;
            _wrapperUtility = wrapperUtility;
            _appSetting = appSetting;
        }

        public SendCodeResult SendCode(SendCodeParam param)
        {
            if (CanSendCode(param.SentCodeTime, param.IntervalInMinute))
            {
                var userInfo = _accountService.GetUserInfoById(param.AffId, false);
                if (!param.Email.MatchWith(userInfo.Email))
                {
                    return CreateSendCodeFailedResult(isValidEmail: false);
                }

                if (string.IsNullOrEmpty(userInfo.SecretKey))
                {
                    userInfo.SecretKey = TryCreateSecretKey(userInfo.AffId);
                }

                var counter = _wrapperUtility.GetRandomGenerator().Next(int.MinValue, int.MaxValue);
                var otp = _twoFactorAuthService.GenerateHotp(userInfo.SecretKey, counter);

                var emailParam = param.VerificationEmailParam;
                var verificationAccountEmailParam = new VerificationAccountEmailParam
                {
                    User = userInfo,
                    MailContact = _appSetting.MailContactByCountry(userInfo.TargetCountryCode),
                    MailTo = userInfo.Email,
                    RootDomain = emailParam.RootDomain,
                    Code = otp,
                    Ip = emailParam.Ip,
                    CurrentLanguage = emailParam.CurrentLanguage
                };

                _mailService.SendVerificationEmail(verificationAccountEmailParam);

                return new SendCodeResult
                {
                    IsValidEmail = true,
                    CanSendCode = true,
                    NewCounter = counter,
                    NewSendCodeTime = GetNewSendCodeTime()
                };
            }

            return CreateSendCodeFailedResult(false);
        }

        public bool IsValidOtp(VerificationOtpParam param)
        {
            var authMessage = param.LoginInfo + param.HashKey + param.Captcha + param.OtpCode;
            var hashMessage = CreateHashMessage(authMessage, param.HashKey);

            var isValid = string.Equals(hashMessage, param.HashMessage) &&
                _twoFactorAuthService.VerifyHotp(param.SecretKey, param.Counter, param.OtpCode);

            UpdateVerificationInfo(param, isValid);

            return isValid;
        }

        public VerificationAction CreateActionLink(string key, string salt, int expirationInMinute)
        {
            var nowTicks = _wrapperUtility.GetGmt8NowDateTime().Ticks.ToString();
            var queryString = "controller=VerificationAccount&action=VerifyAccount&t=" + nowTicks + "&e=" + expirationInMinute;

            return new VerificationAction
            {
                Link = ConverterUtils.Base64Encode(SymmetricEncryptionUtility.Encrypt<AesManaged>(queryString, key, salt)),
                TimeToken = nowTicks
            };
        }

        private void UpdateVerificationInfo(VerificationOtpParam param, bool isValid)
        {
            var verificationParam = CreateVerificationParam(param);
            var verificationInfo = GetTData<VerificationInfo>(verificationParam.MapTo<AuthResultBaseParam, GetLoginInfoByUserDeviceCriteria>());

            if (verificationInfo.FailedLoginCount.HasValue)
            {
                var updateResult = ExecuteReturnResultInfo(verificationParam.MapTo<AuthResultBaseParam, UpdateVerificationInfoCommand>());
                if (!updateResult.IsOk)
                {
                    LogHelper.WriteError(updateResult.Message);
                }
            }
            else
            {
                if (isValid)
                {
                    var insertResult = ExecuteReturnResultInfo(verificationParam.MapTo<AuthResultBaseParam, InsertUserDeviceInfoCommand>());
                    if (!insertResult.IsOk)
                    {
                        LogHelper.WriteError(insertResult.Message);
                    }
                }
            }
        }

        private AuthResultBaseParam CreateVerificationParam(VerificationOtpParam param)
        {
            return new AuthResultBaseParam
            {
                AffId = param.AffId,
                DeviceInfo = _cryptographyService.ComputeSha256Hash(Parser.GetDeviceInfo(param.UserAgent)),
                IpAddress = param.IpAddress,
                Language = param.Language
            };
        }

        private bool CanSendCode(long sendCodeTimeSession, int intervalInMinute)
        {
            var maxTime = _wrapperUtility.GetGmt8NowDateTime().AddMinutes(intervalInMinute * -1).Ticks;

            return sendCodeTimeSession == 0 || maxTime - sendCodeTimeSession >= 0;
        }

        private long GetNewSendCodeTime()
        {
            var now = _wrapperUtility.GetGmt8NowDateTime();

            return DateTimeHelper.CreateDateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second).Ticks;
        }

        private static string CreateHashMessage(string message, string secret)
            => CryptographyHelper.SHA256Hash(message, secret);

        private string TryCreateSecretKey(int affId)
        {
            var secretKey = GenerateSecretKey();
            var resultCode = _accountService.CreateSecretKey(affId, secretKey);

            while (resultCode == SecretKeyExistedCode)
            {
                secretKey = GenerateSecretKey();
                resultCode = _accountService.CreateSecretKey(affId, secretKey);
            }

            return secretKey;
        }

        private static string GenerateSecretKey()
        {
            return Base32Encoding.ToString(KeyGeneration.GenerateRandomKey(Number.Twenty));
        }

        private static SendCodeResult CreateSendCodeFailedResult(bool canSendCode = true, bool isValidEmail = true)
        {
            return new SendCodeResult
            {
                IsValidEmail = isValidEmail,
                CanSendCode = canSendCode
            };
        }
    }
}