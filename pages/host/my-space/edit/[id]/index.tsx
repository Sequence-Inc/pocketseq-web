import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import useAddSpace from "@hooks/useAddSpace";
import ConfirmModal from "src/elements/ConfirmModal";
import { Stepper, Container } from "@element";
import Basic from "src/components/Space/Basic";
import NearestStationStep from "src/components/Space/NearestStationStep";
import PricingPlan from "src/components/Space/PricingPlan";
import SpacePhotos from "src/components/Space/SpacePhotos";
import { useQuery } from "@apollo/client";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import Head from "next/head";
import { config } from "src/utils";

const EditNewSpace = ({ userSession }) => {
    const { loading, confirmRef } = useAddSpace();
    const [spaceId, setSpaceId] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const router = useRouter();

    const { t } = useTranslation("adminhost");

    const { id } = router.query;
    const {
        data,
        loading: spaceLoading,
        refetch,
    } = useQuery(GET_SPACE_BY_ID, {
        variables: { id },
        fetchPolicy: "network-only",
        skip: !id,
    });

    const steps = [
        t("space-basic"),
        t("space-nearest-stations"),
        t("space-photos"),
        t("space-pricing-plans"),
    ];

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Edit space | {config.appName}</title>
            </Head>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
            <Container className="py-4 sm:py-6 lg:py-8">
                <Stepper
                    steps={steps}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    isEdit={true}
                >
                    {activeStep === 0 ? (
                        <Basic
                            steps={steps}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            setSpaceId={setSpaceId}
                            initialValue={data?.spaceById}
                            spaceLoading={spaceLoading}
                        />
                    ) : activeStep === 1 ? (
                        <NearestStationStep
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            spaceId={spaceId}
                            initialValue={data?.spaceById?.nearestStations}
                        />
                    ) : activeStep === 2 ? (
                        <SpacePhotos
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            refetch={refetch}
                            spaceId={spaceId || id}
                            initialValue={data?.spaceById?.photos}
                        />
                    ) : activeStep === 3 ? (
                        <PricingPlan
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            spaceId={spaceId}
                            initialValue={data?.spaceById?.pricePlans}
                            refetch={refetch}
                        />
                    ) : null}
                </Stepper>
            </Container>
        </HostLayout>
    );
};

export default EditNewSpace;

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
