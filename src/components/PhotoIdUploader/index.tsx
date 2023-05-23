import { IdentificationIcon, UploadIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { useState } from "react";

import useTranslation from "next-translate/useTranslation";
import { config } from "src/utils";

export const PhotoIdUploader = () => {
    const { t } = useTranslation("adminhost");
    return (
        <>
            <div className="overflow-hidden bg-white rounded-lg shadow">
                <div className="p-5">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <IdentificationIcon
                                className="w-7 h-7 text-gray-500"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex-1 w-0 ml-5">
                            <h3 className="text-xl font-medium text-gray-700">
                                本人確認書類の写真をアップロードしてください
                            </h3>
                            <div className="mt-4 text-gray-600">
                                {config.appName}
                                では、お客様がスペースを投稿する前に、お客様の身元を確認させていただきます。
                                お客様の写真付き身分証明書は、当社のスタッフによって確認され、タイムリーに承認されます。
                            </div>
                            <div className="mt-4 text-gray-600">
                                現在、運転免許証またはパスポートが、政府発行の有効な写真付き身分証明書として認められています。
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 text-right">
                    <Link href="/host/photo-id-upload">
                        <a className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <UploadIcon
                                className="w-5 h-5 mr-2 -ml-1"
                                aria-hidden="true"
                            />
                            {t("do-upload")}
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
};
