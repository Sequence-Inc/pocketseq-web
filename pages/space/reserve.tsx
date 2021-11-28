import React from "react";
import { MainLayout } from "@layout";
import Head from "next/head";
import { Button, Container } from "@element";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { LoadingSpinner } from "@comp";
import { render } from "@headlessui/react/dist/utils/render";
import { DateFromTimeStamp } from "src/utils";

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

    const { paymentSource } = paymentMethods;

    return (
        <MainLayout>
            <Head>
                <title>Reserve - time book</title>
            </Head>
            <Container className="mt-16">
                <div className="relative flex space-x-12">
                    <div className="flex-1 py-40">
                        <div className="lg:w-1/2 lg:mx-auto text-gray-700 space-y-8 bg-white px-6 py-5 border border-gray-100 rounded-xl shadow-xl">
                            <div>
                                <p>spaceId: {spaceId}</p>
                                <p>start: {DateFromTimeStamp(start)}</p>
                                <p>end: {DateFromTimeStamp(end)}</p>
                                <p>hours: {hours}</p>
                                <p>price: {price}</p>
                                <p>amount: {amount}</p>
                                <p>spaceName: {spaceName}</p>
                                <p>address: {address}</p>
                            </div>
                            <div>
                                <h2>Select a payment method</h2>
                                {paymentSource &&
                                    paymentSource.map((card, index) => {
                                        return (
                                            <div key={index}>
                                                <span>
                                                    {card.brand}
                                                    {card.last4}
                                                </span>
                                                <span>
                                                    {card.expMonth}/
                                                    {card.expYear}
                                                </span>
                                            </div>
                                        );
                                    })}
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
