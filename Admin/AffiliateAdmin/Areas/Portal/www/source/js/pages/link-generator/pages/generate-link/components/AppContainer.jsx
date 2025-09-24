import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';

import AppLayout from '@/layouts/AppLayout';
import Loader from '@/components/Loader';
import GenerateLinkForm from './GenerateLinkForm';

const AppContainer = (props) => {
    const { isShowLoader } = props;

    return (
        <AppLayout>
            <Loader show={isShowLoader} />
            <GenerateLinkForm />
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="link-generator-toast-container"
            />
        </AppLayout>
    );
};

function mapStateToProps({ isShowLoader }) {
    return Object.assign({}, { isShowLoader });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));