var affiliatePCAReport = (function ($) {
    var _pageSize = 20;
    var _pageIndex = 0;
    var _sortingColumn = 'Month';
    var _isSortingAsc = false;
    var _sortType = 1;
    var _month = "";

    function initPager() {
        $("#playerCPAPager").removeClass("display-none");
        $("#playerCPAPager").pager({
            totalItems: parseInt($("#TotalItem").val()),
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            languageCode: Site.getCurrentLanguage(),
            onChange: function (pageIndex, pageSize) {
                _pageIndex = pageIndex;
                _pageSize = pageSize;
                var params = _me.getParams();
                _me.getPlayerCPAReport(params);
            }
        });
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

    function formatDateUnit(value) {
        return value < 10 ? '0' + value : value;
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

    function getDateString(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return formatDateUnit(month) + "/" + formatDateUnit(day) + "/" + year;
    }

    var _me = {
        initialize: function () {
            initDatePicker('FromDate', 'fromPicker');
            initDatePicker('ToDate', 'toPicker');
            _me.initEvent();
            _me.handleUrlParameters();
        },

        getUrlParameter: function (name) {
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            let results = regex.exec(location.search);

            if (!results && location.hash) {
                results = regex.exec(location.hash);
            }

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },

        convertDateFormat: function (dateStr) {
            const date = new Date(dateStr);

            if (isNaN(date.getTime())) {
                return '';
            }

            return getDateString(date);
        },

        handleUrlParameters: function () {
            const fromDate = _me.getUrlParameter('fromDate');
            const toDate = _me.getUrlParameter('toDate');
            const viewBy = _me.getUrlParameter('viewBy');

            const convertedFromDate = _me.convertDateFormat(fromDate);
            const convertedToDate = _me.convertDateFormat(toDate);

            if (!convertedFromDate || !convertedToDate) {
                alert($("<div/>").html(langResource.isInvalid).text());
                return;
            }

            $('#FromDate').val(convertedFromDate);
            $('#ToDate').val(convertedToDate);
            $('#ViewBy').val(viewBy);

            setTimeout(function () {
                _me.getFullReport(_me.getParams());
            }, 100);
        },

        initEvent: function () {
            $('#btnSubmit').on('click', function () {
                _me.hideReport();
                _me.resetParams();
                var params = _me.getParams();
                _me.getFullReport(params);
            });

            $('#monthlyDataTable').on('click', '.th', function () {
                var $this = $(this);
                _me.processSorting($this);
            });

            $('#monthlyDataTable').on('click', '.month-link', function () {
                var $this = $(this);
                _me.resetParams();
                $("#player-cpa-report").addClass("display-none");
                var monthText = $this.text();
                _month = monthText;
                var params = _me.getParams();
                _me.getPlayerCPAByMonthReport(params);
            });

            $('#playerDataTable').on('click', '.cpa-amount-link', function () {
                var $this = $(this);
                _me.resetParams();
                var cpaId = $this.data("cpa-id");

                var params = {
                    memberCPAID: cpaId
                };

                _me.getPlayerCPATurnOverReport(params);
            });

            $('#closeModal').on('click', function () {
                _me.hideDialog();
            });
        },

        getFullReport: function (params) {
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/AffiliateCPAReport"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _me.renderMonthlyReport(response.MonthlyCPAViewModel);
                    _me.renderPlayerCPAReport(response.PlayerCPAViewModel);

                    if (response.PlayerCPAViewModel.TotalRows != 0) {
                        initPager();
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

        getMonthlyReport: function (params) {
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/AffiliateCPAReport/GetMonthlyReport"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _me.renderMonthlyReport(response);
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        getPlayerCPAReport: function (params) {
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/AffiliateCPAReport/GetPlayerCPAReport"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _me.renderPlayerCPAReport(response);
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        getPlayerCPAByMonthReport: function (params) {
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/AffiliateCPAReport/GetPlayerCPAReport"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _me.renderPlayerCPAReport(response);

                    if (response.TotalRows != 0) {
                        initPager();
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

        getPlayerCPATurnOverReport: function (params) {
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/AffiliateCPAReport/GetPlayerCPATurnOverReport"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _me.renderPlayerCPATurnOverReport(response);
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        renderMonthlyReport: function (data) {
            $('#monthly-cpa-report').removeClass("display-none");
            $('#monthlyReportData').empty();
            if (data && data.MonthlyCPA.length > 0) {
                var bodyHtml = _me.buildMonthlyDataTable(data);
                $('#monthlyReportData').html(bodyHtml);
            }
            else {
                $('#monthlyReportData').html('<tr class="noInfo"><td class="text-center no-info" colspan="6">' + langResource.noInfo + '</td></tr>');
            }
        },

        renderPlayerCPAReport: function (data) {
            $('#player-cpa-report').removeClass("display-none");
            $('#playerReportData').empty();
            if (data && data.PlayerCPA.length > 0) {
                $('#TotalItem').val(data.TotalRows);
                var bodyHtml = _me.buildPlayerDataTable(data);
                $('#playerReportData').html(bodyHtml);
            }
            else {
                $('#playerReportData').html('<tr class="noInfo"><td class="text-center no-info" colspan="14">' + langResource.noInfo + '</td></tr>');
            }
        },

        buildMonthlyDataTable: function (data) {
            var htmlRowList = [];

            for (var i = 0; i < data.MonthlyCPA.length; i++) {
                var dataItem = data.MonthlyCPA[i];
                htmlRowList.push(_me.buildMonthlyRow(dataItem, i));
            }

            htmlRowList.push(_me.buildMonthlyTotalRow(data.MonthlyCPATotal));

            return htmlRowList.join("");
        },

        buildMonthlyRow: function (dataRow, index) {
            var rowIndex = parseInt(index) + 1;
            var rowItems = [];
            rowItems.push('<tr>');
            rowItems.push('<td class="text-center">' + rowIndex + '</td>');
            rowItems.push('<td class="text-center"><a href="javascript:;" class="month-link">' + dataRow.Month + '</a></td>');
            rowItems.push('<td class="text-center">' + dataRow.Quota + '</td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.CPAAmount)));
            rowItems.push(_me.buildCell(formatDecimal(dataRow.EstimatedCPAAmount)));
            rowItems.push(_me.buildCell(formatDecimal(dataRow.ApprovedCPAAmount)));
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildMonthlyTotalRow: function (total) {
            if (total) {
                return '<tr class="total">' +
                    '<td class="text-right" colspan="3">' + langResource.total + '</td>' +
                    _me.buildCell(formatDecimal(total.CPAAmount)) +
                    _me.buildCell(formatDecimal(total.EstimatedCPAAmount)) +
                    _me.buildCell(formatDecimal(total.ApprovedCPAAmount)) +
                    '</tr>';
            }

            return '';
        },

        buildPlayerDataTable: function (data) {
            var htmlRowList = [];

            for (var i = 0; i < data.PlayerCPA.length; i++) {
                var dataItem = data.PlayerCPA[i];
                htmlRowList.push(_me.buildPlayerRow(dataItem, i));
            }

            htmlRowList.push(_me.buildPlayerTotalRow(data.PlayerCPATotal));

            return htmlRowList.join("");
        },

        buildPlayerRow: function (dataRow, index) {
            var rowIndex = _pageIndex * _pageSize + parseInt(index) + 1;
            var rowItems = [];
            rowItems.push('<tr>');
            rowItems.push('<td class="text-center">' + rowIndex + '</td>');
            rowItems.push('<td>' + dataRow.CustUserName + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.RegisteredDateText + '</td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.FTD)));
            rowItems.push(_me.buildCell(formatDecimal(dataRow.TotalDeposit)));
            rowItems.push('<td class="text-center">' + dataRow.AQDText + '</td>');
            if (dataRow.IsTO) {
                rowItems.push('<td class="text-right"><a href="javascript:;" class="cpa-amount-link" data-cpa-id="' + dataRow.MemberCPAId + '">' + formatDecimal(dataRow.CPAAmount) + '</a></td>');
            } else {
                rowItems.push(_me.buildCell(formatDecimal(dataRow.CPAAmount)));
            }
            rowItems.push('<td class="text-center">' + dataRow.HoldingTickets + ' / ' + dataRow.HoldingBetTickets + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.HQDText + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.HEDText + '</td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.EstimatedCPAAmount)));
            rowItems.push(_me.buildCell(formatDecimal(dataRow.ApprovedCPAAmount)));

            if (dataRow.CPAStatus === "Rejected") {
                rowItems.push('<td class="text-center">' + dataRow.CPAStatus + '<span title="' + dataRow.Description + '" class="glyphicon glyphicon-info-sign"></span></td>');
            } else {
                rowItems.push('<td class="text-center">' + dataRow.CPAStatus + '</td>');
            }

            rowItems.push('<td class="text-center">' + dataRow.CPADateText + '</td>');
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildPlayerTotalRow: function (total) {
            if (total) {
                return '<tr class="total">' +
                    '<td class="text-right" colspan="2">' + langResource.total + '</td>' +
                    _me.buildCell(formatDecimal(total.FTD)) +
                    _me.buildCell(formatDecimal(total.TotalDeposit)) +
                    '<td></td>' +
                    _me.buildCell(formatDecimal(total.ApprovedCPAAmount)) +
                    _me.buildCell(formatDecimal(total.CPAAmount)) +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    _me.buildCell(formatDecimal(total.EstimatedCPAAmount)) +
                    _me.buildCell(formatDecimal(total.ApprovedCPAAmount)) +
                    '<td></td>' +
                    '<td></td>' +
                    '</tr>';
            }

            return '';
        },

        renderPlayerCPATurnOverReport: function (data) {
            $('#playerTurnoverReportData').empty();
            if (data && data.Groups.length > 0) {
                var bodyHtml = _me.buildPlayerCPATurnOverDataTable(data);
                $('#playerTurnoverReportData').html(bodyHtml);
            }
            else {
                $('#playerTurnoverReportData').html('<tr class="noInfo"><td class="text-center no-info" colspan="3">' + langResource.noInfo + '</td></tr>');
            }

            $('#play-cpa-turnover').removeClass("display-none");
            $('#play-cpa-turnover').modal({ backdrop: 'static', keyboard: false });
        },

        hideDialog: function () {
            $('#play-cpa-turnover').modal('hide');
        },

        buildPlayerCPATurnOverDataTable: function (data) {
            var htmlRowList = [];

            for (var i = 0; i < data.Groups.length; i++) {
                var groupItem = data.Groups[i];
                htmlRowList.push(_me.buildPlayerCPATurnOverGroupParrentRow(groupItem.Total));
                for (var j = 0; j < groupItem.Players.length; j++) {
                    var childItem = groupItem.Players[j];
                    htmlRowList.push(_me.buildPlayerCPATurnOverGroupChildRow(childItem));
                }
            }

            htmlRowList.push(_me.buildPlayerCPATurnOverTotalRow(data.Total));

            return htmlRowList.join("");
        },

        buildPlayerCPATurnOverGroupParrentRow: function (dataRow) {
            var rowItems = [];
            rowItems.push('<tr class="parent-group">');
            rowItems.push('<td class="text-left"> Group ' + dataRow.GroupProductId + '</td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.Turnover)));
            rowItems.push(_me.buildCell(formatDecimal(dataRow.CPAAmount)));
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildPlayerCPATurnOverGroupChildRow: function (dataRow) {
            var rowItems = [];
            rowItems.push('<tr class="child-group">');
            rowItems.push('<td class="text-left">' + dataRow.ProductName + '</td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.Turnover)));
            rowItems.push('<td></td>');
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildPlayerCPATurnOverTotalRow: function (total) {
            if (total) {
                return '<tr class="total">' +
                    '<td class="text-right">' + langResource.total + '</td>' +
                    _me.buildCell(formatDecimal(total.Turnover)) +
                    _me.buildCell(formatDecimal(total.CPAAmount))
                '</tr>';
            }

            return '';
        },

        buildCell: function (cellData) {
            return '<td class="text-right">' + cellData + '</td>';
        },

        getParams: function () {
            var params = {
                fromDate: $('#FromDate').val(),
                toDate: $('#ToDate').val(),
                statusId: $('#Status').val(),
                viewBy: $('#ViewBy').val(),
                pageSize: _pageSize,
                pageIndex: _pageIndex + 1,
                sortType: _sortType,
                sortDirectionType: _isSortingAsc,
                month: _month
            };

            return params;
        },

        resetParams: function () {
            _pageIndex = 0;
            _pageSize = 20;
            _month = "";
            _isSortingAsc = false;
            _sortType = 1;
        },

        processSorting: function processSorting($element) {
            var columnName = $element.closest('.th').data('name');

            if (columnName === _sortingColumn) {
                _isSortingAsc = !_isSortingAsc;
            } else {
                _isSortingAsc = true;
                _sortingColumn = columnName;
            }

            var sortingSelector = _isSortingAsc ? '.asc' : '.desc';
            var $sortIcon = $element.find(sortingSelector);
            _me.activeSortIcon($sortIcon);
            _sortType = _me.getSortType();
            var params = _me.getParams();
            _me.getMonthlyReport(params);
        },

        activeSortIcon: function activeSortIcon($element) {
            $('.th').find('.caret.current').removeClass('current');
            $element.addClass('current');
        },

        getSortType: function () {
            if (_sortingColumn === 'Month') {
                return 1;

            } else if (_sortingColumn === 'Quota') {
                return 2;

            } else if (_sortingColumn === 'CPAAmount') {
                return 3;

            } else if (_sortingColumn === 'EstimatedCPAAmount') {
                return 4;

            } else if (_sortingColumn === 'ApprovedCPAAmount') {
                return 5;

            } else {
                return 1;
            }
        },

        hideReport: function () {
            $("#player-cpa-report").addClass("display-none");
            $("#monthly-cpa-report").addClass("display-none");
            $("#playerCPAPager").addClass("display-none");
        }
    };

    return _me;
})(jQuery)

affiliatePCAReport.initialize();