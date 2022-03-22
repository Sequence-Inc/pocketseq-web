import { useMutation, useQuery } from "@apollo/client";
import { Button, Container, Table } from "@element";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { IColumns } from "src/elements/Table";
import HostLayout from "src/layouts/HostLayout";
import { format } from "date-fns";
import {
    APPROVE_RESERVATION,
    RESERVATIONS,
} from "src/apollo/queries/host.queries";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { LoadingSpinner } from "@comp";
import { CalendarIcon } from "@heroicons/react/outline";
import { config, reservationStatusJapanify } from "src/utils";
import Link from "next/link";

const noOfItems = 10;

const ReservationList = ({ userSession }) => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const [skip, setSkip] = useState<number>(0);
    const { data, loading, error, refetch } = useQuery(RESERVATIONS, {
        fetchPolicy: "network-only",
        variables: { paginate: { take: noOfItems, skip: 0 }, filter: {} },
    });

    const [approveReservation] = useMutation(APPROVE_RESERVATION);

    const keys = [
        { name: "Space Name", key: "space" },
        { name: "From", key: "fromDateTime" },
        { name: "To", key: "toDateTime" },
        { name: "Status", key: "status" },
    ];

    const childClassname = (key) => {
        if (key === "space") {
            return "text-left overflow-hidden overflow-ellipsis";
        } else {
            return "text-center";
        }
    };

    const handleApprove = async (reservationId: string) => {
        try {
            const resp = await approveReservation({
                variables: { reservationId },
            });
            alert("Approved");
            refetch();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const newData: IColumns[] = keys.map(({ name, key }: any) => ({
            Header: name.toUpperCase(),
            accessor: key,
            childClassName: childClassname(key),
            Cell: ({ column, value, row }) => {
                if (!value) return "";
                if (column.id === "space") {
                    return (
                        <Link href={`/host/reservation/${row.original.id}`}>
                            <a className="font-bold hover:text-gray-700">
                                {value.name}
                            </a>
                        </Link>
                    );
                } else if (
                    column.id === "fromDateTime" ||
                    column.id === "toDateTime"
                ) {
                    return format(new Date(value), "yyyy-MM-dd, HH:mm");
                } else if (column.id === "status") {
                    return (
                        <div className="text-center">
                            {reservationStatusJapanify(value)}
                        </div>
                    );
                } else return value;
            },
        }));

        newData.push({
            Header: "ACTION",
            accessor: "action",
            Cell: ({ row }: { row: any }) => {
                if (row.original.approved) {
                    return (
                        <Button
                            type="button"
                            className="flex mx-auto focus:outline-none disabled:cursor-not-allowed"
                            disabled
                        >
                            承認済み
                        </Button>
                    );
                }
                return (
                    <Button
                        type="button"
                        className="flex mx-auto focus:outline-none"
                        onClick={() => handleApprove(row.original.id)}
                    >
                        承認する
                    </Button>
                );
            },
        });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
        setLoadComplete(true);
    }, []);

    const handleNextPrev = (type: "next" | "prev") => {
        const hasNext = data?.reservations?.paginationInfo?.hasNext;
        const hasPrevious = data?.reservations?.paginationInfo?.hasNext;
        if (type === "next" && hasNext) {
            refetch({
                paginate: {
                    take: noOfItems,
                    skip: skip + noOfItems,
                },
                filter: {},
            });
            setSkip(skip + noOfItems);
        } else if (type === "prev" && hasPrevious) {
            refetch({
                paginate: {
                    take: noOfItems,
                    skip: skip - noOfItems,
                },
                filter: {},
            });
            setSkip(skip - noOfItems);
        }
    };

    let content;
    if (loading) {
        content = <LoadingSpinner loadingText="Loading reservations..." />;
    }
    if (error) {
        content = <div>There was an error.</div>;
    }

    if (loadComplete) {
        content = (
            <Table
                columns={columns}
                data={data?.reservations?.data || []}
                paginate={data?.reservations?.paginationInfo}
                handlePaginate={handleNextPrev}
            />
        );
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>ご予約リスト - {config.appName}</title>
            </Head>
            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <CalendarIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            予約
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">{content}</Container>
        </HostLayout>
    );
};

export default ReservationList;

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
