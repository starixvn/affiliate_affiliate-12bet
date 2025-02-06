var VerificationAccount = (function () {
    var _refreshCaptchaTimeoutId = null;
    var _countdownResendCodeTimeoutId = null;
    var INTERVAL_SENDCODE_SECOND = 60;
    var REFRESH_CAPTCHA_INTERVAL = 600000;
    var _originalSendCodeText = null;

    function registerRefreshCaptcha() {
        function refreshCaptcha() {
            _me.generateCaptcha();
            clearTimeout(_refreshCaptchaTimeoutId);
            _refreshCaptchaTimeoutId = setTimeout(refreshCaptcha, REFRESH_CAPTCHA_INTERVAL);
        }

        clearTimeout(_refreshCaptchaTimeoutId);
        _refreshCaptchaTimeoutId = setTimeout(refreshCaptcha, REFRESH_CAPTCHA_INTERVAL);
    }

    function updateAction(action) {
        $('#ActionLink').val(action.Link);
        $('#ActionToken').val(action.TimeToken);
    }

    function isValidEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function toggleMessageForEmail(isValid) {
        $('#emailGroup').toggleClass('has-error', !isValid);
        $('#emailValidationMessage').toggleClass('hide', isValid);
        $('#emailValidationMessage').html(resource.invalidEmail);
    }

    var _me = {
        initialize: function () {
            _originalSendCodeText = $('#btnSendCode').text();
            _me.initEvent();
            registerRefreshCaptcha();
        },
        initEvent: function () {
            $("#btnSendCode").on("click", function (e) {
                //_me.sendCode();
                var $form = $("#sendCodeForm");
                var validator = $form.validate();
                var isValidForm = validator.form();

                if (isValidForm) {
                    alert($("<div/>").html(resource.errAuthorized).text());
                }
            });
            $("#btnLoginVerification").on("click", function (e) {
                _me.submitForm();
            });
            $("#verifyAccCaptchaBtn").on('click', function (e) {
                e.preventDefault();
                _me.generateCaptcha();
                registerRefreshCaptcha();
            });
            $('#verificationAccountForm input').on('keypress', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    _me.submitForm();
                }
            });

            $('#Email').on('keypress', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    _me.sendCode();
                }
            });
        },
        generateCaptcha: function () {
            var captchaUrl = Site.resolveRelativeLangUrl("VerificationAccount/CaptchaImage?_v=" + new Date().getTime());
            $("#verifyAccCaptchaImg").attr("src", captchaUrl);
        },
        sendCode: function () {
            var $form = $("#sendCodeForm");
            var validator = $form.validate();
            var isValidForm = validator.form();

            if (isValidForm) {
                var email = $('#Email').val().trim();
                var token = $('input[name="__RequestVerificationToken"]', $("#verificationAccountForm")).val();
                var isValidInputEmail = isValidEmail(email);

                if (!isValidInputEmail) {
                    toggleMessageForEmail(isValidInputEmail);
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: Site.resolveRelativeLangUrl("VerificationAccount/SendCode"),
                    data: { __RequestVerificationToken: token, email: email },
                    dataType: "json",
                    cache: false,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    success: function (response) {
                        if (response.IsValidEmail) {
                            $('#btnSendCode').prop("disabled", true);
                            $('#Email').prop("disabled", true);
                            _me.countDown(INTERVAL_SENDCODE_SECOND);

                            if (!response.CanSendCode) {
                                alert($("<div/>").html(resource.wait60Seconds).text());
                            }
                        } else {
                            alert($("<div/>").html(resource.invalidEmail).text());
                        }

                        $('#VerificationToken').val(response.VerificationToken);
                        $('#verificationAccountGroup').toggleClass('hide', !(response.IsValidEmail && response.CanSendCode));
                        updateAction(response.Action);
                    },
                    beforeSend: function () {
                        Site.showLoader();
                    },
                    complete: function () {
                        Site.hideLoader();
                    }
                });
            }
        },
        countDown: function (second) {
            clearTimeout(_countdownResendCodeTimeoutId);
            if (second === 0) {
                $('#btnSendCode').text(_originalSendCodeText);
                $('#btnSendCode').prop('disabled', false);
                $('#Email').prop('disabled', false);
            } else {
                $('#btnSendCode').text(_originalSendCodeText + ' (' + second + ')');
                _countdownResendCodeTimeoutId = setTimeout(_me.countDown, 1000, --second);
            }
        },
        submitForm: function () {
            var username = $('#Usename').val();
            var password = $('#Password').val();
            var code = $('#Code').val();
            var captcha = $('#Captcha').val();
            var $form = $("#verificationAccountForm");
            var validator = $form.validate();
            var isValidForm = validator.form();

            if (isValidForm) {
                var csrfToken = $('input[name="__RequestVerificationToken"]', $("#loginDialog")).val();
                var publicKey = AuthHelper.base64DecodeUnicode($("#PublicKey").val());
                var timeStamp = AuthHelper.getUtcUnixTimeStamp();

                var queryString = 'u=' + encodeURIComponent(username.trim()) + '&p=' + encodeURIComponent(password) + '&t=' + timeStamp;
                var encryptedQueryString = AuthHelper.encrypt(queryString, publicKey);
                $('#Password').val(encryptedQueryString);

                var verificationToken = $('#VerificationToken').val();
                var authMessage = encryptedQueryString + verificationToken + captcha + code;
                var hashMessage = CryptoJS.HmacSHA256(authMessage, verificationToken).toString();

                var url = Site.resolveRelativeUrl("Execute") + '?callInfo=' + encodeURIComponent($('#ActionLink').val());
                var param = {
                    __RequestVerificationToken: csrfToken,
                    LoginInfo: encryptedQueryString,
                    Code: code,
                    Captcha: captcha,
                    HashMessage: hashMessage,
                    t: $('#ActionToken').val()
                };
                $.ajax({
                    type: "POST",
                    url: url,
                    data: param,
                    dataType: "json",
                    cache: false,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    success: function (response) {
                        if (response.IsOk) {
                            Site.showLoader();
                            Site.redirect(Site.resolveRelativeLangUrl("UserPanel/Main/#AccountOverview"));
                        }
                        else if (response.IsExpired) {
                            alert($("<div/>").html(resource.verificationFailed).text());
                        }
                        else {
                            var message = response.Message || resource.general;
                            alert(message);
                            updateAction(response.Action);
                            _me.generateCaptcha();
                            registerRefreshCaptcha();
                        }

                        $('#Password').val('');
                        $('#Captcha').val('');
                    },
                    beforeSend: function () {
                        Site.showLoader();
                    },
                    complete: function (jqXHR, textStatus) {
                        Site.hideLoader();
                    }
                });
            }
        }
    };
    return _me;
})();

VerificationAccount.initialize();