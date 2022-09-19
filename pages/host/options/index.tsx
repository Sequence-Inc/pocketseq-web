import { Button, PageLayout, Table } from "@element";
import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import {
    AdjustmentsIcon,
    PlusIcon,
    PencilAltIcon,
    OfficeBuildingIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { queries as OptionQueires } from "src/apollo/queries/options";
import { useQuery } from "@apollo/client";
import useTranslation from "next-translate/useTranslation";
import { IColumns, TTableKey } from "src/types/timebookTypes";
import { LoadingSpinner } from "src/components/LoadingSpinner";

const OptionList = ({ userSession }) => {
    const router = useRouter();
    const { t } = useTranslation("adminhost");
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);
    const { data, error, loading } = useQuery(OptionQueires.MY_OPTIONS);

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
                                    `/host/options/edit/${row.original.id}`
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
        content = <LoadingSpinner loadingText="Loading options ..." />;
    }
    if (error) {
        content = <div>An error occurred: {error.message}</div>;
    }

    if (loadComplete && data) {
        content = <Table columns={columns} data={data?.myOptions} />;
    }
    return (
        <HostLayout userSession={userSession}>
            <PageLayout
                pageTitle="オプション管理"
                BannerIcon={AdjustmentsIcon}
                BannerActionButton={() => (
                    <Button
                        variant="primary"
                        Icon={PlusIcon}
                        onClick={() => router.push("/host/options/add")}
                    >
                        オプションの追加
                    </Button>
                )}
            >
                {content}
            </PageLayout>
        </HostLayout>
    );
};

export default OptionList;

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
