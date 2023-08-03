import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PREFECTURES } from "src/apollo/queries/admin.queries";
import { classNames } from "src/utils";
import { NetworkHelper } from "@comp";

const headers = [
    // { name: "ID", key: "id", headerClass: "text-center", cellClass: "text-left" },
    {
        name: "都道府県",
        key: "name",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "フリガナ",
        key: "nameKana",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "ローマ字",
        key: "nameRomaji",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "表示",
        key: "available",
        headerClass: "text-center",
        cellClass: "text-center",
    },
    {
        name: "動作",
        key: "action",
        headerClass: "text-right",
        cellClass: "text-right",
    },
];

export const PrefecturesList = () => {
    const { data, loading, error } = useQuery(PREFECTURES, {
        fetchPolicy: "network-only",
    });

    if (loading) return <NetworkHelper type="loading" />;

    if (error) return <NetworkHelper type="error" message={error.message} />;

    if (data.allPrefectures.length === 0) {
        return <NetworkHelper type="no-data" />;
    }

    // return null;
    const normalizedForm = data.allPrefectures.map((account) => {
        const newAccountData = { ...account };
        return newAccountData;
    });

    const renderData = (key, data) => {
        switch (key) {
            case "action":
                return (
                    <Link href={`settings/edit/prefecture/${data.id}`}>
                        <a className="font-medium text-gray-500 hover:text-primary">
                            変更
                        </a>
                    </Link>
                );
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
