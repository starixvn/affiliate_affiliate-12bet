var commissionReport = (function ($) {
    var _reportData = null;
    var _sortingColumn = 'Month';
    var _isSortingAsc = false;
    var _currentBaseCurrency = 0;
    const _currentPage = "RevenueReport";
    var _isSubmited = false;

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

    var _me = {
        initialize: function () {
            _me.initEvent();
            _me.toggleTable();
        },

        initEvent: function () {
            $('#dataTable').on('click', '.th', function () {
                var $this = $(this);
                _me.processSorting($this);
            });

            $('#btnSubmit').click(function (e) {
                e.preventDefault();
                _me.submit();
            });

            $('#dataTable').on('click', '.toggleDetailRow', function () {
                var $this = $(this);
                var isExpanding = $this.hasClass('bottom');

                $this.toggleClass('bottom', !isExpanding);
                $this.toggleClass('left', isExpanding);

                $this.closest('.sumrow').toggleClass('active', !isExpanding)
                    .nextUntil('.sumrow').toggleClass('expanded', !isExpanding);
                $('.sumrow.active').nextUntil('.sumrow').addClass('expanded');
                $('.total.expanded').removeClass('expanded');
            });

            $('#dataTable').on('click', '.amountItem', function () {
                let url = "UserPanel/Main/#SubAffEarning";
                let params = {
                    monthDate: $(this).data("date"),
                    requestPage: _currentPage,
                    baseCurrency: _currentBaseCurrency
                };

                Site.redirect(Site.resolveRelativeLangUrl(`${url}?${$.param(params)}`));
            })


        },

        toggleTable: function () {
            $('#dataTable').toggle(_isSubmited);
        },

        submit: function () {
            _currentBaseCurrency = $("#base-currency").val();
            var param = {
                year: $("#year").val(),
                baseCurrency: _currentBaseCurrency
            };
            $.ajax({
                type: "POST",
                url: Site.resolveRelativeLangUrl("UserPanel/RevenueReport"),
                data: JSON.stringify(param),
                dataType: "json",
                cache: false,
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    _reportData = response;
                    _isSubmited = true;
                    if (_reportData) {
                        _me.toggleTable();
                        _me.renderData();
                        _me.activeSortIcon($('#defaultSorting'));
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

        renderData: function () {
            if (_reportData.Data && _reportData.Data.length) {
                var bodyHtml = _me.buildDataTable();
                $('#reportData').html(bodyHtml);
                $('.sumrow.active').nextUntil('.sumrow').addClass('expanded');
            }
            else {
                $('#reportData').html('<tr class="noInfo"><td class="text-center no-info" colspan=' + (langResource.isMaxLevel ? "14" : "16") + '>' + langResource.noInfo + '</td></tr>');
            }
        },

        buildDataTable: function () {
            var mainData = _reportData.Data;
            var htmlRowList = [];

            for (var i = 0; i < mainData.length; i++) {
                var dataItem = mainData[i];
                var summaryDataRow = dataItem.Data;
                htmlRowList.push(_me.buildRow(summaryDataRow, true, i, dataItem.DiplayMonth));

                var detailRowList = dataItem.ProductData;
                for (var productRow of detailRowList) {
                    htmlRowList.push(_me.buildRow(productRow, false));
                }
            }

            htmlRowList.push(_me.buildTotalRow());

            return htmlRowList.join("");
        },

        buildRow: function (dataRow, isSummaryRow, index, title) {
            var isFirstSumRow = index === 0;
            var activeClass = isFirstSumRow ? ' active' : '';
            var toggleIconClass = isFirstSumRow ? 'bottom' : 'left';
            var className = isSummaryRow ? ' class="sumrow' + activeClass + '"' : '';
            var length = langResource.isMaxLevel ? 11 : 12;

            var date = dataRow.MonthDate;

            var iconHtml = '<span class="chevron toggleDetailRow ' + toggleIconClass + '" aria-hidden="true"></span>';
            var rowItems = [];
            rowItems.push('<tr' + className + '>');
            rowItems.push('<td class="text-center">' + (isSummaryRow ? index + 1 : '') + '</td>');
            rowItems.push('<td class="title-cell"><div class="row-wrapper">' + (isSummaryRow ? title + iconHtml : dataRow.ProductName) + '</div></td>');
            rowItems.push(_me.buildCell(formatDecimal(dataRow.TurnOver)));
            rowItems.push(_me.buildCell(formatDecimal(dataRow.GGR)));
            if (isSummaryRow) {
                var commRate = dataRow.CommissionRate + '%';
                var subCommRate = dataRow.SubCommRate + '%';
                var commRateCell = dataRow.IsMultiGroupProduct ? '<td class="text-right text-danger" title="' + langResource.theHighestShare + '">' + commRate + '</td>' : _me.buildCell(commRate);

                rowItems.push(_me.buildCell(formatDecimal(dataRow.PlatformFee)));
                rowItems.push(_me.buildCell(formatDecimal(dataRow.DepositFee)));
                rowItems.push(_me.buildCell(formatDecimal(dataRow.WithdrawalFee)));
                rowItems.push(_me.buildCell(formatDecimal(dataRow.Bonus)));
                rowItems.push(_me.buildCell(formatDecimal(dataRow.Rebate)));
                rowItems.push(commRateCell);
                rowItems.push(_me.buildCell(formatDecimal(dataRow.Commission)));
                rowItems.push(_me.buildCell(dataRow.EarningByDisplay));
                rowItems.push(_me.buildCell(formatDecimal(dataRow.P2pCommission)));
                !langResource.isMaxLevel && rowItems.push('<td class="text-right">' + subCommRate + '</td>');
                !langResource.isMaxLevel && rowItems.push(_me.buildSubAffCell(formatDecimal(dataRow.SubAffCommission), date));
                rowItems.push(_me.buildCell(formatDecimal(dataRow.TotalCommission)))
            } else {
                for (var i = 0; i < length; i++) {
                    rowItems.push(_me.buildCell(""));
                }
            }
            rowItems.push('</tr>');

            return rowItems.join("");
        },

        buildTotalRow: function () {
            var dataRow = _reportData.Total;
            if (dataRow) {
                return '<tr class="total">' +
                    '<td class="text-right" colspan="2">' + langResource.total + '</td>' +
                    _me.buildCell(formatDecimal(dataRow.TurnOver)) +
                    _me.buildCell(formatDecimal(dataRow.GGR)) +
                    _me.buildCell(formatDecimal(dataRow.PlatformFee)) +
                    _me.buildCell(formatDecimal(dataRow.DepositFee)) +
                    _me.buildCell(formatDecimal(dataRow.WithdrawalFee)) +
                    _me.buildCell(formatDecimal(dataRow.Bonus)) +
                    _me.buildCell(formatDecimal(dataRow.Rebate)) +
                    _me.buildCell('') +
                    _me.buildCell(formatDecimal(dataRow.Commission)) +
                    _me.buildCell('') +
                    _me.buildCell(formatDecimal(dataRow.P2pCommission)) +
                    (langResource.isMaxLevel ? '' : _me.buildCell('')) +
                    (langResource.isMaxLevel ? '' : _me.buildCell(formatDecimal(dataRow.SubAffCommission))) +
                    _me.buildCell(formatDecimal(dataRow.TotalCommission)) +
                    '</tr>';
            }

            return '';
        },

        buildCell: function (cellData) {
            return '<td class="text-right">' + cellData + '</td>';
        },

        buildSubAffCell: function (cellData, date) {
            return `<td class="text-right"><a data-date=${date} href='javascript:;' class='amountItem'> ${cellData}</a></td>`;
        },

        processSorting: function ($element) {
            var columnName = $element.closest('.th').data('name');
            if (_reportData && _reportData.Data && _reportData.Data.length) {
                if (columnName === _sortingColumn) {
                    _isSortingAsc = !_isSortingAsc;
                } else {
                    _isSortingAsc = true;
                    _sortingColumn = columnName;
                }

                var sortingSelector = _isSortingAsc ? '.asc' : '.desc';
                var $sortIcon = $element.find(sortingSelector);
                _me.activeSortIcon($sortIcon);
                _me.sort();
                _me.renderData();
            }
        },

        activeSortIcon: function ($element) {
            $('.th').find('.caret.current').removeClass('current');
            $element.addClass('current');
        },

        sort: function () {
            var mainDataList = _reportData.Data;
            mainDataList.sort(function (item, nextItem) {
                if (_sortingColumn === 'Month') {
                    return _isSortingAsc ? item.Month - nextItem.Month : -(item.Month - nextItem.Month);
                } else if (_sortingColumn === 'EarningBy') {
                    let sortedEarningBy = 0;
                    const earningByCurrent = item.Data['EarningByDisplay'].toLowerCase();
                    const earningByNext = nextItem.Data['EarningByDisplay'].toLowerCase();

                    if (earningByCurrent < earningByNext) {
                        sortedEarningBy = -1;
                    } else if (earningByCurrent > earningByNext) {
                        sortedEarningBy = 1;
                    }

                    return _isSortingAsc ? sortedEarningBy : -sortedEarningBy;
                } else {
                    return _isSortingAsc ?
                        item.Data[_sortingColumn] - nextItem.Data[_sortingColumn] :
                        -(item.Data[_sortingColumn] - nextItem.Data[_sortingColumn]);
                }
            });
        }
    }
    return _me;
})(jQuery);

commissionReport.initialize();