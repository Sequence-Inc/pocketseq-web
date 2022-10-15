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
import { ADD_PHOTO_ID, HOST } from "../../../src/apollo/queries/host.queries";
import axios from "axios";
import router from "next/router";

import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import requireAuth from "src/utils/authecticatedRoute";
import { config } from "src/utils";
import { GET_LICENSE_UPLOAD_TOKEN } from "src/apollo/queries/space.queries";

export const licenseTypes = [
    {
        id: "宿泊「旅館業営業許可書」（旅館ホテル営業）",
        title: "宿泊「旅館業営業許可書」（旅館ホテル営業）",
    },
    {
        id: "飲食「営業許可書」（飲食店業）",
        title: "飲食「営業許可書」（飲食店業）",
    },
    {
        id: "防災「適マーク」",
        title: "防災「適マーク」",
    },
    {
        id: "「理容室・美容室開業届」（保健所から発行）",
        title: "「理容室・美容室開業届」（保健所から発行）",
    },
    {
        id: "従業員名簿",
        title: "従業員名簿",
    },
    {
        id: "管理美容師（資格保有者）",
        title: "管理美容師（資格保有者）",
    },
    {
        id: "病院「診療施設開設届」「獣医師免許」",
        title: "病院「診療施設開設届」「獣医師免許」",
    },
    {
        id: "営業許可証",
        title: "営業許可証",
    },
    {
        id: "その他",
        title: "その他",
    },
];

const LicenseUpload = ({ userSession }) => {
    const [loading, setLoading] = useState(null);

    const [type, setType] = useState(licenseTypes[0].id);
    const [photo, setPhoto] = useState([]);

    const { t } = useTranslation("adminhost");

    const [mutate] = useMutation(GET_LICENSE_UPLOAD_TOKEN);

    const handleSelectPhoto = (event) => {
        console.log("currently", photo);
        setPhoto([...photo, ...event.target.files]);
    };

    const handleDelete = (index) => {
        const newPhotos = photo.filter((_, idx) => idx !== index);
        setPhoto(newPhotos || []);
    };

    const handleUpload = async () => {
        if (!photo) {
            alert("Please select a file to upload.");
            return;
        }
        setLoading(true);
        // get upload URL for all the photos
        const photos = photo.map((res) => ({ mime: res.type }));
        const { data, errors } = await mutate({
            variables: { input: { type, photos } },
        });
        if (errors) {
            console.log("Errors", errors);
            alert("Error, " + errors);
            setLoading(false);
            return;
        }
        if (data) {
            try {
                await Promise.all(
                    data.addLicense.map((token, index) => {
                        const { url, mime } = token;
                        const options = {
                            headers: {
                                "Content-Type": mime,
                            },
                        };
                        axios.put(url, photo[index], options);
                    })
                );
                alert("License upload successful");
                setPhoto([]);
            } catch (err) {
                console.log(err);
                alert("Error, " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChangeBasePlan = (type) => {
        setType(type);
    };

    const licenseTypeTitle = licenseTypes.filter(
        (license) => license.id === type
    )[0].title;

    console.log(photo);

    let content = (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg
                    className="w-12 h-12 mx-auto text-gray-400"
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
                        className="relative font-medium bg-white rounded-md cursor-pointer text-primary hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <span>{t("select-photo")}</span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/jpeg"
                            className="sr-only"
                            multiple
                            onChange={handleSelectPhoto}
                            disabled={loading}
                        />
                    </label>
                    {/* <p className="pl-1">アップロードする</p> */}
                </div>
                <p className="text-xs text-gray-500">JPEGファイルのみ対応</p>
            </div>
        </div>
    );

    if (photo.length > 0) {
        content = (
            <div className="px-6 pt-5 pb-6 overflow-hidden rounded-md">
                <div className="mb-4">
                    <div>
                        <div className="grid grid-cols-2 gap-2">
                            {photo.map((photo, index) => {
                                return (
                                    <div key={index} className="relative">
                                        <img
                                            src={(window.URL
                                                ? URL
                                                : webkitURL
                                            ).createObjectURL(photo)}
                                            className="object-cover bg-gray-50 rounded-lg w-36 h-36"
                                        />
                                        {typeof photo === "object" ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                                className="absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 -translate-y-1/2 bg-opacity-75 rounded-lg opacity-50 top-1/2 left-1/2 bg-primary hover:bg-opacity-90 hover:opacity-100"
                                            >
                                                Remove
                                            </button>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <button
                        onClick={() => setPhoto([])}
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
                        {t("clear")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>Upload license - {config.appName}</title>
            </Head>

            <Container className="py-4 space-y-8 sm:py-6 lg:py-8">
                <div className="mx-auto overflow-hidden bg-white rounded-lg shadow sm:max-w-lg">
                    <div className="p-5">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <IdentificationIcon
                                    className="text-gray-500 w-7 h-7"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex-1 w-0 ml-5">
                                <h3 className="text-xl font-medium text-gray-700">
                                    アップロードする
                                </h3>
                                <div className="mt-8 mb-4">
                                    <div className="w-full">
                                        必要な資格の種類（免許証や営業許可証）
                                        <br />
                                        <strong>■宿泊業、飲食業</strong>
                                        <br />
                                        ・宿泊「旅館業営業許可書」（旅館ホテル営業）
                                        <br />
                                        ・飲食「営業許可書」（飲食店業）
                                        <br />
                                        ・防災「適マーク」
                                        <br />
                                        <strong>■美容室</strong>
                                        <br />
                                        「理容室・美容室開業届」（保健所から発行）
                                        <br />
                                        ※上記を提出する際に、従業員名簿、管理美容師（資格保有者）の提出が必要
                                        <br />
                                        <strong>
                                            ■ペット取り扱い・トリマーサロン等ペットを取り扱う業者全般に必要　「動物取扱業」
                                        </strong>
                                        <br />
                                        以下7種類の項目があるのでどれに当てはまるかチェックを入れてもらうようにしたい
                                        <br />
                                        （１，販売・２，保管・３，貸出し・４，訓練・５，展示・６，競りあっせん・７，譲受飼養）
                                        <br />
                                        ・病院「診療施設開設届」「獣医師免許」
                                        <br />
                                        <strong>■アスレチック等:</strong>
                                        <br />
                                        「営業許可証」
                                        <br />
                                        <strong>■レンタルスペース:</strong>
                                        <br />
                                        「営業許可証」
                                        <br />
                                    </div>
                                </div>
                                <div className="mt-8 mb-4">
                                    <div className="w-full">
                                        <select
                                            onChange={(event) =>
                                                handleChangeBasePlan(
                                                    event.target.value
                                                )
                                            }
                                            className="py-2 border border-gray-300 rounded text-sm text-gray-600"
                                        >
                                            {licenseTypes.map((licenseType) => {
                                                return (
                                                    <option
                                                        key={licenseType.id}
                                                        value={licenseType.id}
                                                    >
                                                        {licenseType.title}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600">
                                    アップロードする{licenseTypeTitle}
                                    の画像を選択します。
                                </p>
                                <div className="mt-8 mr-8 sm:max-w-md">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-3 text-right bg-gray-50">
                        {loading && (
                            <span className="inline-block mr-4 text-gray-500">
                                アップロード中...
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
                            アップロードする
                        </button>
                    </div>
                </div>
            </Container>
        </HostLayout>
    );
};

export default LicenseUpload;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/",
        roles: ["host"],
    });
    if (validation !== true) {
        return validation;
    } else {
        return {
            props: {
                userSession,
            },
        };
    }
};
