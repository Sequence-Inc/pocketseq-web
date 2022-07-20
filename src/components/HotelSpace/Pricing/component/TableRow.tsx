import { Button, TextField } from "@element";
import { useAddPriceScheme, useReduceObject } from "@hooks/useAddHotelSpace";

import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "src/config";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { THotelPriceScheme } from "@appTypes/timebookTypes";
import { PRICING_BY_HOTEL_ID } from "src/apollo/queries/hotel.queries";
import { useToast } from "@hooks/useToasts";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import ErrorModal from "src/elements/ErrorModal";
import ConfirmModal from "./ConfirmModal";
import { Controller } from "react-hook-form";

type TColumns = {
    className?: string;
    key: string;
    name?: string;
};

interface TableRowProps {
    row?: THotelPriceScheme & { isNew?: boolean };
    rowId: string | number;
    columns?: TColumns[];
    handleRemoveRow?: any;
}

const InputFields = [
    { key: "roomCharge", name: "Room Charge" },
    ...PRICE_SCHEME_ADULTS,
    ...PRICE_SCHEME_CHILD,
];

const ModalBody = ({ getValues, dirtyFields }) => {
    const formFields = useReduceObject(getValues(), Object.keys(dirtyFields));

    const content = useMemo(() => {
        if (!Object.keys(formFields)?.length) return <LoadingSpinner />;

        return Object.keys(formFields).map((fieldKey, index) => {
            const { name } = InputFields.find((item) => item.key === fieldKey);

            return (
                <div
                    className="flex space-x-4 my-2 w-full bg-gray-100 items-center p-2"
                    key={index}
                >
                    <p className="text-sm font-semibold">{name}&nbsp;:</p>
                    <p className="text-base font-medium ">
                        {formFields[fieldKey]}
                    </p>
                </div>
            );
        });
    }, [formFields]);
    return (
        <div className="w-96">
            <p className="text-left text-base font-bold text-gray-600 mb-3">
                Are you satisfied with your inputs
            </p>
            {content}
        </div>
    );
};

const TableRow = (props: TableRowProps) => {
    const { row, columns, handleRemoveRow } = props;
    const { addAlert } = useToast();
    const [content, setContent] = useState<React.ReactElement[]>();
    const errorModal = useRef(null);
    const confirmModal = useRef(null);
    const {
        isDirty,
        register,
        onSubmit,
        trigger,
        errors,
        loading,
        getValues,
        dirtyFields,
        control,
    } = useAddPriceScheme({
        hotelId: row?.hotelId,
        formProps: {
            defaultValues: { ...row },
        },
        options: {
            refetchQueries: [
                {
                    query: PRICING_BY_HOTEL_ID,
                    variables: {
                        hotelId: row.hotelId,
                    },
                },
            ],
            onCompleted: (data) => {
                addAlert({
                    type: "success",
                    message: "Successfully added new price scheme",
                });
            },
            onError: () => {
                addAlert({
                    type: "error",
                    message: "Could not add new price scheme",
                });
            },
        },
    });

    const handleSubmitForm = useCallback(async () => {
        const result = await trigger();

        if (!result) {
            return errorModal.current.open("Fill all the required fields");
        }

        return confirmModal.current.open();
    }, []);

    const onConFirm = useCallback(() => {
        confirmModal.current.close();
        onSubmit();
    }, []);

    const handleRemove = useCallback(() => {
        handleRemoveRow(props.rowId);
    }, []);

    const handleBuildForm = useCallback(() => {
        const formFields: React.ReactElement[] = [];

        columns?.map((col, index) => {
            if (col?.key === "name") {
                formFields.push(
                    <td
                        className={
                            "px-4 py-3.5 text-base text-gray-700 max-w-0 whitespace-nowrap  border-l-0 border-b-0 " +
                            `${loading && " bg-gray-200"}`
                        }
                        key={col.key}
                    >
                        {!loading && <p>{row[col.key]}</p>}
                        {loading && (
                            <div>
                                <div className="w-4 h-4 border-[2px] border-green-400 border-l-0 border-solid rounded-full animate-spin"></div>
                            </div>
                        )}
                    </td>
                );
            } else {
                formFields.push(
                    <td
                        className={
                            "px-4 py-3.5 text-base text-gray-700 max-w-0 whitespace-nowrap border min-w-max border-b-0 last:border-r-0" +
                            `${loading && " bg-gray-200"}`
                        }
                        key={col.key}
                    >
                        {/* <Controller
                            name={`${col.key}`}
                            render={
                                ({field})=>
                            }
                        control={control}
                        /> */}
                        <TextField
                            label=""
                            disabled={loading || !row?.isNew}
                            {...register(`${col.key}`, {
                                required: true,
                                min: {
                                    value: 0,
                                    message: "Must be greater than 0",
                                },
                                valueAsNumber: true,
                            })}
                            id={col.key}
                            type="number"
                            step="0.01"
                            key={index}
                            error={errors[col.key] && true}
                            errorMessage={`Required`}
                        />
                    </td>
                );
            }
        });

        setContent(formFields);
    }, [row, columns, errors, loading]);

    useEffect(handleBuildForm, [handleBuildForm]);

    return (
        <>
            <ErrorModal ref={errorModal} />
            <ConfirmModal ref={confirmModal} onConfirm={onConFirm}>
                <ModalBody getValues={getValues} dirtyFields={dirtyFields} />
            </ConfirmModal>
            <tr>
                {content}

                {isDirty && row.isNew && (
                    <td className="flex mt-3 ml-2  space-x-2 items-center absolute ">
                        <Button
                            onClick={handleSubmitForm}
                            Icon={CheckIcon}
                            className="text-green-400"
                            loading={loading}
                        >
                            {" "}
                        </Button>
                        <Button
                            onClick={handleRemove}
                            Icon={XIcon}
                            loading={loading}
                            className="text-red-400"
                        >
                            {" "}
                        </Button>
                    </td>
                )}

                {!isDirty && row.isNew && (
                    <td className="flex mt-3 ml-2  space-x-2 items-center absolute ">
                        <Button
                            onClick={handleRemove}
                            Icon={XIcon}
                            loading={loading}
                            className="text-red-400"
                        >
                            {" "}
                        </Button>
                    </td>
                )}
            </tr>
        </>
    );
};

export default TableRow;
