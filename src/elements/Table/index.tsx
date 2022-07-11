import { CashIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React from "react";
import { useMemo } from "react";
import { useTable } from "react-table";

import useTranslation from "next-translate/useTranslation";

export interface IColumns {
    Header: string;
    accessor: string;
    className?: string;
    childClassName?: string;
    Cell?: any;
}
interface ITableProps {
    columns: any;
    data: any[];
    hidePagination?: boolean;
    paginate?: any;
    handlePaginate?: (type: "prev" | "next") => void;
}

const Table = ({
    columns,
    data,
    paginate,
    handlePaginate,
    hidePagination = false,
}: ITableProps) => {
    const { t } = useTranslation("adminhost");
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns: useMemo(() => columns, []),
            data,
        });

    return (
        <div className="flex flex-col mt-2">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                        <table
                            className="min-w-full divide-y divide-gray-200"
                            {...getTableProps()}
                        >
                            <thead>
                                {headerGroups.map((headerGroup, index) => (
                                    <tr
                                        key={index}
                                        {...headerGroup.getHeaderGroupProps()}
                                    >
                                        {headerGroup.headers.map(
                                            (column: any) => (
                                                <th
                                                    key={column.id}
                                                    className={`px-4 py-3 font-bold text-sm tracking-wider text-gray-500 uppercase bg-gray-50 ${column.className}`}
                                                    {...column.getHeaderProps()}
                                                >
                                                    {column.render("Header")}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </thead>
                            <tbody
                                className="bg-white divide-y divide-gray-200"
                                {...getTableBodyProps()}
                            >
                                {rows.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr
                                            key={row.id}
                                            className="bg-white hover:bg-gray-50 "
                                            {...row.getRowProps()}
                                        >
                                            {row.cells.map((cell: any) => {
                                                return (
                                                    <td
                                                        key={cell.column.id}
                                                        className={`px-4 py-3.5 text-base text-gray-700 max-w-0 whitespace-nowrap ${cell.column.childClassName}`}
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render("Cell")}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        {!hidePagination && (
                            <nav
                                className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                                aria-label="Pagination"
                            >
                                <div className="flex justify-between flex-1 sm:justify-end">
                                    <button
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        disabled={!paginate?.hasPrevious}
                                        type="button"
                                        onClick={() => {
                                            handlePaginate("next");
                                        }}
                                    >
                                        {t("previous-page")}
                                    </button>
                                    <button
                                        className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        disabled={!paginate?.hasNext}
                                        type="button"
                                        onClick={() => {
                                            handlePaginate("prev");
                                        }}
                                    >
                                        {t("next-page")}
                                    </button>
                                </div>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
