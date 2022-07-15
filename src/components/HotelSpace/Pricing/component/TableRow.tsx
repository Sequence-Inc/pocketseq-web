import { TextField } from "@element";
import { useAddPriceScheme } from "@hooks/useAddHotelSpace";
import { Button } from "antd";
import React, { useCallback, useMemo } from "react";
import { useRowState } from "react-table";
import { THotelPriceScheme } from "@appTypes/timebookTypes";

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
    const { isDirty, register } = useAddPriceScheme({
        hotelId: row?.hotelId,
        formProps: {
            defaultValues: { ...row },
        },
        options: {},
    });

    const handleRemove = useCallback(() => {
        handleRemoveRow(props.rowId);
    }, []);

    const content = useMemo(() => {
        if (!Object.keys(row)?.length || !columns?.length) {
            return null;
        }
        const formFields = [];

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
                                {...register(col.key, {
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
                            />
                        </td>
                    );
                }
            });
        }

        return formFields;
    }, [row, columns]);

    return (
        <tr>
            {content}

            {row?.isNew && (
                <td className="px-2 text-base text-gray-700  whitespace-nowrap ">
                    <Button>Save</Button>
                    <Button onClick={handleRemove}>remove</Button>
                </td>
            )}
        </tr>
    );
};

export default TableRow;
