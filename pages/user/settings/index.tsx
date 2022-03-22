import React, { useState } from "react";
import { PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import HostLayout from "src/layouts/HostLayout";
import Head from "next/head";
import { Button, Container, TextField } from "@element";
import { useMutation, useQuery } from "@apollo/client";

import {
    GET_PROFILE_FOR_SETTINGS,
    UPDATE_USER_PROFILE,
} from "src/apollo/queries/user.queries";
import DashboardCard from "src/components/DashboardCard";
import withAuth from "src/utils/withAuth";
import { IPaymentMethod } from "src/types/timebookTypes";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import requireAuth from "src/utils/authecticatedRoute";
import { getSession } from "next-auth/react";
import { config } from "src/utils";
import { LoadingSpinner } from "src/components/LoadingSpinner";

const UserSettings = ({ userSession }) => {
    const [profile, setProfile] = useState();
    const [profileLoading, setProfileLoading] = useState<boolean>(false);
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const { data, loading, error } = useQuery(GET_PROFILE_FOR_SETTINGS, {
        fetchPolicy: "network-only",
    });
    const [mutate] = useMutation(UPDATE_USER_PROFILE);

    useEffect(() => {
        if (data?.myProfile) {
            setValue("firstName", data?.myProfile?.firstName);
            setValue("lastName", data?.myProfile?.lastName);
            setValue("firstNameKana", data?.myProfile?.firstNameKana);
            setValue("lastNameKana", data?.myProfile?.lastNameKana);
            setValue("dob", data?.myProfile?.dob);
        }
    }, [data]);

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

    if (loading)
        return (
            <LoadingSpinner />
        );

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

    const removePaymentMethod = (id) => {
        return null;
    };

    const renderPaymentMethods = () => {
        if (paymentSource.length === 0) {
            return (
                <div className="py-10">
                    <h3 className="text-center">No payment methods</h3>
                </div>
            );
        } else {
            return paymentSource.map((card, index) => {
                return (
                    <div
                        key={index}
                        className="flex justify-between px-6 py-4 bg-gray-50 text-gray-700 rounded-lg shadow"
                    >
                        <div>
                            <span className="inline-block mr-5">
                                {card.brand.toUpperCase()}
                            </span>
                            <span>... {card.last4}</span>
                        </div>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                removePaymentMethod(card.id);
                            }}
                            className="text-sm text-red-500 hover:text-red-700"
                        >
                            削除
                        </a>
                    </div>
                );
            });
        }
    };

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
                    <form onSubmit={onSubmit}>
                        <h3 className="flex items-center justify-between py-2 mb-4 border-b border-gray-100 px-4 sm:px-6 pb-4">
                            <div className="font-bold">
                                ご利用者プロフィール
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="inline-block w-auto px-4"
                                loading={profileLoading}
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
                                        disabled={profileLoading}
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
                                        disabled={profileLoading}
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
                                        disabled={profileLoading}
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
                                        disabled={profileLoading}
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
                                        {...register("dob")}
                                        label="お誕生日"
                                        error={errors.dob && true}
                                        errorMessage="Date of birth is required"
                                        disabled={profileLoading}
                                        singleRow
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
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
        roles: ["user"],
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
