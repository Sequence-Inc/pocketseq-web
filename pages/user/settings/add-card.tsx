import React, { useState } from "react";
import Link from "next/link";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Button, Container } from "@element";
import { LoadingSpinner } from "@comp";

import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_PAYMENT_METHOD,
    SETUP_INTENT,
} from "src/apollo/queries/user.queries";
import requireAuth from "src/utils/authecticatedRoute";
import { getSession } from "next-auth/react";
import { config } from "src/utils";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

const AddCard = ({ userSession }) => {
    const {
        data: clientSecret,
        loading: setupIntentLoading,
        error,
    } = useQuery(SETUP_INTENT, { fetchPolicy: "network-only" });

    if (setupIntentLoading) {
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <h3>エラーが発生しました: {error.message} </h3>;
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>カード追加 - {config.appName}</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 w-full">
                <div className="space-y-6">
                    <h2 className="text-lg font-medium leading-6 text-gray-700">
                        カード追加
                    </h2>
                    <div className="space-y-6">
                        {setupIntentLoading && (
                            <h4 className="text-center">Loading...</h4>
                        )}
                        <Elements
                            options={{ clientSecret: clientSecret.setupIntent }}
                            stripe={stripePromise}
                        >
                            <CardForm />
                        </Elements>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

const CardForm = () => {
    const [loading, setLoading] = useState(true);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();

            const { error } = await stripe.confirmSetup({
                //`Elements` instance that was used to create the Payment Element
                elements,
                confirmParams: {
                    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/settings`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="lg:w-1/2 lg:mx-auto bg-white border border-gray-100 shadow-lg rounded-lg p-4 space-y-4">
                <PaymentElement
                    options={{}}
                    onReady={() => setLoading(false)}
                />
                <Button type="submit" variant="primary" disabled={loading}>
                    カード追加
                </Button>

                <div>
                    <Link href="/user/settings">
                        <Button variant="secondary">戻る</Button>
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default AddCard;

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
