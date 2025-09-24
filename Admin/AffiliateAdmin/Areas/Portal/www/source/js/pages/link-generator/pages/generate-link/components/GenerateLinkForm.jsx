import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col} from 'reactstrap';

import LinkInfomation from './sections/LinkInfomation';
import TrackingLinks from './sections/TrackingLinks';

const GenerateLinkForm = ({ 
    formData
}) => {
    const previousCountryCode = useRef(null);
    const previousLanguageCode = useRef(null);
    // Watch for changes in targetCountryCode or languageCode
    useEffect(() => {
        const currentCountryCode = formData?.targetCountryCode;
        const currentLanguageCode = formData?.languageCode;
        
        // Skip if no country/language values are set
        if (!currentCountryCode || !currentLanguageCode) {
            previousCountryCode.current = currentCountryCode;
            previousLanguageCode.current = currentLanguageCode;
            return;
        }

        // Check if country or language has changed
        const countryChanged = previousCountryCode.current !== null && 
                              previousCountryCode.current !== currentCountryCode;
        const languageChanged = previousLanguageCode.current !== null && 
                               previousLanguageCode.current !== currentLanguageCode;

        // Update previous values
        previousCountryCode.current = currentCountryCode;
        previousLanguageCode.current = currentLanguageCode;
    }, [formData?.targetCountryCode, formData?.languageCode, moduleComponents, sources, reloadAllModuleSources, validateAndResetInvalidSources]);

    return (
        <Container fluid className="landing-page-builder">
            <Row>
                <Col lg={9}>
                    <LinkInfomation />
                </Col>
                <Col lg={3}>
                    <TrackingLinks />
                </Col>
            </Row>
        </Container>
    );
};

function mapStateToProps({ formData }) {
    return Object.assign({}, { formData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GenerateLinkForm));
