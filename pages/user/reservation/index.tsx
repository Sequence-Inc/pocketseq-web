import { useQuery } from "@apollo/client";
import { Container, Table } from "@element";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { MY_RESERVATION } from "src/apollo/queries/user.queries";
import { IColumns } from "src/elements/Table";
import HostLayout from "src/layouts/HostLayout";
import { format } from "date-fns";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { config, reservationStatusJapanify } from "src/utils";
import Link from "next/link";
import { CalendarIcon } from "@heroicons/react/outline";

const noOfItems = 10;

const ReservationList = ({ userSession }) => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [hotelColumns, setHotelColumns] = useState<IColumns[] | undefined>();
    const [skip, setSkip] = useState<number>(0);
    const { data, refetch } = useQuery(MY_RESERVATION, {
        fetchPolicy: "network-only",
        variables: {
            spacePaginate: { take: noOfItems, skip: 0 },
            spaceFilter: { sortOrder: "desc" },
            hotelPaginate: { take: noOfItems, skip: 0 },
            hotelFilter: { sortOrder: "desc" },
        },
    });

    const keys = [
        { name: "施設名", key: "space" },
        { name: "From", key: "fromDateTime" },
        { name: "To", key: "toDateTime" },
        { name: "状態", key: "status" },
        { name: "予約日", key: "createdAt" },
    ];

    const hotelKeys = [
        { name: "施設名", key: "packagePlan" },
        { name: "Room", key: "hotelRoom" },
        { name: "From", key: "fromDateTime" },
        { name: "To", key: "toDateTime" },
        { name: "状態", key: "status" },
        { name: "予約日", key: "createdAt" },
    ];

    const childClassname = (key) => {
        if (key === "space" || key === "packagePlan") {
            return "text-left overflow-hidden overflow-ellipsis";
        } else {
            return "text-center";
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
                        <Link href={`/user/reservation/${row.original.id}`}>
                            <a className="text-gray-700 font-medium hover:text-primary">
                                {value.name}
                            </a>
                        </Link>
                    );
                } else if (
                    column.id === "fromDateTime" ||
                    column.id === "toDateTime" ||
                    column.id === "createdAt"
                ) {
                    return (
                        <span className="text-sm text-gray-500">
                            {format(new Date(value), "yyyy年MM月dd日, HH:mm")}
                        </span>
                    );
                } else if (column.id === "status") {
                    return (
                        <div className="text-center">
                            {reservationStatusJapanify(value)}
                        </div>
                    );
                } else return value;
            },
        }));
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);

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
                                href={`/user/reservation/hotel/${row.original.id}`}
                            >
                                <a className="text-gray-700 font-medium hover:text-primary">
                                    {value.name}
                                </a>
                            </Link>
                        );
                    } else if (column.id === "hotelRoom") {
                        return <>{value.name}</>;
                    } else if (
                        column.id === "fromDateTime" ||
                        column.id === "toDateTime" ||
                        column.id === "createdAt"
                    ) {
                        return (
                            <span className="text-sm text-gray-500">
                                {format(
                                    new Date(value),
                                    "yyyy年MM月dd日, HH:mm"
                                )}
                            </span>
                        );
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
        const filteredNewHotelData = newHotelData.filter(
            (res) => res !== undefined
        );
        setHotelColumns(filteredNewHotelData);
    }, []);

    const handleSpacePagination = (type: "next" | "prev") => {
        const hasNext = data?.myReservations?.paginationInfo?.hasNext;
        const hasPrevious = data?.myReservations?.paginationInfo?.hasPrevious;
        if (type === "next" && hasNext) {
            refetch({
                spacePaginate: {
                    take: noOfItems,
                    skip: skip + noOfItems,
                },
            });
            setSkip(skip + noOfItems);
        } else if (type === "prev" && hasPrevious) {
            refetch({
                spacePaginate: {
                    take: noOfItems,
                    skip: skip - noOfItems,
                },
            });
            setSkip(skip - noOfItems);
        }
    };
    const handleHotelPagination = (type: "next" | "prev") => {
        const hasNext = data?.myHotelRoomReservation.paginationInfo?.hasNext;
        const hasPrevious =
            data?.myHotelRoomReservation.paginationInfo?.hasPrevious;
        if (type === "next" && hasNext) {
            refetch({
                hotelPaginate: {
                    take: noOfItems,
                    skip: skip + noOfItems,
                },
            });
            setSkip(skip + noOfItems);
        } else if (type === "prev" && hasPrevious) {
            refetch({
                hotelPaginate: {
                    take: noOfItems,
                    skip: skip - noOfItems,
                },
            });
            setSkip(skip - noOfItems);
        }
    };

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
                                            ご予約リスト
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                {columns && (
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-gray-700 font-bold text-2xl">
                                スペース予約
                            </h3>
                            <Table
                                columns={columns}
                                data={data?.myReservations?.data || []}
                                paginate={data?.myReservations?.paginationInfo}
                                handlePaginate={handleSpacePagination}
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-gray-700 font-bold text-2xl">
                                宿泊予約
                            </h3>
                            <Table
                                columns={hotelColumns}
                                data={data?.myHotelRoomReservation?.data || []}
                                paginate={
                                    data?.myHotelRoomReservation?.paginationInfo
                                }
                                handlePaginate={handleHotelPagination}
                            />
                        </div>
                    </div>
                )}
            </Container>
        </HostLayout>
    );
};

export default ReservationList;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/api/auth/signin",
        roles: ["user"],
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
