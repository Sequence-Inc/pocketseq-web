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

const EditNewSpace = () => {
    const { loading, confirmRef } = useAddSpace();
    const [spaceId, setSpaceId] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const router = useRouter();
    const { id } = router.query;
    const { data, refetch } = useQuery(GET_SPACE_BY_ID, { variables: { id }, fetchPolicy: "network-only", skip: !id })
    const steps = [
        "Basic",
        "Nearest Stations",
        "Photos",
        "Pricing Plans"
    ];

    return (
        <HostLayout>
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
                            spaceId={spaceId}
                            initialValue={{ img: null }}
                        />
                    ) : activeStep === 3 ? (
                        <PricingPlan
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            steps={steps}
                            spaceId={spaceId}
                            initialValue={data?.spaceById?.spacePricePlans}
                            refetch={refetch}
                        />
                    ) : null}
                </Stepper>
            </Container>
        </HostLayout>
    );
};

export default EditNewSpace;
