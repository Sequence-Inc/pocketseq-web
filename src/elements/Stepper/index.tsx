import React, { Dispatch, SetStateAction } from "react";
// import Step from './Step';
import Step from "./step1";
import { Button } from "@element";

interface IStepperProps {
    steps: any[];
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
    isEdit?: boolean;
    children: React.ReactChild
}

const Stepper = ({ steps, activeStep, setActiveStep, isEdit, children }: IStepperProps) => {
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
