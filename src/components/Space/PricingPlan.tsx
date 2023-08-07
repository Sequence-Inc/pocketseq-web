import React, { useEffect, useState, Fragment, useRef } from "react";
import { useMutation } from "@apollo/client";
import { Button, Select, TextField } from "@element";
import { ExclamationIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { DatePicker } from "antd";
import useTranslation from "next-translate/useTranslation";
import { Popover, Dialog, Transition } from "@headlessui/react";

import {
    ADD_PRICING_PLAN,
    REMOVE_PRICING_PLAN,
} from "src/apollo/queries/space.queries";
import { IOtherSpacesProps } from "./NearestStationStep";
import moment, { Moment } from "moment";
import { LoadingSpinner } from "../LoadingSpinner";
import { PriceFormatter } from "src/utils";
import { useGetInitialSpace } from "@hooks/useAddSpace";
import AlertModal from "../AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

const planTypes = [
    { title: "DAILY", label: "日" },
    { title: "HOURLY", label: "時間" },
    { title: "MINUTES", label: "分" },
];

export const durationSuffix = (type) => {
    return planTypes.filter((plan) => plan.title === type)[0].label;
};

const dailyOptions = Array.from({ length: 30 }, (_, index) => index + 1);
const hourlyOptions = Array.from({ length: 24 }, (_, index) => index + 1);
const minutesOptions = [5, 10, 15, 30, 45];

const PricingPlan = ({
    activeStep,
    setActiveStep,
    steps,
    spaceId,
    selectedSpaceId,
}: // refetch,
IOtherSpacesProps) => {
    const [defaultPricePlans, setDefaultPricePlans] = useState([]);
    const [pricePlans, setPricePlans] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activePlan, setActivePlan] = useState(-1);
    const router = useRouter();
    const { id } = router.query;
    const {
        initialValue,
        spaceDetailLoading,
        refetchSpaceDetail: refetch,
    } = useGetInitialSpace(id || spaceId || selectedSpaceId);
    const [addPricePlan, { error: addPricePlanError }] =
        useMutation(ADD_PRICING_PLAN);
    const [mutateRemovePrice, { error: removePricePlanError }] =
        useMutation(REMOVE_PRICING_PLAN);

    const { t } = useTranslation("adminhost");

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const setSeparatePlans = (mergedPlans) => {
        const defaultPlans = [];
        const plans = [];
        mergedPlans.map((plan) => {
            if (plan.isDefault) {
                defaultPlans.push(plan);
            } else {
                plans.push(plan);
            }
        });
        setDefaultPricePlans(defaultPlans);
        setPricePlans(plans);
    };

    useEffect(() => {
        if (initialValue?.pricePlans) {
            setSeparatePlans(initialValue?.pricePlans);
        }
    }, [initialValue?.pricePlans]);

    const showForm = () => {
        setOpenForm(true);
    };

    const closeForm = () => {
        setOpenForm(false);
    };

    const addPlan = async (plan) => {
        const { data, errors } = await addPricePlan({
            variables: {
                spaceId: id || selectedSpaceId || spaceId,
                pricePlan: plan,
            },
        });
        if (errors) {
            console.log("has error", errors);
        } else {
            const newPlan = data.addPricePlan;
            setSeparatePlans([...pricePlans, newPlan]);
            initialValue && refetch();
            setOpenForm(false);
        }
    };

    const removePlan = async (planId) => {
        setLoading(true);
        try {
            const { data } = await mutateRemovePrice({
                variables: {
                    id: planId,
                },
            });
            if (data) {
                const newDefaultPlans = defaultPricePlans.filter(
                    (_) => _.id !== planId
                );
                const newPlans = pricePlans.filter((_) => _.id !== planId);
                setSeparatePlans([...newDefaultPlans, ...newPlans]);
            }
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
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
        handleNext();
    };

    const listPlans = (plans, type) => {
        return [...plans.filter((plan) => plan.type === type)].sort(
            (a, b) => a.duration - b.duration
        );
    };

    const renderPlanItemsFromCategory = (category) => {
        return category.map((plan) => {
            return (
                <div key={plan.id}>
                    <PricePlanItem
                        pricePlan={plan}
                        index={plan.id}
                        removePlan={(value) => removePlan(value)}
                    />
                </div>
            );
        });
    };

    const renderDefaultPricePlans = () => {
        const daily = listPlans(defaultPricePlans, "DAILY");
        const hourly = listPlans(defaultPricePlans, "HOURLY");
        const minutes = listPlans(defaultPricePlans, "MINUTES");

        return (
            <div className="flex w-full space-x-6">
                <div className="w-full space-y-3">
                    <h3 className="text-sm text-gray-500 font-bold">日</h3>
                    {renderPlanItemsFromCategory(daily)}
                </div>
                <div className="w-full space-y-3">
                    <h3 className="text-sm text-gray-500 font-bold">時間</h3>
                    {renderPlanItemsFromCategory(hourly)}
                </div>
                <div className="w-full space-y-3">
                    <h3 className="text-sm text-gray-500 font-bold">分</h3>
                    {renderPlanItemsFromCategory(minutes)}
                </div>
            </div>
        );
    };

    const renderPricePlans = () => {
        const daily = listPlans(pricePlans, "DAILY");
        const hourly = listPlans(pricePlans, "HOURLY");
        const minutes = listPlans(pricePlans, "MINUTES");

        return (
            <div className="flex w-full space-x-6">
                <div className="w-full space-y-3">
                    <h3 className="text-sm text-gray-500 font-bold">日</h3>
                    {renderPlanItemsFromCategory(daily)}
                </div>
                <div className="w-full space-y-3">
                    <h3 className="text-sm text-gray-500 font-bold">時間</h3>
                    {renderPlanItemsFromCategory(hourly)}
                </div>
                <div className="w-full space-y-3">
                    <h3 className="text-sm text-gray-500 font-bold">分</h3>
                    {renderPlanItemsFromCategory(minutes)}
                </div>
            </div>
        );
    };

    return (
        <div className="">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {t("price-plan-title")}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                        {t("price-plan-description")}
                    </div>
                </div>
                <div>
                    <button
                        onClick={showForm}
                        className="flex items-center justify-center w-full p-2 text-sm font-medium text-white bg-primary border border-transparent rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-primaryHover focus:ring-primaryHover"
                    >
                        <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                        {t("price-plan-add")}
                    </button>
                </div>
            </div>
            {openForm && (
                <div className="w-full p-6 space-y-3">
                    <h3 className="text-2xl text-primary font-bold text-center">
                        料金プラン追加する
                    </h3>
                    <div>
                        <PricePlanForm
                            addPlan={addPlan}
                            closeForm={closeForm}
                            addError={addPricePlanError}
                        />
                    </div>
                </div>
            )}
            <div className="w-full p-6 space-y-3">
                <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-2">
                    基本料金プラン
                </h2>
                {renderDefaultPricePlans()}
            </div>
            <div className="w-full p-6 space-y-3">
                <h2 className="text-lg text-gray-600 font-bold border-b border-gray-100 pb-2">
                    特別プラン
                </h2>
                {renderPricePlans()}
            </div>
            <div className="flex justify-between px-4 py-5 border-t border-gray-100 bg-gray-50 sm:px-6">
                {id ? null : (
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
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </div>
    );
};

export default PricingPlan;

const PricePlanItem = ({ index, pricePlan, removePlan }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const {
        id,
        type,
        amount,
        duration,
        title,
        cooldownTime,
        lastMinuteDiscount,
        maintenanceFee,
        fromDate,
        toDate,
    } = pricePlan;

    const cancelButtonRef = useRef(null);

    const deletePlan = async () => {
        setIsLoading(true);
        await removePlan(id);
        setIsLoading(false);
        setOpen(false);
    };

    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <ExclamationIcon
                                            className="h-6 w-6 text-red-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        {isLoading && (
                                            <LoadingSpinner loadingText="読み込み中..." />
                                        )}

                                        {!isLoading && (
                                            <>
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-lg leading-6 font-medium text-gray-900"
                                                >
                                                    Are you sure?
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <div className="text-sm text-gray-500">
                                                        Would you like to delete
                                                        "{title}" plan?
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => deletePlan()}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <Popover key={index} className="relative">
                <Popover.Button className="flex w-full h-12 items-center px-4 py-3 text-white rounded-md bg-primary hover:bg-primaryHover">
                    <div className="flex-grow text-left">{title}</div>
                    <div className="w-10 text-center">
                        {duration}
                        {durationSuffix(type)}
                    </div>
                    <div className="w-20 text-right">
                        {PriceFormatter(amount)}
                    </div>
                </Popover.Button>
                <Popover.Panel className="absolute bottom-12 left-0 right-0 py-4 px-3 rounded-md shadow-lg z-20 bg-white text-gray-700 space-y-4">
                    <div className="text-gray-500 space-y-2">
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                プランタイトル
                            </div>
                            <div>{title}</div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                対タイプ
                            </div>
                            <div>{durationSuffix(type)}対</div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                期間
                            </div>
                            <div>{`${duration}${durationSuffix(type)}`}</div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                料金
                            </div>
                            <div>{PriceFormatter(amount)}</div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                開始日
                            </div>
                            <div>
                                {fromDate
                                    ? moment(fromDate).format("YYYY-MM-DD")
                                    : "無し"}
                            </div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                終了日
                            </div>
                            <div>
                                {toDate
                                    ? moment(toDate).format("YYYY-MM-DD")
                                    : "無し"}
                            </div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                直前割引
                            </div>
                            <div>{PriceFormatter(lastMinuteDiscount)}</div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                リセット時間
                            </div>
                            <div>{cooldownTime}分</div>
                        </div>
                        <div className="w-full flex items-center space-x-4">
                            <div className="w-28 font-bold text-right">
                                手数料
                            </div>
                            <div>{PriceFormatter(maintenanceFee)}</div>
                        </div>
                    </div>
                    <div className="flex justify-center w-full text-center border-t pt-3">
                        <button
                            className="flex items-center  text-base text-red-500 hover:text-red-600"
                            onClick={() => setOpen(true)}
                        >
                            <TrashIcon className="w-5 h-5 mr-1" /> 消す
                        </button>
                    </div>
                </Popover.Panel>
            </Popover>
        </>
    );
};

const PricePlanForm = ({ addPlan, closeForm, addError }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("DAILY");
    const [amount, setAmount] = useState<string>();
    const [lastMinuteDiscount, setLastMinuteDiscount] = useState<string>();
    const [duration, setDuration] = useState<number>();
    const [durationOptions, setDurationOptions] =
        useState<number[]>(dailyOptions);
    const [cooldownTime, setCooldownTime] = useState<string>();
    const [maintenanceFee, setMaintenanceFee] = useState<string>("0");
    const [fromDateActive, setFormDateActive] = useState<boolean>(false);
    const [toDateActive, setToDateActive] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<Moment>(moment().add(1, "d"));
    const [toDate, setToDate] = useState<Moment>(moment().add(6, "M"));
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation("adminhost");

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

    const handleSubmit = async () => {
        setLoading(true);
        if (!title || !type || !amount || parseInt(amount) <= 0 || !duration) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "必要な情報をすべて入力してください",
            });
            openModal();
            setLoading(false);
            return;
        }
        try {
            await addPlan({
                title,
                type,
                amount: parseFloat(amount),
                duration,
                lastMinuteDiscount: parseFloat(lastMinuteDiscount),
                cooldownTime: parseInt(cooldownTime),
                maintenanceFee: parseFloat(maintenanceFee),
                fromDate: fromDateActive
                    ? fromDate.format("YYYY-MM-DD").toString()
                    : null,
                toDate: toDateActive
                    ? toDate.format("YYYY-MM-DD").toString()
                    : null,
            });
        } catch (error) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: error.message,
            });
            openModal();
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type === "DAILY") {
            setDurationOptions(dailyOptions);
            setDuration(dailyOptions[0]);
        } else if (type === "HOURLY") {
            setDurationOptions(hourlyOptions);
            setDuration(hourlyOptions[0]);
        } else if (type === "MINUTES") {
            setDurationOptions(minutesOptions);
            setDuration(minutesOptions[0]);
        }
    }, [type]);

    return (
        <div className="space-y-4">
            {addError && <div>Add error</div>}
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
                    label="対タイプ"
                    options={planTypes}
                    error={null}
                    errorMessage="Space Types is required"
                    labelKey="label"
                    valueKey="title"
                    singleRow
                    value={type}
                    onChange={(event) => {
                        setType(event.toString());
                    }}
                />
            </div>
            <div>
                <div className="flex items-center">
                    <Select
                        label="期間"
                        options={durationOptions}
                        error={null}
                        errorMessage="duration"
                        singleRow
                        value={duration}
                        onChange={(event) => {
                            setDuration(event as number);
                        }}
                    />
                    <div className="ml-2 text-lg text-gray-500">
                        {durationSuffix(type)}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center">
                    <TextField
                        label={t("price-plan-price")}
                        error={null}
                        errorMessage="Price is required"
                        autoFocus
                        singleRow
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                    <div className="ml-2 text-lg text-gray-500">円</div>
                </div>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="sm:space-x-4 flex-none flex items-center">
                        <label className="block text-sm font-bold text-gray-700 sm:text-right w-60">
                            開始日
                        </label>
                        <div className="h-10 flex items-center">
                            <input
                                type="checkbox"
                                checked={fromDateActive ? true : false}
                                onChange={() =>
                                    setFormDateActive(!fromDateActive)
                                }
                            />
                        </div>
                        {fromDateActive && (
                            <div className="relative rounded-md">
                                <DatePicker
                                    mode="date"
                                    id="fromDate"
                                    className="appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary"
                                    value={fromDate}
                                    defaultValue={null}
                                    onChange={(value) => setFromDate(value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="sm:space-x-4 flex-none sm:flex items-center">
                        <label className="block text-sm font-bold text-gray-700 sm:text-right w-60">
                            終了日
                        </label>
                        <div className="h-10 flex items-center">
                            <input
                                type="checkbox"
                                checked={toDateActive ? true : false}
                                onChange={() => setToDateActive(!toDateActive)}
                            />
                        </div>
                        {toDateActive && (
                            <div className="relative rounded-md">
                                <DatePicker
                                    mode="date"
                                    id="fromDate"
                                    className="appearance-none block w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm border-gray-300 focus:ring-primary focus:border-primary"
                                    value={toDate}
                                    onChange={(value) => setToDate(value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center">
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
                    <div className="ml-2 text-lg text-gray-500">円</div>
                </div>
            </div>
            <div>
                <div className="flex items-center">
                    <TextField
                        label={t("price-plan-cooldown")}
                        error={null}
                        errorMessage="Cooldown time is required"
                        autoFocus
                        singleRow
                        value={cooldownTime}
                        onChange={(event) =>
                            setCooldownTime(event.target.value)
                        }
                    />
                    <div className="ml-2 text-lg text-gray-500">分</div>
                </div>
            </div>
            {/* <div>
                <div className="flex items-center">
                    <TextField
                        label={t("price-plan-handling-fee")}
                        error={null}
                        errorMessage=""
                        autoFocus
                        singleRow
                        value={maintenanceFee}
                        onChange={(event) =>
                            setMaintenanceFee(event.target.value)
                        }
                    />
                    <div className="ml-2 text-lg text-gray-500">円</div>
                </div>
            </div> */}
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
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </div>
    );
};
