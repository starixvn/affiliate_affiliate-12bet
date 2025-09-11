"use strict";

var SUPPORT_MIN_WITDH = 716;
var SUB_MENU_HEIGHT = 43;
var DETAILS_SECTION_MENU_HEIGHT = 33;

function toggleCollapseButton(btn) {
    $(btn).children("span").toggleClass("right");
    $(btn).children("span").toggleClass("bottom");
}

function handleSetTop() {
    var isOverviewTable = $("#overview-table").length;

    if (isOverviewTable) {
        var headerHeight = $('#overview-table-header').height();
        $('#overview-table-total > th').css({ top: SUB_MENU_HEIGHT + Math.ceil(headerHeight) + "px" });
    }
}

function handleScroll() {
    var isSummaryPanel = $("#summary").length;

    if (isSummaryPanel) {
        if (window.innerWidth < SUPPORT_MIN_WITDH) {
            $("#details-section-menu").removeClass("details-section-sticky");
        } else {
            var stickyPoint = $("#details-section").offset().top;

            if (window.pageYOffset >= stickyPoint) {
                $("#details-section-menu").addClass("details-section-sticky");
            }
            if (window.pageYOffset < stickyPoint - DETAILS_SECTION_MENU_HEIGHT) {
                $("#details-section-menu").removeClass("details-section-sticky");
            }
        }
    }
}

function handleResize() {
    handleScroll();
    handleSetTop();
}

var UserPanel = (function ($) {
    var DEFAULT_ACTION = 'AccountOverview';
    var allowedActionList = ["AccountOverview", "StatementHistory", "MyAccount", "PaymentRequest", "ReferrersStatistics", "LandingPageStatistics", "MarketingLinkStatistics", "DailyEarning", "SubAffEarning", "RevenueReport", "RedepositCPAReport"];

    var _ajaxRequest = null;

    var _me = {
        datepicker: [],
        initialize: function initialize() {
            _me.renderView();
            UserPanel.initEvent();
        },

        initEvent: function initEvent() {
            $(window).on('hashchange', function (event) {
                event.stopPropagation();
                _me.renderView();
            });
        },

        activeMenu: function activeMenu(actionName) {
            var activeClassName = "active";
            $("#mainMenu .menu-item").removeClass(activeClassName);
            $("#menu" + actionName).addClass(activeClassName);
        },

        renderView: function renderView() {
            _me.clearEventListener();
            $("#mainPanel").html("");
            var actionUrl = _me.getActionUrl(false);
            var actionName = actionUrl.split('?')[0];
            _me.activeMenu(actionName);

            var url = Site.resolveRelativeLangUrl("UserPanel/" + actionUrl);

            if (_ajaxRequest !== null) {
                _ajaxRequest.abort();
            }

            _ajaxRequest = $.ajax({
                type: "GET",
                dataType: "html",
                cache: false,
                url: url,
                success: function success(response) {
                    $("#mainPanel").html(response);
                },
                beforeSend: function beforeSend() {
                    Site.showLoader();
                },
                complete: function complete() {
                    Site.hideLoader();
                }
            });
        },

        clearEventListener: function clearEventListener() {
            $("#mainPanel *").off();
            if (_me.datepicker) {
                for (var i = 0; i < _me.datepicker.length; i++) {
                    if (_me.datepicker[i]) {
                        _me.datepicker[i].destroy();
                    }
                }
                _me.datepicker = [];
            }

            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        },

        getActionUrl: function getActionUrl(onlyAction) {
            var hash = window.location.hash;
            var actionUrl = hash.split('#')[1];

            if (!actionUrl) {
                return DEFAULT_ACTION;
            }

            var urlPartList = actionUrl.split('?');
            var actionName = urlPartList[0];

            if (allowedActionList.indexOf(actionName) === -1) {
                actionName = DEFAULT_ACTION;
            }

            var queryString = !onlyAction && urlPartList[1] ? '?' + urlPartList[1] : '';

            return actionName + queryString;
        }
    };

    return _me;
})(jQuery);

UserPanel.initialize();

