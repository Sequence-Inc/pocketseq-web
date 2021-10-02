import React from "react";
// import Step from './Step';
import Step from "./step1";
import { Button } from "@element";

const Stepper = ({ steps, activeStep, setActiveStep, isEdit, children }) => {
    return (
        <div className="flex flex-col items-center w-full space-y-4">
            <Step
                steps={steps || []}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                isEdit={isEdit}
            />
            <div className="w-full shadow sm:rounded-md">
                <div className="space-y-4 bg-white">{children}</div>
            </div>
        </div>
    );
};

export default Stepper;
