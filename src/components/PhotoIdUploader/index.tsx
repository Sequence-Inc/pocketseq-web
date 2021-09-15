import { IdentificationIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

const PhotoIdUploader = () => {
    return (
        <>
            <div className="overflow-hidden bg-white rounded-lg shadow">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <IdentificationIcon
                                className="w-6 h-6 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex-1 w-0 ml-5">
                            <dl>
                                <dt className="text-xs text-gray-500 uppercase">
                                    PHOTO ID
                                </dt>
                                <dd>
                                    <div className="text-2xl font-medium text-gray-700">
                                        Upload a copy of your identification
                                        document
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-3 bg-gray-50">
                    <div className="text-sm">Upload</div>
                </div>
            </div>
        </>
    );
};

export default PhotoIdUploader;
