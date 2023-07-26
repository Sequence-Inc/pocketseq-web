import { Dialog as HeadlessDialog } from "@headlessui/react";
import {
    ExclamationCircleIcon,
    InformationCircleIcon,
} from "@heroicons/react/outline";

export interface DialogProps {
    isOpen: boolean;
    type: "info" | "error";
    title: string;
    onClose?: any;
    description?: string;
    children?: React.ReactChildren;
}

export const Dialog = ({
    isOpen,
    onClose,
    type,
    title,
    description,
    children,
}: DialogProps): React.ReactElement => {
    const Icon =
        type === "error" ? ExclamationCircleIcon : InformationCircleIcon;
    const titleColor = type === "error" ? "text-red-600" : "text-primary";

    return (
        <HeadlessDialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <HeadlessDialog.Panel className="w-full max-w-sm rounded-lg shadow-2xl bg-white p-6 align-middle">
                    <div className={`flex items-center ${titleColor}`}>
                        <Icon className="w-6 h-6 mr-2" />
                        <HeadlessDialog.Title
                            as="h3"
                            className={`text-lg font-bold leading-6 ${titleColor}`}
                        >
                            {title}
                        </HeadlessDialog.Title>
                    </div>
                    {description && (
                        <HeadlessDialog.Description
                            as="div"
                            className="mt-3 text-base text-gray-600"
                        >
                            {description}
                        </HeadlessDialog.Description>
                    )}

                    {children && children}
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
