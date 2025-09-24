import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Alert } from 'reactstrap';

const LinkInfomation = ({ }) => {

    return (
        <Row>
            <Col>
                <fieldset className='link-infomation'>
                    <legend><h6 className="font-weight-bold text-success">Link Infomation</h6></legend>
                </fieldset>
            </Col>
        </Row>
    );
};

function mapStateToProps({ }) {
    return Object.assign({}, { });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(LinkInfomation));
