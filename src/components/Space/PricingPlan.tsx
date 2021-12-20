import { useMutation } from "@apollo/client";
import { Button, Select, TextField } from "@element";
import { PlusIcon } from "@heroicons/react/outline";
import { TrashIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
    ADD_PRICING_PLAN,
    REMOVE_PRICING_PLAN,
} from "src/apollo/queries/space.queries";
import { IOtherSpacesProps } from "./NearestStationStep";

import useTranslation from "next-translate/useTranslation";

const PricingPlan = ({
    activeStep,
    setActiveStep,
    steps,
    spaceId,
    initialValue,
    refetch,
}: IOtherSpacesProps) => {
    const [pricePlans, setPricePlans] = useState([]);
    const [toggleForm, setToggleForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activePlan, setActivePlan] = useState(-1);
    const [mutate] = useMutation(ADD_PRICING_PLAN);
    const [mutateRemovePrice] = useMutation(REMOVE_PRICING_PLAN);
    const router = useRouter();
    const { id } = router.query;

    const { t } = useTranslation("adminhost");

    useEffect(() => {
        if (initialValue) setPricePlans(initialValue);
    }, [initialValue]);

    const showForm = () => {
        setToggleForm(true);
    };

    const closeForm = () => {
        setToggleForm(false);
    };

    const addPlan = async (plan) => {
        const { data } = await mutate({
            variables: {
                spaceId: initialValue ? id : spaceId,
                pricePlans: [plan],
            },
        });
        if (data) {
            const newPlan = {
                ...plan,
                id: data.addSpacePricePlans.id,
            };
            setPricePlans([...pricePlans, newPlan]);
            initialValue && refetch();
            setToggleForm(false);
        }
    };
    const removePlan = async (index, priceId) => {
        setLoading(true);
        setActivePlan(index);
        try {
            const { data } = await mutateRemovePrice({
                variables: {
                    input: {
                        id: priceId,
                        spaceId: initialValue ? id : spaceId,
                    },
                },
            });
            if (data) {
                const newPlans = pricePlans.filter((_, idx) => idx !== index);
                setPricePlans(newPlans);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
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
        if (pricePlans.length > 0) handleNext();
    };

    return (
        <div className="">
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {t("price-plan-title")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {t("price-plan-description")}
                </p>
            </div>
            <div className="w-full my-6 space-y-3 sm:w-96 sm:ml-64">
                {/* <h3 className="font-medium text-gray-700">Price Plans</h3> */}
                {pricePlans.map((price, index) => {
                    return (
                        <PricePlanItem
                            key={index}
                            index={index}
                            pricePlan={price}
                            removePlan={removePlan}
                            isLoading={loading && activePlan === index && true}
                        />
                    );
                })}
            </div>
            <div className="mb-8">
                {toggleForm && (
                    <PricePlanForm addPlan={addPlan} closeForm={closeForm} />
                )}
                {toggleForm ? null : (
                    <div className="items-center flex-none sm:space-x-4 sm:flex">
                        <div className="block text-sm font-medium text-gray-700 sm:text-right w-60">
                            &nbsp;
                        </div>
                        <div className="relative rounded-md sm:w-96">
                            <button
                                onClick={showForm}
                                className="flex items-center justify-center w-full p-2 text-sm font-medium text-gray-500 bg-gray-100 border border-transparent rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-200 focus:ring-gray-300"
                            >
                                <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                                {t("price-plan-add")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between px-4 py-5 border-t border-gray-100 bg-gray-50 sm:px-6">
                {initialValue ? null : (
                    <>
                        <Button
                            className="w-auto px-8"
                            disabled={!hasPrevious || loading}
                            onClick={handlePrevious}
                        >
                            {t("previous-page")}
                        </Button>
                        <Button
                            variant="primary"
                            className="w-auto px-8"
                            onClick={handlePricingPlan}
                            loading={loading}
                        >
                            {t("next-page")}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PricingPlan;

const PricePlanItem = ({ index, pricePlan, removePlan, isLoading }) => {
    const {
        id,
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
            {isLoading ? (
                <svg
                    version="1.1"
                    id="loader-1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    className="w-6 h-6 mr-3 text-green-200 animate-spin"
                    viewBox="0 0 50 50"
                >
                    <path
                        fill="currentColor"
                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                    ></path>
                </svg>
            ) : (
                <button onClick={() => removePlan(index, id)}>
                    <TrashIcon className="w-6 h-6 text-green-200 hover:text-green-100" />
                </button>
            )}
        </div>
    );
};

const PricePlanForm = ({ addPlan, closeForm }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("HOURLY");
    const [amount, setAmount] = useState<string>();
    const [lastMinuteDiscount, setLastMinuteDiscount] = useState<string>();
    const [duration, setDuration] = useState<string>();
    const [cooldownTime, setCooldownTime] = useState<string>();
    const [maintenanceFee, setMaintenanceFee] = useState<string>();
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation("adminhost");

    const planTypes = [{ title: "HOURLY" }, { title: "DAILY" }];

    const handleSubmit = async () => {
        setLoading(true);
        if (!title || !type || !amount || parseInt(amount) <= 0 || !duration) {
            alert("Please provide title, plan type, price and duration.");
            setLoading(false);
            return;
        }
        await addPlan({
            title,
            type,
            amount: parseFloat(amount),
            lastMinuteDiscount: parseFloat(lastMinuteDiscount),
            duration: parseFloat(duration),
            cooldownTime: parseInt(cooldownTime),
            maintenanceFee: parseFloat(maintenanceFee),
        });
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <TextField
                    label={t("price-plan-name")}
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
                    label={t("price-plan-price")}
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
                    label={t("price-plan-discount")}
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
                    label={t("price-plan-cooldown")}
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
                    label={t("price-plan-handling-fee")}
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
                <div className="relative rounded-md sm:w-96 sm:flex sm:space-x-3">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        {t("price-plan-add")}
                    </Button>
                    <Button onClick={closeForm} disabled={loading}>
                        {t("cancel")}
                    </Button>
                </div>
            </div>
        </div>
    );
};
