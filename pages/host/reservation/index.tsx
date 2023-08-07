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
import AlertModal from "src/components/AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

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
            spaceFilter: { sortOrder: "desc" },
            hotelPaginate: { take: noOfItems, skip: 0 },
            hotelFilter: { sortOrder: "desc" },
        },
    });

    const [approveReservation] = useMutation(APPROVE_RESERVATION);
    const [approveHotelReservation] = useMutation(APPROVE_HOTEL_RESERVATION);

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

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

    const handleApprove = async (reservationId: string) => {
        try {
            const resp = await approveReservation({
                variables: { reservationId },
            });
            setModalData({
                intent: "SUCCESS",
                title: "予約が承認されました。",
                text: resp.data?.approveReservation.message,
            });
            openModal();
            refetch();
        } catch (err) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: err.message,
            });
            openModal();
        }
    };
    const handleHotelApprove = async (reservationId: string) => {
        try {
            const resp = await approveHotelReservation({
                variables: { reservationId },
            });
            setModalData({
                intent: "SUCCESS",
                title: "予約が承認されました。",
                text: resp.data?.approveRoomReservation.message,
            });
            openModal();
            refetch();
        } catch (err) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: err.message,
            });
            openModal();
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
                        <div className="text-center w-40">
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
                            <div className="text-center w-40">
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

    const handlePaginateSpaces = React.useCallback(
        (type: "next" | "prev") => {
            const hasNext = data?.reservations?.paginationInfo?.hasNext;
            const hasPrevious = data?.reservations?.paginationInfo?.hasPrevious;

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
        },
        [data]
    );

    const handlePaginateHotels = React.useCallback(
        (type: "next" | "prev") => {
            const hasNext =
                data?.hotelRoomReservations?.paginationInfo?.hasNext;
            const hasPrevious =
                data?.hotelRoomReservations?.paginationInfo?.hasPrevious;

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
        },
        [data]
    );

    let content;
    if (loading) {
        content = <LoadingSpinner loadingText="読み込み中..." />;
    }
    if (error) {
        content = <div>エラーが発生しました</div>;
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
                        handlePaginate={handlePaginateSpaces}
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
                        handlePaginate={handlePaginateHotels}
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
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
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
