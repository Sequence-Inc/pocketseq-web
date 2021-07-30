import React from "react";
import CodeInput from "../CodeInput";
import { Button } from "@element";
import usePinDialogContent from "./usePinDialogContent";

const PinDialogContent = ({
    response,
    setModal,
    callback,
    location,
    emailAddress,
}) => {
    const { verifyPin, setCode, resendCode, isLoading, resendLoading } =
        usePinDialogContent(response, callback, location);

    return (
        <form onSubmit={verifyPin} className="space-y-4">
            <div className="flex items-center justify-center mx-auto rounded-full h-14 w-14 bg-lightBlue-50">
                <svg
                    className="w-8 h-8 text-lightBlue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <h3
                className="mt-2 text-base font-normal text-center text-lightBlue-600"
                id="modal-headline"
            >
                Confirm Reset Password
            </h3>
            <p className="text-sm text-center text-gray-600">Sent You Code</p>
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Verification code
                </label>
                <CodeInput
                    length={6}
                    initialValue=""
                    onChange={(value: number) => setCode(value)}
                    type="numeric"
                    inputMode="numeric"
                    onComplete={(value: number) => setCode(value)}
                    autoSelect={true}
                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                />
            </div>
            <Button
                type="submit"
                className="sm:col-start-2"
                loading={isLoading || resendLoading}
            >
                Verify Code
            </Button>
            <Button
                variant="white"
                disabled={isLoading || resendLoading}
                onClick={() => setModal(false)}
            >
                Cancel
            </Button>
            <div className="relative text-center">
                <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                    codeNotReceived
                </span>
            </div>
            <div className="text-xs text-center text-gray-500">
                makeSureNotReceiveCode
            </div>
            <Button
                variant="white"
                disabled={isLoading || resendLoading}
                onClick={(e) => {
                    e.preventDefault();
                    resendCode(emailAddress);
                }}
            >
                {resendLoading ? "buttonResendLoading" : "buttonResendCode"}
            </Button>
        </form>
    );
};

export default PinDialogContent;
