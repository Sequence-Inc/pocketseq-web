import React from "react";
import AddOptionsForm from "src/components/Options/Form";

import { Button, PageLayout } from "@element";

import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import { AdjustmentsIcon, PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const EditOption = ({ userSession }) => {
    const router = useRouter();

    const { optionId }: { optionId?: string } = router.query;
    return (
        <HostLayout userSession={userSession}>
            <PageLayout
                pageTitle="Edit Option"
                bannerTitle="Edit Options"
                BannerIcon={AdjustmentsIcon}
                childrenWrapperClassName="bg-white"
            >
                <AddOptionsForm optionId={optionId} />
            </PageLayout>
        </HostLayout>
    );
};

export default EditOption;

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
