import { CogIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useQuery } from "@apollo/client";

import { GET_PROFILE } from "src/apollo/queries/user.queries";
import React from "react";
import withAuth from "src/utils/withAuth";
import Link from "next/link";

const tabs = [
    { name: "Profile", href: "#", current: true },
    { name: "Calendar", href: "#", current: false },
    { name: "Recognition", href: "#", current: false },
];
const HostDashboard = ({ currentSession }) => {
    const { data, loading, error } = useQuery(GET_PROFILE, {
        fetchPolicy: "network-only",
    });

    if (loading)
        return (
            <div className="flex items-center justify-center h-content">
                <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center h-content">
                Error {error.message}
            </div>
        );

    const { myProfile: profile } = data;

    let profilePhoto = `https://avatars.dicebear.com/api/identicon/${profile.id}.svg`;
    if (profile.profilePhoto) {
        profilePhoto = profile.profilePhoto.small.url;
    }

    const name = `${profile.firstName} ${profile.lastName}`;
    const nameKana = `${profile.firstNameKana} ${profile.lastNameKana}`;

    const fields = {
        Phone: "(555) 123-4567",
        Email: profile.email,
        Name: name,
        "Name (Kana)": nameKana,
    };
    return (
        <HostLayout>
            <Head>
                <title>Profile - Timebook</title>
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
                                            <Link href="/user/settings">
                                                <a className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                                    <CogIcon
                                                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span>Edit profile</span>
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
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">
                                        About
                                    </dt>
                                    <dd
                                    //     className="mt-1 max-w-prose text-sm text-gray-900 space-y-5"
                                    //     dangerouslySetInnerHTML={{
                                    //         __html: profile.about,
                                    //     }}
                                    />
                                </div>
                            </dl>
                        </div>
                    </article>
                </>
            </Container>
        </HostLayout>
    );
};

// export async function getStaticProps(props) {
//     const { data: localSession, error: localSessionError } =
//         await client.query();
//     const { data, error } = await client.query({ query: HOST });
//     return {
//         props: null,
//     };
// }

export default withAuth(HostDashboard);

function classNames(...args: [string]): string {
    return args.join(" ");
}
