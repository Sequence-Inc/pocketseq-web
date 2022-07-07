import { ToastAlert } from "@element";
import React, { createContext, useCallback, useContext, useRef } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const toastRef = useRef(null);

    const addAlert = useCallback(() => {
        if (toastRef.current) {
            toastRef.current?.open();
        }
    }, [toastRef.current]);

    return (
        <ToastContext.Provider value={{ addAlert }}>
            {children}
            <ToastAlert ref={toastRef} />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
