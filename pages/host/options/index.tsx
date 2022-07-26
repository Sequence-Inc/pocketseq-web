import { Button, PageLayout } from "@element";
import React from "react";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import HostLayout from "src/layouts/HostLayout";
import { AdjustmentsIcon, PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const OptionList = ({ userSession }) => {
    const router = useRouter();
    return (
        <HostLayout userSession={userSession}>
            <PageLayout
                pageTitle="Options"
                BannerIcon={AdjustmentsIcon}
                BannerActionButton={() => (
                    <Button
                        variant="primary"
                        Icon={PlusIcon}
                        onClick={() => router.push("/host/options/add")}
                    >
                        Add Options
                    </Button>
                )}
            >
                OptionList
            </PageLayout>
        </HostLayout>
    );
};

export default OptionList;

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
