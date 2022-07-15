import { Button, TextField } from "@element";
import { useAddPriceScheme } from "@hooks/useAddHotelSpace";

import React, { useCallback, useEffect, useState } from "react";
import { useRowState } from "react-table";
import { THotelPriceScheme } from "@appTypes/timebookTypes";
import { PRICING_BY_HOTEL_ID } from "src/apollo/queries/hotel.queries";
import { useToast } from "@hooks/useToasts";
PRICING_BY_HOTEL_ID;
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
const TableRow = (props: TableRowProps) => {
    const { row, columns, handleRemoveRow } = props;
    const { addAlert } = useToast();
    const { isDirty, register, onSubmit, errors } = useAddPriceScheme({
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
    const [content, setContent] = useState<React.ReactElement[]>();

    const handleRemove = useCallback(() => {
        handleRemoveRow(props.rowId);
    }, []);

    const handleBuildForm = useCallback(() => {
        if (!Object.keys(row)?.length || !columns?.length) {
            return null;
        }
        const formFields: React.ReactElement[] = [];
        {
            columns?.map((col, index) => {
                if (col?.key === "name") {
                    formFields.push(
                        <td
                            className="px-4 py-3.5 text-base text-gray-700 max-w-0 whitespace-nowrap  border-l-0 border-b-0"
                            key={col.key}
                        >
                            {row[col.key] || ""}
                        </td>
                    );
                } else {
                    formFields.push(
                        <td
                            className="px-4 py-3.5 text-base text-gray-700 max-w-0 whitespace-nowrap border min-w-max border-b-0 last:border-r-0"
                            key={col.key}
                        >
                            <TextField
                                label=""
                                {...register(`${col.key}`, {
                                    required: !!(
                                        col.key === "roomCharge" ||
                                        col.key === "oneAdultCharge"
                                    ),
                                    min: {
                                        value: 0,
                                        message: "Must be greater than 0",
                                    },
                                    valueAsNumber: true,
                                })}
                                type="number"
                                step="0.01"
                                key={index}
                                error={errors[col.key] && true}
                            />
                        </td>
                    );
                }
            });
        }

        setContent(formFields);
    }, [row, columns, errors]);

    useEffect(handleBuildForm, [handleBuildForm]);
    return (
        <>
            <tr>
                {content}

                {isDirty && row.isNew && (
                    <td className="flex mt-3 ml-2  space-x-2 items-center absolute ">
                        <Button onClick={onSubmit}>Save</Button>
                        <Button onClick={handleRemove}>Cancel</Button>
                    </td>
                )}

                {!isDirty && row.isNew && (
                    <td className="flex mt-3 ml-2  space-x-2 items-center absolute ">
                        <Button onClick={handleRemove}>Cancel</Button>
                    </td>
                )}
            </tr>
        </>
    );
};

export default TableRow;
