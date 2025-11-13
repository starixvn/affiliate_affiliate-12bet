var Site = (function ($) {
    var _rootUrl = null;
    var _rootLangUrl = null;
    var _language = null;
    var optionAll = "<option value=''>" + window.Lang.All + "</option>";

    var _me = {
        initialize: function () {
            _rootUrl = $("#RootUrl").val();
            _rootLangUrl = $("#RootLangUrl").val();
            _language = $("#Language").val();
        },
        resolveRelativeUrl: function (url) {
            return _rootUrl + url;
        },
        resolveRelativeLangUrl: function (url) {
            return _rootLangUrl + url;
        },
        getCurrentLanguage: function () {
            return _language;
        },
        escapeHtml: function (inputString) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(inputString));
            return div.innerHTML;
        },
        showLoader: function () {
            $("#blocker").show();
        },
        hideLoader: function () {
            $("#blocker").hide();
        },
        redirect: function (url) {
            window.location.href = url;
        },
        reload: function () {
            window.location.reload(true);
        },
        displayResult: function (isSuccess, message, selector) {
            selector = selector || "#messageResult";
            var $result = $(selector);
            $result.toggleClass("alert-success", isSuccess);
            $result.toggleClass("alert-danger", !isSuccess);
            $result.html(message);
            $result.show();

            isSuccess && window.setTimeout(() => $result.hide(), 3000);
        },
        convertDateFormat: function (dateStr) {
            const date = new Date(dateStr);

            if (isNaN(date.getTime())) {
                return '';
            }

            return getDateString(date);
        },
        getUrlParameter: function (name) {
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            let results = regex.exec(location.search);

            if (!results && location.hash) {
                results = regex.exec(location.hash);
            }

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        buildOptionList: function (dataList, value, text, hasAllOption) {
            var optionList = dataList.map(function (item) {
                return "<option value='" + item[value] + "'>" + item[text] + "</option>"
            });

            if (hasAllOption) {
                optionList.unshift(optionAll);
            }

            return optionList.join("");
        }
    };

    return _me;
})(jQuery);

Site.initialize();