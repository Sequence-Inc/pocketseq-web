import React, { useState, useCallback } from "react";
import { Button, FileUpload } from "@element";
import { LoadingSpinner } from "@comp";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { GET_UPLOAD_TOKEN } from "src/apollo/queries/space.queries";
import { IOtherSpacesProps } from "./NearestStationStep";
import { useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { useGetInitialSpace, useSpacePhotos } from "@hooks/useAddSpace";
import { useToast } from "@hooks/useToasts";
import { Router, useRouter } from "next/router";

const SpacePhotos = ({
    activeStep,
    setActiveStep,
    steps,
    selectedSpaceId,
    spaceId,
}: IOtherSpacesProps) => {
    const { initialValue, spaceDetailLoading, refetchSpaceDetail } =
        useGetInitialSpace(selectedSpaceId || spaceId);

    const { addAlert } = useToast();
    const { handleRemovePhoto, handleAddSpacePhotos } = useSpacePhotos(
        selectedSpaceId || spaceId
    );

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const { t } = useTranslation("adminhost");

    const handleAddPhoto = useCallback(
        async (photo) => {
            handleAddSpacePhotos(photo)
                .then((data) => {
                    setTimeout(() => {
                        addAlert({
                            type: "success",
                            message: "Added photos successfully",
                        });
                        refetchSpaceDetail();
                    }, 5000);
                })
                .catch((err) => {
                    addAlert({
                        type: "error",
                        message: "Could not add photos ",
                    });
                    refetchSpaceDetail();
                });
        },
        [handleAddSpacePhotos, refetchSpaceDetail]
    );

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    function handleNext(): void {
        if (hasNext) setActiveStep(activeStep + 1);
    }

    if (spaceDetailLoading)
        return <LoadingSpinner loadingText="Loading Space Photos" />;

    return (
        <form>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {t("photo-title")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {t("photo-description")}
                </p>
            </div>
            <div className="w-6/12 mx-auto mb-4">
                <FileUpload
                    key="room_form"
                    id="general_form"
                    hideLabel
                    label=""
                    // error={errors.photos && true}
                    errorMessage="Photos are required"
                    onChange={(e) => {}}
                    defaultPhotos={initialValue?.photos || []}
                    onRemove={handleRemovePhoto}
                    onUpload={handleAddPhoto}
                />
            </div>

            <div className="flex justify-between px-4 py-5 bg-gray-50 sm:px-6">
                <Button
                    className="w-auto px-8"
                    disabled={spaceDetailLoading || !hasPrevious}
                    onClick={handlePrevious}
                >
                    {t("previous-page")}
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    className="w-auto px-8"
                    loading={spaceDetailLoading}
                    onClick={handleNext}
                >
                    {t("next-page")}
                </Button>
            </div>
            {/* )} */}
        </form>
    );
};

export default SpacePhotos;
