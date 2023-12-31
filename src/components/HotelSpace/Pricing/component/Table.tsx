import React from "react";
import { useMemo } from "react";
import TableRow from "./TableRow";
import useTranslation from "next-translate/useTranslation";
import { TTableKey } from "@appTypes/timebookTypes";

export interface IColumns {
    Header: string;
    accessor: string;
    className?: string;
    childClassName?: string;
    Cell?: any;
}
interface ITableProps {
    columns: TTableKey[];
    data: any[];
    hidePagination?: boolean;
    paginate?: any;
    handlePaginate?: (type: "prev" | "next") => void;
    handleRemoveRow?: any;
    refetchPricings?: any;
}

const Table = ({ columns, data, refetchPricings, ...rest }: ITableProps) => {
    const { t } = useTranslation("adminhost");

    const columnClassName = (key): string | undefined => {
        const commonClass =
            "border first:border-l-0 border-t-0 text-center font-semibold whitespace-nowrap text-gray-900 bg-white last:border-r-0";
        switch (key) {
            case "name":
                return `${commonClass} w-11`;
            case "roomCharge":
                return `${commonClass}  text-xs`;
            default:
                return `${commonClass} text-base`;
        }
    };

    const headers = useMemo(() => {
        if (!columns?.length) return [];
        return columns?.map((col) => ({
            ...col,
            className: columnClassName(col.key),
        }));
    }, [columns]);

    return (
        <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {headers?.map((col, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className={`px-4 py-3 font-bold text-sm tracking-wider uppercase ${col.className}`}
                                        >
                                            {col?.name}
                                        </th>
                                    ))}
                                    <th
                                        key="action"
                                        scope="col"
                                        className={`px-4 py-3 font-bold text-sm tracking-wider uppercase`}
                                    >
                                        動作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {[...data]
                                    ?.sort((a, b) => {
                                        if (!a?.createdAt) return 1;
                                        if (!b?.createdAt) return -1;
                                        return a.createdAt - b.createdAt;
                                    })
                                    ?.map((row, index) => (
                                        <TableRow
                                            row={row}
                                            rowId={index}
                                            key={`${index}`}
                                            columns={headers}
                                            refetchPricings={refetchPricings}
                                            {...rest}
                                        />
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
