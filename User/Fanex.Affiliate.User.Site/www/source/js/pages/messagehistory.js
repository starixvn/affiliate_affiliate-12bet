var MessageHistory = (function ($) {
    var _pageSize = 10;
    var _pageIndex = 0;

    function initPager() {
        $("#messagePager").pager({
            totalItems: parseInt($("#TotalItem").val()),
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            languageCode: Site.getCurrentLanguage(),
            onChange: function (pageIndex, pageSize) {
                _pageIndex = pageIndex;
                _pageSize = pageSize;

                var params = _me.getParams();
                _me.submit(params);
            }
        });
    }

    var _me = {
        initialize: function () {
            // Initialize date pickers with custom onOpen callback
            // Prevent opening when "Search All" checkbox is checked
            DatePickerComponent.initLinkedDatePickers('FromDate', 'fromPicker', 'ToDate', 'toPicker', {
                datepickerRegistry: UserPanel.datepicker,
                onOpen: function () {
                    if ($("#chkSearchAll").prop("checked")) {
                        this.hide();
                    }
                }
            });
            initPager();
            _me.initEvent();
        },

        initEvent: function () {
            $("#btnSubmit").on("click", function () {
                var params = _me.getParams();
                _me.submit(params, _me.updatePager);
            });

            $("#chkSearchAll").on("click", function () {
                var isChecked = $(this).prop("checked");
                _me.toggleDate(isChecked);
            });
        },

        getParams: function () {
            var hasDateRange = !$("#chkSearchAll").prop("checked");
            var seachBy = $("#Search").val();

            return {
                FromDate: hasDateRange && $("#FromDate").val(),
                ToDate: hasDateRange && $("#ToDate").val(),
                Important: !seachBy ? "" : (seachBy === "1" ? true : false),
                PageSize: _pageSize,
                PageIndex: _pageIndex + 1
            }
        },

        submit: function (params, onSuccess) {
            $.ajax({
                type: "GET",
                dataType: "html",
                cache: false,
                data: params,
                url: Site.resolveRelativeLangUrl("News/GetMessageHistory"),
                success: function (response) {
                    $("#messageDataList").html(response);
                    onSuccess && onSuccess();
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        updatePager: function () {
            $("#messagePager").pager("update", {
                pageIndex: _pageIndex,
                totalItems: parseInt($("#TotalItem").val())
            });
        },

        toggleDate: function (isDisabled) {
            $(".date-wrapper > *").toggleClass("disabled", isDisabled);
        }
    }

    return _me;
})(jQuery)

MessageHistory.initialize();