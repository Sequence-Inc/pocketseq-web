import React from "react";
import HostLayout from "src/layouts/HostLayout";
import { Container } from "@element";

import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { CalendarIcon, CreditCardIcon } from "@heroicons/react/outline";
import Head from "next/head";
import {
    CANCEL_RESERVATION,
    GET_RESERVATION_BY_ID,
} from "src/apollo/queries/space.queries";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { PriceFormatter } from "src/utils";

const AddNewSpace = ({ userSession, id }) => {
    const {
        data,
        loading: reservationLoading,
        error,
        refetch,
    } = useQuery(GET_RESERVATION_BY_ID, {
        variables: {
            id,
        },
    });

    const [cancelReservation] = useMutation(CANCEL_RESERVATION);

    if (reservationLoading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return <h3>Error</h3>;
    }

    const { reservationById } = data;
    const {
        reservationId,
        fromDateTime,
        toDateTime,
        status,
        updatedAt,
        createdAt,
        approved,
        approvedOn,
        space,
        reservee,
        transaction,
    } = reservationById;

    const handleCancel = async () => {
        const choice = confirm(
            "Are you sure you want to cancel this reservation? Cancellation fee may apply!"
        );
        if (choice) {
            try {
                const { data } = await cancelReservation({
                    variables: { reservationId: id },
                });
                alert(`${data.cancelReservation.message}`);
            } catch (error) {
                alert(`Error! ${error.message}`);
            }
            refetch();
        }
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>予約内容</title>
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
                                            予約内容
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-bold text-gray-700">
                            {space.name}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {moment(fromDateTime).format("YYYY/MM/DD HH:mm")}
                            から
                            {moment(toDateTime).format("YYYY/MM/DD HH:mm")}まで
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    予約ID
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {reservationId}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    予約者
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {reservee.name ||
                                        `${reservee.lastName} ${reservee.firstName}`}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    From Date Time
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {moment(fromDateTime).format(
                                        "YYYY/MM/DD HH:mm"
                                    )}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    To Date Time
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {moment(toDateTime).format(
                                        "YYYY/MM/DD HH:mm"
                                    )}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Status
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {status}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Reservation approved on
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {approvedOn
                                        ? moment(approvedOn).format(
                                              "YYYY/MM/DD HH:mm"
                                          )
                                        : "-"}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    スペース
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {space.name}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    スペース住所
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    〒{space.address.postalCode}
                                    {space.address.prefecture.name}
                                    {space.address.addressLine1}
                                    {space.address.addressLine2}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    料金
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {PriceFormatter(transaction.amount)}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    お支払いステータス
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {transaction.status}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    お支払い方法
                                </dt>
                                {transaction.paymentMethodInfo && (
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <ul
                                            role="list"
                                            className="border border-gray-200 rounded-md divide-y divide-gray-200"
                                        >
                                            <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                <div className="w-0 flex-1 flex items-center justify-start">
                                                    <CreditCardIcon
                                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="ml-2 flex-1 w-0 truncate text-gray-400">
                                                        {transaction.paymentMethodInfo.brand.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <span className="flex-1 w-0 truncate">
                                                        ...
                                                        {
                                                            transaction
                                                                .paymentMethodInfo
                                                                .last4
                                                        }
                                                    </span>
                                                    <span className="ml-4 flex-1 w-0 truncate">
                                                        {
                                                            transaction
                                                                .paymentMethodInfo
                                                                .expMonth
                                                        }
                                                        /
                                                        {
                                                            transaction
                                                                .paymentMethodInfo
                                                                .expYear
                                                        }
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                    </dd>
                                )}
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    予約キャンセル
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <button
                                        onClick={() => handleCancel()}
                                        disabled={status === "CANCELED"}
                                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-bold text-white sm:ml-3 sm:w-auto sm:text-sm ${
                                            status === "CANCELED"
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        }`}
                                    >
                                        キャンセル
                                    </button>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

export default AddNewSpace;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["user"],
    });
    if (validation !== true) {
        return validation;
    } else {
        const { id } = context.query;

        return {
            props: {
                userSession,
                id,
            },
        };
    }
};
