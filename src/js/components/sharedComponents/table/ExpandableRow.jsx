/**
 * ExpandableRow.jsx
 * Created by Lizzie Salita 5/14/20
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const propTypes = {
    data: PropTypes.object,
    columns: PropTypes.array,
    oddClass: PropTypes.string
};

const ExpandableRow = ({ data, columns, oddClass }) => {
    const [expanded, setExpanded] = useState(false);
    const icon = expanded ? 'chevron-down' : 'chevron-right';
    return (
        <>
            <tr className={`usda-table__row${oddClass} usda-table__row_expandable`}>
                {columns.map((col) => {
                    if (col === 'name' && data.children) {
                        return (
                            <td className="usda-table__cell">
                                <button
                                    className="usda-table__expand-button"
                                    onClick={() => setExpanded(!expanded)}>
                                    <FontAwesomeIcon icon={icon} />
                                </button>
                                {data.name}
                            </td>
                        );
                    }
                    return (
                        <td className={`usda-table__cell${col === 'name' ? ' usda-table__cell_name' : ''}`}>
                            {data[col]}
                        </td>
                    );
                })}
            </tr>
            {data.children && expanded ? (
                data.children.map((childRow, i) => {
                    const lastClass = i === data.children.length - 1 ? ' usda-table__child-row_last' : '';
                    return (
                        <tr className={`usda-table__child-row${lastClass}${oddClass}`}>
                            {columns.map((col) => (
                                <td className="usda-table__cell usda-table__cell_child">
                                    <div className="usda-table__child-cell-content">
                                        {childRow[col]}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    );
                })
            ) : null}
        </>
    );
};


ExpandableRow.propTypes = propTypes;
export default ExpandableRow;

