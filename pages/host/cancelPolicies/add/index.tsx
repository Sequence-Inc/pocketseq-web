import React, { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container, ToastAlert } from "@element";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { Tabs } from "antd";
import { General, Rooms, Pricing, Plans } from "src/components/HotelSpace";
import CancelPolicyForm from "src/components/CancelPolicy/Form";

const AddCancelPolicies = ({ userSession }) => {
    const { t } = useTranslation("adminhost");
    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Add Cancel Policy</title>
            </Head>
            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        {/* Page Header Starts */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <OfficeBuildingIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            Add Cancel Policy
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page Header Ends */}
                    </div>
                </Container>
            </div>

            <Container className="bg-white py-4 sm:py-6 lg:py-8 mt-3 mb-3 sm:mb-5">
                <CancelPolicyForm />
            </Container>
        </HostLayout>
    );
};

export default AddCancelPolicies;

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
