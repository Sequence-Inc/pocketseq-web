import { Select, SwitchField } from "@element";
import { Transition } from "@headlessui/react";
import {
    useCalculateSpacePrice,
    TUseCalculateSpacePriceProps,
    useReserveSpace,
} from "@hooks/reserveSpace";
import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { OPTION_PAYMENT_TERMS, SPACE_SUBSCRIPTION_CATEGORIES } from "@config";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import moment from "moment";
import { LoadingSpinner } from "../LoadingSpinner";
import { PriceFormatter } from "src/utils";
import { useQuery } from "@apollo/client";
import { MY_SUBSCRIPTIONS } from "src/apollo/queries/subscription/queries";
import SubsciptionBox from "./SubscriptionBox";

interface IReserveSpaceModal {
    reservationData: TUseCalculateSpacePriceProps;
    showModal: boolean;
    setShowModal: Function;
    setAdditionalOptions: Function;
    children?: React.ReactNode;
    setReservationData?: any;
    userSession?: any;
}

const ReserveSpaceModal = ({
    reservationData,
    showModal,
    setShowModal,
    children,
    setAdditionalOptions,
    userSession,
    setReservationData,
}: IReserveSpaceModal) => {
    const {
        spaceDetails,
        fetchingSpace,
        fetchingSpaceError,
        additionalOptionsFields,
        onAdditionalFieldChangeQuantity,
        onAdditionalOptionsCheckboxAction,
        includedOptions,
    } = useReserveSpace(reservationData?.spaceId);

    const setSubscription = useCallback(
        (val) => {
            setReservationData((prev) => ({
                ...prev,
                useSubscription: val,
            }));
        },
        [setReservationData]
    );

    const { data: subscription, loading: fetchingSubscriptions } =
        useQuery(MY_SUBSCRIPTIONS);

    const hasSpaceSubscriptions = useMemo(() => {
        if (subscription?.mySubscriptions?.length) {
            return subscription?.mySubscriptions?.find(
                (subscription) => subscription?.type === "rental-space"
            );
        }
    }, [subscription]);

    const {
        fetchCalculatedPrice,
        calculatingPrice,
        calculatedPrice,
        priceCalculationError,
        fetchCalculatedPriceWithAuth,
        loading,
        priceData,
    } = useCalculateSpacePrice();

    const addressText = `〒${spaceDetails?.address?.postalCode} ${spaceDetails?.address?.prefecture.name} ${spaceDetails?.address?.addressLine1} ${spaceDetails?.address?.addressLine2}`;

    useEffect(() => {
        if (!reservationData) return;
        let calculatePriceInput = {
            ...reservationData,
            additionalOptionsFields: additionalOptionsFields,
        };
        setAdditionalOptions(additionalOptionsFields);

        if (
            userSession &&
            (hasSpaceSubscriptions?.amount > SPACE_SUBSCRIPTION_CATEGORIES.B ||
                hasSpaceSubscriptions?.amount > spaceDetails?.subcriptionPrice)
        ) {
            fetchCalculatedPriceWithAuth(calculatePriceInput);
        } else {
            fetchCalculatedPrice(calculatePriceInput);
        }
    }, [
        reservationData,
        additionalOptionsFields,
        setAdditionalOptions,
        fetchCalculatedPrice,
        fetchCalculatedPriceWithAuth,
        userSession,
    ]);

    const taxCalculated = priceData?.total
        ? Math.ceil(priceData?.total - Math.ceil(priceData?.total / 1.1))
        : 0;
    return (
        <Transition.Root show={showModal} as={Fragment}>
            <div className="relative z-10">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-10 inset-0 overflow-y-auto sm:px-10 py-10 ">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="relative bg-white rounded-lg px-4 sm:px-10 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full sm:min-h-full sm:mx-20 sm:p-6">
                                <div>
                                    <div className="mt-3 text-left text-lg space-y-6 text-gray-700 sm:mt-5">
                                        <button
                                            className="absolute top-3 right-3 hover:bg-gray-200 hover:rounded-sm"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <XIcon className="w-6 text-gray-500" />
                                        </button>
                                        <h3 className="text-xl sm:text-3xl leading-6 font-bold">
                                            予約
                                        </h3>

                                        {fetchingSpace && (
                                            <div className="my-20">
                                                <LoadingSpinner />
                                            </div>
                                        )}
                                        {!fetchingSpace &&
                                            fetchingSpaceError && (
                                                <div>
                                                    Could not load space
                                                    details. Please try again
                                                    later
                                                </div>
                                            )}
                                        {!fetchingSpace &&
                                            !fetchingSpaceError && (
                                                <div className="grid gap-y-4 gap-x-0 sm:gap-x-8 grid-cols-1 sm:grid-cols-3">
                                                    <div className="space-y-5 text-base sm:text-lg sm:col-span-2">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h5 className="font-bold">
                                                                    施設名
                                                                </h5>
                                                                <div className="text-gray-500">
                                                                    {
                                                                        spaceDetails?.name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h5 className="font-bold">
                                                                    タイプ
                                                                </h5>
                                                                <div className="text-gray-500">
                                                                    {
                                                                        spaceDetails
                                                                            ?.spaceTypes[0]
                                                                            .title
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h5 className="font-bold">
                                                                    住所
                                                                </h5>
                                                                <div className="text-gray-500">
                                                                    {addressText ||
                                                                        ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h5 className="font-bold">
                                                                    チェックイン
                                                                </h5>
                                                                <div className="text-gray-500">
                                                                    {reservationData?.fromDateTime &&
                                                                        moment(
                                                                            reservationData?.fromDateTime
                                                                        ).format(
                                                                            "YYYY-MM-DD"
                                                                        )}
                                                                    ,{" "}
                                                                    {reservationData?.fromDateTime &&
                                                                        moment(
                                                                            reservationData?.fromDateTime
                                                                        ).format(
                                                                            "hh:mm a"
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {includedOptions?.length >
                                                            0 && (
                                                            <>
                                                                <div className="border-t border-gray-300 h-0 max-h-0"></div>

                                                                <div className="w-full space-y-3">
                                                                    <h5 className="font-bold">
                                                                        オプション
                                                                    </h5>

                                                                    {includedOptions?.map(
                                                                        (
                                                                            includedOption,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="flex space-x-2"
                                                                            >
                                                                                <CheckIcon className="w-6 text-green-400" />
                                                                                <span className="flex items-center space-x-2">
                                                                                    <div>
                                                                                        {
                                                                                            includedOption?.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {includedOption?.description &&
                                                                                            `(${includedOption?.description})`}
                                                                                    </div>
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {additionalOptionsFields?.length >
                                                            0 && (
                                                            <>
                                                                <div className="border-t border-gray-300 h-0 max-h-0"></div>
                                                                <div className="">
                                                                    <div className="mb-8">
                                                                        <span className="text-2xl font-bold ">
                                                                            オプションの追加
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        {additionalOptionsFields?.map(
                                                                            (
                                                                                additionalField: any,
                                                                                additionalFieldIndex
                                                                            ) => {
                                                                                const paymentTerm =
                                                                                    OPTION_PAYMENT_TERMS.find(
                                                                                        (
                                                                                            terms
                                                                                        ) =>
                                                                                            terms.value ===
                                                                                            additionalField?.paymentTerm
                                                                                    )?.label;

                                                                                // const selectOptions =
                                                                                return (
                                                                                    <div
                                                                                        className="flex items-center justify-between"
                                                                                        key={
                                                                                            additionalField?.additionalOptionFieldId
                                                                                        }
                                                                                    >
                                                                                        <div className="flex space-x-2 ">
                                                                                            <input
                                                                                                id="comments"
                                                                                                aria-describedby="comments-description"
                                                                                                name="comments"
                                                                                                type="checkbox"
                                                                                                checked={
                                                                                                    additionalField?.isChecked
                                                                                                }
                                                                                                onChange={(
                                                                                                    event
                                                                                                ) =>
                                                                                                    onAdditionalOptionsCheckboxAction(
                                                                                                        additionalFieldIndex,
                                                                                                        event
                                                                                                            .target
                                                                                                            .checked
                                                                                                    )
                                                                                                }
                                                                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                                                            />
                                                                                            <div className="flex flex-col space-y-1">
                                                                                                <div className="text-base leading-5 font-bold">
                                                                                                    {
                                                                                                        additionalField?.name
                                                                                                    }
                                                                                                </div>

                                                                                                {paymentTerm && (
                                                                                                    <span className="font-normal leading-5 font-base flex space-x-1">
                                                                                                        <div>
                                                                                                            {PriceFormatter(
                                                                                                                additionalField?.additionalPrice
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            /
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            {
                                                                                                                paymentTerm
                                                                                                            }
                                                                                                        </div>
                                                                                                    </span>
                                                                                                )}
                                                                                                {!paymentTerm && (
                                                                                                    <span className="font-normal leading-5 font-base flex space-x-1">
                                                                                                        <div className="text-sm text-gray-500">
                                                                                                            No
                                                                                                            additional
                                                                                                            charge
                                                                                                        </div>
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex justify-end  space-x-3">
                                                                                            <div className="w-20 overflow-visible">
                                                                                                <Select
                                                                                                    options={
                                                                                                        additionalField?.stockOptions
                                                                                                    }
                                                                                                    optionClassName="top-auto bottom-full"
                                                                                                    value={
                                                                                                        additionalField?.quantity
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        val
                                                                                                    ) =>
                                                                                                        onAdditionalFieldChangeQuantity(
                                                                                                            val,
                                                                                                            additionalFieldIndex
                                                                                                        )
                                                                                                    }
                                                                                                    label=""
                                                                                                    valueKey="value"
                                                                                                    labelKey="label"
                                                                                                    className="w-full"
                                                                                                    hidePlaceholder
                                                                                                />
                                                                                            </div>

                                                                                            <div className=" flex items-center ">
                                                                                                <div className="font-normal text-base w-12">
                                                                                                    {
                                                                                                        paymentTerm
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="relative">
                                                        <div
                                                            className={`border  border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-5`}
                                                        >
                                                            <h3 className="text-xl sm:text-2xl font-bold">
                                                                料金の詳細
                                                            </h3>

                                                            <div className="flex items-center justify-between text-base">
                                                                <div>
                                                                    基本料金
                                                                </div>

                                                                {priceData && (
                                                                    <div>
                                                                        {PriceFormatter(
                                                                            priceData?.spaceAmount /
                                                                                1.1
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {(!calculatingPrice ||
                                                                !loading) &&
                                                                additionalOptionsFields
                                                                    ?.filter(
                                                                        (
                                                                            item: any
                                                                        ) =>
                                                                            !!item?.isChecked
                                                                    )
                                                                    ?.map(
                                                                        (
                                                                            additionalfield: any,
                                                                            index
                                                                        ) => {
                                                                            const optionsCharge =
                                                                                PriceFormatter(
                                                                                    (additionalfield?.additionalPrice *
                                                                                        additionalfield?.quantity) /
                                                                                        1.1
                                                                                ) ||
                                                                                "No Charge";
                                                                            return (
                                                                                <div
                                                                                    className="flex items-center justify-between"
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    <span className="flex space-x-2 items-end">
                                                                                        <div>
                                                                                            {
                                                                                                additionalfield?.name
                                                                                            }
                                                                                        </div>

                                                                                        <div className="text-gray-400 text-sm">
                                                                                            {
                                                                                                additionalfield?.quantity
                                                                                            }
                                                                                        </div>
                                                                                    </span>
                                                                                    <div
                                                                                        className={`${
                                                                                            optionsCharge ===
                                                                                                "No Charge" &&
                                                                                            "text-sm text-grey-400"
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            optionsCharge
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                            <div className="flex items-center justify-between text-base">
                                                                <div>税金</div>

                                                                <div>
                                                                    {PriceFormatter(
                                                                        taxCalculated
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between font-bold border-t border-gray-300 pt-3 text-base">
                                                                <div>
                                                                    合計（税込）
                                                                </div>

                                                                {priceData?.total && (
                                                                    <div>
                                                                        {PriceFormatter(
                                                                            priceData?.total
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {calculatingPrice ||
                                                            (loading && (
                                                                <div className=" h-14 my-2  flex items-center justify-center rounded-lg opacity-75">
                                                                    <div className="flex items-center justify-center h-content">
                                                                        <svg
                                                                            className="animate-spin -ml-1 mr-3 h-6 w-6 text-primary"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <circle
                                                                                className="opacity-25"
                                                                                cx="12"
                                                                                cy="12"
                                                                                r="10"
                                                                                stroke="currentColor"
                                                                                strokeWidth="4"
                                                                            ></circle>
                                                                            <path
                                                                                className="opacity-50"
                                                                                fill="currentColor"
                                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                            ></path>
                                                                        </svg>
                                                                        <span className="text-gray-400 text-lg">
                                                                            Calculating
                                                                            Price
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        <div className="border border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-3 mt-4">
                                                            <div className="font-bold">
                                                                適用されるサブスクリプション:
                                                            </div>
                                                            <hr />
                                                            <SubsciptionBox
                                                                hasSpaceSubscriptions={
                                                                    hasSpaceSubscriptions
                                                                }
                                                                spaceDetails={
                                                                    spaceDetails
                                                                }
                                                                setSubscription={
                                                                    setSubscription
                                                                }
                                                                fetchingSpace={
                                                                    fetchingSpace
                                                                }
                                                                useSubscription={
                                                                    reservationData?.useSubscription
                                                                }
                                                                priceData={
                                                                    priceData
                                                                }
                                                            />
                                                        </div>

                                                        {/* {hasSpaceSubscriptions && (
                                                        <div className="border border-gray-300 shadow-sm px-3 rounded-lg space-y-5 mt-4">
                                                            <SwitchField
                                                                className="my-2"
                                                                label="Use Subsciption"
                                                                onChange={(
                                                                    val
                                                                ) =>
                                                                    setSubscription(
                                                                        val
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )} */}
                                                    </div>
                                                    <div className="space-y-5 sm:col-span-2">
                                                        <div className="border-t border-gray-300 h-0 max-h-0"></div>
                                                        <div className="space-y-6">
                                                            {children}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </div>
        </Transition.Root>
    );
};

export default ReserveSpaceModal;
