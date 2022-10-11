import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import clsx from "clsx";

interface FormLabelProps {
    value: string;
    hide?: boolean;
    className?: string;
    children?: React.ReactNode;
    required?: boolean;
}
const FormLabel = (props: FormLabelProps) => {
    return (
        <span className={clsx(props.className || "")}>
            {props.value}
            {props.required && (
                <span className="text-red-400 ml-1">*</span>
            )}{" "}
        </span>
    );
};

export default FormLabel;
