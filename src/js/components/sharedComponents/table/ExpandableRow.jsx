/**
 * ExpandableRow.jsx
 * Created by Lizzie Salita 5/14/20
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const propTypes = {
    data: PropTypes.object,
    columns: PropTypes.array
};

const ExpandableRow = ({ data, columns }) => {
    const [expanded, setExpanded] = useState(false);
    const icon = expanded ? 'chevron-down' : 'chevron-right';
    return (
        <>
            <tr className="usda-table__expand-row">
                {columns.map((col) => {
                    if (col === 'name' && data.children) {
                        return (
                            <td className="usada-table__cell">
                                <button onClick={() => setExpanded(!expanded)}>
                                    <FontAwesomeIcon icon={icon} />
                                </button>
                                {data.name}
                            </td>
                        );
                    }
                    return (
                        <td className="usada-table__cell">
                            {data[col]}
                        </td>
                    );
                })}
            </tr>
            {data.children && expanded ? (
                data.children.map((childRow) => (
                    <tr className="usda-table__child-row">
                        {columns.map((col) => (
                            <td className="usda-table__child-cell">
                                {childRow[col]}
                            </td>
                        ))}
                    </tr>
                ))
            ) : null}
        </>
    );
};


ExpandableRow.propTypes = propTypes;
export default ExpandableRow;

