import { useQuery } from '@apollo/client'
import { Container, Table } from '@element'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { MY_RESERVATION } from 'src/apollo/queries/user.queries'
import { IColumns } from 'src/elements/Table'
import HostLayout from 'src/layouts/HostLayout'
import { format } from 'date-fns'

const noOfItems = 10;

const ReservationList = () => {
    const [columns, setColumns] = useState<IColumns[] | undefined>();
    const [skip, setSkip] = useState<number>(0);
    const { data, refetch } = useQuery(MY_RESERVATION, { fetchPolicy: "network-only", variables: { paginate: { take: noOfItems, skip: 0 }, filter: {} } });

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
            Cell: ({ column, value }) => {
                if (!value) return "";
                if (column.id === "space") {
                    return value.name
                } else if (column.id === "fromDateTime" || column.id === "toDateTime") {
                    return format(new Date(value), "yyyy-MM-dd, HH:mm");
                } else return value;
            }
        }));
        const filteredNewData = newData.filter((res) => res !== undefined);
        setColumns(filteredNewData);
    }, []);

    const handleNextPrev = (type: 'next' | 'prev') => {
        const hasNext = data?.myReservations?.paginationInfo?.hasNext;
        const hasPrevious = data?.myReservations?.paginationInfo?.hasNext;
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
                        data={data?.myReservations?.data || []}
                        paginate={data?.myReservations?.paginationInfo}
                        handlePaginate={handleNextPrev}
                    />
                )}
            </Container>
        </HostLayout>
    )
}

export default ReservationList
