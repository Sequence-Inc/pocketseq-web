import React, { useEffect, useState } from "react";
import { MainLayout } from "@layout";
import Head from "next/head";
import { Button, Container } from "@element";
import {
    GET_PAYMENT_SOURCES,
    RESERVE_SPACE,
} from "src/apollo/queries/user.queries";
import { useMutation, useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { LoadingSpinner } from "@comp";
import {
    config,
    DateFromTimeStamp,
    fromBase64,
    PriceFormatter,
} from "src/utils";
import { getSession, signIn } from "next-auth/react";
import createApolloClient from "src/apollo/apolloClient";
import {
    GET_PRICE_PLANS,
    GET_SPACE_BY_ID,
} from "src/apollo/queries/space.queries";
import moment from "moment";
import { durationSuffix } from "src/components/Space/PricingPlan";

const Reserve = ({ space, start, end, duration, type, total, userSession }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [reservationComplete, setReservationComplete] = useState(null);

    const startDateTime = moment(start);
    const endDateTime = moment(end);

    const dateDisplayFormat =
        type === "DAILY" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm";

    const [
        fetchPaymentMethods,
        { data: paymentMethods, loading: paymentMethodsLoading, error },
    ] = useLazyQuery(GET_PAYMENT_SOURCES, { fetchPolicy: "network-only" });

    const { id: spaceId, name, address, photos } = space;

    const [
        reserveSpace,
        { loading: reservationLoading, error: reservationError },
    ] = useMutation(RESERVE_SPACE);

    const getPaymentMethods = async () => {
        try {
            await fetchPaymentMethods();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (userSession) {
            getPaymentMethods();
        }
    }, []);

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
            const { data } = await reserveSpace({
                variables: {
                    input: {
                        fromDateTime:
                            type === "DAILY"
                                ? startDateTime.startOf("day").unix() * 1000
                                : startDateTime.unix() * 1000,
                        duration,
                        durationType: type,
                        spaceId,
                        paymentSourceId: selectedPaymentMethod,
                    },
                },
            });
            setReservationComplete(data);
        } catch (error) {
            alert(`Error: ${error.message}`);
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

    const { paymentSource } = paymentMethods || { paymentSource: null };

    const addressText = `〒${address.postalCode}${address.prefecture.name}${address.addressLine1}${address.addressLine2}`;

    const taxableAmount = total / 1.1;

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>Reserve - {config.appName}</title>
            </Head>
            <Container className="mt-16">
                <div className="relative flex space-x-12">
                    <div className="flex-1 py-40">
                        <div className="lg:w-1/3 lg:mx-auto text-gray-700 space-y-4 bg-white px-5 py-5 border border-gray-100 rounded-xl shadow-xl">
                            <div className="space-y-4">
                                <div className="relative w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                                    <img
                                        src={photos[0].large.url}
                                        alt="category items"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {name}
                                    </h3>
                                    <div className="text-gray-500 text-sm mt-2">
                                        {addressText}
                                    </div>
                                </div>
                                <div className="h-0 border-t border-gray-200"></div>
                                <h2 className="font-bold">
                                    Reservation Details
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>チェックイン:</span>
                                        <span className="font-bold">
                                            {startDateTime.format(
                                                dateDisplayFormat
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>チェックアウト:</span>
                                        <span className="font-bold">
                                            {endDateTime.format(
                                                dateDisplayFormat
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>期間:</span>
                                        <span className="font-bold">
                                            {duration}
                                            {durationSuffix(type)}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-0 border-t border-gray-200"></div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>小計:</span>
                                        <span className="font-bold">
                                            {PriceFormatter(taxableAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>税金:</span>
                                        <span className="font-bold">
                                            {PriceFormatter(
                                                total - taxableAmount
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>会計:</span>
                                        <span className="font-bold">
                                            {PriceFormatter(total)}
                                        </span>
                                    </div>
                                </div>
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
                                        <div>
                                            {
                                                reservationComplete.reserveSpace
                                                    .description
                                            }
                                        </div>
                                        <div>
                                            Reservation ID:{" "}
                                            {
                                                reservationComplete.reserveSpace
                                                    .transactionId
                                            }
                                        </div>
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
                                    {userSession ? (
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
                                            <div className="mt-4">
                                                <Button
                                                    type="button"
                                                    variant={
                                                        selectedPaymentMethod ===
                                                        null
                                                            ? "disabled"
                                                            : "primary"
                                                    }
                                                    className="inline-block"
                                                    disabled={
                                                        selectedPaymentMethod ===
                                                        null
                                                    }
                                                    onClick={handleReservation}
                                                >
                                                    Pay and Reserve
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="font-bold text-center mb-4">
                                                Please login to finish
                                                reservation
                                            </div>
                                            <Button
                                                type="button"
                                                variant="primary"
                                                className="inline-block"
                                                onClick={() =>
                                                    signIn("credentials")
                                                }
                                            >
                                                ログイン
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="h-0 border-t border-gray-200 py-5">
                                <Link href={`/space/${spaceId}`}>
                                    <a>&#8592; 戻る</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </MainLayout>
    );
};

export default Reserve;

export async function getServerSideProps(context) {
    const { id, data } = context.query;

    const decodedData = JSON.parse(fromBase64(data));
    const { start, end, duration, type } = decodedData;

    const startDateTime = moment(start);
    const fromDateTime =
        type === "DAILY"
            ? startDateTime.startOf("day").unix() * 1000
            : startDateTime.startOf("hour").unix() * 1000;

    const client = createApolloClient();
    const spaceData = await client.query({
        query: GET_SPACE_BY_ID,
        variables: { id },
    });
    const reservationData = await client.query({
        query: GET_PRICE_PLANS,
        variables: {
            input: {
                fromDateTime,
                duration,
                durationType: type,
                spaceId: id,
            },
        },
    });
    const { total } = reservationData.data.getApplicablePricePlans;
    const userSession = await getSession(context);
    return {
        props: {
            space: spaceData.data.spaceById,
            start,
            end,
            duration,
            type,
            total,
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
