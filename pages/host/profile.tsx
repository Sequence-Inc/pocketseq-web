import { CogIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useQuery } from "@apollo/client";

import { GET_PROFILE } from "src/apollo/queries/user.queries";
import React from "react";
import withAuth from "src/utils/withAuth";
import Link from "next/link";
import requireAuth from "src/utils/authecticatedRoute";
import { getSession } from "next-auth/react";
import { config } from "src/utils";
import { LoadingSpinner } from "src/components/LoadingSpinner";

const tabs = [{ name: "プロフィール", href: "#", current: true }];
const HostDashboard = ({ userSession }) => {
    const isHost = userSession.user.roles.includes("host");

    const { data, loading, error } = useQuery(GET_PROFILE, {
        fetchPolicy: "network-only",
    });

    if (loading) return <LoadingSpinner />;

    if (error)
        return (
            <div className="flex items-center justify-center h-content">
                Error {error.message}
            </div>
        );

    const { myProfile: profile } = data;

    let profilePhoto = `https://avatars.dicebear.com/api/identicon/${profile.id}.svg`;

    if (isHost) {
        if (profile.host.profilePhoto) {
            profilePhoto = profile.host.profilePhoto.medium.url;
        }
    } else {
        if (profile.profilePhoto) {
            profilePhoto = profile.profilePhoto.medium.url;
        }
    }

    const name = `${profile.lastName} ${profile.firstName}`;
    const nameKana = `${profile.lastNameKana} ${profile.firstNameKana}`;

    const fields = {
        性: profile.lastName,
        名: profile.firstName,
        "性（カナ）": profile.lastNameKana,
        "名（カナ）": profile.firstNameKana,
        Email: profile.email,
    };

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>プロフィール - {config.appName}</title>
            </Head>
            <Container className="py-4 sm:py-6 lg:py-8">
                <>
                    <article>
                        {/* Profile header */}
                        <div>
                            <div>
                                <div className="h-32 w-full bg-primary lg:h-48"></div>
                            </div>
                            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                                    <div className="flex">
                                        <img
                                            className="h-24 w-24 rounded-full ring-4 ring-white bg-white sm:h-32 sm:w-32"
                                            src={profilePhoto}
                                            alt={name}
                                        />
                                    </div>
                                    <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                                        <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                                            <h1 className="text-2xl font-bold text-gray-900 truncate">
                                                {name}
                                            </h1>
                                        </div>
                                        <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0">
                                            <Link href="/settings">
                                                <a className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                                    <CogIcon
                                                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span>
                                                        プロフィールの編集
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                                        {name}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-6 sm:mt-2 2xl:mt-5">
                            <div className="border-b border-gray-200">
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <nav
                                        className="-mb-px flex space-x-8"
                                        aria-label="Tabs"
                                    >
                                        {tabs.map((tab) => (
                                            <a
                                                key={tab.name}
                                                href={tab.href}
                                                className={
                                                    tab.current
                                                        ? "border-primary text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                                                }
                                                aria-current={
                                                    tab.current
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {tab.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Description list */}
                        <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                {Object.keys(fields).map((field) => (
                                    <div key={field} className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            {field}
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {fields[field]}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </article>
                </>
            </Container>
        </HostLayout>
    );
};

export default HostDashboard;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/api/auth/signin",
        roles: ["user", "host"],
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
