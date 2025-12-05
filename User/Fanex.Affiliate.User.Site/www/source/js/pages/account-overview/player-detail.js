var PlayersDetails = (function ($) {
    var _pageSize = 20;
    var _pageIndex = 0;
    var _sortingColumn = 'Turnover';
    var _sortById = 5;
    var _isSortingAsc = false;
    const SortByIdList = {
        Username: 1,
        RegisteredDate: 2,
        Deposit: 3,
        Withdrawal: 4,
        Turnover: 5,
        GGR: 6,
        Bonus: 7,
        Rebate: 8,
        DepositFee: 9,
        WithdrawalFee: 10,
        FdmDate: 11,
        FdmAmt: 12,
    };

    function initPager() {
        $("#player-detail-pager").pager({
            totalItems: parseInt($("#TotalItem").val()),
            pageSize: _pageSize,
            pageIndex: _pageIndex,
            languageCode: Site.getCurrentLanguage(),
            onChange: function (pageIndex, pageSize) {
                _pageIndex = pageIndex;
                _pageSize = pageSize;

                var params = _me.getPlayersDetailsParam();
                _me.renderPlayersDetails(params);
            }
        });
    }

    var _me = {
        initialize: function () {
            initPager();
            _me.initEvent();
            _me.activeSortIcon($('#defaultSorting'));
            _me.togglePager();
        },

        initEvent: function () {
            $('#player-detail-table').on('click', '.th', function () {
                var $this = $(this);
                _me.processSorting($this);
            });
        },

        togglePager: function () {
            var totalItem = parseInt($("#TotalItem").val());
            $("#player-detail-pager").toggle(totalItem !== 0);
        },

        getPlayersDetailsParam: function () {
            const accountOverviewParams = Summary.getAccountOverviewParams();
            accountOverviewParams.PageSize = _pageSize;
            accountOverviewParams.PageIndex = _pageIndex + 1;
            accountOverviewParams.SortById = _sortById;
            accountOverviewParams.IsSortAsc = _isSortingAsc;

            return accountOverviewParams;
        },

        renderPlayersDetails: function (params) {
            $.ajax({
                type: "POST",
                dataType: "html",
                cache: false,
                data: JSON.stringify(params),
                contentType: "application/json; charset=UTF-8",
                url: Site.resolveRelativeLangUrl("UserPanel/Summary/PlayersDetailsContent"),
                success: function (response) {
                    $("#player-detail-content").html(response);
                    $("#player-detail-content").addClass($("#HasScroll").val());
                    _me.togglePager();
                },
                beforeSend: function () {
                    Site.showLoader();
                },
                complete: function () {
                    Site.hideLoader();
                }
            });
        },

        processSorting: function ($element) {
            var columnName = $element.closest('.th').data('name');

            if (columnName === _sortingColumn) {
                _isSortingAsc = !_isSortingAsc;
            } else {
                _isSortingAsc = false;
                _sortingColumn = columnName;
            }

            _sortById = SortByIdList[columnName];
            var sortingSelector = _isSortingAsc ? '.asc' : '.desc';
            var $sortIcon = $element.find(sortingSelector);
            _me.activeSortIcon($sortIcon);

            var params = _me.getPlayersDetailsParam();
            _me.renderPlayersDetails(params);
        },
        activeSortIcon: function ($element) {
            $('.th').find('.caret.current').removeClass('current');
            $element.addClass('current');
        }
    };

    return _me;
})(jQuery);

PlayersDetails.initialize();