import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { LibraryIcon } from "@heroicons/react/outline";
import { SPACE_TYPES } from "src/apollo/queries/admin.queries";
import { classNames } from "src/utils";
import { NetworkHelper } from "@comp";
import { Button } from "@element";

const headers = [
    // { name: "ID", key: "id", headerClass: "text-center", cellClass: "text-left" },
    {
        name: "",
        key: "photo",
        headerClass: "w-20",
        cellClass: "w-20",
    },
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
    {
        name: "デスクリプション",
        key: "available",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "アクション",
        key: "action",
        headerClass: "text-right",
        cellClass: "text-right",
    },
];

export const SpaceTypesList = () => {
    const { data, loading, error, refetch } = useQuery(SPACE_TYPES, {
        fetchPolicy: "network-only",
    });

    if (loading) return <NetworkHelper type="loading" />;

    if (error) return <NetworkHelper type="error" message={error.message} />;

    if (data.allSpaceTypes.length === 0) {
        return <NetworkHelper type="no-data" />;
    }
    // return null;
    const normalizedForm = data.allSpaceTypes.map((spaceTypes) => {
        const newAccountData = { ...spaceTypes };
        return newAccountData;
    });

    const renderData = (key, data) => {
        switch (key) {
            case "action":
                return (
                    <Link href={`settings/edit/space-type/${data.id}`}>
                        <a className="font-medium text-gray-500 hover:text-primary">
                            Modify
                        </a>
                    </Link>
                );
            case "photo":
                if (data.photo !== null) {
                    return (
                        <img
                            src={data.photo?.thumbnail?.url}
                            className="w-full rounded"
                        />
                    );
                } else {
                    return null;
                }
            case "available":
                const { available } = data;
                if (available === true) {
                    return (
                        <span
                            className={classNames(
                                ` text-white px-3 py-1 rounded-full text-xs`,
                                `bg-green-500`
                            )}
                        >
                            AVAILABLE
                        </span>
                    );
                } else {
                    return (
                        <span
                            className={classNames(
                                ` text-white px-3 py-1 rounded-full text-xs`,
                                `bg-gray-400`
                            )}
                        >
                            UNAVAILABLE
                        </span>
                    );
                }
            default:
                return data[key] || "-";
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    return (
        <>
            <div className="flex flex-col mt-2">
                <div className="flex mb-4 space-x-4">
                    <Link href="settings/add/space-type">
                        <Button variant="primary" className="w-auto">
                            Add new space type
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        className="w-auto"
                        onClick={handleRefresh}
                    >
                        Refresh List
                    </Button>
                </div>
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
