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
                                決済情報の追加
                            </h3>
                            <p className="mt-4 text-gray-600">
                                Timebookでは、支払いに関する情報登録が必要となります。
                                こちらの設定が完了後、スペースの追加やレンタルが可能になります。
                            </p>
                            <p className="mt-4 text-gray-600">
                                下の「今すぐ完了」をクリックすると、決済サイト「Stripe」に移動します。
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
