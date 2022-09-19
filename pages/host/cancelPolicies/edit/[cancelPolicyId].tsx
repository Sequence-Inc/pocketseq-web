import React from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container, PageLayout } from "@element";
import useTranslation from "next-translate/useTranslation";
import CancelPolicyForm from "src/components/CancelPolicy/Form";
import { useRouter } from "next/router";

import { AdjustmentsIcon } from "@heroicons/react/outline";

const EditCancelPolicies = ({ userSession }) => {
    const { t } = useTranslation("adminhost");
    const router = useRouter();
    const { cancelPolicyId }: { cancelPolicyId?: string } = router.query;
    return (
        <HostLayout userSession={userSession}>
            <PageLayout
                pageTitle="キャンセルポリシー編集"
                BannerIcon={AdjustmentsIcon}
            >
                <CancelPolicyForm cancelPolicyId={cancelPolicyId} />
            </PageLayout>
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
