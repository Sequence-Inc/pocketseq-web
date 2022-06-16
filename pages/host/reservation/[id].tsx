import React, { useState, useEffect, Fragment, useRef } from "react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/client";
import {
    CalendarIcon,
    CreditCardIcon,
    ExclamationIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";

import HostLayout from "src/layouts/HostLayout";
import { Button, Container } from "@element";
import requireAuth from "src/utils/authecticatedRoute";
import { GET_RESERVATION_BY_ID } from "src/apollo/queries/space.queries";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { PriceFormatter } from "src/utils";
import {
    APPROVE_RESERVATION,
    CANCEL_RESERVATION_HOST,
} from "src/apollo/queries/host.queries";

const ReservationById = ({ userSession, id }) => {
    const [open, setOpen] = useState(false);

    const [cancelChargePercent, setCancelChargePercent] = useState(0);
    const [cancelChargeAmount, setCancelChargeAmount] = useState(0);
    const [cancelRemarks, setCancelRemarks] = useState("");

    const cancelButtonRef = useRef(null);

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

    const [approveReservation] = useMutation(APPROVE_RESERVATION);
    const [
        cancelReservation,
        { loading: cancelReservationLoading, error: cancelReservationError },
    ] = useMutation(CANCEL_RESERVATION_HOST);

    const handleApprove = async (reservationId: string) => {
        try {
            await approveReservation({
                variables: { reservationId },
            });
            alert("Approved");
            refetch();
        } catch (err) {
            console.log(err);
        }
    };

    const handleReservationCancel = async (
        reservationId,
        cancelCharge,
        remarks
    ) => {
        try {
            const { data } = await cancelReservation({
                variables: { input: { reservationId, cancelCharge, remarks } },
            });
            setOpen(false);
            alert(data.cancelReservation.message);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    if (reservationLoading) {
        return <LoadingSpinner />;
    }
    if (error) {
        console.log(error);
        return <h3>Error: {error.message}</h3>;
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
                    <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                        <div className="">
                            <h3 className="text-lg leading-6 font-bold text-gray-700">
                                {space.name}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                {moment(fromDateTime).format(
                                    "YYYY/MM/DD HH:mm"
                                )}
                                から
                                {moment(toDateTime).format("YYYY/MM/DD HH:mm")}
                                まで
                            </p>
                        </div>
                        {status !== "CANCELED" && (
                            <div className="flex w-60 space-x-4 items-center">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                >
                                    キャンセル
                                </Button>

                                <Button
                                    type="button"
                                    variant={approved ? "disabled" : "primary"}
                                    disabled={approved}
                                    onClick={() => {
                                        handleApprove(id);
                                    }}
                                >
                                    {approved ? "承認済み" : "承認する"}
                                </Button>
                            </div>
                        )}
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
                        </dl>
                    </div>
                </div>
            </Container>
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationIcon
                                            className="h-6 w-6 text-red-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left divide-y">
                                        <div>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900"
                                            >
                                                予約をキャンセルする
                                            </Dialog.Title>
                                            <p className="mt-3 text-sm text-gray-500">
                                                この予約をキャンセルしてもよろしいですか？
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-4 mb-4 space-y-3">
                                            <div className="text-sm text-gray-500">
                                                <span className="inline-block w-40 font-bold">
                                                    予約番号
                                                </span>
                                                <span>{reservationId}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="inline-block w-40 font-bold">
                                                    本料金
                                                </span>
                                                <span>
                                                    {PriceFormatter(
                                                        transaction.amount
                                                    )}
                                                    <span className="text-xs">
                                                        (税込)
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="inline-block w-40 font-bold">
                                                    キャンセル料金％
                                                </span>
                                                <span>
                                                    <input
                                                        disabled={
                                                            cancelReservationLoading
                                                        }
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        className="px-2 py-1 border-gray-200 rounded mr-2"
                                                        value={
                                                            cancelChargePercent
                                                        }
                                                        onChange={(event) => {
                                                            const value =
                                                                parseFloat(
                                                                    event.target
                                                                        .value
                                                                );
                                                            if (value < 0) {
                                                                alert(
                                                                    "Cancel charge can not be less than 0%."
                                                                );
                                                            } else if (
                                                                value > 100
                                                            ) {
                                                                alert(
                                                                    "Cancel charge can not be more than 100%"
                                                                );
                                                            } else {
                                                                setCancelChargePercent(
                                                                    value
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex text-sm text-gray-500">
                                                <span className="inline-block w-40 font-bold">
                                                    キャンセル理由
                                                </span>
                                                <span>
                                                    <textarea
                                                        disabled={
                                                            cancelReservationLoading
                                                        }
                                                        className="px-2 py-1 border-gray-200 rounded mr-2"
                                                        value={cancelRemarks}
                                                        onChange={(event) => {
                                                            setCancelRemarks(
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 mb-4 space-y-3">
                                            <div className="text-sm text-gray-500">
                                                <span className="inline-block w-40 font-bold">
                                                    キャンセル料金
                                                </span>
                                                <span className="font-bold">
                                                    {PriceFormatter(
                                                        transaction.amount *
                                                            (cancelChargePercent /
                                                                100)
                                                    )}
                                                    <span className="text-xs font-normal">
                                                        (税込)
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        disabled={cancelReservationLoading}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            handleReservationCancel(
                                                id,
                                                cancelChargePercent,
                                                cancelRemarks
                                            );
                                        }}
                                    >
                                        Cancel seservation
                                    </button>
                                    <button
                                        type="button"
                                        disabled={cancelReservationLoading}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Do not cancel resrvation
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </HostLayout>
    );
};

export default ReservationById;

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
        const { id } = context.query;

        return {
            props: {
                userSession,
                id,
            },
        };
    }
};
