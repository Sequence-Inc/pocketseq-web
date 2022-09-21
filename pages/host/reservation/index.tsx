import { useMutation, useQuery } from "@apollo/client";
import { Button, Container, Table } from "@element";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { IColumns } from "src/elements/Table";
import HostLayout from "src/layouts/HostLayout";
import { format } from "date-fns";
import {
    APPROVE_HOTEL_RESERVATION,
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
    const [hotelColumns, setHotelColumns] = useState<IColumns[] | undefined>();

    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const [skip, setSkip] = useState<number>(0);

    const { data, loading, error, refetch } = useQuery(RESERVATIONS, {
        fetchPolicy: "network-only",
        variables: {
            spacePaginate: { take: noOfItems, skip: 0 },
            spaceFilter: {},
            hotelPaginate: { take: noOfItems, skip: 0 },
            hotelFilter: {},
        },
    });

    const [approveReservation] = useMutation(APPROVE_RESERVATION);
    const [approveHotelReservation] = useMutation(APPROVE_HOTEL_RESERVATION);

    const keys = [
        { name: "Space Name", key: "space" },
        { name: "From", key: "fromDateTime" },
        { name: "To", key: "toDateTime" },
        { name: "Status", key: "status" },
    ];

    const hotelKeys = [
        { name: "Plan Name", key: "packagePlan" },
        { name: "From", key: "fromDateTime" },
        { name: "To", key: "toDateTime" },
        { name: "Status", key: "status" },
    ];

    const childClassname = (key) => {
        if (key === "space" || key === "packagePlan") {
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
            alert(resp.data?.approveReservation.message);
            refetch();
        } catch (err) {
            console.log(err);
        }
    };
    const handleHotelApprove = async (reservationId: string) => {
        try {
            const resp = await approveHotelReservation({
                variables: { reservationId },
            });
            alert(resp.data?.approveRoomReservation.message);
            refetch();
        } catch (err) {
            alert("Error: " + err?.message);
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
                            <a className="hover:text-gray-700">{value.name}</a>
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
                if (
                    row.original.approved ||
                    row.original.status === "CANCELED"
                ) {
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

        // Hotel Data Preparation
        const newHotelData: IColumns[] = hotelKeys.map(
            ({ name, key }: any) => ({
                Header: name.toUpperCase(),
                accessor: key,
                childClassName: childClassname(key),
                Cell: ({ column, value, row }) => {
                    if (!value) return "";
                    if (column.id === "packagePlan") {
                        return (
                            <Link
                                href={`/host/reservation/hotel/${row.original.id}`}
                            >
                                <a className="text-gray-700 hover:text-gray-900 font-bold">
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
            })
        );

        newHotelData.push({
            Header: "ACTION",
            accessor: "action",
            Cell: ({ row }: { row: any }) => {
                if (
                    row.original.approved ||
                    row.original.status === "CANCELED"
                ) {
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
                        onClick={() => handleHotelApprove(row.original.id)}
                    >
                        承認する
                    </Button>
                );
            },
        });
        const filteredNewHotelData = newHotelData.filter(
            (res) => res !== undefined
        );
        setHotelColumns(filteredNewHotelData);

        setLoadComplete(true);
    }, []);

    // const handleNextPrev = (type: "next" | "prev") => {
    //     const hasNext = data?.reservations?.paginationInfo?.hasNext;
    //     const hasPrevious = data?.reservations?.paginationInfo?.hasNext;
    //     if (type === "next" && hasNext) {
    //         refetch({
    //             paginate: {
    //                 take: noOfItems,
    //                 skip: skip + noOfItems,
    //             },
    //             filter: {},
    //         });
    //         setSkip(skip + noOfItems);
    //     } else if (type === "prev" && hasPrevious) {
    //         refetch({
    //             paginate: {
    //                 take: noOfItems,
    //                 skip: skip - noOfItems,
    //             },
    //             filter: {},
    //         });
    //         setSkip(skip - noOfItems);
    //     }
    // };

    const handleNextPrev = () => {
        return null;
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
            <div className="space-y-10">
                <div className="space-y-4">
                    <h3 className="text-gray-700 font-bold text-2xl">
                        スペース予約
                    </h3>
                    <Table
                        columns={columns}
                        data={data?.reservations?.data || []}
                        paginate={data?.reservations?.paginationInfo}
                        handlePaginate={handleNextPrev}
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="text-gray-700 font-bold text-2xl">
                        宿泊予約
                    </h3>
                    <Table
                        columns={hotelColumns}
                        data={data?.hotelRoomReservations?.data || []}
                        paginate={data?.hotelRoomReservations?.paginationInfo}
                        handlePaginate={handleNextPrev}
                    />
                </div>
            </div>
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
                                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-700 sm:leading-9 sm:truncate">
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
