import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";

import withAuth from "src/utils/withAuth";

import {
    useStripe,
    useElements,
    Elements,
    CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@apollo/client";
import { ADD_PAYMENT_METHOD } from "src/apollo/queries/user.queries";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

const HostDashboard = () => {
    return (
        <HostLayout>
            <Head>
                <title>Add card - Timebook</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 w-full">
                <div className="space-y-6">
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Add card
                    </h2>
                    <div>
                        <Elements stripe={stripePromise}>
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

    const [addPaymentMethod] = useMutation(ADD_PAYMENT_METHOD, {
        onCompleted: async (data) => {
            try {
                console.log(data);
                alert("Card successfully added");
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        },
        onError: (err) => {
            console.log(err);
            setLoading(false);
            alert(`Error ${err.message}`);
        },
    });

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (error) {
            setLoading(false);
            alert(`Error: ${error.message}`);
            return;
        } else {
            // attach payment method to user
            await addPaymentMethod({
                variables: { paymentMethodId: paymentMethod.id },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{ hidePostalCode: true, disabled: loading }}
                onReady={() => setLoading(false)}
            />
            <button disabled={loading}>Submit</button>
        </form>
    );
};

export default withAuth(HostDashboard);
