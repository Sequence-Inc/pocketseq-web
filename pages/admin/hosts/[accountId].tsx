import { useState } from "react";
import Head from "next/head";
import HostLayout from "src/layouts/HostLayout";
import { useQuery } from "@apollo/client";
import { Tab } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/outline";
import { Container } from "@element";
import { NetworkHelper } from "@comp";
import {
    BasicAccountInfo,
    HostAccountInfo,
} from "src/components/AccountDetails";

import { classNames, config } from "src/utils";
import { ACCOUNT_BY_ID } from "src/apollo/queries/admin.queries";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";

function AdminDashboard({ userSession, accountId }) {
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

    // get data for accountID this

    let [tabs] = useState([
        {
            title: "Host information",
            component: <HostAccountInfo account={account} />,
        },
        {
            title: "Kanrisha information",
            component: <BasicAccountInfo account={account} />,
        },
        {
            title: "Bookings",
            component: <>Bookings of {accountId}</>,
        },
    ]);

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Host account - {config.appName}</title>
            </Head>

            <div className="bg-white shadow">
                <Container>
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                {/* <div className="hidden w-16 h-16 border rounded-lg shadow-sm sm:flex sm:justify-center sm:items-center">
                                    <ViewListIcon className="w-10 h-10 text-primary" />
                                </div> */}
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            Host
                                        </h1>
                                    </div>
                                    <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <dt className="sr-only">
                                            Total accounts
                                        </dt>
                                        <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 capitalize sm:mr-6 sm:mt-0">
                                            <UsersIcon
                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            12 accounts
                                        </dd>
                                    </dl>
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

export default AdminDashboard;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["admin"],
    });
    if (validation !== true) {
        return validation;
    } else {
        const { accountId } = context.query;
        return {
            props: {
                userSession,
                accountId,
            },
        };
    }
};
