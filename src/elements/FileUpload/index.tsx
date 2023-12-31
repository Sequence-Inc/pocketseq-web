import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import useTranslation from "next-translate/useTranslation";

import { ExclamationCircleIcon } from "@heroicons/react/solid";

interface PhotoUploadFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    id: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    onBlur?: any;
    onChange: any;
    value?: string | number;
    singleRow?: boolean;
    hideLabel?: boolean;
    defaultPhotos?: any;
    onRemove?: any;
    onUpload?: any;
    onDefault?: any;
}

const FileUpload = React.forwardRef<HTMLInputElement, PhotoUploadFieldProps>(
    (props, ref) => {
        const {
            label,
            id,
            className,
            error,
            errorMessage,
            singleRow,
            value,
            onChange,
            hideLabel,
            defaultPhotos,
            onRemove,
            onUpload,
            onDefault,
            ...rest
        } = props;
        const [photos, setPhotos] = useState([]);
        const [mutatingPhoto, setMutatingPhoto] = useState(null);
        // just a comment
        const handleDelete = (index) => {
            const newPhotos = photos.filter((_, idx) => idx !== index);
            setPhotos(newPhotos);
        };

        const { t } = useTranslation("adminhost");

        const handleUploadPhoto = useCallback(
            async (files: File[]) => {
                if (!defaultPhotos) return;
                onUpload && (await onUpload(files));
            },
            [onUpload, defaultPhotos]
        );

        const handleSelectPhoto = (event) => {
            setPhotos([...photos, ...event.target.files]);

            handleUploadPhoto(event.target.files);
        };

        const handleDeleteDefaultPhoto = async (photo) => {
            setMutatingPhoto(photo?.id);
            onRemove && (await onRemove(photo));
            setMutatingPhoto(null);
        };

        const madeDefault = async (photo) => {
            setMutatingPhoto(photo?.id);
            onDefault && (await onDefault(photo));
            setMutatingPhoto(null);
        };

        useEffect(() => {
            if (!photos.length) {
                onChange(null);
            }
            const newPhotos = photos.filter((res) => typeof res === "object");

            onChange(newPhotos);

            return () => {
                setMutatingPhoto(null);
            };
        }, [photos]);

        useEffect(() => {
            if (defaultPhotos?.length) {
                setPhotos([]);
            }
        }, [defaultPhotos?.length]);

        return (
            <div
                className={clsx(
                    singleRow
                        ? "sm:space-x-4 flex-none sm:flex items-center"
                        : "space-y-1",
                    className ? className : ""
                )}
            >
                {!hideLabel && (
                    <label
                        htmlFor={id}
                        className={clsx(
                            "block text-sm font-bold text-gray-700",
                            singleRow ? "sm:text-right w-60" : ""
                        )}
                    >
                        {label || t("photo-select")}
                    </label>
                )}
                <div
                    className={clsx(
                        "relative rounded-md",
                        singleRow ? "sm:w-96" : ""
                    )}
                >
                    <div className="max-w-lg py-2 space-y-4 ">
                        <DefaultPhotos
                            photos={defaultPhotos}
                            deletePhoto={handleDeleteDefaultPhoto}
                            mutatingPhoto={mutatingPhoto}
                            madeDefault={madeDefault}
                        />
                        <SelectedPhotos
                            photos={photos}
                            deletePhoto={handleDelete}
                        />

                        <div className="flex justify-center pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                        htmlFor={id}
                                        className="relative font-medium text-center bg-white rounded-md cursor-pointer text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                    >
                                        <span>{t("photo-upload")}</span>
                                        <input
                                            id={id}
                                            name={id}
                                            type="file"
                                            accept="image/jpeg"
                                            className="sr-only"
                                            multiple
                                            onChange={handleSelectPhoto}
                                        />
                                    </label>
                                </div>
                                <div className="text-xs text-gray-500 text-center">
                                    {t("photo-upload-description")}
                                </div>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ExclamationCircleIcon
                                className="w-5 h-5 text-red-400"
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </div>
                {error && (
                    <span className="text-sm text-red-500">{errorMessage}</span>
                )}
            </div>
        );
    }
);

const DefaultPhotos = ({ photos, deletePhoto, madeDefault, mutatingPhoto }) => {
    if (!photos?.length) return null;
    function byId(a, b) {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => {
                return (
                    <div key={index} className="relative flex justify-center">
                        <img
                            src={photo?.medium?.url}
                            className="object-cover rounded-lg w-36 h-36 border-2 border-green-200"
                        />

                        {photo?.id === mutatingPhoto && (
                            <div className="absolute opacity-50 w-36 h-36 top-0 border-4 flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-[2px] border-green-400 border-l-0 border-solid rounded-full animate-spin "></div>

                                <div className="max-w-min">Loading</div>
                            </div>
                        )}
                        {typeof photo === "object" &&
                        photo?.id !== mutatingPhoto ? (
                            <div className="w-36 absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                {!photo?.isDefault && (
                                    <button
                                        type="button"
                                        onClick={() => madeDefault(photo)}
                                        className="px-4 py-2 mb-3 text-sm text-white bg-opacity-75 rounded-lg opacity-90  bg-primary hover:opacity-100"
                                    >
                                        Make Default
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => deletePhoto(photo)}
                                    className="px-4 py-2 text-sm text-white bg-opacity-75 rounded-lg opacity-90  bg-primary hover:opacity-100"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

// const Photo=()=>{

// }

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
                                    className="absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 -translate-y-1/2 bg-opacity-75 rounded-lg opacity-90 top-1/2 left-1/2 bg-primary hover:bg-opacity-90 hover:opacity-100"
                                >
                                    Uploading...
                                </button>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

FileUpload.defaultProps = {
    label: "",
    placeholder: "",
    id: "",
    className: "",
    error: false,
    errorMessage: "",
    singleRow: false,
    hideLabel: false,
};

export default FileUpload;
