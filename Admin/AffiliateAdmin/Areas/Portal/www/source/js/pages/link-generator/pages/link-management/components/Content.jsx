import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { resolveClientUrl, formatDateTime } from '@/modules/utils';
import { headerText, globalResource } from '../libs/constants';
import { setSelectedLink, setShouldResetScrollPosition, fetchData, setPagingOption, setParam } from '../actions';
import { showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';

export const Content = (props) => {
    const { isModifyInLinkManagement } = props;

    useEffect(() => {
        const { param } = props;

        param && props.fetchData(param);
    }, [props.param]);
    
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
                <Cell header={true} colWidth={60} title={headerText.AffiliateCampaignLink}>{headerText.AffiliateCampaignLink}</Cell>
                <Cell header={true} colWidth={30} title={headerText.CreatedTime}>{headerText.CreatedTime}</Cell>
                <Cell header={true} colWidth={30} title={headerText.CreatedBy}>{headerText.CreatedBy}</Cell>
                <Cell header={true} colWidth={20} title={headerText.Action}>{headerText.Action}</Cell>
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
        const affiliateCampaignLink = dataItem.AffiliateCampaignLink;
        const createdDate = formatDateTime(dataItem.CreatedDate, 'MM/dd/yyyy HH:mm:ss');
        const createdBy = dataItem.CreatedBy || '';

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-left" title={linkName}>
                    {linkName}
                </Cell>
                <Cell className="text-left" title={affiliateCampaignLink}>{affiliateCampaignLink}</Cell>
                <Cell className="text-center" title={createdDate}>{createdDate}</Cell>
                <Cell className="text-center" title={createdBy}>{createdBy}</Cell>
                <Cell className="text-center">
                    <a href={resolveClientUrl(`Portal/LinkManagement?linkId=${dataItem.LinkId}`)} target="_top" title="Edit Link">
                        <span className="oi oi-pencil text-secondary"></span>
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
            <div className="table-responsive table-striped my-2">
                <Table
                    minWidth={1475}
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