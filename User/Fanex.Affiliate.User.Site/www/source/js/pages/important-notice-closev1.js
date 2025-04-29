const ModalCloseV1 = (function ($) {
    const _me = {
        initialize: function () {
            _me.showDialog();
            _me.initEvent();
        },

        initEvent: function () {
            $('#closeModal').on('click', function () {
                _me.hideDialog();
            });
        },

        showDialog: function () {
            const isShow = sessionStorage.getItem('showDialogCloseV1');
            if (isShow === '1') {
                $('#importantNoticeModal').modal({ backdrop: 'static', keyboard: false });
            }
        },

        hideDialog: function () {
            sessionStorage.setItem('showDialogCloseV1', '0');
            $('#importantNoticeModal').modal('hide');
        }
    };

    return _me;
})(jQuery);

ModalCloseV1.initialize();