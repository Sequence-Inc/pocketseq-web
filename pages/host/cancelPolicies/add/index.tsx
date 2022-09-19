import React from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container, PageLayout } from "@element";
import { OfficeBuildingIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";

import CancelPolicyForm from "src/components/CancelPolicy/Form";

const AddCancelPolicies = ({ userSession }) => {
    const { t } = useTranslation("adminhost");

    return (
        <HostLayout userSession={userSession}>
            <PageLayout
                pageTitle="キャンセルポリシー追加"
                BannerIcon={AdjustmentsIcon}
            >
                <CancelPolicyForm />
            </PageLayout>
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
