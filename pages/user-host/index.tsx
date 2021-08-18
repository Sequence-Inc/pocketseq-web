import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from '@element'
import { useQuery } from "@apollo/client";
import { HOST } from "src/apollo/queries/host.queries";
import React from "react";
import DashboardCard from "src/components/DashboardCard";
import withAuth from "src/utils/withAuth";

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
    account: IAccount;
}

const HostDashboard = () => {
    const { data } = useQuery<{ host: IHost }>(HOST);
    return (
        <HostLayout>
            <Head>
                <title>Dashboard | Host Admin</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                {!!data?.host?.account?.balance ?
                    <>
                        <h2 className="text-lg font-medium leading-6 text-gray-900">Overview</h2>
                        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Card */}
                            <DashboardCard
                                Icon={ScaleIcon}
                                name="Available Balance"
                                amount={data?.host?.account?.balance.available[0].currency + data?.host?.account?.balance.available[0].amount}
                                url={data?.host?.account?.url}
                            />
                            <DashboardCard
                                Icon={ScaleIcon}
                                name="Pending Balance"
                                amount={data?.host?.account?.balance.pending[0].currency + data?.host?.account?.balance.pending[0].amount}
                                url={data?.host?.account?.url}
                            />
                        </div>
                    </>
                    : data?.host?.account?.balance === null
                        ? <div className="text-center">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No stripe account</h3>
                            <p className="mt-1 text-sm text-gray-500">{data?.host?.account?.message}</p>
                            <div className="mt-6">
                                <a
                                    href={data?.host?.account?.url}
                                    className="inline-flex justify-center text-sm font-medium text-primary hover:text-primaryHover"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
                                    Add Stripe Account
                                </a>
                            </div>
                        </div>
                        : <div className="flex items-center justify-center h-content">
                            <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                        </div>}
            </Container>
        </HostLayout>
    );
}


export default withAuth(HostDashboard);
