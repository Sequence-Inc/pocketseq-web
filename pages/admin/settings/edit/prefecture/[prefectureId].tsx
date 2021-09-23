import { useCallback, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import withAuth from "src/utils/withAuth";
import HostLayout from "src/layouts/HostLayout";
import { useQuery } from "@apollo/client";
import { Tab } from "@headlessui/react";
import { UsersIcon, PlusIcon } from "@heroicons/react/solid";
import { Button, Container, Table } from "@element";
import { AccountsList } from "@comp";

import { classNames } from "src/utils";
import { useRouter } from "next/router";

import { cache } from "../../../../../src/apollo/cache";
import { PREFECTURE_BY_ID } from "src/apollo/queries/admin.queries";

function AdminDashboard({ prefectureId }) {
    // get data for accountID this
    console.log("get data for prefectureId", prefectureId);
    const prefecture = cache.readQuery({
        query: PREFECTURE_BY_ID,
        variables: { id: prefectureId },
    });

    console.log(prefectureId);

    return (
        <HostLayout>
            <Head>
                <title>Edit Prefecture - Timebook</title>
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
                                            Edit Prefecture
                                        </h1>
                                    </div>
                                    <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <dt className="sr-only">
                                            [Prefecture Name]
                                        </dt>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                <div className="w-full sm:px-0"></div>
            </Container>
        </HostLayout>
    );
}

export default withAuth(AdminDashboard);

export async function getServerSideProps(context) {
    const { prefectureId } = context.query;
    return { props: { prefectureId } };
}
