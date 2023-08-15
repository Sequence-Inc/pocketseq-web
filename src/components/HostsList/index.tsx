import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LibraryIcon, PencilAltIcon, PlusIcon } from "@heroicons/react/outline";
import { ACCOUNTS } from "src/apollo/queries/admin.queries";
import { classNames } from "src/utils";
import Link from "next/link";
import { NetworkHelper } from "@comp";
import useTranslation from "next-translate/useTranslation";

const noOfItems = 20;

const headers = [
    // { name: "ID", key: "id", headerClass: "text-center", cellClass: "text-left" },
    {
        name: "ホスト名",
        key: "name",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "管理者",
        key: "kanriSha",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "メール",
        key: "email",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "Status",
        key: "approved",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "Action",
        key: "action",
        headerClass: "text-right",
        cellClass: "text-right",
    },
];

export const HostsList = ({ filterOptions }) => {
    const [page, setPage] = useState(0);
    const [skip, setSkip] = useState(0);

    const { t } = useTranslation("adminhost");

    const { approved, suspended, profileTypes, roles } = filterOptions;

    const { data, loading, error, refetch } = useQuery(ACCOUNTS, {
        variables: {
            filters: { approved, suspended, profileTypes, roles },
            paginate: { take: noOfItems, skip: noOfItems * page },
        },
        fetchPolicy: "network-only",
        errorPolicy: "ignore",
    });

    const handlePaginate = React.useCallback(
        (type: "next" | "prev") => {
            const hasNext = data?.allAccounts?.paginationInfo?.hasNext;
            const hasPrevious = data?.allAccounts?.paginationInfo?.hasPrevious;

            if (type === "next" && hasNext) {
                refetch({
                    paginate: {
                        take: noOfItems,
                        skip: skip + noOfItems,
                    },
                });
                setSkip(skip + noOfItems);
            } else if (type === "prev" && hasPrevious) {
                refetch({
                    paginate: {
                        take: noOfItems,
                        skip: skip - noOfItems,
                    },
                });
                setSkip(skip - noOfItems);
            }
        },
        [data]
    );

    if (loading) return <NetworkHelper type="loading" />;

    if (error) return <NetworkHelper type="error" message={error.message} />;

    if (data.allAccounts.data.length === 0) {
        return <NetworkHelper type="no-data" />;
    }

    // return null;
    const normalizedForm = data.allAccounts.data.map((account) => {
        const newAccountData = { ...account };
        if (account.__typename === "UserProfile") {
            newAccountData.name = account.host?.name;
            newAccountData.kanriSha = `${account.lastName} ${account.firstName}`;
        }
        return newAccountData;
    });

    const renderData = (key, data) => {
        if (key === "name") {
            // check if has profilePhoto
            let profilePhoto = `https://avatars.dicebear.com/api/identicon/${data.id}.svg`;
            if (data.profilePhoto) {
                profilePhoto = data.profilePhoto.thumbnail.url;
            }
            if (data.host?.profilePhoto) {
                profilePhoto = data.host.profilePhoto.thumbnail.url;
            }
            return (
                <div className="flex items-center">
                    <img
                        src={profilePhoto}
                        className="w-6 h-6 rounded-md mr-3"
                    />
                    {data[key]}
                </div>
            );
        } else if (key === "approved") {
            const { approved } = data;
            if (approved === true) {
                return (
                    <span
                        className={classNames(
                            ` text-white px-3 py-1 rounded-full text-xs`,
                            `bg-green-500`
                        )}
                    >
                        APPROVED
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
                        UNAAPPROVED
                    </span>
                );
            }
        } else if (key === "action") {
            return <Link href={`hosts/${data.accountId}`}>Detail</Link>;
        } else {
            return data[key];
        }
    };

    const paginate = data?.allAccounts?.paginationInfo;

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
                    {/* Pagination */}
                    <nav
                        className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                        aria-label="Pagination"
                    >
                        <div className="hidden sm:block">
                            {/* <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span>{" "}
                                to <span className="font-medium">10</span> of{" "}
                                <span className="font-medium">20</span> results
                            </div> */}
                        </div>
                        <div className="flex justify-between flex-1 sm:justify-end">
                            <button
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${
                                    !paginate?.hasPrevious &&
                                    `disabled:bg-gray-100 disabled:cursor-not-allowed`
                                }`}
                                disabled={!paginate?.hasPrevious}
                                type="button"
                                onClick={() => {
                                    handlePaginate("prev");
                                }}
                            >
                                {t("previous-page")}
                            </button>
                            <button
                                className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50
                                        ${
                                            !paginate?.hasNext &&
                                            `disabled:bg-gray-100 disabled:cursor-not-allowed`
                                        }
                                        `}
                                disabled={!paginate?.hasNext}
                                type="button"
                                onClick={() => {
                                    handlePaginate("next");
                                }}
                            >
                                {t("next-page")}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};
