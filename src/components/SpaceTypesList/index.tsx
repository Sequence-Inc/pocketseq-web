import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { LibraryIcon } from "@heroicons/react/outline";
import { SPACE_TYPES } from "src/apollo/queries/admin.queries";
import { classNames } from "src/utils";
import { NetworkHelper } from "@comp";

const headers = [
    // { name: "ID", key: "id", headerClass: "text-center", cellClass: "text-left" },
    {
        name: "タイトル",
        key: "title",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "デスクリプション",
        key: "description",
        headerClass: "text-left",
        cellClass: "text-left",
    },
];

export const SpaceTypesList = () => {
    const { data, loading, error } = useQuery(SPACE_TYPES);

    console.log(data, loading, error);

    if (loading) return <NetworkHelper type="loading" />;

    if (error) return <NetworkHelper type="error" message={error.message} />;

    if (data.allSpaceTypes.length === 0) {
        return <NetworkHelper type="no-data" />;
    }

    // return null;
    const normalizedForm = data.allSpaceTypes.map((account) => {
        const newAccountData = { ...account };
        return newAccountData;
    });

    const renderData = (key, data) => {
        if (key === "action") {
            return <Link href={`settings/space-types/${data.id}`}>Detail</Link>;
        } else {
            return data[key];
        }
    };

    return (
        <>
            <div className="flex flex-col mt-2">
                <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {headers.map((column: any, idx: number) => (
                                    <th
                                        key={idx}
                                        className={classNames(
                                            `px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50`,
                                            column.headerClass
                                        )}
                                    >
                                        {column.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {normalizedForm.map((account, idx) => {
                                return (
                                    <tr
                                        key={idx}
                                        className="bg-white hover:bg-gray-50"
                                    >
                                        {headers.map((cell: any) => {
                                            return (
                                                <td
                                                    key={`${idx}-${cell.key}`}
                                                    className={classNames(
                                                        `px-4 py-3 text-sm text-gray-800`,
                                                        cell.cellClass
                                                    )}
                                                >
                                                    {renderData(
                                                        cell.key,
                                                        account
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
