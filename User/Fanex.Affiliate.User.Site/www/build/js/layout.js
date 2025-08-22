"use strict";

var Layout = (function ($) {
    var DEFAULT_SPEED = 39;
    var regexLangPartten = /\/(\w{2}|hien|hitg|phen)\//g;
    var regexLang = new RegExp(regexLangPartten);

    function createNewUrlByLanguage(language) {
        var href = window.location.href;
        var pathItems = window.location.pathname.split('/');
        var langIndex = pathItems.findIndex(function (i) {
            return regexLang.test("/" + i + "/");
        });

        if (langIndex != -1) {
            pathItems[langIndex] = language;
            var newPathName = pathItems.join('/');

            return href.replace(window.location.pathname, newPathName);
        } else {
            var host = window.location.host + $("#RootUrl").val().replace(/\/\w{2}\//, '');
            return href.replace(host, host + "/" + language);
        }
    }

    var _me = {
        initialize: function initialize() {
            _me.registerAjaxHandlerError();
            _me.initEvent();
            _me.renderHotNews();
        },
        initEvent: function initEvent() {
            $("#selectedLanguage").on("click", function (e) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass("active");
                    window.addEventListener("click", _me.handleCloseLanguageDropdown, true);
                } else {
                    $(this).removeClass("active");
                }
            });

            $("#menuMobileBtn").on("click", function (e) {
                if ($(this).hasClass('collapsed')) {
                    window.addEventListener("click", _me.handleCloseMenuPopup, true);
                }
            });

            $("#languageList").on("click", ".language-item", function () {
                var $selectedItem = $(this);
                _me.changeLanguage($selectedItem.data('option'));
            });

            $('li.parent').on('mouseover', function () {
                var $menuItem = $(this),
                    $submenuWrapper = $('> .submenu-container', $menuItem);

                // grab the menu item's position relative to its positioned parent
                var menuItemPos = $menuItem.position();
                var withMenu = $menuItem.outerWidth();
                var heightMenu = $menuItem.outerHeight();

                // place the submenu in the correct position relevant to the menu item
                $submenuWrapper.css({
                    top: menuItemPos.top + heightMenu,
                    left: menuItemPos.left + withMenu - 200
                });
            });

            $(window).scroll(function () {
                if ($(this).scrollTop() > 200) {
                    $('#moveToTop').fadeIn(200);
                } else {
                    $('#moveToTop').fadeOut(200);
                }
            });
        },

        handleCloseMenuPopup: function handleCloseMenuPopup(e) {
            var menuBtn = $("#menuMobileBtn");
            var isOpened = !menuBtn.hasClass('collapsed');

            if (isOpened) {
                menuBtn.click();
                window.removeEventListener("click", _me.handleCloseMenuPopup, isOpened);
            }
        },

        handleCloseLanguageDropdown: function handleCloseLanguageDropdown(e) {
            var languageBtn = $("#selectedLanguage");
            var isOpened = languageBtn.hasClass('active');

            if (isOpened) {
                !languageBtn.has(e.target).length && languageBtn.removeClass("active");
                window.removeEventListener("click", _me.handleCloseLanguageDropdown, isOpened);
            }
        },

        registerAjaxHandlerError: function registerAjaxHandlerError() {
            $(document).ajaxError(function (event, jqXHR) {
                var status = jqXHR.status;

                switch (status) {
                    case 401:
                    case 403:
                        window.location.href = _me.handleResolveRelativeLangUrl("Home");
                        break;
                    case 404:
                        window.location.href = _me.handleResolveRelativeLangUrl("Notify/PageNotFound");
                        break;
                    case 500:
                        alert($("<div/>").html(window.Lang.ServerError).text());
                        break;
                    default:
                        break;
                }
            });
        },
        renderHotNews: function renderHotNews() {
            $.ajax({
                type: "GET",
                url: _me.handleResolveRelativeLangUrl("News/LatestHotNews"),
                dataType: "html",
                cache: false,
                success: function success(response) {
                    var $marquee = $("#marquee");
                    $marquee.html(response);
                    // Time = Distance/Speed
                    var containerWith = $marquee.width();
                    var timeTaken = containerWith / DEFAULT_SPEED;

                    $marquee.css("animation-duration", timeTaken + "s");
                }
            });
        },

        changeLanguage: function changeLanguage(selectedLanguage) {
            var newUrl = createNewUrlByLanguage(selectedLanguage).replace(/\/+$/, '');

            Site.redirect(newUrl);
        },

        handleResolveRelativeLangUrl: function handleResolveRelativeLangUrl(url) {
            if (typeof Site === "undefined" || !Site.resolveRelativeLangUrl) {
                return $("#RootLangUrl").val() + url;
            }

            return Site.resolveRelativeLangUrl(url);
        }
    };

    return _me;
})(jQuery);

Layout.initialize();

