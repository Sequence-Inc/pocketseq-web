import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { PencilAltIcon } from "@heroicons/react/outline";

import { Container, Table } from "@element";
import { THotelRoom, IColumns, TTableKey } from "@appTypes/timebookTypes";
import { LoadingSpinner } from "src/components/LoadingSpinner";

interface IRoomListProps {
    data?: THotelRoom[];
    loading?: boolean;
    refetching?: boolean;
}

const RoomList = (props: IRoomListProps) => {
    const { data, loading, refetching } = props;

    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const { t } = useTranslation("adminhost");

    const keys: TTableKey[] = [
        { name: t("space-name"), key: "name" },
        { name: "Stock", key: "stock" },
    ];

    const columnClassName = (key): string | undefined => {
        if (key === "name") return "min-w-10 text-left";
        if (key === "stock") return "w-32 text-left";
    };

    const childClassname = (key): string => {
        if (key === "maximumCapacity" || key === "status") {
            return "text-right";
        } else {
            return "text-left ";
        }
    };
    useEffect(() => {
        const newData: IColumns[] = keys.map(({ name, key }: TTableKey) => ({
            Header: name.toUpperCase(),
            accessor: key,
            className: columnClassName(key),
            childClassName: childClassname(key),
            Cell: ({ column, row, value }) => {
                if (column?.id === "name") {
                    return (
                        <div className="text-left">
                            {/* <Link
                                href={`/host/my-space/edit/${row?.original?.id}/view`}
                            > */}
                            <a className="text-gray-600 hover:text-gray-700">
                                {value}
                            </a>
                            {/* </Link> */}
                        </div>
                    );
                }
                return value;
            },
        }));

        newData.push({
            Header: "ACTION",
            accessor: "action",
            Cell: ({ row }: { row: any }) => {
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            className="flex items-center shadow text-sm focus:outline-none bg-gray-100 px-3 py-1 rounded  text-gray-500 hover:text-gray-700 cursor-not-allowed"
                            // hover:bg-gray-200
                            // onClick={() => {
                            //     router.push(
                            //         `/host/my-space/edit/${row.original.id}/view`
                            //     );
                            // }}
                        >
                            <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
                            確認
                        </button>
                    </div>
                );
            },
        });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
        setLoadComplete(true);
    }, []);

    let content;

    if (loading) {
        content = <LoadingSpinner loadingText="Loading Rooms..." />;
    }

    if (loadComplete && data?.length) {
        content = <Table columns={columns} data={data} />;
    }

    return <Container className="py-4 text-gray-700">{content}</Container>;
};

export default RoomList;
