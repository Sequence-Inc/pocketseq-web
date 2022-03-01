import React, { useState } from "react";
import { MainLayout } from "@layout";
import Head from "next/head";
import { Button, Container } from "@element";
import {
    GET_PAYMENT_SOURCES,
    RESERVE_SPACE,
} from "src/apollo/queries/user.queries";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { LoadingSpinner } from "@comp";
import {
    config,
    DateFromTimeStamp,
    FormatPrice,
    PriceFormatter,
} from "src/utils";
import { appendErrors } from "react-hook-form";
import { getSession } from "next-auth/react";

const Reserve = ({
    spaceId,
    start,
    end,
    hours,
    price,
    amount,
    spaceName,
    address,
    userSession,
}) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [reservationComplete, setReservationComplete] = useState(null);
    const {
        data: paymentMethods,
        loading: paymentMethodsLoading,
        error,
    } = useQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });

    const [
        reserveSpace,
        { loading: reservationLoading, error: reservationError },
    ] = useMutation(RESERVE_SPACE);
    if (reservationError) {
        console.log(reservationError);
    }
    if (error) {
        return (
            <div>
                <h3>An error occurred: {error.message}</h3>
                <Link href="/">
                    <Button type="submit">Go Back</Button>
                </Link>
            </div>
        );
    }

    if (paymentMethodsLoading) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    const handleReservation = async () => {
        try {
            if (!selectedPaymentMethod) {
                alert("Select card for payment");
                return;
            }
            const { data, errors } = await reserveSpace({
                variables: {
                    input: {
                        fromDateTime: parseInt(start, 10) * 1000,
                        toDateTime: parseInt(end, 10) * 1000,
                        spaceId,
                        paymentSourceId: selectedPaymentMethod,
                    },
                },
            });
            // console.log("reserveSpace Data", data);
            if (!errors) {
                setReservationComplete(data);
            }
        } catch (error) {
            // console.log(error.message);
        }
    };

    const selectPaymentMethod = (paymentSourceId: string) => {
        if (paymentSourceId) {
            if (paymentSourceId === selectedPaymentMethod) {
                setSelectedPaymentMethod(null);
            } else {
                setSelectedPaymentMethod(paymentSourceId);
            }
        }
    };

    const { paymentSource } = paymentMethods;

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>Reserve - {config.appName}</title>
            </Head>
            <Container className="mt-16">
                <div className="relative flex space-x-12">
                    <div className="flex-1 py-40">
                        <div className="lg:w-1/3 lg:mx-auto text-gray-700 space-y-8 bg-white px-6 py-5 border border-gray-100 rounded-xl shadow-xl">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {spaceName}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {address}
                                    </p>
                                </div>
                                <h2 className="font-bold">
                                    Reservation Details
                                </h2>
                                <p className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-bold">
                                        {DateFromTimeStamp(start, "date")}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="font-bold">
                                        {DateFromTimeStamp(start, "time")}〜
                                        {DateFromTimeStamp(end, "time")}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="font-bold">
                                        {" "}
                                        {hours}時間
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Price:</span>
                                    <span className="font-bold">
                                        {" "}
                                        {PriceFormatter(price)}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-bold">
                                        {" "}
                                        {PriceFormatter(amount)}
                                    </span>
                                </p>
                            </div>
                            <div className="h-0 border-t border-gray-200"></div>
                            {reservationError && (
                                <div className="bg-red-100 text-red-600 py-4 px-5 rounded-lg border border-red-200">
                                    {reservationError.message}
                                </div>
                            )}
                            {reservationLoading && (
                                <div className="bg-gray-100 text-gray-600 py-4 px-5 rounded-lg border border-gray-200">
                                    Reserving...
                                </div>
                            )}
                            {reservationComplete ? (
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg text-green-800">
                                        Reservation complete
                                    </h3>
                                    <div className="space-y-1">
                                        <p>
                                            {
                                                reservationComplete.reserveSpace
                                                    .description
                                            }
                                        </p>
                                        <p>
                                            Reservation ID:{" "}
                                            {
                                                reservationComplete.reserveSpace
                                                    .transactionId
                                            }
                                        </p>
                                    </div>
                                    <div className="space-y-3 pt-1">
                                        <div>
                                            <Link href="/user/profile">
                                                <Button variant="primary">
                                                    Go to profile
                                                </Button>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/">
                                                <Button variant="secondary">
                                                    Go back to home
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <PaymentMethods
                                            paymentSource={paymentSource}
                                            reservationLoading={
                                                reservationLoading
                                            }
                                            selectPaymentMethod={
                                                selectPaymentMethod
                                            }
                                            currentPaymentMethod={
                                                selectedPaymentMethod
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            variant={
                                                selectedPaymentMethod === null
                                                    ? "disabled"
                                                    : "primary"
                                            }
                                            className="inline-block"
                                            disabled={
                                                selectedPaymentMethod === null
                                            }
                                            onClick={handleReservation}
                                        >
                                            Pay and Reserve
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </MainLayout>
    );
};

export default Reserve;

export async function getServerSideProps(context) {
    const { spaceId, start, end, hours, price, amount, spaceName, address } =
        context.query;
    const userSession = await getSession();
    return {
        props: {
            spaceId,
            start,
            end,
            hours,
            price,
            amount,
            spaceName,
            address,
            userSession,
        },
    };
}

const PaymentMethods = ({
    paymentSource,
    reservationLoading,
    currentPaymentMethod,
    selectPaymentMethod,
}) => {
    return (
        <div>
            <div className=" flex justify-between items-center">
                <h2 className="font-bold">Select a payment method</h2>
                <Link href="/user/settings/add-card">
                    <a target="_blank">
                        <Button
                            type="button"
                            variant="white"
                            className="inline-block"
                        >
                            Add card
                        </Button>
                    </a>
                </Link>
            </div>
            <div className="space-y-4 mt-4">
                {paymentSource &&
                    paymentSource.map((card, index) => {
                        let style =
                            "flex justify-between py-3 px-6 rounded-lg cursor-pointer ";
                        if (card.id === currentPaymentMethod) {
                            style +=
                                "border-2 border-primary bg-green-50 text-green-700";
                        } else {
                            style +=
                                "border-2 border-gray-100 text-gray-700 hover:bg-gray-50";
                        }
                        return (
                            <div
                                key={index}
                                className={style}
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (!reservationLoading) {
                                        selectPaymentMethod(card.id);
                                    }
                                }}
                            >
                                <span>
                                    <span className="inline-block mr-4">
                                        {card.brand.toUpperCase()}
                                    </span>
                                    {card.expMonth}/{card.expYear}
                                </span>
                                <span>... {card.last4}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
