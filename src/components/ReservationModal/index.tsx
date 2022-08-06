import { Select } from "@element";
import { Transition } from "@headlessui/react";
import { useReserveHotel, useCalculatePrice } from "@hooks/reserveHotel";
import React, { Fragment, useEffect } from "react";
import { OPTION_PAYMENT_TERMS } from "@config";
import moment from "moment";

const RequestReservationModal = ({
    showModal,
    reservationData,
    setShowModal,
    children,
}) => {
    const {
        fetchCalculatedPrice,
        priceCalculation,
        calculatingPrice,
        priceCalculationError,
    } = useCalculatePrice();

    const {
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        handleSubmit,
        getValues,
        additionalOptionsFields,
        onAdditionalOptionsCheckboxAction,
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
        };

        fetchCalculatedPrice(calculatePriceInput);
    }, [reservationData, fetchCalculatedPrice]);

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

                <div className="fixed z-10 inset-0 overflow-y-auto">
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
                                        <h3 className="text-3xl leading-6 font-bold">
                                            <button
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                            >
                                                &larr;
                                            </button>{" "}
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

                                                <div className="border-t border-gray-300 h-0 max-h-0"></div>

                                                <div className="">
                                                    <div className="mb-8">
                                                        <span className="text-2xl font-bold ">
                                                            Options
                                                        </span>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {additionalOptionsFields?.map(
                                                            (
                                                                additionalField: any,
                                                                index
                                                            ) => {
                                                                const paymentTerm =
                                                                    OPTION_PAYMENT_TERMS.find(
                                                                        (
                                                                            terms
                                                                        ) =>
                                                                            terms.value ===
                                                                            additionalField?.paymentTerm
                                                                    ).label;

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
                                                                                        index,
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

                                                                                <span className="font-normal leading-5 font-base flex space-x-1">
                                                                                    <p>
                                                                                        ￥
                                                                                        {
                                                                                            additionalField?.additionalPrice
                                                                                        }
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
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex justify-end  space-x-3">
                                                                            <div className="w-20">
                                                                                <Select
                                                                                    options={[]}
                                                                                    value=""
                                                                                    label=""
                                                                                    className="w-full"
                                                                                    hidePlaceholder
                                                                                />
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
                                            <div className="mt-2 ml-6 space-y-5 w-1/3">
                                                <div className="border border-gray-300 shadow-sm py-3 px-4 rounded-lg space-y-5">
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
                                                            )}{" "}
                                                            x{" "}
                                                            {
                                                                reservationData?.noOfNight
                                                            }
                                                            泊
                                                        </div>
                                                        <div>
                                                            {reservationData?.price && (
                                                                <div>
                                                                    ￥{" "}
                                                                    {
                                                                        reservationData?.price
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>税金</div>
                                                        <div>
                                                            ￥{" "}
                                                            {reservationData?.price *
                                                                0.1}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between font-bold border-t border-gray-300 pt-3">
                                                        <div>合計（税込）</div>
                                                        <div>
                                                            ￥{" "}
                                                            {reservationData?.price *
                                                                0.1 +
                                                                reservationData?.price}
                                                        </div>
                                                    </div>
                                                </div>
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
