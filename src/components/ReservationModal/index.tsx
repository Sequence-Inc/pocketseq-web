import { Select, SwitchField } from "@element";
import { Transition } from "@headlessui/react";
import { useReserveHotel, useCalculatePrice } from "@hooks/reserveHotel";
import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { HOTEL_SUBSCRIPTION_CATEGORIES, OPTION_PAYMENT_TERMS } from "@config";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { PriceFormatter } from "src/utils";
import { MY_SUBSCRIPTIONS } from "src/apollo/queries/subscription/queries";
import { useQuery } from "@apollo/client";
import SubsciptionBox from "./SubscriptionBox";

const RequestReservationModal = ({
    showModal,
    reservationData,
    setShowModal,
    setAdditionalOptions,
    setReservationData,
    children,
    userSession,
}) => {
    const {
        fetchCalculatedPrice,
        priceCalculation,
        calculatingPrice,
        fetchCalculatePriceWithAuth,
        priceData,
    } = useCalculatePrice();

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

    const hasHotelSubscriptions = useMemo(() => {
        if (subscription?.mySubscriptions?.length) {
            return subscription?.mySubscriptions?.find(
                (subscription) => subscription?.type === "hotel"
            );
        }
    }, [subscription]);

    const {
        additionalOptionsFields,
        onAdditionalOptionsCheckboxAction,
        onAdditionalFieldChangeQuantity,
        includedOptions,
        setValue,
    } = useReserveHotel({
        plan: reservationData?.plan.id,
        roomPlanId: reservationData?.roomPlanId,
        nAdult: reservationData?.noOfAdults,
        nChild: reservationData?.noOfChilds,
        checkInDate: reservationData?.startDate?.unix(),
        checkOutDate: reservationData?.endDate?.unix(),
    });

    useEffect(() => {
        if (!reservationData) return;
        let calculatePriceInput = {
            roomPlanId: reservationData?.roomPlanId,
            nAdult: reservationData?.noOfAdults,
            nChild: reservationData?.noOfChilds,
            checkInDate: reservationData?.startDate,
            checkOutDate: reservationData?.endDate,
            additionalOptionsFields: additionalOptionsFields,
        };
        setAdditionalOptions(additionalOptionsFields);

        if (
            userSession &&
            (hasHotelSubscriptions?.amount > HOTEL_SUBSCRIPTION_CATEGORIES.B ||
                hasHotelSubscriptions?.amount >
                    reservationData?.subcriptionPrice)
        ) {
            fetchCalculatePriceWithAuth({
                ...calculatePriceInput,
                useSubscription: reservationData?.useSubscription,
            });
        } else {
            fetchCalculatedPrice(calculatePriceInput);
        }
    }, [
        reservationData,
        additionalOptionsFields,
        setAdditionalOptions,
        fetchCalculatedPrice,
        fetchCalculatePriceWithAuth,
    ]);
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

                <div className="fixed z-10 inset-0 overflow-y-auto px-10 py-10 ">
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
                            <div className="relative bg-white rounded-lg px-10 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full sm:min-h-full sm:mx-20 sm:p-6">
                                <div>
                                    <div className="mt-3 text-left text-lg space-y-6 text-gray-700 sm:mt-5">
                                        <button
                                            className="absolute top-3 right-3 hover:bg-gray-200 hover:rounded-sm"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <XIcon className="w-6 text-gray-500" />
                                        </button>
                                        <h3 className="text-3xl leading-6 font-bold">
                                            予約をリクエスト
                                        </h3>
                                        <div className="flex items-start">
                                            <div className="mt-2 pr-6 space-y-5 w-2/3">
                                                <h4 className="text-2xl font-bold">
                                                    旅行
                                                </h4>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h5 className="font-bold">
                                                            プラン
                                                        </h5>
                                                        <p className="text-gray-500">
                                                            {
                                                                reservationData
                                                                    ?.plan.name
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="text-lg font-bold"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            編集
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h5 className="font-bold">
                                                            部屋タイプ
                                                        </h5>
                                                        <p className="text-gray-500">
                                                            {
                                                                reservationData
                                                                    ?.room
                                                                    .hotelRoom
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="text-lg font-bold"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            編集
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h5 className="font-bold">
                                                            予約期間
                                                        </h5>
                                                        <p className="text-gray-500">
                                                            {reservationData?.startDate.format(
                                                                "MM月DD日"
                                                            )}
                                                            〜
                                                            {reservationData?.endDate.format(
                                                                "DD日"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="text-lg font-bold"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            編集
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h5 className="font-bold">
                                                            予約人数
                                                        </h5>
                                                        <p className="text-gray-500">
                                                            ゲスト
                                                            {reservationData?.noOfAdults +
                                                                reservationData?.noOfChild}
                                                            名
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="text-lg font-bold"
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            編集
                                                        </button>
                                                    </div>
                                                </div>

                                                {includedOptions?.length >
                                                    0 && (
                                                    <>
                                                        <div className="border-t border-gray-300 h-0 max-h-0"></div>

                                                        <div className="w-full space-y-3">
                                                            <h5 className="font-bold">
                                                                Included Options
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
                                                                            <p>
                                                                                {
                                                                                    includedOption?.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {includedOption?.description &&
                                                                                    `(${includedOption?.description})`}
                                                                            </p>
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                <div className="border-t border-gray-300 h-0 max-h-0"></div>

                                                <div className="">
                                                    <div className="mb-8">
                                                        <span className="text-2xl font-bold ">
                                                            Additional Options
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
                                                                                <p className="text-base leading-5 font-bold">
                                                                                    {
                                                                                        additionalField?.name
                                                                                    }
                                                                                </p>

                                                                                {paymentTerm && (
                                                                                    <span className="font-normal leading-5 text-sm flex space-x-1">
                                                                                        <p>
                                                                                            {PriceFormatter(
                                                                                                additionalField?.additionalPrice
                                                                                            )}
                                                                                        </p>
                                                                                        <p>
                                                                                            /
                                                                                        </p>
                                                                                        <p>
                                                                                            {
                                                                                                paymentTerm
                                                                                            }
                                                                                        </p>
                                                                                    </span>
                                                                                )}
                                                                                {!paymentTerm && (
                                                                                    <span className="font-normal leading-5 font-base flex space-x-1">
                                                                                        <p className="text-sm text-gray-500">
                                                                                            No
                                                                                            additional
                                                                                            charge
                                                                                        </p>
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex justify-end  space-x-3">
                                                                            <div className="w-20">
                                                                                <Select
                                                                                    options={
                                                                                        additionalField?.stockOptions
                                                                                    }
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

                                                                                {/* <select>
                                                                                    {quantityOptions?.map(
                                                                                        (
                                                                                            val
                                                                                        ) => (
                                                                                            <option
                                                                                                value={
                                                                                                    val
                                                                                                }
                                                                                                key={
                                                                                                    val
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    val
                                                                                                }
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                                </select> */}
                                                                            </div>

                                                                            <div className=" flex items-center ">
                                                                                <p className="font-normal text-base w-12">
                                                                                    {
                                                                                        paymentTerm
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-300 h-0 max-h-0"></div>

                                                <div className="space-y-6">
                                                    {children}
                                                </div>
                                            </div>

                                            <div className="mt-2 ml-6  w-1/3 relative">
                                                {calculatingPrice && (
                                                    <div className="bg-gray-200 h-full w-full  absolute flex items-center justify-center rounded-lg opacity-75">
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
                                                )}
                                                <div
                                                    className={`border  border-gray-300 shadow-sm px-3 py-3 rounded-lg space-y-5`}
                                                >
                                                    <h3 className="text-2xl font-bold">
                                                        料金の詳細
                                                    </h3>
                                                    <div className="flex items-center justify-between ">
                                                        <div>
                                                            大人
                                                            {
                                                                reservationData?.noOfAdults
                                                            }
                                                            {reservationData?.noOfChild >
                                                                0 && (
                                                                <>
                                                                    ・子供
                                                                    {
                                                                        reservationData?.noOfChild
                                                                    }
                                                                </>
                                                            )}
                                                            x
                                                            {
                                                                reservationData?.noOfNight
                                                            }
                                                            泊
                                                        </div>
                                                        <div>
                                                            {reservationData?.price && (
                                                                <div>
                                                                    {PriceFormatter(
                                                                        reservationData?.price /
                                                                            1.1
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {!calculatingPrice &&
                                                        additionalOptionsFields
                                                            ?.filter(
                                                                (item: any) =>
                                                                    !!item?.isChecked
                                                            )
                                                            ?.map(
                                                                (
                                                                    additionalfield: any,
                                                                    index
                                                                ) => {
                                                                    const optionsCharge =
                                                                        additionalfield?.additionalPrice *
                                                                            additionalfield?.quantity ||
                                                                        "No Charge";
                                                                    return (
                                                                        <div
                                                                            className="flex items-center justify-between"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <span className="flex space-x-2 items-end">
                                                                                <p>
                                                                                    {
                                                                                        additionalfield?.name
                                                                                    }
                                                                                </p>

                                                                                <p className="text-gray-400 text-sm">
                                                                                    X
                                                                                    {
                                                                                        additionalfield?.quantity
                                                                                    }
                                                                                </p>
                                                                            </span>
                                                                            <p
                                                                                className={`${
                                                                                    optionsCharge ===
                                                                                        "No Charge" &&
                                                                                    "text-sm text-grey-400"
                                                                                }`}
                                                                            >
                                                                                {optionsCharge ===
                                                                                "No Charge"
                                                                                    ? optionsCharge
                                                                                    : PriceFormatter(
                                                                                          optionsCharge /
                                                                                              1.1
                                                                                      )}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                    <div className="flex items-center justify-between">
                                                        <div>税金</div>
                                                        <div>
                                                            {!priceData &&
                                                                !calculatingPrice &&
                                                                PriceFormatter(
                                                                    reservationData?.price -
                                                                        reservationData?.price /
                                                                            1.1
                                                                )}
                                                            {!calculatingPrice &&
                                                                priceData &&
                                                                PriceFormatter(
                                                                    (priceData?.totalAmount ||
                                                                        0) -
                                                                        (priceData?.totalAmount ||
                                                                            0) /
                                                                            1.1
                                                                )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between font-bold border-t border-gray-300 pt-3">
                                                        <div>合計（税込）</div>
                                                        <div>
                                                            {!calculatingPrice &&
                                                                PriceFormatter(
                                                                    priceData?.totalAmount
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <SubsciptionBox
                                                    hasHotelSubscriptions={
                                                        hasHotelSubscriptions
                                                    }
                                                    spaceDetails={
                                                        reservationData
                                                    }
                                                    setSubscription={
                                                        setSubscription
                                                    }
                                                />
                                            </div>
                                        </div>
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

export default RequestReservationModal;
