import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import {
    PencilAltIcon,
    IdentificationIcon,
    PlusIcon,
} from "@heroicons/react/outline";

import { Button, Container, Table } from "@element";
import HostLayout from "src/layouts/HostLayout";
import { GET_MY_LICENSE } from "src/apollo/queries/space.queries";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";
import moment from "moment";

interface IColumns {
    Header: string;
    accessor: string;
    className?: string;
    childClassName?: string;
    Cell?: any;
}

const noOfItems = 10;

const Licenses = ({ userSession }) => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);

    const { t } = useTranslation("adminhost");

    const { data, loading, error, refetch } = useQuery(GET_MY_LICENSE, {
        fetchPolicy: "network-only",
        variables: {
            paginate: { take: noOfItems, skip: 0 },
        },
    });

    const handlePaginateSpaces = React.useCallback(
        (type: "next" | "prev") => {
            const hasNext = data?.getMyLicenses?.paginationInfo?.hasNext;
            const hasPrevious =
                data?.getMyLicenses?.paginationInfo?.hasPrevious;

            if (type === "next" && hasNext) {
                refetch({
                    paginate: {
                        take: noOfItems,
                        skip: skip + noOfItems,
                    },
                });
                setSkip(skip + noOfItems);
            } else if (type === "prev" && hasPrevious) {
                refetch({
                    paginate: {
                        take: noOfItems,
                        skip: skip - noOfItems,
                    },
                });
                setSkip(skip - noOfItems);
            }
        },
        [data]
    );

    const keys = [
        { name: "ライセンス", key: "type" },
        { name: "承認", key: "approved" },
        { name: "アップロード", key: "createdAt" },
        { name: "備考", key: "remarks" },
    ];
    const columnClassName = (key) => {
        if (key === "createdAt" || key === "approved" || key === "remarks")
            return "w-40";
    };
    const childClassname = (key) => {
        if (key === "maximumCapacity" || key === "spaceSize") {
            return "text-right";
        } else {
            return "text-left";
        }
    };

    useEffect(() => {
        const newData: IColumns[] = keys.map(({ name, key }: any) => ({
            Header: name.toUpperCase(),
            accessor: key,
            className: columnClassName(key),
            childClassName: childClassname(key),
            Cell: ({ column, row, value }) => {
                if (column.id === "approved") {
                    return (
                        <div className="flex justify-center">
                            {value ? "承認済み" : "未承認"}
                        </div>
                    );
                }
                if (column.id === "createdAt") {
                    return (
                        <div className="flex justify-center">
                            {moment(value).format("YYYY-MM-DD")}
                        </div>
                    );
                }

                return value;
            },
        }));

        // newData.push({
        //     Header: "ACTION",
        //     accessor: "action",
        //     Cell: ({ row }: { row: any }) => {
        //         return (
        //             <div className="flex items-center justify-center space-x-2">
        //                 <button
        //                     className="flex items-center shadow text-sm focus:outline-none bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
        //                     onClick={() => {
        //                         router.push(
        //                             `/host/my-space/edit/${row.original.id}/view`
        //                         );
        //                     }}
        //                 >
        //                     <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
        //                     確認
        //                 </button>
        //                 <button
        //                     className="flex items-center shadow text-sm focus:outline-none bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
        //                     onClick={() => {
        //                         router.push(
        //                             `/host/my-space/edit/${row.original.id}`
        //                         );
        //                     }}
        //                 >
        //                     <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
        //                     編集
        //                 </button>
        //             </div>
        //         );
        //     },
        // });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
        setLoadComplete(true);
    }, []);

    let content;
    if (loading) {
        content = <LoadingSpinner loadingText="読み込み中..." />;
    }
    if (error) {
        content = <div>エラーが発生しました: {error.message}</div>;
    }
    if (loadComplete && data) {
        content = (
            <Table
                columns={columns}
                data={data.getMyLicenses?.data}
                handlePaginate={handlePaginateSpaces}
                paginate={data?.getMyLicenses?.paginationInfog}
            />
        );
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>ライセンス管理 - {config.appName}</title>
            </Head>
            {/* Page header */}
            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <IdentificationIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            ライセンス管理
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            <Link href="/host/license/add">
                                <a>
                                    <Button variant="primary" Icon={PlusIcon}>
                                        ライセンスの追加
                                    </Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8 text-gray-700">
                {content}
            </Container>
        </HostLayout>
    );
};

export default Licenses;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
            },
        };
    }
};
