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

const AddNewSpace = () => {
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
        <HostLayout>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
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
