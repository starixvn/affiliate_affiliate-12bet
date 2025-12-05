var BasePCAReport = (function ($) {
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

    function getDateString(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return formatDateUnit(month) + "/" + formatDateUnit(day) + "/" + year;
    }

    var _me = {
        initialize: function () {
            DatePickerComponent.initLinkedDatePickers('FromDate', 'fromPicker', 'ToDate', 'toPicker', {
                datepickerRegistry: UserPanel.datepicker
            });
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

        formatDecimal: function (value) {
            return format(value, 2)
        }
    };

    return _me;
})(jQuery)

BasePCAReport.initialize();