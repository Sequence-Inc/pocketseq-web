import React, { useState } from "react";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { Input, Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";

type RadioOptions = {
    value: any;
    label: any;
};
interface RadioProps {
    label: string;
    placeholder?: string;
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
    value?: string | number;
    options: RadioOptions[];
    singleRow?: boolean;
    direction?: "horizontal" | "vertical";
}

const RadioField = React.forwardRef<HTMLInputElement, RadioProps>(
    (props, ref) => {
        const {
            label,
            id,
            className,
            error,
            errorMessage,
            singleRow,
            options,
            direction,
            ...rest
        } = props;
        const [value, setValue] = useState(options[0]?.value);
        const handleChange = (e: RadioChangeEvent) => {
            console.log("radio checked", e.target.value);
            setValue(e.target.value);
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
                    <Radio.Group onChange={handleChange} value={value}>
                        <Space direction={direction} className="space-y-2">
                            {options?.length > 0 &&
                                options.map((opt, index) => (
                                    <Radio
                                        value={opt?.value}
                                        key={index}
                                        className={`text-sm leading-5 font-medium ${
                                            value === opt.value &&
                                            "text-indigo-900"
                                        }`}
                                    >
                                        {opt?.label}
                                    </Radio>
                                ))}
                            {/* <Radio value={2}>Option B</Radio>
                            <Radio value={3}>Option C</Radio> */}
                        </Space>
                    </Radio.Group>
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

RadioField.defaultProps = {
    label: "",
    placeholder: "",
    id: "",
    className: "",
    error: false,
    errorMessage: "",
    singleRow: false,
    direction: "vertical",
};
export default RadioField;
