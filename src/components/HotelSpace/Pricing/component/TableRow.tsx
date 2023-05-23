import { Button, TextField } from "@element";
import useReduceObject from "@hooks/useFilterObject";
import { PRICE_SCHEME_ADULTS, PRICE_SCHEME_CHILD } from "src/config";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { THotelPriceScheme } from "@appTypes/timebookTypes";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import ErrorModal from "src/elements/ErrorModal";
import ConfirmModal from "./ConfirmModal";
import { usePricing } from "@hooks/host-hotel";
import { useQuery } from "@apollo/client";
import { PRICE_SCHEME_BY_ID } from "src/apollo/queries/hotel/pricing/queries";

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
    refetchPricings?: any;
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
                    <div className="text-sm font-semibold">{name}&nbsp;:</div>
                    <div className="text-base font-medium ">
                        {formFields[fieldKey]}
                    </div>
                </div>
            );
        });
    }, [formFields]);
    return (
        <div className="w-96">
            <div className="text-left text-base font-bold text-gray-600 mb-3">
                Are you satisfied with your inputs
            </div>
            {content}
        </div>
    );
};

const TableRow = (props: TableRowProps) => {
    const { row, columns, handleRemoveRow } = props;
    const errorModal = useRef(null);
    const confirmModal = useRef(null);
    const [priceId, setPriceId] = useState(null);
    const [content, setContent] = useState<React.ReactElement[]>();

    const [defaultValue, setDefaultValue] = useState(null);
    const {
        data: priceScheme,
        loading: priceSchemeLoading,
        error: priceFetchError,
    } = useQuery(PRICE_SCHEME_BY_ID, {
        skip: !priceId,
        variables: {
            id: priceId,
        },
    });

    const {
        isDirty,
        register,
        onSubmit,
        trigger,
        errors,
        loading,
        getValues,
        dirtyFields,
        resetField,
        // onUpdate,
    } = usePricing({
        hotelId: row?.hotelId,
        initialValue: defaultValue,
        options: {
            onCompleted: (data) => {
                setPriceId(data?.addPriceScheme?.priceScheme?.id);
                setDefaultValue(data?.addPriceScheme?.priceScheme);
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
        if (!priceScheme?.priceSchemeById) {
            return onSubmit();
        }

        // return onUpdate();
    }, [priceScheme?.priceSchemeById]);

    const handleRemove = useCallback(() => {
        if (row?.isNew) {
            return handleRemoveRow(props.rowId);
        }

        Object.keys(dirtyFields).forEach((element) => {
            resetField(element);
        });
    }, [row, dirtyFields]);

    const handleBuildForm = useCallback(() => {
        const formFields: React.ReactElement[] = [];

        columns?.map((col, index) => {
            if (col?.key === "name") {
                formFields.push(
                    <td
                        className={
                            "px-4 py-3.5 text-base text-gray-700 whitespace-nowrap  border-l-0 border-b-0 " +
                            `${loading && " bg-gray-200"}`
                        }
                        key={col.key}
                    >
                        {!loading && !priceSchemeLoading && (
                            <div>{defaultValue && defaultValue[col.key]}</div>
                        )}
                        {loading ||
                            (priceSchemeLoading && (
                                <div>
                                    <div className="w-4 h-4 border-[2px] border-green-400 border-l-0 border-solid rounded-full animate-spin"></div>
                                </div>
                            ))}
                    </td>
                );
            } else {
                formFields.push(
                    <td
                        className={
                            "px-4 py-3.5 text-base text-gray-700  whitespace-nowrap border min-w-max border-b-0 last:border-r-0" +
                            `${loading && " bg-gray-200"}`
                        }
                        key={col.key}
                    >
                        <TextField
                            label=""
                            disabled={
                                loading || priceSchemeLoading || defaultValue
                            }
                            {...register(`${col.key}`, {
                                required: true,
                                min: {
                                    value: 1,
                                    message: "Must be greater than 0",
                                },
                                valueAsNumber: true,
                            })}
                            className="min-w-max"
                            id={col.key}
                            type="number"
                            key={index}
                            error={errors[col.key] && true}
                            errorMessage={`Required`}
                        />
                    </td>
                );
            }
        });
        formFields.push(
            <td className="flex mt-3 ml-2  space-x-2 items-center  ">
                {isDirty && (
                    <>
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
                    </>
                )}
            </td>
        );
        setContent(formFields);
    }, [defaultValue, columns, errors, loading, priceSchemeLoading]);

    useEffect(() => {
        if (row?.id) {
            setPriceId(row.id);
        }

        return () => {
            setPriceId(null);
        };
    }, [row]);

    useEffect(() => {
        if (priceScheme?.priceSchemeById) {
            setDefaultValue(priceScheme?.priceSchemeById);
            return;
        }

        setDefaultValue(null);

        return () => {
            setDefaultValue(null);
        };
    }, [priceScheme]);
    useEffect(handleBuildForm, [handleBuildForm]);
    return (
        <>
            <ErrorModal ref={errorModal} />
            <ConfirmModal ref={confirmModal} onConfirm={onConFirm}>
                <ModalBody getValues={getValues} dirtyFields={dirtyFields} />
            </ConfirmModal>
            <tr>{content}</tr>
        </>
    );
};

export default TableRow;
