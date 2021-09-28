import { useMutation } from "@apollo/client";
import { Button, Select, TextField } from "@element";
import { PlusIcon } from "@heroicons/react/outline";
import { TrashIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { ADD_PRICING_PLAN } from "src/apollo/queries/space.queries";

const PricingPlan = ({ activeStep, setActiveStep, steps, spaceId }) => {
    const [pricePlans, setPricePlans] = useState([]);
    const [mutate] = useMutation(ADD_PRICING_PLAN);
    const id = "cku3zo566000009l78w6b1v07";

    const addPlan = (plan) => {
        setPricePlans([...pricePlans, plan]);
    };
    const removePlan = (index) => {
        const newPlans = pricePlans.filter((_, idx) => idx !== index);
        setPricePlans(newPlans);
    };

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    function handleNext(): void {
        if (hasNext) setActiveStep(activeStep + 1);
    }

    const handlePricingPlan = async () => {
        const { data } = await mutate({ variables: { spaceId: id, pricePlans } })
        console.log(data)
        if (data) handleNext();
    }

    return (
        <div className="">
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Price plan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Please add the applicable pricing plan for your space.
                </p>
            </div>
            <div className="w-full my-6 space-y-3 sm:w-96 sm:ml-64">
                <h3 className="font-medium text-gray-700">Price Plans</h3>
                {pricePlans.map((price, index) => {
                    return (
                        <PricePlanItem
                            key={index}
                            index={index}
                            pricePlan={price}
                            removePlan={removePlan}
                        />
                    );
                })}
            </div>
            <div className="mb-8">
                <PricePlanForm addPlan={addPlan} />
            </div>
            <div className="flex justify-between px-4 py-5 border-t border-gray-100 bg-gray-50 sm:px-6">
                <Button
                    className="w-auto px-8"
                    disabled={!hasPrevious}
                    onClick={handlePrevious}
                >
                    Previous
                </Button>
                <Button variant="primary" className="w-auto px-8" onClick={handlePricingPlan}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default PricingPlan;

const PricePlanItem = ({ index, pricePlan, removePlan }) => {
    const {
        type,
        amount,
        duration,
        title,
        cooldownTime,
        lastMinuteDiscount,
        maintenanceFee,
    } = pricePlan;

    return (
        <div
            key={index}
            className="flex items-center px-4 py-3 text-white rounded-md bg-primary"
        >
            <div className="flex-auto">
                {title} - ￥{amount}/{duration}
                {type === "HOURLY" ? "時間" : "日"}
            </div>
            <button onClick={() => removePlan(index)}>
                <TrashIcon className="w-6 h-6 text-green-200 hover:text-green-100" />
            </button>
        </div>
    );
};

const PricePlanForm = ({ addPlan }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("HOURLY");
    const [amount, setAmount] = useState<string>();
    const [lastMinuteDiscount, setLastMinuteDiscount] = useState<string>();
    const [duration, setDuration] = useState<string>();
    const [cooldownTime, setCooldownTime] = useState<string>();
    const [maintenanceFee, setMaintenanceFee] = useState<string>();

    const planTypes = [{ title: "HOURLY" }, { title: "DAILY" }];

    const handleSubmit = () => {
        if (!title || !type || !amount || parseInt(amount) <= 0 || !duration) {
            alert("Please provide title, plan type, price and duration.");
            return;
        }
        addPlan({
            title,
            type,
            amount: parseFloat(amount),
            lastMinuteDiscount: parseFloat(lastMinuteDiscount),
            duration: parseFloat(duration),
            cooldownTime: parseInt(cooldownTime),
            maintenanceFee: parseFloat(maintenanceFee),
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <TextField
                    label="Title"
                    error={null}
                    errorMessage="Title is required"
                    autoFocus
                    singleRow
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div className="">
                <Select
                    label="Plan Type"
                    options={planTypes}
                    error={null}
                    errorMessage="Space Types is required"
                    labelKey="title"
                    valueKey="title"
                    singleRow
                    value={type}
                    onChange={(event) => {
                        setType(event.toString());
                    }}
                />
            </div>
            <div>
                <TextField
                    label="Price"
                    error={null}
                    errorMessage="Price is required"
                    autoFocus
                    singleRow
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Last minute discount"
                    error={null}
                    errorMessage=""
                    autoFocus
                    singleRow
                    value={lastMinuteDiscount}
                    onChange={(event) =>
                        setLastMinuteDiscount(event.target.value)
                    }
                />
            </div>
            <div>
                <TextField
                    label="Duration"
                    error={null}
                    errorMessage="Duration is required"
                    autoFocus
                    singleRow
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Cooldown time"
                    error={null}
                    errorMessage="Cooldown time is required"
                    autoFocus
                    singleRow
                    value={cooldownTime}
                    onChange={(event) => setCooldownTime(event.target.value)}
                />
            </div>
            <div>
                <TextField
                    label="Maintenance fee"
                    error={null}
                    errorMessage=""
                    autoFocus
                    singleRow
                    value={maintenanceFee}
                    onChange={(event) => setMaintenanceFee(event.target.value)}
                />
            </div>
            <div className="items-center flex-none sm:space-x-4 sm:flex">
                <div className="block text-sm font-medium text-gray-700 sm:text-right w-60">
                    &nbsp;
                </div>
                <div className="relative rounded-md sm:w-96">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center justify-center w-full p-2 text-sm font-medium text-gray-500 bg-gray-100 border border-transparent rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-200 focus:ring-gray-300"
                    >
                        <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                        Add station
                    </button>
                </div>
            </div>
        </div>
    );
};
