import React, { useState } from "react";
import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Button, Container } from "@element";
import { useQuery } from "@apollo/client";

import { GET_PROFILE_FOR_SETTINGS } from "src/apollo/queries/user.queries";
import DashboardCard from "src/components/DashboardCard";
import withAuth from "src/utils/withAuth";
import { IPaymentMethod } from "src/types/timebookTypes";
import Link from "next/link";

const HostDashboard = ({ currentSession }) => {
    const [profile, setProfile] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

    const { data, loading, error } = useQuery(GET_PROFILE_FOR_SETTINGS, {
        fetchPolicy: "network-only",
    });

    if (error)
        return (
            <div className="flex items-center justify-center h-content">
                Error {error.message}
            </div>
        );

    if (loading)
        return (
            <div className="flex items-center justify-center h-content">
                <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
            </div>
        );

    const {
        myProfile,
        paymentSource,
    }: { myProfile: any; paymentSource: IPaymentMethod[] } = data;

    // setProfile(myProfile);
    // setPaymentMethods(paymentSource);

    const removePaymentMethod = (id) => {
        return null;
    };

    const renderPaymentMethods = () => {
        if (paymentSource.length === 0) {
            return (
                <div className="py-10">
                    <h3 className="text-center">No payment methods</h3>
                </div>
            );
        } else {
            return paymentSource.map((card, index) => {
                return (
                    <div
                        key={index}
                        className="flex justify-between bg-white shadow-sm rounded-lg px-6 py-4 text-gray-700"
                    >
                        <div>
                            <span className="inline-block mr-5">
                                {card.brand.toUpperCase()}
                            </span>
                            <span>{card.last4}</span>
                        </div>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                removePaymentMethod(card.id);
                            }}
                            className="text-sm text-red-500 hover:text-red-700"
                        >
                            Remove Card
                        </a>
                    </div>
                );
            });
        }
    };

    return (
        <HostLayout>
            <Head>
                <title>Settings - Timebook</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 w-full">
                <div className="space-y-6">
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Settings
                    </h2>
                    <div>
                        <h3 className="flex justify-between border-b border-gray-300 py-2 mb-4">
                            <span>Payment methods</span>
                            <Link href="/user/settings/add-card">
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="inline-block w-auto"
                                >
                                    + Add card
                                </Button>
                            </Link>
                        </h3>
                        <div className="space-y-3">
                            {renderPaymentMethods()}
                        </div>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

export default withAuth(HostDashboard);
