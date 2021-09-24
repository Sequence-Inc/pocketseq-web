import React, { useState } from "react";
import {
    IdentificationIcon,
    UploadIcon,
    XIcon,
} from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Container } from "@element";
import { useMutation } from "@apollo/client";
import withAuth from "src/utils/withAuth";
import { ADD_PHOTO_ID } from "../../../src/apollo/queries/host.queries";
import axios from "axios";
import router from "next/router";

const PhotoIdUpload = () => {
    const [loading, setLoading] = useState(null);
    const [photo, setPhoto] = useState(null);

    const handleSelectPhoto = (event) => {
        const file = event.nativeEvent.target.files[0];
        console.log(file);
        setPhoto(file);
    };

    const [addPhotoId] = useMutation(ADD_PHOTO_ID, {
        onCompleted: async (data) => {
            try {
                const { url, mime } = data.addPhotoId;
                const options = {
                    headers: {
                        "Content-Type": mime,
                    },
                };
                const photoUpload = await axios.put(url, photo, options);
                setLoading(false);
                setPhoto(null);
                alert("Photo ID successfully uploaded.");
                router.push("/host");
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
            // now upload the actual photo
        },
        onError: (err) => {
            console.log(err);
            setLoading(false);
        },
    });

    const handleUpload = () => {
        if (!photo) {
            alert("Please select a file to upload.");
            return;
        }
        setLoading(true);
        addPhotoId({ variables: { input: { mime: photo.type } } });
    };

    let content = (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="flex text-sm text-gray-600">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <span>Upload a file</span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/jpeg"
                            className="sr-only"
                            onChange={handleSelectPhoto}
                            disabled={loading}
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
        </div>
    );

    if (photo) {
        content = (
            <div className="px-6 pt-5 pb-6 rounded-md overflow-hidden">
                <div className="mb-4">
                    <img src={URL.createObjectURL(photo)} />
                </div>
                <div className="text-right">
                    <button
                        onClick={() => setPhoto(null)}
                        disabled={loading}
                        type="button"
                        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  ${
                            loading && "opacity-50"
                        }`}
                    >
                        <XIcon
                            className="w-5 h-5 mr-2 -ml-1"
                            aria-hidden="true"
                        />
                        Clear photo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <HostLayout>
            <Head>
                <title>Upload photo ID - Timebook</title>
            </Head>

            <Container className="py-4 sm:py-6 lg:py-8 space-y-8">
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
                                    Upload photo id
                                </h3>
                                <p className="mt-4 text-gray-600">
                                    Timebook will need to verify your identity
                                    before letting you post spaces on our
                                    platform. Your photo id document will be
                                    reviewed by our staff and approved in timely
                                    manner.
                                </p>
                                <div className="mt-8 mr-8">{content}</div>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-3 bg-gray-50 text-right">
                        {loading && (
                            <span className="inline-block mr-4 text-gray-500">
                                Uploading...
                            </span>
                        )}
                        <button
                            disabled={loading}
                            onClick={handleUpload}
                            type="button"
                            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                loading && "opacity-50"
                            }`}
                        >
                            <UploadIcon
                                className="w-5 h-5 mr-2 -ml-1"
                                aria-hidden="true"
                            />
                            Upload
                        </button>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

export default withAuth(PhotoIdUpload);