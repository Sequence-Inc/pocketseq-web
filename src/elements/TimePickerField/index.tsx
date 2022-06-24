import React from "react";
import clsx from "clsx";
import { TimePicker } from "antd";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import moment, { Moment } from "moment";

interface TimePickerFieldProps {
    label: string;
    placeholder?: string;
    format?: string;
    id?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    onBlur?: any;
    onChange: any;
    defaultValue?: string | number;
    value?: Moment;
    step?: string;
    singleRow?: boolean;
    use12Hours?: boolean;
}

const TimePickerField = React.forwardRef<
    HTMLInputElement,
    TimePickerFieldProps
>((props, ref) => {
    const {
        label,
        id,
        className,
        error,
        errorMessage,
        singleRow,
        value,
        onChange,
        defaultValue,
        use12Hours,
        ...rest
    } = props;

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
                    "block text-sm font-bold text-gray-700",
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
                <TimePicker
                    mode="date"
                    id={id}
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
                    value={value}
                    onChange={(event) => onChange(event)}
                    use12Hours={use12Hours}
                />

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

TimePickerField.defaultProps = {
    label: "",
    placeholder: "",
    format: "text",
    id: "",
    className: "",
    error: false,
    errorMessage: "",
    singleRow: false,
    use12Hours: false,
};

export default TimePickerField;
