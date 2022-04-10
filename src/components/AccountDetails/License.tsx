import { Button } from "@element";
import {
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from "@heroicons/react/outline";
import React from "react";

export const LicenseInfo = ({ account }) => {
    console.log(account);
    const { license } = account.host;
    if (!license) {
        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            No license
                        </div>
                    </dl>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {license.map(
                            ({
                                id,
                                type,
                                approved,
                                remarks,
                                photos,
                                createdAt,
                            }) => {
                                return (
                                    <div
                                        key={id}
                                        className="py-4 sm:py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6"
                                    >
                                        <div className="text-sm font-medium text-gray-500">
                                            {type}
                                        </div>
                                        <div className="mt-1 text-sm sm:mt-0">
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
                                        </div>
                                        <div className="mt-1 text-sm sm:mt-0">
                                            <div className="flex space-x-2">
                                                {photos.map((photo) => {
                                                    return (
                                                        <img
                                                            key={photo.id}
                                                            src={
                                                                photo.small.url
                                                            }
                                                            className="h-6 w-6 rounded"
                                                        />
                                                    );
                                                })}{" "}
                                                <button
                                                    type="button"
                                                    className=""
                                                >
                                                    View photos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </dl>
                </div>
            </div>
        </>
    );
};
