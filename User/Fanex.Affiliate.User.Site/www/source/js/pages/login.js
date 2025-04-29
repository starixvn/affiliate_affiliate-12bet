var Login = (function ($) {
    var _refreshCaptchaTimeoutId = null;
    var REFRESH_CAPTCHA_INTERVAL = 600000;

    function registerRefreshLoginCaptcha() {
        function refreshCaptcha() {
            _me.generateDialogCaptcha();
            clearTimeout(_refreshCaptchaTimeoutId);
            _refreshCaptchaTimeoutId = setTimeout(refreshCaptcha, REFRESH_CAPTCHA_INTERVAL);
        }

        clearTimeout(_refreshCaptchaTimeoutId);
        _refreshCaptchaTimeoutId = setTimeout(function () {
            refreshCaptcha();
        }, REFRESH_CAPTCHA_INTERVAL);
    }

    function toggleLoginButton(isEnable) {
        $('#btnDialogLogin').prop('disabled', !isEnable);
    }

    var _me = {
        initialize: function () {
            _me.registerLoginDialog();
            _me.initLoginDialogEvent();
        },
        registerLoginDialog: function () {
            $("#loginDialog").on("show.bs.modal", function (e) {
                _me.generateDialogCaptcha();
                registerRefreshLoginCaptcha();
            })

            $("#loginDialog").on("hide.bs.modal", function (e) {
                $("#loginDialogcaptchaImg").attr("src", "");
            })
        },
        initLoginDialogEvent: function () {
            if (!!window.isShowLogin) {
                $("#loginDialog").modal({ backdrop: "static" });
            }

            $('#mobileLogin').on('click', function () {
                $("#loginDialog").modal({ backdrop: "static" });
            });

            $(".mediaLoginLink").on("click", function () {
                $('#isCLickedBannerLink').val("1");
                $("#loginDialog").modal({ backdrop: "static" });
            });

            $("#btnDialogLogin").on("click", function () {
                _me.requestSignin();
            });

            $("#loginDialog input").on("keypress", function (e) {
                if (e.keyCode === 13 && !$('#btnDialogLogin').prop('disabled')) {
                    _me.requestSignin();
                }
            });

            $("#loginDialogcaptchaBtn").on("click", function () {
                _me.generateDialogCaptcha();
                registerRefreshLoginCaptcha();
            });
        },

        requestSignin: function () {
            var $username = $("#dialogtxtUsername");
            var $password = $("#dialogtxtPassword");
            var $validation = $("#dialogtxtValidation");

            var username = $username.val();
            var password = $password.val();
            var validation = $validation.val();

            var validationResult = _me.validate(username, password, validation);
            if (validationResult.isValid) {
                var token = $('input[name="__RequestVerificationToken"]', $("#userLogin")).val();
                var publicKey = AuthHelper.base64DecodeUnicode($("#PublicKey").val());
                var timeStamp = AuthHelper.getUtcUnixTimeStamp();

                var queryString = 'u=' + encodeURIComponent(username.trim()) + '&p=' + encodeURIComponent(password) + '&t=' + timeStamp;
                var encryptedQueryString = AuthHelper.encrypt(queryString, publicKey);
                $password.val(encryptedQueryString);

                var postData = {
                    __RequestVerificationToken: token,
                    LoginInfo: encodeURIComponent(encryptedQueryString),
                    ValidationKey: validation
                };

                $.ajax({
                    type: "POST",
                    url: Site.resolveRelativeLangUrl("Auth/SignIn"),
                    data: postData,
                    dataType: "json",
                    cache: false,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    success: function (response) {
                        if (response.IsOk) {
                            sessionStorage.setItem('showDialogCloseV1', '1');
                            var isRedirectToMediaPage = $('#isCLickedBannerLink').val() === "1";
                            if (isRedirectToMediaPage) {
                                PageTracking.addTrackingForLogin();

                                setTimeout(function () {
                                    Site.redirect(Site.resolveRelativeLangUrl("UserPanel/Main/#AccountOverview#MediaGallery"));
                                }, 10);
                            }
                            else {
                                Site.redirect(Site.resolveRelativeLangUrl("UserPanel/Main/#AccountOverview"));
                            }
                        }
                        else {
                            if (response.ShouldVerifyAccount) {
                                Site.redirect(Site.resolveRelativeLangUrl('VerificationAccount'));
                            }
                            else {
                                alert(response.Message);

                                $username.val("");
                                $password.val("");
                                $validation.val("");
                                _me.generateDialogCaptcha();
                                registerRefreshLoginCaptcha();

                                toggleLoginButton(true);
                            }
                        }
                    },
                    beforeSend: function () {
                        Site.showLoader();
                        toggleLoginButton(false);
                    },
                    complete: function (jqXHR, textStatus) {
                        Site.hideLoader();
                        if (textStatus === 'error') {
                            toggleLoginButton(true);
                        }
                    }
                });
            }
            else {
                alert($("<div/>").html(validationResult.message).text());
            }
        },

        validate: function (username, password, validationCode) {
            var empty = "";
            var result = {
                isValid: false,
                message: empty
            };

            if (username === empty) {
                $("#dialogtxtUsername").focus();
                result.message = validationMessage.enterUserName;
                return result;
            }

            if (password === empty) {
                $("#dialogtxtPassword").focus();
                result.message = validationMessage.enterPassword;
                return result;
            }

            if (validationCode === empty) {
                $("#dialogtxtValidation").focus();
                result.message = validationMessage.enterValidationCode;
                return result;
            }

            result.isValid = true;
            return result;
        },

        generateDialogCaptcha: function () {
            var captchaUrl = Site.resolveRelativeLangUrl("Auth/CaptchaImage?_v=" + new Date().getTime());
            $("#loginDialogcaptchaImg").attr("src", captchaUrl);
        }
    };

    return _me;
})(jQuery);

Login.initialize();