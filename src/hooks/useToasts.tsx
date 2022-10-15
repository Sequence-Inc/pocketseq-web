import { ToastAlert } from "@element";
import React, { createContext, useCallback, useContext, useRef } from "react";

enum EAlertEnums {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}
interface IAlertProps {
    type: EAlertEnums;
    message?: string;
}

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const toastRef = useRef(null);

    const addAlert = useCallback(
        ({ type = EAlertEnums.SUCCESS, message }: IAlertProps) => {
            if (toastRef.current) {
                if (type === EAlertEnums.SUCCESS)
                    return toastRef.current?.showSuccess({ message });
                if (type === EAlertEnums.ERROR)
                    return toastRef.current?.showError({ message });
            }
        },
        [toastRef.current]
    );

    return (
        <ToastContext.Provider value={{ addAlert }}>
            {children}
            <ToastAlert ref={toastRef} />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
