import React from 'react'
import { Button } from 'reactstrap';
import { Cell } from '@9softstudio/react-fixed-table-header';
import { connect } from 'react-redux';
import { setParams, setPlayerCpaData } from '../../actions';
import { bindActionCreators } from 'redux';
import { headerRows } from '../../libs/constants';

const RowHeader = ({ index, row, sortColumn, isAscending, handleClickHeader }) => {
    return (
        <tr className={`freeze-row-h${index}`}>
            {
                row.map((cell, index) => {
                    return (
                        <Cell
                            key={index}
                            header={true}
                            style={{ width: cell.width, maxWidth: cell.width }}
                            className={`freeze-column-${index}`}
                            rowSpan={cell.rowSpan}
                            colSpan={cell.columnSpan}
                            title={cell.title}>
                            {cell.sortable ? (
                                <Button
                                    className="th-wrapper"
                                    color="link"
                                    onClick={() => handleClickHeader(cell.sortColumn)}>
                                    <div className='px-2'>
                                        {cell.title}
                                        {
                                            cell.tooltipTitle && (
                                                <span title={cell.tooltipTitle} className='align-top'>
                                                    <span className="oi icon-info mx-2 mb-2"></span>
                                                </span>
                                            )
                                        }
                                    </div>
                                    <div className="icon-container">
                                        <span className={`caret asc ${sortColumn === cell.sortColumn && isAscending ? "current" : ''}`}></span>
                                        <span className={`caret desc ${sortColumn === cell.sortColumn && !isAscending ? "current" : ''}`}></span>
                                    </div>
                                </Button>
                            ) :
                                (
                                    <div className="th-wrapper">
                                        {cell.title}
                                    </div>
                                )}
                        </Cell>
                    )
                })
            }
        </tr>
    )
}

export const TableHeader = ({ sortColumn, isAscending, handleSort }) => {
    const handleClickHeader = (sortColumnSelected) => {
        handleSort(sortColumnSelected);
    }

    return (
        <thead>
            {
                headerRows.map((row, index) => {
                    return (
                        <RowHeader
                            key={index}
                            index={index + 1}
                            row={row}
                            handleClickHeader={handleClickHeader}
                            sortColumn={sortColumn}
                            isAscending={isAscending} />
                    )
                })
            }

        </thead>
    )
}

const mapStateToProps = ({ playerCpaData }) => {
    return {
        playerCpaData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setParams, setPlayerCpaData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TableHeader);
