/**
 * DatePicker Component
 * Provides utilities for initializing Pikaday date pickers with linking functionality
 */
var DatePickerComponent = (function ($) {
    'use strict';

    function formatDateUnit(value) {
        return value < 10 ? '0' + value : value;
    }

    function getDateString(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return formatDateUnit(month) + "/" + formatDateUnit(day) + "/" + year;
    }

    var _component = {
        /**
         * Format a number to have leading zero if less than 10
         * @param {number} value - The value to format
         * @returns {string} Formatted value
         */
        formatDateUnit: formatDateUnit,

        /**
         * Format a date object to MM/DD/YYYY string
         * @param {Date} date - The date to format
         * @returns {string} Formatted date string
         */
        getDateString: getDateString,

        /**
         * Initialize linked date pickers where ToDate must be >= FromDate
         * Maximum date range between FromDate and ToDate is limited to 3 months
         * @param {string} fromFieldId - ID of the from date input field
         * @param {string} fromTriggerId - ID of the from date trigger element
         * @param {string} toFieldId - ID of the to date input field
         * @param {string} toTriggerId - ID of the to date trigger element
         * @param {Object} options - Optional configuration options
         * @param {Date} options.minDate - Minimum selectable date (default: 2015-01-01)
         * @param {Date} options.maxDate - Maximum selectable date (default: today)
         * @param {Function} options.dateFormat - Custom date formatting function
         * @param {Array} options.datepickerRegistry - Array to register pickers for cleanup
         * @param {number} options.maxRangeMonths - Maximum months range between dates (default: 6)
         * @param {Function} options.onOpen - Custom callback when Date picker opens
         * @param {Function} options.onClose - Custom callback when Date picker closes
         * @param {Function} options.onDraw - Custom callback when Date picker is drawn
         * @returns {Object} Object containing fromDatePicker and toDatePicker instances
         */
        initLinkedDatePickers: function (fromFieldId, fromTriggerId, toFieldId, toTriggerId, options) {
            var defaults = {
                minDate: new Date("2015-01-01"),
                maxDate: new Date(),
                dateFormat: function (date) {
                    return getDateString(date);
                },
                datepickerRegistry: null,
                maxRangeMonths: 6, // Maximum range between fromDate and toDate is 6 months
                onOpen: null,
                onClose: null,
                onDraw: null
            };

            var settings = $.extend({}, defaults, options || {});

            // If Today hidden field exists, use it as maxDate
            if ($("#Today").length > 0) {
                settings.maxDate = new Date($("#Today").val());
            }

            /**
             * Calculate the maximum date allowed (3 months from the given date)
             * @param {Date} startDate - The starting date
             * @returns {Date} The maximum date (3 months ahead)
             */
            function getMaxDateWithRange(startDate) {
                var maxDate = new Date(startDate);
                maxDate.setMonth(maxDate.getMonth() + settings.maxRangeMonths);
                
                // Don't exceed the global maxDate
                if (maxDate > settings.maxDate) {
                    return settings.maxDate;
                }
                return maxDate;
            }

            /**
             * Calculate the minimum date allowed (3 months before the given date)
             * @param {Date} endDate - The ending date
             * @returns {Date} The minimum date (3 months back)
             */
            function getMinDateWithRange(endDate) {
                var minDate = new Date(endDate);
                minDate.setMonth(minDate.getMonth() - settings.maxRangeMonths);
                
                // Don't go below the global minDate
                if (minDate < settings.minDate) {
                    return settings.minDate;
                }
                return minDate;
            }

            var fromDatePicker = new Pikaday({
                field: document.getElementById(fromFieldId),
                trigger: document.getElementById(fromTriggerId),
                minDate: settings.minDate,
                maxDate: settings.maxDate,
                toString: settings.dateFormat,
                onSelect: function (date) {
                    // When FromDate changes, update ToDate's minDate
                    toDatePicker.setMinDate(date);
                    
                    // Set maxDate for ToDate (3 months from FromDate)
                    var maxToDate = getMaxDateWithRange(date);
                    
                    // If ToDate is now before FromDate, update ToDate to match FromDate
                    if (toDatePicker.getDate() && toDatePicker.getDate() < date) {
                        toDatePicker.setDate(date);
                    }
                    
                    // If ToDate is now beyond 3 months from FromDate, adjust ToDate
                    if (toDatePicker.getDate() && toDatePicker.getDate() > maxToDate) {
                        toDatePicker.setDate(maxToDate);
                    }
                },
                onOpen: settings.onOpen,
                onClose: settings.onClose,
                onDraw: settings.onDraw
            });

            var toDatePicker = new Pikaday({
                field: document.getElementById(toFieldId),
                trigger: document.getElementById(toTriggerId),
                minDate: settings.minDate,
                maxDate: settings.maxDate,
                toString: settings.dateFormat,
                onSelect: function (date) {
                    // Set minDate for FromDate (3 months before ToDate)
                    var minFromDate = getMinDateWithRange(date);
                    
                    // If FromDate is now after ToDate, update FromDate to match ToDate
                    if (fromDatePicker.getDate() && fromDatePicker.getDate() > date) {
                        fromDatePicker.setDate(date);
                    }
                    
                    // If FromDate is now beyond 3 months before ToDate, adjust FromDate
                    if (fromDatePicker.getDate() && fromDatePicker.getDate() < minFromDate) {
                        fromDatePicker.setDate(minFromDate);
                    }
                },
                onOpen: settings.onOpen,
                onClose: settings.onClose,
                onDraw: settings.onDraw
            });

            // Initialize the constraints based on current values if they exist
            var currentFromDate = fromDatePicker.getDate();
            
            if (currentFromDate) {
                toDatePicker.setMinDate(currentFromDate);
            }

            // Register pickers if registry is provided
            if (settings.datepickerRegistry && Array.isArray(settings.datepickerRegistry)) {
                settings.datepickerRegistry.push(fromDatePicker);
                settings.datepickerRegistry.push(toDatePicker);
            }

            return {
                fromDatePicker: fromDatePicker,
                toDatePicker: toDatePicker
            };
        }
    };

    return _component;
})(jQuery);

