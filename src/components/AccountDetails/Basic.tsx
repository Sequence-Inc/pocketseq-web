import {
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import React from "react";

export const BasicAccountInfo = ({ account }) => {
    console.log(account);
    const {
        __typename,
        id,
        accountId,
        name,
        nameKana,
        firstName,
        lastName,
        firstNameKana,
        lastNameKana,
        registrationNumber,
        email,
        emailVerified,
        roles,
        approved,
        suspended,
        createdAt,
        updatedAt,
    } = account;

    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Account ID
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {accountId}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Account Type
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {__typename === "UserProfile" ? "個人" : "法人"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Account Role
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {roles[0] === "user" && "ユーザー"}
                                {roles[0] === "host" && "ホスト"}
                                {roles[0] === "admin" && "アドミン"}
                            </dd>
                        </div>

                        {__typename === "UserProfile" && (
                            <>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        User ID
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {id}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        First Name
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {firstName}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Last Name
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {lastName}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        First Name Kana
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {firstNameKana}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Last Name Kana
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {lastNameKana}
                                    </dd>
                                </div>
                            </>
                        )}
                        {__typename === "CompanyProfile" && (
                            <>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Company ID
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {id}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Name
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {name}
                                    </dd>
                                </div>

                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Name Kana
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {nameKana}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        法人番号
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {registrationNumber}
                                    </dd>
                                </div>
                            </>
                        )}

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                    {email}{" "}
                                    {emailVerified ? (
                                        <div className="flex items-center ml-3 text-primary text-sm">
                                            <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                            Verified
                                        </div>
                                    ) : (
                                        <div className="flex items-center ml-3 text-gray-500 text-sm">
                                            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400 mr-1" />
                                            Not verified
                                        </div>
                                    )}
                                </div>
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Approved
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {approved ? (
                                    <div className="flex items-center text-primary text-sm">
                                        <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                        Approved
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <XCircleIcon className="w-5 h-5 text-gray-400 mr-1" />
                                        Not approved
                                    </div>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Suspended
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {suspended ? (
                                    <div className="flex items-center text-red-500 text-sm">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-1" />
                                        Suspended
                                    </div>
                                ) : (
                                    <div className="flex items-center text-primary text-sm">
                                        <CheckCircleIcon className="w-5 h-5 text-primary mr-1" />
                                        Not suspended
                                    </div>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Registration Date
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {moment(createdAt).format(
                                    "YYYY年MM月DD日 HH:mm"
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Last Update Date
                            </dt>
                            <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                {moment(updatedAt).format(
                                    "YYYY年MM月DD日 HH:mm"
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
};
