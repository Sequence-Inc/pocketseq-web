import { LoadingSpinner } from "@comp";
import { Button } from "@element";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ShieldExclamationIcon,
} from "@heroicons/react/outline";

export type ModalIntent =
    | "LOADING"
    | "SUCCESS"
    | "ERROR"
    | "PANEL_CHANGE"
    | "DELETE_PRICE_OVERRIDE"
    | "CONFIRM";
export type ModalData = {
    intent: ModalIntent;
    title?: string;
    text: string;
    onConfirm?: any;
};

interface generateAlertModalContentProps {
    modalData: ModalData;
    setIsModalOpen: (boolean) => void;
    setModalData: (ModalData) => void;
}

export const generateAlertModalContent = ({
    modalData,
    setIsModalOpen,
    setModalData,
}: generateAlertModalContentProps): React.ReactElement => {
    if (!modalData) return null;

    const { intent, title, text, onConfirm } = modalData;

    let modalHeader = null;
    let modalTitle = null;
    let modalActions = null;

    if (intent === "LOADING") {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    if (intent === "SUCCESS") {
        modalHeader = (
            <div className="text-primary">
                <CheckCircleIcon className="w-8 h-8" />
            </div>
        );
        modalActions = (
            <div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setIsModalOpen(false);
                        setModalData(null);
                        onConfirm && onConfirm();
                    }}
                >
                    Okay
                </Button>
            </div>
        );
    } else if (intent === "ERROR") {
        modalHeader = (
            <div className="text-red-400">
                <ShieldExclamationIcon className="w-8 h-8" />
            </div>
        );
        modalActions = (
            <div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setIsModalOpen(false);
                        setModalData(null);
                        onConfirm && onConfirm();
                    }}
                >
                    Okay
                </Button>
            </div>
        );
    } else if (intent === "PANEL_CHANGE") {
        modalHeader = (
            <div className="text-yellow-400">
                <ExclamationCircleIcon className="w-8 h-8" />
            </div>
        );
        modalActions = (
            <div className="flex space-x-4">
                <Button
                    variant="primary"
                    onClick={() => {
                        setIsModalOpen(false);
                        setModalData(null);
                        onConfirm && onConfirm();
                    }}
                >
                    Okay
                </Button>
            </div>
        );
    } else if (intent === "DELETE_PRICE_OVERRIDE") {
        modalHeader = (
            <div className="text-red-400">
                <ShieldExclamationIcon className="w-8 h-8" />
            </div>
        );
        modalActions = (
            <div className="flex space-x-4">
                <Button
                    variant="danger"
                    onClick={() => {
                        setIsModalOpen(false);
                        onConfirm && onConfirm();
                    }}
                >
                    削除
                </Button>
                <Button
                    onClick={() => {
                        setIsModalOpen(false);
                        setModalData(null);
                    }}
                >
                    キャンセル
                </Button>
            </div>
        );
    } else if (intent === "CONFIRM") {
        modalHeader = (
            <div className="text-yellow-400">
                <ExclamationCircleIcon className="w-8 h-8" />
            </div>
        );
        modalActions = (
            <div className="flex space-x-4">
                <Button
                    variant="primary"
                    onClick={() => {
                        setIsModalOpen(false);
                        onConfirm && onConfirm();
                    }}
                >
                    Okay
                </Button>
                <Button
                    onClick={() => {
                        setIsModalOpen(false);
                        setModalData(null);
                    }}
                >
                    キャンセル
                </Button>
            </div>
        );
    }

    if (title) {
        let titleColor = "text-primary";
        if (intent === "ERROR" || intent === "DELETE_PRICE_OVERRIDE") {
            titleColor = "text-red-500";
        } else if (intent === "PANEL_CHANGE" || intent === "CONFIRM") {
            titleColor = "text-yellow-500";
        }
        modalTitle = (
            <h3 className={`text-base font-semibold ${titleColor}`}>{title}</h3>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-center space-x-2">
                {modalHeader}
                {modalTitle}
            </div>
            {text && <div className="text-center mt-4">{text}</div>}
            {modalActions && <div className="mt-6">{modalActions}</div>}
        </div>
    );
};
