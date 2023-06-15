import React from 'react';
import { useTable } from 'react-table';

const FakeData = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
    },
    {
        id: 2,
        name: 'Nguyễn Văn B',
    },
    {
        id: 3,
        name: 'Nguyễn Văn C',
    },
    {
        id: 4,
        name: 'Nguyễn Văn D',
    },
    {
        id: 5,
        name: 'Nguyễn Văn E',
    },
];

const PointClass = () => {
    const data = React.useMemo(() => FakeData, []);
    const columns = React.useMemo(
        () => [
            {
                Header: 'STT',
                accesor: 'id',
            },
            {
                Header: 'Tên học viên',
                accesor: 'name',
            },
        ],
        [],
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });
    return (
        <div>
            <div>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PointClass;
