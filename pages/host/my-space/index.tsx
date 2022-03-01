import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import {
    PencilAltIcon,
    OfficeBuildingIcon,
    PlusIcon,
} from "@heroicons/react/outline";

import { Button, Container, Table } from "@element";
import HostLayout from "src/layouts/HostLayout";
import { MY_SPACES } from "src/apollo/queries/space.queries";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";

interface IColumns {
    Header: string;
    accessor: string;
    className?: string;
    childClassName?: string;
    Cell?: any;
}

const MySpace = ({ userSession }) => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const { t } = useTranslation("adminhost");

    const { data, loading, error } = useQuery(MY_SPACES, {
        fetchPolicy: "network-only",
    });

    const keys = [
        { name: t("space-name"), key: "name" },
        { name: t("max-capacity"), key: "maximumCapacity" },
        { name: t("space-size"), key: "spaceSize" },
        { name: t("space-types"), key: "spaceTypes" },
    ];
    const columnClassName = (key) => {
        if (key === "maximumCapacity") return "w-44";
        if (key === "name") return "min-w-10 text-left";
        if (key === "spaceSize") return "w-32";
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
            Cell: ({ column, value }) => {
                if (column.id === "spaceTypes") {
                    return (
                        <div className="flex justify-center">
                            {value.map((res: any) => (
                                <span
                                    key={res.title}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
                                >
                                    {res.title}
                                </span>
                            ))}
                        </div>
                    );
                } else return value;
            },
        }));

        newData.push({
            Header: "ACTION",
            accessor: "action",
            Cell: ({ row }: { row: any }) => {
                return (
                    <button
                        className="flex mx-auto focus:outline-none"
                        onClick={() => {
                            router.push(
                                `/host/my-space/edit/${row.original.id}`
                            );
                        }}
                    >
                        <PencilAltIcon className="w-5 h-5 text-gray-400" />
                    </button>
                );
            },
        });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
        setLoadComplete(true);
    }, []);

    let content;
    if (loading) {
        content = <LoadingSpinner loadingText="Loading spaces..." />;
    }
    if (error) {
        content = <div>An error occurred: {error.message}</div>;
    }
    if (loadComplete && data) {
        console.log(columns, data);
        content = <Table columns={columns} data={data.mySpaces} />;
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Spaces - Host - {config.appName}</title>
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
                                        <OfficeBuildingIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            {t("my-spaces")}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            <Link href="/host/my-space/add">
                                <a>
                                    <Button variant="primary" Icon={PlusIcon}>
                                        {t("add-space")}
                                    </Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">{content}</Container>
        </HostLayout>
    );
};

export default MySpace;

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
