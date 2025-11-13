(function ($) {
    var _languageCode;
    var pagingInfoText = {
        'en-US': 'Page {0} of {1}',
        'id-ID': 'Halaman {0} dari {1}',
        'zh-CN': '从 {0} 页到 {1} 页',
        'zh-TW': '從 {0} 頁到 {1} 頁',
        'th-TH': 'หน้า {0} จาก {1}',
        'vi-VN': 'Trang {0} của {1}',
        'ko-KR': '페이지 {0} 중 {1}'
    }

    var DEFAULT_PAGESIZE_LIST = [10, 20, 50, 100, 200];
    var defaultOption = {
        pageIndex: 0,
        pageSize: 20,
        totalItems: 0,
        pageSizeList: DEFAULT_PAGESIZE_LIST,
        languageCode: 'en-US',
        onChange: function (pageIndex, pageSize) { },
        onClickPrev: function () { },
        onClickLastPrev: function () { },
        onClickNext: function () { },
        onClickLastNext: function () { },
        onChangePageSize: function () { },
    };

    function getPagingInfoText(pageIndex, totalPage) {
        return (pagingInfoText[_languageCode] || pagingInfoText['en-US']).replace('{0}', pageIndex).replace('{1}', (totalPage || 1));
    }

    function buildPrevButton() {
        var html = ['<a href="javascript:;" title="First" class="icon glyphicon glyphicon-fast-backward page-first disable"></a>'];
        html.push('<a href="javascript:;" title="Prev" class="icon glyphicon glyphicon-triangle-left page-prev disable"></a>');

        return html.join('');
    }

    function buildNextButton(isDisabled) {
        var disable = isDisabled ? "disable" : "";
        var html = ['<a href="javascript:;" title="Next" class="icon glyphicon glyphicon-triangle-right page-next ' + disable + '"></a>'];
        html.push('<a href="javascript:;" title="Last" class="icon glyphicon glyphicon-fast-forward page-last ' + disable + '"></a>');

        return html.join('');
    }

    function buildPageInfo(totalPage) {
        var html = ['<div class="page-input">'];
        html.push('<span class="text-pageInfo">' + getPagingInfoText(1, totalPage) + '</span>')
        html.push('</div>');

        return html.join('');
    }

    function buildPageSizeList(pageSizeList, selectedItem) {
        var htmlPageSize = ['<select class="pagesize-select" >'];
        for (var i = 0; i < pageSizeList.length; i++) {
            var pageSize = pageSizeList[i];
            var selected = pageSize === selectedItem ? "selected" : "";
            htmlPageSize.push('<option value="' + pageSize + '" ' + selected + '>' + pageSize + '</option>');
        }
        htmlPageSize.push('</select>');

        return htmlPageSize.join('');
    }

    function updatePageInfo($pagerContainer, pageIndex, totalPage) {
        $pagerContainer.find('.text-pageInfo').text(getPagingInfoText(pageIndex, totalPage));
    }

    function togglePrevButton($pagerContainer, isEnable) {
        $pagerContainer.find('.page-first').toggleClass('disable', !isEnable);
        $pagerContainer.find('.page-prev').toggleClass('disable', !isEnable);
    }

    function toggleNextButton($pagerContainer, isEnable) {
        $pagerContainer.find('.page-next').toggleClass('disable', !isEnable);
        $pagerContainer.find('.page-last').toggleClass('disable', !isEnable);
    }

    function resetToInitialState($pagerContainer, isDisabledNextButton) {
        togglePrevButton($pagerContainer, false);
        toggleNextButton($pagerContainer, !isDisabledNextButton);
    }

    function calculateTotalPage(totalItems, pageSize) {
        return parseInt(totalItems / pageSize) + (totalItems % pageSize === 0 ? 0 : 1);
    }

    function isDisableNextButton(pageIndex, totalPage) {
        return totalPage === 0 || pageIndex === totalPage - 1;
    }

    var _methods = {
        init: function (option) {
            return this.each(function () {
                var mainOption = $.extend(defaultOption, option || {});

                var $self = $(this);
                $self.find("*").off();
                $self.html("");

                _languageCode = mainOption.languageCode;
                var totalPage = calculateTotalPage(mainOption.totalItems, mainOption.pageSize);
                var pageInfo = {
                    pageIndex: mainOption.pageIndex,
                    pageSize: mainOption.pageSize,
                    totalItems: mainOption.totalItems,
                    totalPage: totalPage
                }

                $self.data('pageInfo', pageInfo);

                var htmlPrevButton = buildPrevButton();
                var htmlPagingInfo = buildPageInfo(totalPage);

                var disableNextButton = pageInfo.totalPage === 0 || pageInfo.pageIndex === pageInfo.totalPage - 1;
                var htmlNextButton = buildNextButton(disableNextButton);
                var htmlPageSizeList = buildPageSizeList(mainOption.pageSizeList, mainOption.pageSize);

                var $pagerContainer = $('<div class="pager-container"></div>');
                $pagerContainer.append(htmlPrevButton + htmlPagingInfo + htmlNextButton + htmlPageSizeList);
                $self.append($pagerContainer);

                $pagerContainer.on('click', '.page-first', function () {
                    var pageInfo = $self.data('pageInfo');
                    if (pageInfo.pageIndex === 0) {
                        return;
                    }

                    pageInfo.pageIndex = 0;
                    updatePageInfo($pagerContainer, pageInfo.pageIndex + 1, pageInfo.totalPage);
                    var disableNextButton = isDisableNextButton(pageInfo.pageIndex, pageInfo.totalPage);
                    resetToInitialState($pagerContainer, disableNextButton);

                    $self.data('pageInfo', pageInfo);

                    mainOption.onChange(pageInfo.pageIndex, pageInfo.pageSize);
                });

                $pagerContainer.on('click', '.page-prev', function () {
                    var pageInfo = $self.data('pageInfo');
                    if (pageInfo.pageIndex === 0) {
                        return;
                    }

                    pageInfo.pageIndex--;
                    if (pageInfo.pageIndex === 0) {
                        togglePrevButton($pagerContainer, false);
                    }

                    toggleNextButton($pagerContainer, true);
                    updatePageInfo($pagerContainer, pageInfo.pageIndex + 1, pageInfo.totalPage);

                    $self.data('pageInfo', pageInfo);
                    mainOption.onChange(pageInfo.pageIndex, pageInfo.pageSize);
                });

                $pagerContainer.on('click', '.page-next', function () {
                    var pageInfo = $self.data('pageInfo');
                    if (pageInfo.pageIndex === pageInfo.totalPage - 1) {
                        return;
                    }

                    pageInfo.pageIndex++;
                    if (pageInfo.pageIndex === pageInfo.totalPage - 1) {
                        toggleNextButton($pagerContainer, false);
                    }

                    togglePrevButton($pagerContainer, true);
                    $self.data('pageInfo', pageInfo);
                    updatePageInfo($pagerContainer, pageInfo.pageIndex + 1, pageInfo.totalPage);

                    mainOption.onChange(pageInfo.pageIndex, pageInfo.pageSize);
                });

                $pagerContainer.on('click', '.page-last', function () {
                    var pageInfo = $self.data('pageInfo');
                    if (pageInfo.pageIndex === pageInfo.totalPage - 1) {
                        return;
                    }

                    pageInfo.pageIndex = pageInfo.totalPage - 1;
                    updatePageInfo($pagerContainer, pageInfo.pageIndex + 1, pageInfo.totalPage);
                    togglePrevButton($pagerContainer, true);
                    toggleNextButton($pagerContainer, false);

                    $self.data('pageInfo', pageInfo);
                    mainOption.onChange(pageInfo.pageIndex, pageInfo.pageSize);
                });

                $pagerContainer.on('change', '.pagesize-select', function () {
                    var pageInfo = $self.data('pageInfo');
                    pageInfo.pageIndex = 0;
                    pageInfo.pageSize = parseInt($(this).val());

                    var totalPage = calculateTotalPage(pageInfo.totalItems, pageInfo.pageSize);
                    pageInfo.totalPage = totalPage;

                    updatePageInfo($pagerContainer, pageInfo.pageIndex + 1, pageInfo.totalPage);
                    var disableNextButton = isDisableNextButton(pageInfo.pageIndex, pageInfo.totalPage);
                    resetToInitialState($pagerContainer, disableNextButton);

                    $self.data('pageInfo', pageInfo);
                    mainOption.onChange(pageInfo.pageIndex, pageInfo.pageSize);
                });
            });
        },

        update: function (pageInfo) {
            var $self = $(this);
            var oldPageInfo = $self.data('pageInfo');
            var newPageInfo = $.extend({}, oldPageInfo, pageInfo);
            newPageInfo.totalPage = calculateTotalPage(newPageInfo.totalItems, newPageInfo.pageSize);

            var $pagerContainer = $self.find('.pager-container');
            updatePageInfo($pagerContainer, newPageInfo.pageIndex + 1, newPageInfo.totalPage);
            var disableNextButton = isDisableNextButton(newPageInfo.pageIndex, newPageInfo.totalPage);
            resetToInitialState($pagerContainer, disableNextButton);
            $self.data('pageInfo', newPageInfo);
        }
    }

    $.fn.pager = function (methodOrOptions) {
        if (_methods[methodOrOptions]) {
            return _methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return _methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.pager');
        }
    };
})(jQuery);
var StatementHistory = (function ($) {
    const _currentPage = "StatementHistory";
    const urlMapping = {
        201: {
            url: "UserPanel/Main/#DailyEarning",
            getParams: getDefaultParams
        },
        204: {
            url: "UserPanel/Main/#SubAffEarning",
            getParams: getDefaultParams
        },
        206: {
            url: "UserPanel/Main/#PaymentCPAReport",
            getParams: getApprovedCpaEarningParams
        },
        208: {
            url: "UserPanel/Main/#PaymentCPAReport",
            getParams: getCpaAdjustmentParams
        }
    };

    let _pageSize = 20;
    let _pageIndex = 0;
    let _scrollY = 0;
    let _expandElementList = [];

    function initPager() {
        $("#statementPager").pager({
            totalItems: parseInt($("#TotalItem").val()),
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            languageCode: Site.getCurrentLanguage(),
            onChange: function (pageIndex, pageSize) {
                _pageIndex = pageIndex;
                _pageSize = pageSize;
                _expandElementList = [];

                var params = _me.getStatementHistoryParam();
                _me.renderStatementHistory(params);
            }
        });
    }

    function toggleChildrenElem(children, id) {
        if (children.hasClass("display-none")) {
            _expandElementList.push(id);
        } else {
            const index = _expandElementList.indexOf(id);
            if (index > -1) {
                _expandElementList.splice(index, 1);
            }
        }

        $(children).toggleClass("display-none");
    }

    function getDefaultParams(clickedDate, _) {
        return {
            monthDate: clickedDate,
            requestPage: _currentPage,
            baseCurrency: $("#base-currency").val(),
            isOnlyContent: false
        };
    }

    function getCpaAdjustmentParams(_, description) {
        const date = new Date(description.slice(-10));
        let adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return {
            fromDate: _me.formatDate(adjustedDate),
            toDate: _me.formatDate(adjustedDate),
            status: 0,
            viewBy: 1
        };
    }

    function getApprovedCpaEarningParams(clickedDate, _) {
        let date = new Date(clickedDate);
        let today = new Date($("#today").val());

        const itemMonth = date.getMonth();
        const itemYear = date.getFullYear();

        const toMonth = today.getMonth();
        const toYear = today.getFullYear();

        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        if (itemMonth === toMonth && itemYear === toYear) {
            lastDay = new Date(toYear, toMonth, today.getDate());
        }

        return {
            fromDate: _me.formatDate(firstDay),
            toDate: _me.formatDate(lastDay),
            status: 3,
            viewBy: 2
        };
    }

    var _me = {
        initialize: function () {
            _me.handleIfIsClickBreadcumb();
            initPager();
            _me.initEvent();
        },

        formatDate: function (date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            return year + "-" + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day);
        },

        initEvent: function () {
            $("#base-currency").change(function () {
                _expandElementList = [];
                var params = _me.getStatementHistoryParam();
                _me.renderStatementHistory(params);
            })

            $("#statementDataList").on("click", ".amountItem", function () {
                let transtype = Number($(this).data("transtype"));
                let mapping = urlMapping[transtype];
                let clickedDate = $(this).data("date");
                let description = $(this).data("description");

                if (mapping) {
                    let url = mapping.url;
                    let params = mapping.getParams(clickedDate, description);

                    _me.setStatementHistoryParamIntoStorage();
                    Site.redirect(Site.resolveRelativeLangUrl(`${url}?${$.param(params)}`));
                }
            });

            $("#statementDataList").on("click", ".btn.btn-transparent", function () {
                let id = $(this).parents("tr").data("id");
                let children = $(this).parents("tr").siblings(`tr[data-parent='${id}']`);

                toggleCollapseButton(this);
                toggleChildrenElem(children, id);
            });
        },

        getStatementHistoryParam: function () {
            return {
                baseCurrency: $("#base-currency").val(),
                pageSize: _pageSize,
                pageIndex: _pageIndex + 1
            };
        },

        handleIfIsClickBreadcumb: function () {
            const isClickBreadcumb = $("#isClickBreadcumb").val() === 'True';

            if (isClickBreadcumb) {
                let statementHistoryState = sessionStorage.getItem("statementHistoryState");
                const oldState = JSON.parse(statementHistoryState) || { pageSize: _pageSize, pageIndex: _pageIndex, scrollY: _scrollY, expandElementList: _expandElementList }

                _pageSize = oldState.pageSize;
                _pageIndex = oldState.pageIndex;
                _scrollY = oldState.scrollY;
                _expandElementList = oldState.expandElementList;

                var params = _me.getStatementHistoryParam();
                _me.renderStatementHistory(params, isClickBreadcumb);
            }
        },

        handleUpdateByOldState: function () {
            window.scroll({
                top: _scrollY,
                behavior: 'smooth',
            });

            _expandElementList.forEach(_me.handleUpdateExpandingElementByOldState);
        },

        handleUpdateExpandingElementByOldState: function (id) {
            var btnChevron = $(`[data-id="${id}"] span.chevron`)[0];

            if (!!btnChevron) {
                let childrenOfId = $(`tr[data-parent='${id}']`);
                $(childrenOfId).toggleClass("display-none");

                $(btnChevron).toggleClass("right");
                $(btnChevron).toggleClass("bottom");
            }
        },

        setStatementHistoryParamIntoStorage: function () {
            const param = {
                pageSize: _pageSize,
                pageIndex: _pageIndex,
                scrollY: window.scrollY,
                expandElementList: _expandElementList
            }
            sessionStorage.setItem("statementHistoryState", JSON.stringify(param))
        },

        renderStatementHistory: function (params, isClickBreadcumb = false) {
            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                contentType: "application/json; charset=UTF-8",
                url: Site.resolveRelativeLangUrl("UserPanel/StatementHistory"),
                success: function (response) {
                    $("#statementDataList").html(response);

                    !!isClickBreadcumb && _me.handleUpdateByOldState();
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        }
    };

    return _me;
})(jQuery);

StatementHistory.initialize();