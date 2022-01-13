import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LibraryIcon, PencilAltIcon, PlusIcon } from "@heroicons/react/outline";
import { ACCOUNTS } from "src/apollo/queries/admin.queries";
import { classNames } from "src/utils";
import Link from "next/link";
import { NetworkHelper } from "@comp";

const RecordsPerPage = 20;

const headers = [
    // { name: "ID", key: "id", headerClass: "text-center", cellClass: "text-left" },
    {
        name: "名前",
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
        name: "メール",
        key: "email",
        headerClass: "text-left",
        cellClass: "text-left",
    },
    {
        name: "Role",
        key: "roles",
        headerClass: "text-center",
        cellClass: "text-center",
    },
    {
        name: "Action",
        key: "action",
        headerClass: "text-right",
        cellClass: "text-right",
    },
];

export const AccountsList = ({ filterOptions }) => {
    const [page, setPage] = useState(0);

    const { approved, suspended, profileTypes, roles } = filterOptions;

    const { data, loading, error } = useQuery(ACCOUNTS, {
        variables: {
            filters: { approved, suspended, profileTypes, roles },
            paginate: { take: RecordsPerPage, skip: RecordsPerPage * page },
        },
        fetchPolicy: "network-only",
    });

    console.log(data, loading, error);

    if (loading) return <NetworkHelper type="loading" />;

    if (error) return <NetworkHelper type="error" message={error.message} />;

    if (data.allAccounts.data.length === 0) {
        return <NetworkHelper type="no-data" />;
    }

    // return null;
    const normalizedForm = data.allAccounts.data.map((account) => {
        const newAccountData = { ...account };
        if (account.__typename === "UserProfile") {
            newAccountData.name = `${account.lastName} ${account.firstName}`;
            newAccountData.nameKana = `${account.lastNameKana} ${account.firstNameKana}`;
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
            return (
                <div className="flex items-center">
                    <img
                        src={profilePhoto}
                        className="w-6 h-6 rounded-md mr-3"
                    />
                    {data[key]}
                </div>
            );
        } else if (key === "roles") {
            const { roles } = data;
            return (
                <div className="text-center">
                    {roles.map((role, idx) => {
                        let roleClass;
                        if (role === "user") {
                            roleClass = "bg-green-500";
                        } else if (role === "host") {
                            roleClass = "bg-yellow-500";
                        } else if (role === "admin") {
                            roleClass = "bg-red-600";
                        }
                        return (
                            <span
                                key={idx}
                                className={classNames(
                                    `bg-gray-400 text-white px-3 py-1 mx-1 rounded-full text-xs`,
                                    roleClass
                                )}
                            >
                                {role.toUpperCase()}
                            </span>
                        );
                    })}
                </div>
            );
        } else if (key === "action") {
            return <Link href={`accounts/${data.id}`}>Detail</Link>;
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
                    {/* Pagination */}
                    <nav
                        className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                        aria-label="Pagination"
                    >
                        <div className="hidden sm:block">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span>{" "}
                                to <span className="font-medium">10</span> of{" "}
                                <span className="font-medium">20</span> results
                            </p>
                        </div>
                        <div className="flex justify-between flex-1 sm:justify-end">
                            <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Previous
                            </a>
                            <a
                                href="#"
                                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Next
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};
