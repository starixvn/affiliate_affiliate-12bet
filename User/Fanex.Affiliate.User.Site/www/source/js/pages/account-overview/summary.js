var Summary = (function ($) {
    const ViewByMonth = '0';

    function initMonthPicker() {
        let today = $("#Today").val();
        const sixMonthAgo = new Date(today);
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

        $("#MonthDate").monthPicker({
            range: [new Date(sixMonthAgo.getFullYear(), sixMonthAgo.getMonth() + 1, 1), new Date(today)],
            triggerSelector: "#monthPickerTrigger",
            onSelect: function (month, year) {
                var date = DatePickerComponent.formatDateUnit(month) + "/01/" + year;
                $("#MonthDate").data("original-date", date);
            }
        });
    }

    var _me = {
        initialize: function () {
            const params = {
                isGetMonthly: true,
                fromDate: $("#MonthDate").data("original-date"),
                toDate: $("#Today").val()
            };

            initMonthPicker();
            DatePickerComponent.initLinkedDatePickers('FromDate', 'fromPicker', 'ToDate', 'toPicker', { 
                datepickerRegistry: UserPanel.datepicker,
                maxRangeMonths: 3 
            });
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
                    toDate: maxDateOfMonth < today ? DatePickerComponent.getDateString(maxDateOfMonth) : todayVal
                }
            }

            return params;
        },
    };

    return _me;
})(jQuery);

Summary.initialize();