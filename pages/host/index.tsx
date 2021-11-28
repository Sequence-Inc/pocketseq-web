import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useLazyQuery, useQuery } from "@apollo/client";
import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { Container } from "@element";
import { HOST } from "src/apollo/queries/host.queries";
import DashboardCard from "src/components/DashboardCard";
import { PhotoIdUploader, AddStripe, LoadingSpinner } from "src/components";

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
    photoId: any;
    account: IAccount;
    approved: boolean;
}

const HostDashboard = ({ currentSession }) => {
    const { data, loading, error } = useQuery<{ host: IHost }>(HOST, {
        fetchPolicy: "network-only",
    });

    let content;
    let hasStripeAccount = false;
    let hasPhotoId = false;

    if (loading) {
        return (
            <HostLayout>
                <Head>
                    <title>ホスト管理 - time book</title>
                </Head>
                <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                    <LoadingSpinner />
                </Container>
            </HostLayout>
        );
    }

    if (error) {
        return (
            <HostLayout>
                <Head>
                    <title>ホスト管理 - time book</title>
                </Head>
                <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                    <div className="w-full sm:w-1/2 mx-auto h-full space-y-6">
                        <div className="flex items-center justify-center h-1/4">
                            <h2 className="text-lg font-medium leading-6 text-gray-900">
                                {error.message}
                            </h2>
                        </div>
                    </div>
                </Container>
            </HostLayout>
        );
    }
    if (data) {
        if (data?.host?.account?.balance) {
            hasStripeAccount = true;
        }
        if (data?.host?.photoId?.large?.url) {
            hasPhotoId = true;
        }
    }

    console.log(hasStripeAccount, hasPhotoId, data);

    const dashboardContent = (host) => {
        if (!host) return null;

        return (
            <>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                    Overview
                </h2>
                <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard
                        Icon={ScaleIcon}
                        name="Available Balance"
                        amount={`${host?.account?.balance?.available[0].currency?.toUpperCase()} ${
                            host?.account?.balance?.available[0].amount
                        }`}
                        url={host?.account?.url}
                    />
                    <DashboardCard
                        Icon={ScaleIcon}
                        name="Pending Balance"
                        amount={`${host?.account?.balance?.pending[0].currency?.toUpperCase()} ${
                            host?.account?.balance?.pending[0].amount
                        }`}
                        url={host?.account?.url}
                    />
                </div>
            </>
        );
    };

    if (hasStripeAccount && hasPhotoId) {
        if (data?.host.approved) {
            content = dashboardContent(data?.host);
        } else {
            content = (
                <div className="sm:w-1/2 mx-auto">
                    <div className="my-6 text-gray-700">
                        Your account is pending approval from Timebook
                        administration.
                    </div>
                </div>
            );
        }
    } else {
        if (!hasStripeAccount && !hasPhotoId) {
            content = (
                <div className="sm:w-1/2 mx-auto space-y-4">
                    <PhotoIdUploader />
                    <AddStripe account={data.host.account} />
                </div>
            );
        } else if (!hasStripeAccount) {
            content = (
                <div className="sm:w-1/2 mx-auto">
                    <AddStripe account={data.host.account} />
                </div>
            );
        } else {
            content = (
                <div className="sm:w-1/2 mx-auto">
                    <PhotoIdUploader />
                </div>
            );
        }
    }

    return (
        <HostLayout>
            <Head>
                <title>ホスト管理 - time book</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                <div className="w-full mx-auto h-full space-y-6">{content}</div>
            </Container>
        </HostLayout>
    );
};

export default withAuth(HostDashboard);
