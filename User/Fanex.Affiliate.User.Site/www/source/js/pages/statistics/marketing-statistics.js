var ReferrerStatistics = (function ($) {
    function toggleChildrenElem(children) {
        $(children).toggleClass("display-none");
    }

    function initExpandBtnEvent() {
        $(".row-toogleable-table").on("click", ".btn.btn-transparent", function () {
            let parentRow = $(this).parents("tr");
            let id = parentRow.data("id");
            let children = parentRow.siblings(`tr[data-parent='${id}']`);
            toggleCollapseButton(this);
            toggleChildrenElem(children);
        });
    }

    var _me = {

        initialize: function () {
            DatePickerComponent.initLinkedDatePickers('FromDate', 'fromPicker', 'ToDate', 'toPicker', {
                datepickerRegistry: UserPanel.datepicker
            });
            _me.initEvent();
            _me.renderMainView();
        },

        initEvent: function () {
            $('#btnStatisticsSubmit').on('click', function () {
                _me.renderMainView();
            });
        },

        renderMainView: function () {
            $('#statisticsDetailTable').html('');

            let params = {
                fromDate: $('#FromDate').val(),
                toDate: $('#ToDate').val(),
                language: $('#language').val(),
                includeInActiveLink: $('#includeInActive').is(':checked')
            };

            _me.getMainView(params);
        },

        getMainView: function (params) {
            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/MarketingLinkStatistics"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    $("#statisticsTable").html(response);
                    initExpandBtnEvent();
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },
    };

    return _me;
})(jQuery)

ReferrerStatistics.initialize();