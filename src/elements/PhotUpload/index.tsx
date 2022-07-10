import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";
import useTranslation from "next-translate/useTranslation";

interface PhotoUploadFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    id?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    onBlur?: any;
    onChange: any;
    value?: string | number;
    step?: string;
    singleRow?: boolean;
}

const PhotoUploadField = React.forwardRef<
    HTMLInputElement,
    PhotoUploadFieldProps
>((props, ref) => {
    const [photo, setPhoto] = useState([]);
    const { t } = useTranslation("adminhost");

    useEffect(() => {
        if (!photo?.length) return;
        onChange(photo);
    }, [photo]);

    const {
        label,
        id,
        className,
        error,
        errorMessage,
        singleRow,
        onChange,
        ...rest
    } = props;

    const inputField = () => (
        <div className="flex justify-center pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 ">
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
                                htmlFor={id}
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input
                                    id={id}
                                    name={id}
                                    ref={ref}
                                    {...rest}
                                    accept="image/jpeg"
                                    multiple
                                    className="sr-only"
                                    onChange={(event) => {
                                        setPhoto((prev) => [
                                            ...prev,
                                            ...event.target.files,
                                        ]);
                                    }}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">
                            JPEGファイルでご登録下さい。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const previewField = () => {
        return (
            <div className="grid grid-cols-3 gap-3">
                {photo.map((phot, index) => (
                    <div key={index} className="relative">
                        <img
                            key={index}
                            src={(window.URL ? URL : webkitURL).createObjectURL(
                                phot
                            )}
                            className="max-h-60 w-full object-contain"
                        />
                        <button
                            className="absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 -translate-y-1/2 bg-opacity-75 rounded-lg opacity-50 top-1/2 left-1/2 bg-primary hover:bg-opacity-90 hover:opacity-100"
                            onClick={() => setPhoto([])}
                        >
                            Clear selection
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className={clsx(
                singleRow
                    ? "sm:space-x-4 flex-none sm:flex items-center"
                    : "space-y-1",
                className ? className : ""
            )}
        >
            <label
                htmlFor={id}
                className={clsx(
                    "block text-sm font-medium text-gray-700",
                    singleRow ? "sm:text-right w-60" : ""
                )}
            >
                {label}
            </label>
            <div
                className={clsx(
                    "relative rounded-md",
                    singleRow ? "sm:w-96" : ""
                )}
            >
                {/* {photo !== null ? previewField() : inputField()} */}
                {photo?.length > 0 && previewField()}
                {inputField()}
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
});

PhotoUploadField.defaultProps = {
    label: "",
    placeholder: "",
    type: "file",
    id: "",
    className: "",
    error: false,
    errorMessage: "",
    singleRow: false,
};

export default PhotoUploadField;
