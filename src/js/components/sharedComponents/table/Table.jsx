/**
 * Table.jsx
 * Created by Lizzie Salita 5/14/20
 */

import React from 'react';
import PropTypes, { shape, oneOf } from 'prop-types';
import TableHeader from './TableHeader';

const propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    rows: PropTypes.arrayOf(PropTypes.array),
    currentSort: shape({
        direction: oneOf(['asc', 'desc']),
        field: PropTypes.string
    }),
    updateSort: PropTypes.func.isRequired
};

const Table = (props) => (
    <table className="usda-table">
        <thead className="usda-table__head">
            <tr>
                {props.columns.map((col) => (
                    <TableHeader
                        key={col.title}
                        currentSort={props.currentSort}
                        updateSort={props.updateSort}
                        isActive={props.currentSort.field === col.title}
                        {...col} />
                ))}
            </tr>
        </thead>
        <tbody className="usda-table__body">
            {props.rows.map((row) => (
                <tr className="usda-table__row">
                    {row.map((data) => (
                        <td className="usda-table__cell">
                            {data}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

Table.propTypes = propTypes;
export default Table;

