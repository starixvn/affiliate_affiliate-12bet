import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { resolveClientUrl, formatDateTime } from '@/modules/utils';
import { headerText, globalResource } from '../libs/constants';
import { setSelectedLink, setShouldResetScrollPosition, fetchData, setPagingOption, setParam } from '../actions';
import { showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';

export const Content = (props) => {
    const { isModifyInLinkManagement } = props;
    const [alertState, setAlertState] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        const { param } = props;

        param && props.fetchData(param);
    }, [props.param]);

    const handleCopyToClipboard = useCallback(async (textToCopy, successMessage = 'Copied to clipboard successfully!') => {
        if (!textToCopy) {
            setAlertState({ 
                show: true, 
                type: 'danger', 
                message: 'No content available to copy.' 
            });
            setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 5000);
            return;
        }

        setAlertState({ show: false, type: 'success', message: '' });

        try {
            await navigator.clipboard.writeText(textToCopy);
            setAlertState({ 
                show: true, 
                type: 'success', 
                message: successMessage 
            });
            
            setTimeout(() => {
                setAlertState({ show: false, type: 'success', message: '' });
            }, 3000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setAlertState({ 
                        show: true, 
                        type: 'success', 
                        message: successMessage 
                    });
                    setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 3000);
                } else {
                    throw new Error('execCommand copy returned false');
                }
            } catch (fallbackErr) {
                setAlertState({ 
                    show: true, 
                    type: 'danger', 
                    message: 'Failed to copy to clipboard. Please copy manually.' 
                });
                setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 5000);
            }
            
            document.body.removeChild(textArea);
        }
    }, []);

    const generateQRCode = useCallback((url) => {
        // Generate QR code using a simple API or library
        // For now, we'll use a simple QR code generator API
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        return qrCodeUrl;
    }, []);

    const handleCopyQRCode = useCallback(async (affiliateMediaLink) => {
        const qrCodeUrl = generateQRCode(affiliateMediaLink);
        await handleCopyToClipboard(qrCodeUrl, 'QR Code URL copied to clipboard successfully!');
    }, [generateQRCode, handleCopyToClipboard]);

    const handleDownloadQRCode = useCallback((affiliateMediaLink, linkName) => {
        const qrCodeUrl = generateQRCode(affiliateMediaLink);
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `QR_Code_${linkName || 'Link'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setAlertState({ 
            show: true, 
            type: 'success', 
            message: 'QR Code download started!' 
        });
        setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 3000);
    }, [generateQRCode]);
    
    const _handlePaging = (pageIndex, pageSize) => {
        const newPaging = {
            PageIndex: pageIndex,
            PageSize: pageSize
        };
        const newParam = Object.assign({}, props.param, newPaging);

        props.setPagingOption(newPaging);
        props.setParam(newParam);
    };

    function _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={10} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={50} title={headerText.LinkName}>{headerText.LinkName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.AffiliateMediaLink}>{headerText.AffiliateMediaLink}</Cell>
                <Cell header={true} colWidth={30} title={headerText.CreatedTime}>{headerText.CreatedTime}</Cell>
                <Cell header={true} colWidth={30} title={headerText.CreatedBy}>{headerText.CreatedBy}</Cell>
                <Cell header={true} colWidth={30} title={headerText.Action}>{headerText.Action}</Cell>
            </Row>
        );
    }

    function _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(_buildDataRow(dataItem, i + 1));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="6">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const linkName = dataItem.LinkName;
        const affiliateMediaLink = dataItem.AffiliateMediaLink;
        const createdDate = formatDateTime(dataItem.CreatedDate, 'MM/dd/yyyy HH:mm:ss');
        const createdBy = dataItem.CreatedBy || '';

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-left" title={linkName}>
                    {linkName}
                </Cell>
                <Cell className="text-left" title={affiliateMediaLink}>{affiliateMediaLink}</Cell>
                <Cell className="text-center" title={createdDate}>{createdDate}</Cell>
                <Cell className="text-center" title={createdBy}>{createdBy}</Cell>
                <Cell className="text-center">
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleCopyToClipboard(affiliateMediaLink, 'Link copied to clipboard successfully!');
                        }}
                        title="Copy Link"
                        className="text-decoration-none"
                    >
                        <span className="oi oi-clipboard text-secondary"></span>
                    </a>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleCopyQRCode(affiliateMediaLink);
                        }}
                        title="Copy QR Code"
                        className="text-decoration-none ml-2"
                    >
                        <span className="oi oi-code text-secondary"></span>
                    </a>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleDownloadQRCode(affiliateMediaLink, linkName);
                        }}
                        title="Download QR Code"
                        className="text-decoration-none ml-2"
                    >
                        <span className="oi oi-data-transfer-download text-secondary"></span>
                    </a>
                    <a className='ml-2' href={resolveClientUrl(`Portal/LinkManagement?linkId=${dataItem.LinkId}&isClone=true`)} target="_top" title="Duplicate Link">
                        <span className="oi oi-layers text-secondary"></span>
                    </a>
                </Cell>
            </Row>
        )
    }

    return props.gridData && (
        <div className="data-content link-management">
            {alertState.show && (
                <div className={`alert alert-${alertState.type} alert-dismissible fade show`} role="alert">
                    {alertState.message}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setAlertState({ show: false, type: 'success', message: '' })}
                    ></button>
                </div>
            )}
            <div className="table-responsive table-striped my-2">
                <Table
                    minWidth={1500}
                    autoWidth={true}
                    bodyHeight={300}
                    header={_renderHeader()}
                    body={_renderDataSection(props.gridData)}
                    containerPadding={20}
                    isPaging={true}
                    pageOption={props.pagingOption}
                    onPaging={_handlePaging}
                    shouldResetScrollPosition={props.shouldResetScrollPosition}
                />
            </div>
        </div>
    );
}

function mapStateToProps({ shouldResetScrollPosition, gridData, pagingOption, param, isModifyInLinkManagement }) {
    return Object.assign({}, { shouldResetScrollPosition, gridData, pagingOption, param, isModifyInLinkManagement });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedLink, setShouldResetScrollPosition, fetchData, setPagingOption, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));