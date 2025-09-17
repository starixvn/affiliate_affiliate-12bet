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
            url: "UserPanel/Main/#AffiliateCPAReport",
            getParams: getDateRangeParams
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

    function getDefaultParams(clickedDate) {
        return {
            monthDate: clickedDate,
            requestPage: _currentPage,
            baseCurrency: $("#base-currency").val(),
            isOnlyContent: false
        };
    }

    function getDateRangeParams(clickedDate) {
        let date = new Date(clickedDate);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
            fromDate: _me.formatDate(firstDay),
            toDate: _me.formatDate(lastDay),
            viewBy: 3
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

                if (mapping) {
                    let url = mapping.url;
                    let params = mapping.getParams(clickedDate);

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