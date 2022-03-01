import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import useAddSpace from "@hooks/useAddSpace";
import ConfirmModal from "src/elements/ConfirmModal";
import { Stepper, Container } from "@element";
import Basic from "src/components/Space/Basic";
import NearestStationStep from "src/components/Space/NearestStationStep";
import PricingPlan from "src/components/Space/PricingPlan";
import SpacePhotos from "src/components/Space/SpacePhotos";
import Preview from "src/components/Space/Preview";

import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { OfficeBuildingIcon } from "@heroicons/react/outline";
import Head from "next/head";

const AddNewSpace = ({ userSession }) => {
    const { loading, confirmRef } = useAddSpace();
    const [spaceId, setSpaceId] = useState();
    const [activeStep, setActiveStep] = useState(0);

    const { t } = useTranslation("adminhost");

    const steps = [
        t("space-basic"),
        t("space-nearest-stations"),
        t("space-photos"),
        t("space-pricing-plans"),
        t("space-preview"),
    ];

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Add space</title>
            </Head>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
            <div className="bg-white shadow mb-3 sm:mb-5">
                <Container>
                    <div className="py-8 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Profile */}
                            <div className="flex items-center">
                                <div>
                                    <div className="flex items-center">
                                        <OfficeBuildingIcon
                                            className="flex-shrink-0 mr-1.5 h-6 w-6 text-gray-700"
                                            aria-hidden="true"
                                        />
                                        <h1 className="ml-3 text-2xl font-medium leading-7 text-gray-700 sm:leading-9 sm:truncate">
                                            Add new space
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Container className="py-4 sm:py-6 lg:py-8">
                <Stepper
                    steps={steps}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                >
                    {activeStep === 0 ? (
                        <Basic
                            steps={steps}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            setSpaceId={setSpaceId}
                        />
                    ) : activeStep === 1 ? (
                        <NearestStationStep
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            spaceId={spaceId}
                            initialValue={null}
                        />
                    ) : activeStep === 2 ? (
                        <SpacePhotos
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            spaceId={spaceId}
                            initialValue={null}
                        />
                    ) : activeStep === 3 ? (
                        <PricingPlan
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            spaceId={spaceId}
                            initialValue={null}
                        />
                    ) : (
                        <Preview
                            steps={steps}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            spaceId={spaceId}
                        />
                    )}
                </Stepper>
            </Container>
        </HostLayout>
    );
};

export default AddNewSpace;

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
