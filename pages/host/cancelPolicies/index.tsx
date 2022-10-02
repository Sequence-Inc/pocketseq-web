import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Button, Container, Table } from "@element";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import Link from "next/link";
import {
    PencilAltIcon,
    OfficeBuildingIcon,
    PlusIcon,
} from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { IColumns, TTableKey } from "src/types/timebookTypes";
import router from "next/router";
import * as CancelPoliciesQueries from "src/apollo/queries/cancelPolicies";

const { queries: cancelPolicyQueries } = CancelPoliciesQueries;

const CancelPolicies = ({ userSession }) => {
    const { t } = useTranslation("adminhost");
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const { data, loading, error } = useQuery(
        cancelPolicyQueries.MY_CANCEL_POLICIES,
        {
            fetchPolicy: "network-only",
        }
    );
    const keys: TTableKey[] = [{ name: "Name", key: "name" }];

    const columnClassName = (key): string | undefined => {
        if (key === "Name") return "border text-left";
        return "text-left";
    };

    const childClassname = (key): string => {
        if (key === "name") {
            return "text-left";
        }
        return "text-center";
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
                            className="flex items-center shadow text-sm focus:outline-none bg-gray-100 px-3 py-1 rounded  text-gray-500 hover:text-gray-700 "
                            // onClick={() => {
                            //     router.push(
                            //         `/host/cancelPolicies/edit/${row.original.id}/view`
                            //     );
                            // }}
                        >
                            <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
                            確認
                        </button>
                        <button
                            className="flex items-center shadow text-sm focus:outline-none bg-gray-100 px-3 py-1 rounded  text-gray-500 hover:text-gray-700  hover:bg-gray-200"
                            onClick={() => {
                                router.push(
                                    `/host/cancelPolicies/edit/${row.original.id}`
                                );
                            }}
                        >
                            <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
                            編集
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
        content = <LoadingSpinner loadingText="Loading cancel policies..." />;
    }
    if (error) {
        content = <div>An error occurred: {error.message}</div>;
    }

    if (loadComplete && data) {
        content = (
            <Table columns={columns} data={data?.myCancelPolicies.data} />
        );
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>キャンセルポリシー管理</title>
            </Head>
            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        {/* Page Header Starts */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <OfficeBuildingIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            キャンセルポリシー管理
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            <Link href="/host/cancelPolicies/add">
                                <a>
                                    <Button variant="primary" Icon={PlusIcon}>
                                        追加
                                    </Button>
                                </a>
                            </Link>
                        </div>
                        {/* Page Header Ends */}
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8 text-gray-700">
                {content}
            </Container>
        </HostLayout>
    );
};

export default CancelPolicies;

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
