import { useState, useEffect } from "react";
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

const Licenses = ({ userSession }) => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const { t } = useTranslation("adminhost");

    const { data, loading, error } = useQuery(GET_MY_LICENSE, {
        fetchPolicy: "network-only",
    });

    const keys = [
        { name: "License", key: "type" },
        { name: "Approved", key: "approved" },
        { name: "Uploaded", key: "createdAt" },
        { name: "Remarks", key: "remarks" },
    ];
    const columnClassName = (key) => {
        if (key === "type" || key === "createdAt" || key === "approved")
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
                            {value ? "APPROVED" : "PENDING"}
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
        content = <LoadingSpinner loadingText="Loading licenses..." />;
    }
    if (error) {
        content = <div>An error occurred: {error.message}</div>;
    }
    if (loadComplete && data) {
        content = <Table columns={columns} data={data.getMyLicenses} />;
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Host license - {config.appName}</title>
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
                                            Licenses
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            <Link href="/host/license/add">
                                <a>
                                    <Button variant="primary" Icon={PlusIcon}>
                                        Add license
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
