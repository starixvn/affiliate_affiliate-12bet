var LandingPageStatistics = (function ($) {
    var _pageSize = 20;
    var _pageIndex = 0;
    var _selectedPage;
    var _selectedLanguage;

    function initPager() {
        $("#statisticsDetailPager").pager({
            totalItems: parseInt($("#TotalItem").val()),
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            languageCode: Site.getCurrentLanguage(),
            onChange: function (pageIndex, pageSize) {
                _pageIndex = pageIndex;
                _pageSize = pageSize;

                var params = _me.getDetailParam();
                _me.getDetailView(params);
            }
        });
    }

    var _me = {
        initialize: function () {
            DatePickerComponent.initLinkedDatePickers('FromDate', 'fromPicker', 'ToDate', 'toPicker', {
                datepickerRegistry: UserPanel.datepicker
            });
            _me.initEvent();
        },

        initEvent: function () {
            $('#btnStatisticsSubmit').on('click', function () {
                $('#statisticsDetailTable').html('');
                $('#statisticsDetailPager').html('').hide();

                var params = {
                    fromDate: $('#FromDate').val(),
                    toDate: $('#ToDate').val(),
                    deviceType: $('#DeviceType').val(),
                    sportCode: $('#SportCode').val(),
                    languageCode: $('#Language').val()
                };
                _me.getMainView(params);
            });

            $('#statisticsTable').on('click', '.statisticsItem', function () {
                _selectedPage = $(this).data('page');
                _selectedLanguage = $(this).data('language');
                _pageIndex = 0;
                var params = _me.getDetailParam();

                $('#statisticsDetailPager').show();
                _me.getDetailView(params, initPager);
            });
        },

        getMainView: function (params) {
            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/LandingPageStatistics"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    $("#statisticsTable").html(response);
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        getDetailView: function (params, onSuccess) {
            if (!params.sportCode || !params.languageCode) {
                return;
            }

            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/Statistics/StatisticsDetailBySite"),
                contentType: "application/json; charset=UTF-8",

                success: function (response) {
                    $("#statisticsDetailTable").html(response);
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

        getDetailParam: function () {
            return {
                sportCode: _selectedPage,
                languageCode: _selectedLanguage,
                fromDate: $('#FromDate').val(),
                toDate: $('#ToDate').val(),
                deviceType: $('#DeviceType').val(),
                pageSize: _pageSize,
                pageIndex: _pageIndex + 1
            };
        }
    };

    return _me;
})(jQuery)

LandingPageStatistics.initialize();