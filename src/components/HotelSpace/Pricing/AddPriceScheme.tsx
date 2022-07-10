import React, { useState, useEffect, useCallback } from "react";
import { THotelRoom, TTableKey } from "@appTypes/timebookTypes";
import { useAddPriceScheme } from "@hooks/useAddHotelSpace";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "@config";
import { TextField, Button } from "@element";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import { useToast } from "@hooks/useToasts";

interface IPriceListProps {
    hotelId: string;
    hotelRooms?: THotelRoom[];
    roomsLoading?: boolean;
    priceLoading?: boolean;
    refetching?: boolean;
    closeForm?: any;
    onCompleted?: any;
}

const AddPriceScheme = ({
    hotelId,
    hotelRooms,
    roomsLoading,
    priceLoading,
    refetching,
    closeForm,
    onCompleted,
}: IPriceListProps) => {
    const [formInputs, setFormInputs] = useState(null);
    const [loadComplete, setLoadComplete] = useState<boolean>(false);

    const { addAlert } = useToast();

    const { register, loading, errors, onSubmit, setValue } = useAddPriceScheme(
        hotelId,
        {
            onCompleted: () => {
                addAlert({
                    type: "success",
                    message: "Added Pricing scheme",
                }),
                    onCompleted();
            },
            onError: () =>
                addAlert({
                    type: "error",
                    message: "Could not add pricing scheme ",
                }),
        }
    );

    const handleCreateForm = useCallback(() => {
        if (!hotelRooms?.length) {
            return;
        }

        const maxAdultCapacity = Math.max(
            ...hotelRooms.map((room) => room?.maxCapacityAdult || 0)
        );
        const maxChildCapacity = Math.max(
            ...hotelRooms.map((room) => room?.maxCapacityChild || 0)
        );

        const keys: TTableKey[] = [{ name: "Room Charge", key: "roomCharge" }];

        for (
            let i = 0;
            i < (maxAdultCapacity <= 10 ? maxAdultCapacity : 10);
            i++
        ) {
            keys.push(PRICE_SCHEME_ADULTS[i]);
        }

        for (
            let i = 0;
            i < (maxChildCapacity <= 10 ? maxChildCapacity : 10);
            i++
        ) {
            keys.push(PRICE_SCHEME_CHILD[i]);
        }

        const formFields = keys.map((formElement, index) => {
            return (
                <div
                    className="lg:w-80 md:w-9/12 sm:w-full space-y-2"
                    key={index}
                >
                    <label
                        htmlFor={formElement.key}
                        className="text-sm leading-5 font-medium"
                    >
                        {formElement.name}
                    </label>

                    <TextField
                        {...register(`${formElement.key}`, {
                            required: !!(
                                formElement.key === "roomCharge" ||
                                formElement.key === "oneAdultCharge"
                            ),
                            min: {
                                value: 0,
                                message: "Must be greater than 0",
                            },
                            valueAsNumber: true,
                        })}
                        className=""
                        label=""
                        type="number"
                        step="0.01"
                        error={errors[formElement.key] && true}
                        errorMessage={
                            errors[formElement.key]?.message ||
                            `This field is required`
                        }
                    />
                </div>
            );
        });

        setFormInputs(formFields);
        setLoadComplete(true);
        return () => {};
    }, [hotelRooms, errors]);

    if (roomsLoading || priceLoading) {
        return <LoadingSpinner loadingText="Please wait ..." />;
    }

    useEffect(handleCreateForm, [handleCreateForm]);

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            {formInputs?.length > 0 ? formInputs : <></>}

            <div className="w-6/12 flex items-center space-x-3 justify-end border-t py-6">
                <Button
                    variant="primary"
                    className="bg-indigo-600 w-16 hover:bg-indigo-400"
                    type="submit"
                    loading={loading}
                    loadingText={"Please wait"}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    className="w-16"
                    type="button"
                    onClick={closeForm}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AddPriceScheme;
