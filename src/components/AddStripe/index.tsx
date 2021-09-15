import { LibraryIcon, PlusIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

export const AddStripe = ({ account }) => {
    const { url } = account;
    return (
        <>
            <div className="overflow-hidden bg-white rounded-lg shadow">
                <div className="p-5">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <LibraryIcon
                                className="w-7 h-7 text-gray-500"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex-1 w-0 ml-5">
                            <h3 className="text-xl font-medium text-gray-700">
                                Add Payment Details
                            </h3>
                            <p className="mt-4 text-gray-600">
                                Timebook will need some information regarding
                                your payment where payouts will be made. You can
                                only add spaces or rent your spaces after
                                completing this.
                            </p>
                            <p className="mt-4 text-gray-600">
                                By clicking below 'Complete now' button, you
                                will be taken to our partner payment gateway
                                Stripe's site. Once you finish providing all
                                your information you will be returned here.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 text-right">
                    <a
                        href={url}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon
                            className="w-5 h-5 mr-2 -ml-1"
                            aria-hidden="true"
                        />
                        Complete now
                    </a>
                </div>
            </div>
        </>
    );
};
