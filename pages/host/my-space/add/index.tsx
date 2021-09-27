import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import useAddSpace from "@hooks/useAddSpace";
import ConfirmModal from "src/elements/ConfirmModal";
import { Stepper, Container } from "@element";
import Basic from "src/components/Space/Basic";
import NearestStationStep from "src/components/Space/NearestStationStep";
import PricingPlan from "src/components/Space/PricingPlan";
import SpacePhotos from "src/components/Space/SpacePhotos";

const AddNewSpace = () => {
    const { loading, confirmRef } = useAddSpace();
    const [activeStep, setActiveStep] = useState(2);
    const steps = [
        "Basic",
        "Nearest Stations",
        "Photos",
        "Pricing Plans",
        "Preview",
    ];

    return (
        <HostLayout>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
            <Container className="py-4 sm:py-6 lg:py-8">
                <Stepper
                    steps={steps}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    loading={loading}
                >
                    {activeStep === 0 ? (
                        <Basic
                            steps={steps}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                        />
                    ) : activeStep === 1 ? (
                        <NearestStationStep
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                        />
                    ) : activeStep === 2 ? (
                        <SpacePhotos
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                        />
                    ) : activeStep === 3 ? (
                        <PricingPlan
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                        />
                    ) : (
                        <p>ok</p>
                    )}
                </Stepper>
            </Container>
        </HostLayout>
    );
};

export default AddNewSpace;
