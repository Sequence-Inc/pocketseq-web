import { useState } from "react";
import Head from "next/head";
import HostLayout from "src/layouts/HostLayout";
import { Tab } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/solid";
import { Container } from "@element";
import { HostsList } from "@comp";

import { classNames, config } from "src/utils";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";

function AdminDashboard({ userSession }) {
    let [tabs] = useState([
        {
            title: "Approved",
            component: (
                <HostsList
                    filterOptions={{
                        roles: ["host"],
                        approved: true,
                        suspended: false,
                    }}
                />
            ),
        },
        {
            title: "Unapproved",
            component: (
                <HostsList
                    filterOptions={{
                        roles: ["host"],
                        approved: false,
                        suspended: false,
                    }}
                />
            ),
        },
        {
            title: "Suspended",
            component: (
                <HostsList
                    filterOptions={{
                        roles: ["host"],
                        suspended: true,
                    }}
                />
            ),
        },
    ]);

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Hosts - {config.appName}</title>
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
                                            Hosts
                                        </h1>
                                    </div>
                                    <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <dt className="sr-only">Total hosts</dt>
                                        <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 capitalize sm:mr-6 sm:mt-0">
                                            <UsersIcon
                                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            12 hosts
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
        return {
            props: {
                userSession,
            },
        };
    }
};
