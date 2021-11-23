import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useQuery } from "@apollo/client";

import client from "../../src/apollo/apolloClient";

import { GET_PROFILE } from "src/apollo/queries/user.queries";
import React from "react";
import DashboardCard from "src/components/DashboardCard";
import withAuth from "src/utils/withAuth";

const HostDashboard = ({ currentSession }) => {
    const { data, loading, error } = useQuery(GET_PROFILE);

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

    return (
        <HostLayout>
            <Head>
                <title>Settings - Timebook</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Settings
                    </h2>
                    <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3"></div>
                </>
            </Container>
        </HostLayout>
    );
};

export default withAuth(HostDashboard);
