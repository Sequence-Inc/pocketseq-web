import { CashIcon, ChevronRightIcon } from '@heroicons/react/outline'
import React from 'react'
import { useMemo } from 'react'
import { useTable } from 'react-table'

const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: useMemo(() => columns, []),
        data,
    })
    return (
        <div className="flex flex-col mt-2">
            <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup, index) => (
                            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any) => (
                                    <th
                                        key={column.id}
                                        className={`px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase bg-gray-50 ${column.className}`}
                                        {...column.getHeaderProps()}
                                    >
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr key={row.id} className="bg-white" {...row.getRowProps()}>
                                    {row.cells.map((cell: any) => {
                                        return <td
                                            key={cell.column.id}
                                            className={`px-4 py-2 text-sm text-gray-900 max-w-0 whitespace-nowrap ${cell.column.childClassName}`}
                                            {...cell.getCellProps()}
                                        >
                                            {cell.column.id === "sn"
                                                ? (row.index +
                                                    1 +
                                                    data.pageSize * (data.pageNumber - 1)).toString()
                                                : cell.render("Cell")}
                                        </td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* Pagination */}
                <nav
                    className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                    aria-label="Pagination"
                >
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                            <span className="font-medium">20</span> results
                        </p>
                    </div>
                    <div className="flex justify-between flex-1 sm:justify-end">
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Previous
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Next
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Table;

