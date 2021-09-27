import React, { useState } from "react";
import { Button, Select, TextField } from "@element";
import useAddSpace, { useBasicSpace } from "@hooks/useAddSpace";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { normalizeZipCodeInput } from "src/utils/normalizeZipCode";

const SpacePhotos = ({ activeStep, setActiveStep, steps }) => {
    const [photos, setPhotos] = useState([]);
    const { spaceTypes } = useAddSpace();
    const {
        prefectures,
        loading,
        zipCode,
        setZipCode,
        cache,
        setCache,
        register,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
    } = useBasicSpace(handleNext);

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

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

    const handleSubmit = () => {
        // get upload URL for all the photos
        // map all the photos and URLS and create axios put request
        // await Promise.all all the axios put requests
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Space Photos
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be sure to
                    add valid information.
                </p>
            </div>
            <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6 max-w-lg mx-auto">
                <SelectedPhotos photos={photos} deletePhoto={handleDelete} />
                <h3>Select photos</h3>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
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
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                            >
                                <span>Upload a file</span>
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
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            only JPEG files allowed
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between px-4 py-5 bg-gray-50 sm:px-6">
                <Button
                    className="w-auto px-8"
                    disabled={loading || !hasPrevious}
                    onClick={handlePrevious}
                >
                    previous
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    className="w-auto px-8"
                    loading={loading}
                >
                    {hasNext ? "Next" : "Save"}
                </Button>
            </div>
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
                                src={(window.URL
                                    ? URL
                                    : webkitURL
                                ).createObjectURL(photo)}
                                className="w-36 h-36 rounded-lg object-cover"
                            />
                            <button
                                onClick={() => deletePhoto(index)}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 opacity-50 hover:opacity-100"
                            >
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
