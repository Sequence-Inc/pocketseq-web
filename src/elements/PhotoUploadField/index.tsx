import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";

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
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
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

    const inputField = () => {
        return (
            <input
                id={id}
                ref={ref}
                className={clsx(
                    "appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400",
                    "focus:outline-none sm:text-sm",
                    {
                        "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500":
                            error,
                        "border-gray-300 focus:ring-primary focus:border-primary":
                            !error,
                    }
                )}
                {...rest}
                accept="image/jpeg"
                onChange={(event) => {
                    setPhoto(event.target.files[0]);
                }}
            />
        );
    };

    const previewField = () => {
        return (
            <div className="relative block w-full p-2 border rounded-md text-gray-700 placeholder-gray-400 border-gray-300">
                <img
                    src={(window.URL ? URL : webkitURL).createObjectURL(photo)}
                    className="max-h-60 w-full object-contain"
                />
                <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90"
                    onClick={() => setPhoto(null)}
                >
                    Clear selection
                </button>
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
                {photo !== null ? previewField() : inputField()}
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
