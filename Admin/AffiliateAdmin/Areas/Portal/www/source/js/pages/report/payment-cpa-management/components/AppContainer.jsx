import React from 'react';
import { connect } from 'react-redux';

import AppLayout from '../../../../layouts/AppLayout';
import Loader from '../../../../components/Loader';
import Filter from './Filter';
import Content from './Content';
import AdjustCpaAmountModal from './popup/AdjustCpaAmountModal';

export const AppContainer = (props) => {
    return <AppLayout>
        <Loader show={props.isShowLoader} />
        <Filter />
        <Content />
        {props.adjustAmountModal.isOpen && <AdjustCpaAmountModal />}
    </AppLayout>;
};

const mapStateToProps = ({ isShowLoader, adjustAmountModal }) => {
    return {
        isShowLoader,
        adjustAmountModal
    };
};

export default connect(mapStateToProps)(React.memo(AppContainer));