import { useState } from "react";
import {
    CheckCircleIcon,
    PlusIcon,
    OfficeBuildingIcon,
    ViewListIcon,
} from "@heroicons/react/solid";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Button, Container, Table } from "@element";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ALL_SPACE_TYPES, MY_SPACES } from "src/apollo/queries/space.queries";
import { useEffect } from "react";
import { PencilAltIcon } from "@heroicons/react/outline";

interface IColumns {
    Header: string;
    accessor: string;
    className?: string;
    childClassName?: string;
    Cell?: any;
}

const keys = [
    { name: "Name", key: "name" },
    { name: "Maximum Capacity", key: "maximumCapacity" },
    { name: "Space Size", key: "spaceSize" },
    { name: "Space Types", key: "spaceTypes" },
];

const MySpace = () => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const { data } = useQuery(MY_SPACES);

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
                            console.log(row.original.id);
                            // singleCardRef.current.open(row.original.id);
                            // fetch(`api/Members/markThisMemberBusy/${id}/${true}`);
                        }}
                    >
                        <PencilAltIcon className="w-5 h-5 text-gray-400" />
                    </button>
                );
            },
        });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
    }, []);

    return (
        <HostLayout>
            <Head>
                <title>Spaces - Host - Timebook</title>
            </Head>
            {/* Page header */}
            <div className="bg-white shadow">
                <Container>
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                {/* <div className="hidden w-16 h-16 border rounded-lg shadow-sm sm:flex sm:justify-center sm:items-center">
                                    <ViewListIcon className="w-10 h-10 text-primary" />
                                </div> */}
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            My Spaces
                                        </h1>
                                    </div>
                                    <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <dt className="sr-only">
                                            Total spaces
                                        </dt>
                                        <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 capitalize sm:mr-6 sm:mt-0">
                                            <CheckCircleIcon
                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                                aria-hidden="true"
                                            />
                                            12 spaces
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
                            <Link href="/host/my-space/add">
                                <a>
                                    <Button variant="primary" Icon={PlusIcon}>
                                        Add new space
                                    </Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                {columns && (
                    <Table columns={columns} data={data?.mySpaces || []} />
                )}
            </Container>
        </HostLayout>
    );
};

export default MySpace;
