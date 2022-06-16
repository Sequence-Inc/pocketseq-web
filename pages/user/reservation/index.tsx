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

const noOfItems = 10;

const ReservationList = ({ userSession }) => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [skip, setSkip] = useState<number>(0);
    const { data, refetch } = useQuery(MY_RESERVATION, {
        fetchPolicy: "network-only",
        variables: { paginate: { take: noOfItems, skip: 0 }, filter: {} },
    });

    const keys = [
        { name: "Space Name", key: "space" },
        { name: "From", key: "fromDateTime" },
        { name: "To", key: "toDateTime" },
        { name: "Status", key: "status" },
    ];

    const childClassname = (key) => {
        if (key === "space") {
            return "text-left";
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
                            <a className=" hover:text-gray-700">{value.name}</a>
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
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
    }, []);

    const handleNextPrev = (type: "next" | "prev") => {
        const hasNext = data?.myReservations?.paginationInfo?.hasNext;
        const hasPrevious = data?.myReservations?.paginationInfo?.hasNext;
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

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>ご予約リスト - {config.appName}</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                    ご予約リスト
                </h2>
                {columns && (
                    <Table
                        columns={columns}
                        data={data?.myReservations?.data || []}
                        paginate={data?.myReservations?.paginationInfo}
                        handlePaginate={handleNextPrev}
                    />
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
