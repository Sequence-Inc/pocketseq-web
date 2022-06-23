import React from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";

function AddHotelSpace({ userSession }) {
    const { t } = useTranslation("adminhost");

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Hotel Space</title>
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
                                            {t("my-hotel-spaces")}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page Header Ends */}
                    </div>
                </Container>
            </div>
        </HostLayout>
    );
}

export default AddHotelSpace;

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
