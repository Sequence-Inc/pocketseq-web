import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useQuery } from "@apollo/client";
import { HOST } from "src/apollo/queries/host.queries";
import React from "react";
import DashboardCard from "src/components/DashboardCard";
import withAuth from "src/utils/withAuth";
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

const HostDashboard = () => {
    const { data, loading, error } = useQuery<{ host: IHost }>(HOST);

    let content;

    if (loading) {
        content = (
            <div className="flex items-center justify-center h-content">
                <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        content = (
            <div className="flex items-center justify-center h-content">
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

    let photoId = null;

    return (
        <HostLayout>
            <Head>
                <title>Dashboard | Host Admin</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 space-y-8">
                {content}
                <PhotoIdUploader />
            </Container>
        </HostLayout>
    );
};

export default withAuth(HostDashboard);
