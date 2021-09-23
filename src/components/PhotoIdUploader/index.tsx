import { IdentificationIcon, UploadIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { useState } from "react";

export const PhotoIdUploader = () => {
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
                                Upload a copy of your identification document
                            </h3>
                            <p className="mt-4 text-gray-600">
                                Timebook will need to verify your identity
                                before letting you post spaces on our platform.
                                Your photo id document will be reviewed by our
                                staff and approved in timely manner.
                            </p>
                            <p className="mt-4 text-gray-600">
                                Driving license or Passports are currently
                                accepted as a valid government issued photo id
                                document.
                            </p>
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
                            Upload now
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
};
