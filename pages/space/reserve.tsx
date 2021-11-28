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
import { render } from "@headlessui/react/dist/utils/render";
import { DateFromTimeStamp, FormatPrice, PriceFormatter } from "src/utils";

const Reserve = ({
    spaceId,
    start,
    end,
    hours,
    price,
    amount,
    spaceName,
    address,
}) => {
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

    const handleReservation = async (paymentSourceId: string) => {
        try {
            const data = await reserveSpace({
                variables: {
                    input: {
                        fromDateTime: parseInt(start, 10) * 1000,
                        toDateTime: parseInt(end, 10) * 1000,
                        spaceId,
                        paymentSourceId,
                    },
                },
            });
            console.log("reserveSpace Data", data);
        } catch (error) {
            // console.log(error.message);
        }
    };

    const { paymentSource } = paymentMethods;

    return (
        <MainLayout>
            <Head>
                <title>Reserve - time book</title>
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
                            <div>
                                <div className=" flex justify-between items-center">
                                    <h2 className="font-bold">
                                        Select a payment method
                                    </h2>
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
                                <div className="space-y-3 mt-4">
                                    {paymentSource &&
                                        paymentSource.map((card, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex justify-between py-3 px-6 rounded-lg bg-primary text-white hover:bg-green-700 cursor-pointer"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        if (
                                                            !reservationLoading
                                                        ) {
                                                            handleReservation(
                                                                card.id
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <span>
                                                        <span className="inline-block mr-4">
                                                            {card.brand.toUpperCase()}
                                                        </span>
                                                        {card.expMonth}/
                                                        {card.expYear}
                                                    </span>
                                                    <span>
                                                        ... {card.last4}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
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
    const { spaceId, start, end, hours, price, amount, spaceName, address } =
        context.query;
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
        },
    };
}
