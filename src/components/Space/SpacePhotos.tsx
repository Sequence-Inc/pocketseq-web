import React, { useState } from "react";
import { Button } from "@element";
import { LoadingSpinner } from "@comp";

import axios from "axios";
import { useMutation } from "@apollo/client";
import { GET_UPLOAD_TOKEN } from "src/apollo/queries/space.queries";
import { IOtherSpacesProps } from "./NearestStationStep";
import { useEffect } from "react";

import useTranslation from "next-translate/useTranslation";
import { useGetInitialSpace } from "@hooks/useAddSpace";

const SpacePhotos = ({
    activeStep,
    setActiveStep,
    refetch,
    steps,
    spaceId,
    selectedSpaceId,
}: IOtherSpacesProps) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mutate] = useMutation(GET_UPLOAD_TOKEN);
    const { initialValue, spaceDetailLoading, refetchSpaceDetail } =
        useGetInitialSpace(spaceId);
    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const { t } = useTranslation("adminhost");

    useEffect(() => {
        if (initialValue?.photos?.length) {
            const newPhotos = initialValue?.photos?.map(
                (res: any) => res.thumbnail?.url
            );
            setPhotos(newPhotos);
        }
    }, [initialValue?.photos]);

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    function handleNext(): void {
        if (hasNext) setActiveStep(activeStep + 1);
    }

    const handleSelectPhoto = (event) => {
        setPhotos([...photos, ...event.target.files]);
    };

    const handleDelete = (index) => {
        const newPhotos = photos.filter((_, idx) => idx !== index);
        setPhotos(newPhotos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // get upload URL for all the photos
        const newPhotos = photos.filter((res) => typeof res === "object");
        const imageInputs = newPhotos.map((res) => ({ mime: res.type }));
        const { data, errors } = await mutate({
            variables: { spaceId, imageInputs },
        });
        if (errors) {
            console.log("Errors", errors);
            // alert(errors.message);
            setLoading(false);
            return;
        }
        if (data) {
            try {
                await Promise.all(
                    data.addSpacePhotos.map((token, index) => {
                        const { url, mime } = token;
                        const options = {
                            headers: {
                                "Content-Type": mime,
                            },
                        };
                        axios.put(url, newPhotos[index], options);
                    })
                );
                if (initialValue) {
                    refetchSpaceDetail();
                } else handleNext();
            } catch (err) {
                console.log(err);
            }
        }
    };

    if (spaceDetailLoading)
        return <LoadingSpinner loadingText="Loading Space Photos" />;

    return (
        <form onSubmit={handleSubmit}>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {t("photo-title")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {t("photo-description")}
                </p>
            </div>
            <div className="max-w-lg px-4 py-2 mx-auto space-y-4 sm:px-6 sm:py-6">
                <SelectedPhotos photos={photos} deletePhoto={handleDelete} />
                <h3>{t("photo-select")}</h3>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg
                            className="w-12 h-12 mx-auto text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex justify-center text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative font-medium text-center bg-white rounded-md cursor-pointer text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                            >
                                <span>{t("photo-upload")}</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    accept="image/jpeg"
                                    className="sr-only"
                                    multiple
                                    onChange={handleSelectPhoto}
                                    disabled={loading}
                                />
                            </label>
                            {/* <p className="pl-1">or drag and drop</p> */}
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            {t("photo-upload-description")}
                        </p>
                    </div>
                </div>
            </div>

            {initialValue?.photos?.length > 0 ? (
                <div className="flex justify-end px-4 py-5 bg-gray-50 sm:px-6">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-auto px-8"
                        loading={loading}
                    >
                        {t("save")}
                    </Button>
                </div>
            ) : (
                <div className="flex justify-between px-4 py-5 bg-gray-50 sm:px-6">
                    <Button
                        className="w-auto px-8"
                        disabled={loading || !hasPrevious}
                        onClick={handlePrevious}
                    >
                        {t("previous-page")}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-auto px-8"
                        loading={loading}
                    >
                        {t("next-page")}
                    </Button>
                </div>
            )}
        </form>
    );
};

export default SpacePhotos;

const SelectedPhotos = ({ photos, deletePhoto }) => {
    if (photos.length === 0) return null;

    return (
        <div>
            <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => {
                    return (
                        <div key={index} className="relative">
                            <img
                                src={
                                    typeof photo === "object"
                                        ? (window.URL
                                              ? URL
                                              : webkitURL
                                          ).createObjectURL(photo)
                                        : photo
                                }
                                className="object-cover rounded-lg w-36 h-36"
                            />
                            {typeof photo === "object" ? (
                                <button
                                    type="button"
                                    onClick={() => deletePhoto(index)}
                                    className="absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 -translate-y-1/2 bg-opacity-75 rounded-lg opacity-50 top-1/2 left-1/2 bg-primary hover:bg-opacity-90 hover:opacity-100"
                                >
                                    Remove
                                </button>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
