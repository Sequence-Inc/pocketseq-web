import React from "react";
import AddOptionsForm from "src/components/Options/Form";

import { Button, PageLayout } from "@element";

import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import { AdjustmentsIcon, PlusIcon } from "@heroicons/react/outline";

const AddOptions = ({ userSession }) => {
    return (
        <HostLayout userSession={userSession}>
            <PageLayout
                pageTitle="オプションの追加"
                bannerTitle="オプションの追加"
                BannerIcon={AdjustmentsIcon}
                childrenWrapperClassName="bg-white"
            >
                <AddOptionsForm />
            </PageLayout>
        </HostLayout>
    );
};

export default AddOptions;

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
