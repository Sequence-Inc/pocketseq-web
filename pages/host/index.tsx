import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useLazyQuery, useQuery } from "@apollo/client";
import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import { Container } from "@element";
import { HOST } from "src/apollo/queries/host.queries";
import DashboardCard from "src/components/DashboardCard";
import { PhotoIdUploader, AddStripe, LoadingSpinner } from "src/components";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";
import Link from "next/link";

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
    stripeAccount: IAccount;
    approved: boolean;
}

const HostDashboard = ({ userSession }) => {
    const { data, loading, error } = useQuery<{ host: IHost }>(HOST, {
        fetchPolicy: "network-only",
    });

    let content;
    let hasStripeAccount = false;
    let hasPhotoId = false;

    if (loading) {
        return (
            <HostLayout userSession={userSession}>
                <Head>
                    <title>ホスト管理 - {config.appName}</title>
                </Head>
                <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                    <LoadingSpinner />
                </Container>
            </HostLayout>
        );
    }

    if (error) {
        if (error.message === "Your account is pending approval.") {
            return (
                <HostLayout userSession={userSession}>
                    <Head>
                        <title>ホスト管理 - {config.appName}</title>
                    </Head>
                    <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                        <div className="w-full sm:w-1/2 mx-auto h-full">
                            <div className="mt-20 space-y-4 text-gray-600">
                                <h3 className="font-bold text-lg">
                                    ご登録ありがとうございます。
                                </h3>
                                <div>
                                    アカウントの申請を承りました。
                                    <br />
                                    内容を確認致しまして、3営業日以内にご登録のアドレスへご連絡させていただきます。
                                    <br />
                                    3営業日以内に弊社からのご連絡がなかった場合、お手数ですが下記アドレスまでご連絡下さいませ。
                                </div>
                                <div>
                                    お問い合わせ：
                                    <Link href="/contact">
                                        <a className="text-gray-600 hover:text-gray-700 hover:underline">
                                            こちら
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Container>
                </HostLayout>
            );
        }
        return (
            <HostLayout userSession={userSession}>
                <Head>
                    <title>ホスト管理 - {config.appName}</title>
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
        if (data?.host?.stripeAccount?.balance) {
            hasStripeAccount = true;
        }
        if (data?.host?.photoId?.large?.url) {
            hasPhotoId = true;
        }
    }

    const dashboardContent = (host) => {
        if (!host) return null;

        return (
            <>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                    概要
                </h2>
                <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard
                        Icon={ScaleIcon}
                        name="利用可能残高"
                        amount={`${host?.stripeAccount?.balance?.available[0].currency?.toUpperCase()} ${
                            host?.stripeAccount?.balance?.available[0].amount
                        }`}
                        url={host?.stripeAccount?.url}
                    />
                    <DashboardCard
                        Icon={ScaleIcon}
                        name="保留中残高"
                        amount={`${host?.stripeAccount?.balance?.pending[0].currency?.toUpperCase()} ${
                            host?.stripeAccount?.balance?.pending[0].amount
                        }`}
                        url={host?.stripeAccount?.url}
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
                <div className="w-full sm:w-2/3 mx-auto">
                    <div className="my-6 text-gray-700 text-left space-y-3">
                        <h3 className="font-bold text-lg">
                            ご登録ありがとうございます。
                        </h3>
                        <div>
                            アカウントの申請を承りました。
                            <br />
                            内容を確認致しまして、3営業日以内にご登録のアドレスへご連絡させていただきます。
                            <br />
                            3営業日以内に弊社からのご連絡がなかった場合、お手数ですが下記アドレスまでご連絡下さいませ。
                            <br />
                        </div>
                        <div>
                            お問い合わせ：
                            <a href="mailto:info@timeqonnect.jp">
                                info@timeqonnect.jp
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        if (!hasStripeAccount && !hasPhotoId) {
            content = (
                <div className="w-full sm:w-2/3 mx-auto space-y-4">
                    <PhotoIdUploader />
                    <AddStripe account={data.host.stripeAccount} />
                </div>
            );
        } else if (!hasStripeAccount) {
            content = (
                <div className="w-full sm:w-2/3 mx-auto">
                    <AddStripe account={data.host.stripeAccount} />
                </div>
            );
        } else {
            content = (
                <div className="w-full sm:w-2/3 mx-auto">
                    <PhotoIdUploader />
                </div>
            );
        }
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>ホスト管理 - {config.appName}</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8 space-y-8 max-w-4xl h-full">
                <div className="w-full mx-auto h-full space-y-6">{content}</div>
            </Container>
        </HostLayout>
    );
};

export default HostDashboard;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
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
