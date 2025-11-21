var PlayerPCAReport = (function ($) {
    var _pageSize = 20;
    var _pageIndex = 0;
    var _totalItem = 0;
    var _isSubmited = false;
    var _sortingColumn = 'Month';
    var _isSortingAsc = false;
    var _sortType = 1;
    var _month = "";
    var _fromDate = '';
    var _toDate = '';
    var _viewBy = '';
    var _groupId = 0;

    function initStatusSelector() {
        statusSelector = $('#Status').multipleSelector();
    }

    function getStatusClass(status) {
        return `status-${status.toLowerCase().replace(/ /g, '-')}`;
    }

    function initPager() {
        $("#playerCPAPager").pager({
            totalItems: _totalItem,
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            languageCode: Site.getCurrentLanguage(),
            onChange: function (pageIndex, pageSize) {
                var isChangePageSize = _pageSize !== pageSize;
                _pageIndex = pageIndex;
                _pageSize = pageSize;

                if (isChangePageSize) {
                    _me.getPlayerCPAReport(initPager);
                } else {
                    _me.getPlayerCPAReport();
                }
            }
        });
    }

    var _me = {
        initialize: function () {
            initPager();
            initStatusSelector();
            _me.togglePager();
            _me.toggleTable();
            _me.initEvent();
            _me.handleUrlParameters();
        },

        handleUrlParameters: function () {
            _fromDate = BasePCAReport.getUrlParameter('fromDate');
            _toDate = BasePCAReport.getUrlParameter('toDate');
            _viewBy = BasePCAReport.getUrlParameter('viewBy');
            _groupId = BasePCAReport.getUrlParameter('groupId');

            if (!_fromDate || !_toDate) return;

            const convertedFromDate = BasePCAReport.convertDateFormat(_fromDate);
            const convertedToDate = BasePCAReport.convertDateFormat(_toDate);

            if (!convertedFromDate || !convertedToDate) {
                alert($("<div/>").html(langResource.isInvalid).text());
                return;
            }

            $('#FromDate').val(convertedFromDate);
            $('#ToDate').val(convertedToDate);
            $('#ViewBy').val(_viewBy);

            setTimeout(function () {
                _me.getPlayerCPAReport();
            }, 100);
        },

        initEvent: function () {
            $('#btnSubmit').on('click', function () {
                _me.getPlayerCPAReport(initPager);
            });

            $('#playerCPAReportTable').on('click', '.cpa-amount-link', function () {
                var cpaId = $(this).data("cpa-id");

                var params = {
                    memberCPAID: cpaId
                };

                _me.getPlayerCPATurnOverReport(params);
            });

            $('#closeModal').on('click', function () {
                _me.hideDialog();
            });
        },

        togglePager: function () {
            $("#playerCPAPager").toggle(_totalItem !== 0);
        },

        toggleTable: function () {
            $('#playerCPAReportTable').toggle(_isSubmited);
        },

        getPlayerCPAReport: function (callback) {
            var params = _me.getParams()
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/PlayerCPAReport/GetPlayerCPAReport"),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _isSubmited = true;
                    if (response) {
                        _totalItem = response.TotalItem;
                        _me.toggleTable();
                        _me.renderPlayerCPAReport(response);
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

        getPlayerCPATurnOverReport: function (params) {
            $.ajax({
                type: "POST",
                dataType: "json",
                cache: false,
                data: JSON.stringify(params),
                url: Site.resolveRelativeLangUrl("UserPanel/PlayerCPAReport/GetPlayerCPATurnOverReport"),
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

        renderPlayerCPAReport: function (data) {
            if (data && data.MainDataList.length) {
                var bodyHtml = _me.buildplayerCPAReportTable(data);

                $('#playerCPAReportTbody').html(bodyHtml);
            }
            else {
                $('#playerCPAReportTbody').html('<tr class="noInfo"><td class="text-center no-info" colspan="16">' + langResource.noInfo + '</td></tr>');
            }
        },

        buildplayerCPAReportTable: function (data) {
            var htmlRowList = [];

            for (var i = 0; i < data.MainDataList.length; i++) {
                var dataItem = data.MainDataList[i];
                htmlRowList.push(_me.buildPlayerRow(dataItem));
            }

            htmlRowList.push(_me.buildPlayerTotalRow(data.Total));

            return htmlRowList.join("");
        },

        buildPlayerRow: function (dataRow) {
            var statusClass = getStatusClass(dataRow.CPAStatus);

            var rowItems = [];
            rowItems.push('<tr>');
            rowItems.push('<td class="text-center">' + dataRow.RowNum + '</td>');
            rowItems.push('<td>' + dataRow.Player + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayRegisteredDate + '</td>');
            rowItems.push(_me.buildCell(dataRow.IsFTD ? BasePCAReport.formatDecimal(dataRow.FTD) : '-'));
            rowItems.push(_me.buildCell(dataRow.IsTotalDeposit ? BasePCAReport.formatDecimal(dataRow.TotalDeposit) : '-'));
            rowItems.push('<td class="text-center">' + dataRow.DisplayActiveQualifiedDate + '</td>');
            if (dataRow.IsTO) {
                rowItems.push('<td class="text-right"><a href="javascript:;" class="cpa-amount-link" data-cpa-id="' + dataRow.MemberCPA_ID + '">' + BasePCAReport.formatDecimal(dataRow.CPAAmount) + '</a></td>');
            } else {
                rowItems.push(_me.buildCell(BasePCAReport.formatDecimal(dataRow.CPAAmount)));
            }
            rowItems.push('<td class="text-center">' + dataRow.DisplayBetTicket + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayHoldingQualifiedDate + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayHoldingExpiredDate + '</td>');
            rowItems.push(_me.buildCell(BasePCAReport.formatDecimal(dataRow.EstimatedCPAAmount)));
            rowItems.push('<td class="text-center">' + dataRow.DisplayFirstDepositDate + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.RecheckDays + '</td>');
            rowItems.push('<td class="text-center">' + dataRow.DisplayExpiredRedepositDate + '</td>');
            rowItems.push('<td class="text-center">' + (dataRow.IsRedeposit !== undefined ? (dataRow.IsRedeposit ? langResource.yes : langResource.no) : '-') + '</td>');

            if (dataRow.IsAbnormal) {
                rowItems.push('<td class="text-center ' + statusClass + '">' + dataRow.CPAStatusString + '<span title="' + dataRow.Description + '" class="glyphicon glyphicon-info-sign"></span></td>');
            } else {
                rowItems.push('<td class="text-center ' + statusClass + '">' + dataRow.CPAStatusString + '</td>');
            }
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildPlayerTotalRow: function (total) {
            if (total) {
                return '<tr class="total">' +
                    '<td class="text-right" colspan="2">' + langResource.totalAllPages + '</td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    _me.buildCell(BasePCAReport.formatDecimal(total.CPAAmount)) +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    _me.buildCell(BasePCAReport.formatDecimal(total.EstimatedCPAAmount)) +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '</tr>';
            }

            return '';
        },

        renderPlayerCPATurnOverReport: function (data) {
            $('#playerCAPTurnoverTbody').empty();
            if (data && data.Groups.length > 0) {
                var bodyHtml = _me.buildPlayerCPATurnOverDataTable(data);
                $('#playerCAPTurnoverTbody').html(bodyHtml);
            }
            else {
                $('#playerCAPTurnoverTbody').html('<tr class="noInfo"><td class="text-center no-info" colspan="3">' + langResource.noInfo + '</td></tr>');
            }

            $('#playerCPATurnover').removeClass("display-none");
            $('#playerCPATurnover').modal({ backdrop: 'static', keyboard: false });
        },

        hideDialog: function () {
            $('#playerCPATurnover').modal('hide');
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
            rowItems.push('<td class="text-left">' + langResource.group.replace('{0}', dataRow.GroupProductId) + '</td>');
            rowItems.push(_me.buildCell(BasePCAReport.formatDecimal(dataRow.Turnover)));
            rowItems.push(_me.buildCell(BasePCAReport.formatDecimal(dataRow.CPAAmount)));
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildPlayerCPATurnOverGroupChildRow: function (dataRow) {
            var rowItems = [];
            rowItems.push('<tr class="child-group">');
            rowItems.push('<td class="text-left">' + dataRow.ProductName + '</td>');
            rowItems.push(_me.buildCell(BasePCAReport.formatDecimal(dataRow.Turnover)));
            rowItems.push('<td></td>');
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildPlayerCPATurnOverTotalRow: function (total) {
            if (total) {
                return '<tr class="total">' +
                    '<td class="text-right">' + langResource.total + '</td>' +
                    _me.buildCell(BasePCAReport.formatDecimal(total.Turnover)) +
                    _me.buildCell(BasePCAReport.formatDecimal(total.CPAAmount))
                '</tr>';
            }

            return '';
        },

        buildCell: function (cellData) {
            return '<td class="text-right">' + cellData + '</td>';
        },

        getParams: function () {
            var fromDate = $('#FromDate').val();
            var toDate = $('#ToDate').val();
            var viewBy = $('#ViewBy').val();

            var isResetGroupId = fromDate !== _fromDate || toDate !== _toDate || viewBy !== _viewBy;
            _groupId = isResetGroupId ? 0 : _groupId;

            var params = {
                player: $('#Player').val().trim(),
                fromDate: fromDate,
                toDate: toDate,
                status: statusSelector.getSelectedValues(),
                viewBy: viewBy,
                groupId: _groupId,
                pageSize: _pageSize,
                pageIndex: _pageIndex + 1,
                sortType: _sortType,
                sortDirectionType: _isSortingAsc,
                month: _month
            };

            return params;
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
        }
    };

    return _me;
})(jQuery)

PlayerPCAReport.initialize();