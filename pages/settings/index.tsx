import React, { useState } from "react";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Button, Container, TextField } from "@element";
import {
    selectHttpOptionsAndBody,
    useMutation,
    useQuery,
} from "@apollo/client";

import {
    GET_PROFILE_FOR_SETTINGS,
    MAKE_DEFAULT_PAYMENT_SOURCE,
    REMOVE_PAYMENT_SOURCE,
    UPDATE_USER_PROFILE,
} from "src/apollo/queries/user.queries";
import { IPaymentMethod } from "src/types/timebookTypes";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import requireAuth from "src/utils/authecticatedRoute";
import { getSession } from "next-auth/react";
import { config } from "src/utils";
import { LoadingSpinner } from "src/components/LoadingSpinner";
import axios from "axios";
import router from "next/router";
import { ADD_PROFILE_PHOTO } from "src/apollo/queries/host.queries";
import { UploadIcon, XIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { profile } from "console";
import moment from "moment";
import DatePicker from "antd/lib/date-picker";
import { ChangePassword } from "src/components/ChangePassword";

const UserSettings = ({ userSession }) => {
    const [profileLoading, setProfileLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [photo, setPhoto] = useState(null);

    const { t } = useTranslation("adminhost");

    const isHost = userSession.user.roles.includes("host");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const {
        data,
        loading,
        error,
        refetch: refetchProfile,
    } = useQuery(GET_PROFILE_FOR_SETTINGS, {
        fetchPolicy: "network-only",
    });

    const [mutate] = useMutation(UPDATE_USER_PROFILE);

    const [makeDefaultPaymentSource] = useMutation(
        MAKE_DEFAULT_PAYMENT_SOURCE,
        {
            onCompleted: (data) => {
                refetchProfile();
                alert(data.setDefaultPaymentMethod.message);
                setIsLoading(false);
            },
            onError: (error) => {
                alert(`Error: ${error.message}`);
                setIsLoading(false);
            },
        }
    );

    const [removePaymentSource] = useMutation(REMOVE_PAYMENT_SOURCE, {
        onCompleted: (data) => {
            refetchProfile();
            alert(data.removePaymentMethod.message);
            setIsLoading(false);
        },
        onError: (error) => {
            alert(`Error: ${error.message}`);
            setIsLoading(false);
        },
    });

    const [addProfilePhoto] = useMutation(ADD_PROFILE_PHOTO, {
        onCompleted: async (data) => {
            try {
                const { url, mime } = data.addProfilePhoto;
                const options = {
                    headers: {
                        "Content-Type": mime,
                    },
                };
                await axios.put(url, photo, options);
                setTimeout(() => {
                    setIsLoading(false);
                    setPhoto(null);
                    alert("Profile photo successfully uploaded.");
                    refetchProfile();
                }, 1000);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
            // now upload the actual photo
        },
        onError: (err) => {
            console.log(err);
            setIsLoading(false);
        },
    });

    useEffect(() => {
        if (data?.myProfile) {
            setValue("firstName", data?.myProfile?.firstName);
            setValue("lastName", data?.myProfile?.lastName);
            setValue("firstNameKana", data?.myProfile?.firstNameKana);
            setValue("lastNameKana", data?.myProfile?.lastNameKana);
            setValue(
                "dob",
                data?.myProfile?.dob
                    ? moment(data?.myProfile?.dob).format("YYYY-MM-DD")
                    : ""
            );
        }
    }, [data]);

    const handleSelectPhoto = (event) => {
        const file = event.target.files[0];
        setPhoto(file);
    };

    const handleUpload = () => {
        if (!photo) {
            alert("Please select a file to upload.");
            return;
        }
        setIsLoading(true);
        addProfilePhoto({
            variables: { input: { mime: photo.type }, uploadInHost: isHost },
        });
    };

    const onSubmit = handleSubmit(async (formData) => {
        try {
            setProfileLoading(true);
            const input = { ...formData };
            input.id = data?.myProfile.id;
            const userProfileData = await mutate({ variables: { input } });
            if (userProfileData.data?.updateMyProfile) {
                alert(userProfileData.data?.updateMyProfile.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setProfileLoading(false);
        }
    });

    if (loading) return <LoadingSpinner />;

    if (error)
        return (
            <div className="flex items-center justify-center h-content">
                Error {error.message}
            </div>
        );

    const {
        myProfile,
        paymentSource,
    }: { myProfile: any; paymentSource: IPaymentMethod[] } = data;

    const cardIcon = (brand) => {
        if (
            brand === "visa" ||
            brand === "mastercard" ||
            brand === "amex" ||
            brand === "jcb" ||
            brand === "discover" ||
            brand === "unionpay"
        ) {
            return (
                <img src={`/card-icons/${brand}.svg`} className="w-12 h-8" />
            );
        } else {
            return <img src={`/card-icons/generic.svg`} className="w-12 h-8" />;
        }
    };

    const makeDefault = ({ last4, token }) => {
        if (
            confirm(
                `Are you sure you want to make this card ending with ${last4} your default source of payment?`
            )
        ) {
            setIsLoading(true);
            makeDefaultPaymentSource({
                variables: {
                    paymentMethodId: token,
                },
            });
        }
    };

    const removePaymentMethod = ({ token, last4, isDefault }) => {
        if (isDefault) {
            alert("You can not remove default card from your account.");
            return;
        }
        if (
            confirm(
                `Are you sure you want to delete this card ending with ${last4}?`
            )
        ) {
            setIsLoading(true);
            removePaymentSource({
                variables: {
                    paymentMethodId: token,
                },
            });
        }
    };

    const renderPaymentMethods = () => {
        if (!paymentSource || paymentSource.length === 0) {
            return (
                <div className="py-10">
                    <h3 className="text-center">No payment methods</h3>
                </div>
            );
        } else {
            return paymentSource.map((card, index) => {
                const expMonth = card.expMonth.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });
                const expYear = `${card.expYear}`.slice(-2);
                return (
                    <div
                        key={index}
                        className="flex items-center justify-between px-6 py-4 bg-gray-50 text-gray-700 rounded-lg shadow text-base space-x-4"
                    >
                        <div className="flex items-center flex-1 font-mono">
                            <span className="inline-block mr-5">
                                {cardIcon(card.brand)}
                            </span>
                            **** **** **** {card.last4} ({expMonth}/{expYear})
                        </div>
                        <div>
                            {card.isDefault ? (
                                "デフォルトカード"
                            ) : (
                                <button
                                    disabled={isLoading}
                                    onClick={() => {
                                        makeDefault(card);
                                    }}
                                    className="font-bold text-primary"
                                >
                                    デフォルトにする
                                </button>
                            )}
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                removePaymentMethod(card);
                            }}
                            className="font-bold text-red-500 hover:text-red-700"
                        >
                            削除
                        </button>
                    </div>
                );
            });
        }
    };

    const renderProfilePhoto = () => {
        let content = (
            <div className="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
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
                                onChange={handleSelectPhoto}
                                disabled={loading}
                            />
                        </label>
                        {/* <div className="pl-1">アップロードする</div> */}
                    </div>
                    <div className="text-xs text-gray-500">
                        JPEGファイルのみ対応
                    </div>
                </div>
            </div>
        );

        if (photo) {
            content = (
                <div className="px-6 space-x-4 rounded-md border-2 border-transparent">
                    <button
                        onClick={handleUpload}
                        disabled={profileLoading || isLoading}
                        type="button"
                        className={`inline-flex items-center px-3 py-2 border border-primary shadow-sm text-sm leading-4 font-bold rounded-md text-white bg-primary hover:bg-primarySecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  ${
                            (profileLoading || isLoading) && "opacity-50"
                        }`}
                    >
                        <UploadIcon
                            className="w-5 h-5 mr-2 -ml-1"
                            aria-hidden="true"
                        />
                        アップデート
                    </button>
                    <button
                        onClick={() => setPhoto(null)}
                        disabled={loading}
                        type="button"
                        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  ${
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
            );
        }

        return content;
    };

    let photoURL = `https://avatars.dicebear.com/api/identicon/${data?.myProfile?.id}.svg`;
    if (isHost) {
        if (data?.myProfile?.host.profilePhoto) {
            photoURL = data?.myProfile?.host.profilePhoto?.medium?.url;
        }
    } else {
        if (data?.myProfile?.profilePhoto) {
            photoURL = data?.myProfile?.profilePhoto?.medium?.url;
        }
    }
    if (photo) {
        photoURL = URL.createObjectURL(photo);
    }

    return (
        <HostLayout userSession={userSession}>
            <Head>
                <title>設定 - {config.appName}</title>
            </Head>
            <Container className="w-full sm:w-2/3 sm:mx-auto py-4 sm:py-6 lg:py-8 space-y-6">
                <h2 className="text-lg font-bold leading-6 text-gray-900">
                    設定
                </h2>
                <div className="w-full overflow-hidden bg-white rounded-lg shadow py-2 sm:py-3">
                    <h3 className="flex items-center justify-between py-2 mb-4 border-b border-gray-100 px-4 sm:px-6 pb-4">
                        <div className="font-bold">ご利用者写真</div>
                    </h3>
                    <div className="px-4 sm:px-6 flex items-end">
                        <div>
                            <img
                                src={photoURL}
                                className="rounded-full w-32 h-32 border-8 border-gray-200"
                            />
                        </div>
                        <div className="ml-8 flex-grow">
                            {renderProfilePhoto()}
                        </div>
                    </div>
                </div>
                {myProfile.__typename === "UserProfile" && (
                    <div className="w-full overflow-hidden bg-white rounded-lg shadow py-2 sm:py-3">
                        <form onSubmit={onSubmit}>
                            <h3 className="flex items-center justify-between py-2 mb-4 border-b border-gray-100 px-4 sm:px-6 pb-4">
                                <div className="font-bold">
                                    ご利用者プロフィール
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="inline-block w-auto px-4"
                                    loading={profileLoading || isLoading}
                                >
                                    アップデート
                                </Button>
                            </h3>
                            <div className="space-y-3">
                                <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                                    <div className="">
                                        <TextField
                                            {...register("lastName", {
                                                required: true,
                                            })}
                                            label="性"
                                            error={errors.lastName && true}
                                            errorMessage="Last Name is required"
                                            disabled={
                                                profileLoading || isLoading
                                            }
                                            singleRow
                                        />
                                    </div>
                                    <div className="">
                                        <TextField
                                            {...register("firstName", {
                                                required: true,
                                            })}
                                            label="名"
                                            error={errors.firstName && true}
                                            errorMessage="First Name is required"
                                            autoFocus
                                            disabled={
                                                profileLoading || isLoading
                                            }
                                            singleRow
                                        />
                                    </div>
                                    <div className="">
                                        <TextField
                                            {...register("lastNameKana", {
                                                required: true,
                                            })}
                                            label="性（カナ）"
                                            error={errors.lastNameKana && true}
                                            errorMessage="Last Name Kana is required"
                                            disabled={
                                                profileLoading || isLoading
                                            }
                                            singleRow
                                        />
                                    </div>
                                    <div className="">
                                        <TextField
                                            {...register("firstNameKana", {
                                                required: true,
                                            })}
                                            label="名（カナ）"
                                            error={errors.firstNameKana && true}
                                            errorMessage="First Name Kana is required"
                                            disabled={
                                                profileLoading || isLoading
                                            }
                                            singleRow
                                        />
                                    </div>
                                    <div className="">
                                        <TextField
                                            label="Email"
                                            value={myProfile?.email}
                                            onChange={() => {}}
                                            disabled
                                            singleRow
                                        />
                                    </div>
                                    <div className="">
                                        <TextField
                                            {...register("dob", {
                                                required: false,
                                            })}
                                            label="お誕生日"
                                            error={errors.dob && true}
                                            errorMessage="Date of birth is required"
                                            disabled={
                                                profileLoading || isLoading
                                            }
                                            defaultValue={
                                                data?.myProfile?.dob ||
                                                myProfile?.dob
                                                    ? moment(
                                                          data?.myProfile
                                                              ?.dob ||
                                                              myProfile?.dob
                                                      ).format("YYYY-MM-DD")
                                                    : ""
                                            }
                                            placeholder="YYYY-MM-DD"
                                            type={
                                                data?.myProfile?.dob ||
                                                myProfile?.dob
                                                    ? "text"
                                                    : "date"
                                            }
                                            singleRow
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                <ChangePassword />
                {paymentSource && (
                    <div className="w-full overflow-hidden bg-white rounded-lg shadow py-2 sm:py-3">
                        <h3 className="flex items-center justify-between py-2 mb-4 border-b border-gray-100 px-4 sm:px-6 pb-4">
                            <div className="font-bold">
                                お支払方法
                                <span className="inline-block ml-4 font-normal text-gray-500 text-xs">
                                    ※カード利用のみ
                                </span>
                            </div>
                            <Link href="/user/settings/add-card">
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="inline-block w-auto"
                                >
                                    別カードご追加
                                </Button>
                            </Link>
                        </h3>
                        <div className="space-y-3 px-4 sm:px-6">
                            {renderPaymentMethods()}
                        </div>
                    </div>
                )}
            </Container>
        </HostLayout>
    );
};

export default UserSettings;

export const getServerSideProps = async (context) => {
    const userSession = await getSession(context);
    const validation = requireAuth({
        session: userSession,
        pathAfterFailure: "/api/auth/signin",
        roles: ["user", "host"],
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
