import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PinDialogContent from './pinDialogContent';

interface PinDialogProps {
    callback?: (formData: any) => void;
    location?: String;
    emailAddress?: string
}

const PinDialog = forwardRef(({ callback, location, emailAddress }: PinDialogProps, ref) => {
    const [response, setResponse] = useState<any>();
    const [modal, setModal] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        open: (data = {}) => {
            setResponse(data);
            setModal(true);
        },
        close: () => {
            // setLoading(false);
            setModal(false);
        }
    }));

    return modal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true">
                    <div
                        className="absolute inset-0 bg-gray-700 opacity-75"
                        onClick={() => null}></div>
                </div>

                {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true">
                    &#8203;
                </span>

                <div
                    className="inline-block px-6 pt-8 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 sm:align-middle sm:max-w-96 sm:w-96"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline">
                    <PinDialogContent
                        response={response}
                        location={location}
                        setModal={setModal}
                        callback={callback}
                        emailAddress={emailAddress}
                    />
                </div>
            </div>
        </div>
    ) : null;
});

export default PinDialog;
