import { useCallback, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { useQuery } from "@apollo/client";
import { Tab } from "@headlessui/react";
import {
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
    ViewListIcon,
} from "@heroicons/react/outline";
import { Container } from "@element";
import { NetworkHelper } from "@comp";

import { classNames } from "src/utils";
import { ACCOUNT_BY_ID } from "src/apollo/queries/admin.queries";
import { BasicAccountInfo } from "src/components/AccountDetails";

function AccountDetails({ accountId }) {
    // get data for accountID this
    const { data, loading, error } = useQuery(ACCOUNT_BY_ID, {
        variables: { accountId },
        fetchPolicy: "cache-only",
    });

    if (loading) return <NetworkHelper type="loading" />;

    if (error) return <NetworkHelper type="error" message={error.message} />;

    const account = data.accountById;

    if (account.length === 0) {
        return <NetworkHelper type="no-data" />;
    }

    const tabs = [
        {
            title: "Host information",
            component: <BasicAccountInfo account={account} />,
        },
        {
            title: "Payment methods",
            component: <>Payment methods of {accountId}</>,
        },
        {
            title: "Bookings",
            component: <>Bookings of {accountId}</>,
        },
    ];

    let accountStatusIcon;

    if (account.emailVerified) {
        if (account.suspended) {
            accountStatusIcon = (
                <XCircleIcon className="w-5 h-5 text-red-400" />
            );
        } else if (account.approved) {
            accountStatusIcon = (
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
            );
        } else {
            accountStatusIcon = (
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
            );
        }
    } else {
        accountStatusIcon = (
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
        );
    }

    let name;
    if (account.__typename === "UserProfile") {
        name = `${account.lastName} ${account.firstName}`;
    } else {
        name = account.name;
    }

    let profilePhotoUrl;
    if (account.profilePhoto) {
        profilePhotoUrl = account.profilePhoto.thumbnail.url;
    } else {
        profilePhotoUrl = `https://avatars.dicebear.com/api/identicon/${account.id}.svg`;
    }

    return (
        <HostLayout>
            <Head>
                <title>Account - Timebook</title>
            </Head>

            <div className="bg-white shadow">
                <Container>
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <img
                                    src={profilePhotoUrl}
                                    className="w-16 h-16 rounded-lg shadow-sm "
                                />
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <h1 className="ml-3 text-2xl font-medium leading-7 capitalize text-gray-700 sm:leading-9 sm:truncate">
                                            {name}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <div className="flex items-center mt-3 text-sm font-medium text-gray-500 sm:mr-6 sm:mt-0">
                                            {account.email}
                                            <div className="ml-2">
                                                {accountStatusIcon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                <div className="w-full sm:px-0">
                    <Tab.Group>
                        <Tab.List className="flex space-x-1 z-10">
                            {Object.values(tabs).map((tab, idx) => (
                                <Tab
                                    key={idx}
                                    className={({ selected }) =>
                                        classNames(
                                            "py-3 px-6 text-sm leading-5 font-medium border-b-2",
                                            selected
                                                ? "text-primary border-primary"
                                                : "text-gray-500 border-transparent hover:bg-white/[0.12] hover:gray-800"
                                        )
                                    }
                                >
                                    {tab.title}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="border-gray-200 border-t-2 -mt-0.5">
                            {Object.values(tabs).map((tab, idx) => (
                                <Tab.Panel
                                    key={idx}
                                    className={classNames("py-3")}
                                >
                                    {tab.component}
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </Container>
        </HostLayout>
    );
}

export default withAuth(AccountDetails);

export async function getServerSideProps(context) {
    const { accountId } = context.query;
    return { props: { accountId } };
}
