import { Select } from "@element";
import { Transition } from "@headlessui/react";
import {
    useCalculateSpacePrice,
    TUseCalculateSpacePriceProps,
    useReserveSpace,
} from "@hooks/reserveSpace";
import React, { Fragment, useEffect } from "react";
import { OPTION_PAYMENT_TERMS } from "@config";
import { CheckIcon, XIcon } from "@heroicons/react/outline";

interface IReserveSpaceModal {
    reservationData: TUseCalculateSpacePriceProps;
    showModal: boolean;
    setShowModal: Function;
    children?: React.ReactNode;
}

const ReserveSpaceModal = ({
    reservationData,
    showModal,
    setShowModal,
    children,
}: IReserveSpaceModal) => {
    const { spaceId } = useReserveSpace(reservationData?.spaceId);
    const { calculatingPrice, calculatedPrice, priceCalculationError } =
        useCalculateSpacePrice(reservationData);

    console.log("modal data", {
        calculatingPrice,
        calculatedPrice,
        priceCalculationError,
    });
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
