var redepositCPAReport = (function ($) {
    var _reportData = null;
    var _pageSize = 20;
    var _pageIndex = 0;
    var _totalItem = 0;
    var _isSubmited = false;

    function initPager() {
        $("#redeposit-CPA-report-pager").pager({
            totalItems: _totalItem,
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            onChange: function (pageIndex, pageSize) {
                var isChangePageSize = _pageSize !== pageSize;
                _pageIndex = pageIndex;
                _pageSize = pageSize;

                if (isChangePageSize) {
                    _me.submit(initPager);
                } else {
                    _me.submit();
                }
            }
        });
    }

    function formatDateUnit(value) {
        return value < 10 ? '0' + value : value;
    }

    function initDatePicker(id, triggerId) {
        UserPanel.datepicker.push(new Pikaday({
            field: document.getElementById(id),
            trigger: document.getElementById(triggerId),
            yearRange: [2015, new Date().getFullYear()],
            toString: function (date, format) {
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                return formatDateUnit(month) + "/" + formatDateUnit(day) + "/" + year;
            }
        }));
    }

    function formatDecimal(value) {
        return format(value, 2)
    }

    function format(value, digits) {
        if (typeof value !== "number" || isNaN(value)) {
            return "";
        }

        var roundedValue = round(value, digits);

        return roundedValue.toFixed(digits).replace(/(\d)(?=(\d{3})+(\.|$))/g, "$1,");
    }

    function round(value, digits) {
        var sign = value < 0 ? -1 : 1;
        var absoluteValue = Math.abs(value);
        var rounded = Number(Math.round(absoluteValue + 'e' + digits) + 'e-' + digits);

        return sign * rounded;
    }

    function getStatusClass(statusId) {
        switch (statusId) {
            case 1: return 'status-monitoring'; // Monitoring
            case 2: return 'status-not-qualified'; // Not qualified
            case 3: return 'status-qualified';  // Qualified
            default: return '';
        }
    }

    var _me = {
        initialize: function () {
            initDatePicker('FromDate', 'fromPicker');
            initDatePicker('ToDate', 'toPicker');
            initPager();
            _me.togglePager();
            _me.toggleTable();
            _me.initEvent();
        },

        initEvent: function () {
            $('#btnSubmit').click(function (e) {
                e.preventDefault();
                _me.submit(initPager());
            });

            $('#data-table').toggle(false);
        },

        submit: function (callback) {
            var params = {
                fromDate: $('#FromDate').val(),
                toDate: $('#ToDate').val(),
                pageSize: _pageSize,
                pageIndex: _pageIndex + 1
            };

            $.ajax({
                type: "POST",
                url: Site.resolveRelativeLangUrl("UserPanel/RedepositCPAReport"),
                data: JSON.stringify(params),
                dataType: "json",
                cache: false,
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _reportData = response;
                    _isSubmited = true;
                    if (_reportData) {
                        _totalItem = _reportData.RowNumber;
                        _me.toggleTable();
                        _me.renderData();
                        _me.togglePager();
                        callback && callback();
                    }
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        togglePager: function () {
            $("#redeposit-CPA-report-pager").toggle(_totalItem !== 0);
        },

        toggleTable: function () {
            $('#data-table').toggle(_isSubmited);
        },

        renderData: function () {
            if (_reportData.Data && _reportData.Data.length) {
                var bodyHtml = _me.buildDataTable();
                $('#report-data').html(bodyHtml);
            }
            else {
                $('#report-data').html('<tr class="noInfo"><td class="text-center no-info" colspan=10>' + langResource.noInfo + '</td></tr>');
            }
        },

        buildDataTable: function () {
            var mainData = _reportData.Data;
            var htmlRowList = [];

            for (var i = 0; i < mainData.length; i++) {
                var groupData = mainData[i];
                for (var j = 0; j < groupData.length; j++) {
                    var dataRow = groupData[j];
                    htmlRowList.push(_me.buildRow(dataRow, j, groupData.length));
                }
            }

            htmlRowList.push(_me.buildTotalRow());

            return htmlRowList.join("");
        },

        buildRow: function (dataRow, index, length) {
            var isFirstRow = index == 0;
            var className = getStatusClass(dataRow.StatusId);
            var rowItems = [];
            rowItems.push('<tr>');
            rowItems.push('<td class="text-center">' + dataRow.RowIdx + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayStartFrom + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayApprovalDate + '</td>');
            if (isFirstRow) rowItems.push('<td class="text-center" rowspan=' + length + '>' + dataRow.RecheckDays + ' ' + langResource.days + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayExpiredRedepositDate + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.ApprovedCPAPlayer + '</td>');
            if (isFirstRow) rowItems.push('<td class="text-center" rowspan=' + length + '>' + dataRow.RedepositRate + ' %' + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.NoOfPlayerRedeposit + '</td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.TotalSettledCPAAmount)));
            rowItems.push('<td class="text-center ' + className + '">' + dataRow.Status + '</td>');
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildTotalRow: function () {
            var dataRow = _reportData.Total;
            if (dataRow) {
                return '<tr class="total">' +
                    '<td class="text-right" colspan="5">' + langResource.totalAllPages + '</td>' +
                    '<td class="text-center">' + dataRow.ApprovedCPAPlayer + '</td>' +
                    _me.buildCell('') +
                    _me.buildCell('') +
                    _me.buildCell(formatDecimal(dataRow.TotalSettledCPAAmount)) +
                    _me.buildCell('') +
                    '</tr>';
            }

            return '';
        },

        buildCell: function (cellData) {
            return '<td class="text-right">' + cellData + '</td>';
        },
    }
    return _me;
})(jQuery);

redepositCPAReport.initialize();