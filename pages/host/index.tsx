import React from "react";
import Head from "next/head";
import { useQuery } from "@apollo/client";
import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { Container } from "@element";
import { HOST } from "src/apollo/queries/host.queries";
import DashboardCard from "src/components/DashboardCard";
import { PhotoIdUploader, AddStripe } from "src/components";

interface IBalanceInput {
    currency: string;
    amount: string;
}

interface IBalance {
    available: IBalanceInput[];
    pending: IBalanceInput[];
}

interface IAccount {
    message: string;
    url: string;
    balance: IBalance | null;
}

interface IHost {
    id: string;
    name: string;
    stripeAccountId: string;
    photoId: string;
    account: IAccount;
}

const HostDashboard = ({ currentSession }) => {
    const { data, loading, error } = useQuery<{ host: IHost }>(HOST);
    console.log("CurrentUser from WithAuth", currentSession);
    let content;

    if (loading) {
        content = (
            <div className="flex items-center justify-center h-content">
                <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        content = (
            <div className="flex items-center justify-center h-1/4">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                    {error.message}
                </h2>
            </div>
        );
    } else {
        if (data) {
            if (!!data?.host?.account?.balance) {
                content = (
                    <>
                        <h2 className="text-lg font-medium leading-6 text-gray-900">
                            Overview
                        </h2>
                        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Card */}
                            <DashboardCard
                                Icon={ScaleIcon}
                                name="Available Balance"
                                amount={`${data?.host?.account?.balance.available[0].currency?.toUpperCase()} ${
                                    data?.host?.account?.balance?.available[0]
                                        .amount
                                }`}
                                url={data?.host?.account?.url}
                            />
                            <DashboardCard
                                Icon={ScaleIcon}
                                name="Pending Balance"
                                amount={`${data?.host?.account?.balance.pending[0].currency?.toUpperCase()} ${
                                    data?.host?.account?.balance.pending[0]
                                        .amount
                                }`}
                                url={data?.host?.account?.url}
                            />
                        </div>
                    </>
                );
            } else {
                content = <AddStripe account={data.host.account} />;
            }
        }
    }

    return (
        <HostLayout>
            <Head>
                <title>Host - Timebook</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                <div className="w-full sm:w-1/2 mx-auto h-full">
                    {content}
                    <PhotoIdUploader />
                </div>
            </Container>
        </HostLayout>
    );
};

export default withAuth(HostDashboard);