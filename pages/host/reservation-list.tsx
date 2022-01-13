import { useMutation, useQuery } from '@apollo/client'
import { Button, Container, Table } from '@element'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { IColumns } from 'src/elements/Table'
import HostLayout from 'src/layouts/HostLayout'
import { format } from 'date-fns'
import { APPROVE_RESERVATION, RESERVATIONS } from 'src/apollo/queries/host.queries'

const noOfItems = 10;

const ReservationList = () => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [skip, setSkip] = useState<number>(0);
    const { data, refetch } = useQuery(RESERVATIONS, { fetchPolicy: "network-only", variables: { paginate: { take: noOfItems, skip: 0 }, filter: {} } });
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
            const resp = await approveReservation({ variables: { reservationId } })
            alert("Approved")
            refetch();
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const newData: IColumns[] = keys.map(({ name, key }: any) => ({
            Header: name.toUpperCase(),
            accessor: key,
            childClassName: childClassname(key),
            Cell: ({ column, value }) => {
                if (!value) return "";
                if (column.id === "space") {
                    return value.name
                } else if (column.id === "fromDateTime" || column.id === "toDateTime") {
                    return format(new Date(value), "yyyy-MM-dd, HH:mm");
                } else return value;
            }
        }));

        newData.push({
            Header: "ACTION",
            accessor: "action",
            Cell: ({ row }: { row: any }) => {
                if (row.original.approved) {
                    return (
                        <button
                            className="flex mx-auto focus:outline-none disabled:cursor-not-allowed"
                            disabled
                        >
                            Approved
                        </button>
                    );
                }
                return (
                    <Button
                        type="button"
                        className="flex mx-auto focus:outline-none"
                        onClick={() => handleApprove(row.original.id)}
                    >
                        Approve
                    </Button>
                );
            },
        });
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
    }, []);

    const handleNextPrev = (type: 'next' | 'prev') => {
        const hasNext = data?.reservations?.paginationInfo?.hasNext;
        const hasPrevious = data?.reservations?.paginationInfo?.hasNext;
        if (type === 'next' && hasNext) {
            refetch({
                paginate: {
                    take: noOfItems,
                    skip: skip + noOfItems
                },
                filter: {}
            });
            setSkip(skip + noOfItems);
        } else if (type === 'prev' && hasPrevious) {
            refetch({
                paginate: {
                    take: noOfItems,
                    skip: skip - noOfItems
                },
                filter: {}
            });
            setSkip(skip - noOfItems);
        }
    }

    return (
        <HostLayout>
            <Head>
                <title>Profile - Timebook</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                    My Reservation Lists
                </h2>
                {columns && (
                    <Table
                        columns={columns}
                        data={data?.reservations?.data || []}
                        paginate={data?.reservations?.paginationInfo}
                        handlePaginate={handleNextPrev}
                    />
                )}
            </Container>
        </HostLayout>
    )
}

export default ReservationList
