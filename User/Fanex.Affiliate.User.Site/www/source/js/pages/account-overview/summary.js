var Summary = (function ($) {
    const ViewByMonth = '0';

    function formatDateUnit(value) {
        return value < 10 ? '0' + value : value;
    }

    function getDateString(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return formatDateUnit(month) + "/" + formatDateUnit(day) + "/" + year;
    }

    function initMonthPicker() {
        let today = $("#Today").val();
        const sixMonthAgo = new Date(today);
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

        $("#MonthDate").monthPicker({
            range: [new Date(sixMonthAgo.getFullYear(), sixMonthAgo.getMonth() + 1, 1), new Date(today)],
            triggerSelector: "#monthPickerTrigger",
            onSelect: function (month, year) {
                var date = formatDateUnit(month) + "/01/" + year;
                $("#MonthDate").data("original-date", date);
            }
        });
    }

    function initDatePicker(id, triggerId) {
        UserPanel.datepicker.push(new Pikaday({
            field: document.getElementById(id),
            trigger: document.getElementById(triggerId),
            yearRange: [2015, new Date().getFullYear()],
            toString: function (date, format) {
                return getDateString(date);
            }
        }));
    }

    var _me = {
        initialize: function () {
            const params = {
                isGetMonthly: true,
                fromDate: $("#MonthDate").data("original-date"),
                toDate: $("#Today").val()
            };

            initMonthPicker();
            initDatePicker('FromDate', 'fromPicker');
            initDatePicker('ToDate', 'toPicker');
            _me.initEvent();
            _me.renderDashBoardView(params);
            _me.renderDetailView(params, "Overview");
        },

        initEvent: function () {
            $("#dashboardSubmit").on("click", function () {
                _me.handleDashboardSubmit();
            });

            $('#details-section-menu').on('click', '.details-section-menu-item', function () {
                const name = $(this).data('name');
                const params = _me.getAccountOverviewParams();

                _me.renderDetailView(params, name, true);
            });

            $('#ViewBy').on('change', function () {
                _me.handleDashboardSubmit();

                if ($(this).val() == ViewByMonth) {
                    $('.month-picker-group').show();
                    $('.date-picker-group').hide();
                } else {
                    $('.month-picker-group').hide();
                    $('.date-picker-group').show();
                }
            });
        },

        renderDashBoardView: function (params) {
            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/Summary/DashBoard"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    $("#dashboard-section").html(response);
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        activeMenu: function (actionName) {
            const activeClassName = "active";
            $(".details-section-menu-item").removeClass(activeClassName);
            $("#menu" + actionName).addClass(activeClassName);
        },

        renderDetailView: function (params, actionName, isClickSubMenu) {
            _me.activeMenu(actionName);

            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/Summary/" + actionName),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    $("#details-section-content").html(response);
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    isClickSubMenu && Site.hideLoader();
                }
            });
        },

        handleDashboardSubmit: function () {
            const params = _me.getAccountOverviewParams()

            const actionMenu = $('.details-section-menu-item.active').data('name');

            _me.renderDashBoardView(params);
            _me.renderDetailView(params, actionMenu);
        },

        getAccountOverviewParams: function () {
            const isGetMonthly = $('#ViewBy').val() == ViewByMonth;
            let params = {
                isGetMonthly,
                fromDate: $('#FromDate').val(),
                toDate: $('#ToDate').val()
            }

            if (isGetMonthly) {
                const todayVal = $("#Today").val();
                const today = new Date(todayVal);

                const monthDate = $("#MonthDate").data("original-date");
                const monthDateTime = new Date(monthDate);
                const maxDateOfMonth = new Date(monthDateTime.getFullYear(), monthDateTime.getMonth() + 1, 0);

                params = {
                    isGetMonthly,
                    fromDate: monthDate,
                    toDate: maxDateOfMonth < today ? getDateString(maxDateOfMonth) : todayVal
                }
            }

            return params;
        },
    };

    return _me;
})(jQuery);

Summary.initialize();