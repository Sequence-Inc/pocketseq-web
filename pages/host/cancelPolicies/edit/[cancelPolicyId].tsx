import React from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import useTranslation from "next-translate/useTranslation";
import CancelPolicyForm from "src/components/CancelPolicy/Form";
import { useRouter } from "next/router";

const EditCancelPolicies = ({ userSession }) => {
    const { t } = useTranslation("adminhost");
    const router = useRouter();
    const { cancelPolicyId }: { cancelPolicyId?: string } = router.query;
    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Edit Cancel Policy</title>
            </Head>
            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        {/* Page Header Starts */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
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
                <CancelPolicyForm cancelPolicyId={cancelPolicyId} />
            </Container>
        </HostLayout>
    );
};

export default EditCancelPolicies;

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
