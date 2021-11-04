import React from "react";
import Head from "next/head";
import { PinDialog, Button, Logo } from "@element";
import { useRouter } from "next/router";
import { AuthLayout } from "@layout";
import Link from "next/link";
import useRegisterHost from "@hooks/useRegisterHost";
import ErrorModal from "src/elements/ErrorModal";
import clsx from "clsx";
import { RadioGroup } from "@headlessui/react";
import { Controller } from "react-hook-form";
import CorporateForm from "src/components/CorporateForm";
import IndividualForm from "src/components/IndividualForm";

const Register = () => {
    const {
        register,
        control,
        errors,
        watch,
        handleSubmit,
        handleRegister,
        loading,
        pinRef,
        email,
        errorRef,
    } = useRegisterHost();
    const router = useRouter();

    return (
        <AuthLayout>
            <Head>
                <title>ホストアカウントのを作成する - time book</title>
            </Head>
            <ErrorModal ref={errorRef} />
            <PinDialog
                ref={pinRef}
                callback={() => router.replace("/login")}
                emailAddress={email}
                location="register"
            />
            <div className="grid grid-cols-5 gap-10 mt-20">
                <div className="col-span-2">
                    <div className="px-4 pt-6 pb-4 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                        <Logo />
                        <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                            ホストアカウントを作成する
                        </h2>
                        <form
                            onSubmit={handleSubmit(handleRegister)}
                            className="space-y-4"
                        >
                            <div>
                                <Controller
                                    name="hostType"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            disabled={loading}
                                        >
                                            <RadioGroup.Label className="sr-only">
                                                ホストアカウント
                                            </RadioGroup.Label>
                                            <div className="relative flex bg-white rounded-md">
                                                {["個人", "法人"].map(
                                                    (hostType, index) => (
                                                        <RadioGroup.Option
                                                            key={hostType}
                                                            value={hostType}
                                                            className={({
                                                                checked,
                                                            }) =>
                                                                clsx(
                                                                    index === 0
                                                                        ? "rounded-l-md"
                                                                        : "rounded-r-md",
                                                                    checked
                                                                        ? "bg-green-50 border-green-200 z-1"
                                                                        : "border-gray-200",
                                                                    "relative border px-4 py-3 flex w-full cursor-pointer md:pl-4 md:pr-6 focus:outline-none"
                                                                )
                                                            }
                                                        >
                                                            {({
                                                                active,
                                                                checked,
                                                            }) => (
                                                                <>
                                                                    <div className="flex items-center w-full space-x-3 text-sm">
                                                                        <div
                                                                            className={clsx(
                                                                                checked
                                                                                    ? "bg-primary border-transparent"
                                                                                    : "bg-white border-gray-300",
                                                                                active
                                                                                    ? "ring-2 ring-offset-2 ring-primary"
                                                                                    : "",
                                                                                "h-4 w-4 rounded-full border flex items-center justify-center"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        >
                                                                            <span className="rounded-full bg-white w-1.5 h-1.5 m-1" />
                                                                        </div>
                                                                        <RadioGroup.Label
                                                                            as="div"
                                                                            className={clsx(
                                                                                checked
                                                                                    ? "text-primary"
                                                                                    : "text-gray-600",
                                                                                "font-medium w-full"
                                                                            )}
                                                                        >
                                                                            {hostType +
                                                                                " "}
                                                                        </RadioGroup.Label>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </RadioGroup.Option>
                                                    )
                                                )}
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            {watch().hostType === "法人" && (
                                <CorporateForm
                                    register={register}
                                    errors={errors}
                                    loading={loading}
                                />
                            )}
                            {watch().hostType === "個人" && (
                                <IndividualForm
                                    register={register}
                                    errors={errors}
                                    loading={loading}
                                />
                            )}

                            <div>
                                <Button
                                    variant="primary"
                                    loading={loading}
                                    type="submit"
                                >
                                    登録する
                                </Button>
                            </div>
                            <div className="relative text-center">
                                <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                                <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                                    アカウントをお持ちの方
                                </span>
                            </div>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/auth/login");
                                }}
                            >
                                ログインする
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="flex items-center col-span-3">
                    <div className="w-ful">
                        <div className="grid w-full grid-cols-3 gap-6">
                            <h2 className="w-full col-span-3 text-xl font-medium text-primary">
                                導入の流れ
                            </h2>
                            <div>
                                <h3 className="py-2 text-lg font-medium text-center text-white bg-primary">
                                    会員登録
                                </h3>
                                <div className="pl-5">
                                    <ul className="mt-4 text-sm text-gray-600 list-disc">
                                        <li>施設(企業)情報のご登録</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h3 className="py-2 text-lg font-medium text-center text-white bg-primary">
                                    事前審査
                                </h3>
                                <div className="pl-5">
                                    <ul className="mt-4 text-sm text-gray-600 list-disc">
                                        <li>身分証明の確認</li>
                                        <li>免許(宿泊業など)の確認</li>
                                        <li>感染対策の確認</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h3 className="py-2 text-lg font-medium text-center text-white bg-primary">
                                    掲載開始
                                </h3>
                                <div className="pl-5">
                                    <ul className="mt-4 text-sm text-gray-600 list-disc">
                                        <li>ホスト用アカウントの発行</li>
                                        <li>掲載開始</li>
                                        <li>SNSなどで拡散</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <ul className="text-sm text-gray-600">
                                <li>
                                    ※ホスト会員登録後に事務局にて審査を行います。
                                </li>
                                <li>
                                    身分証明および免許（宿泊業等）の確認をさせていただきます。
                                </li>
                                <li>
                                    審査の期間は通常5営業日前後となります。
                                    <br />
                                    審査完了後は完了通知メールにてお知らせいたします。
                                    <br />
                                    完了後、ホストログイン画面よりログインの上で、
                                    <br />
                                    ホスト情報の登録およびスペース登録を行っていただきますと掲載が開始いたします。
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center py-2 mt-2 w-96">
                <div className="py-2 text-md ">
                    <Link href="/">
                        <a className="text-gray-500 hover:text-green-600">
                            time bookにもどる
                        </a>
                    </Link>
                </div>
                <div className="py-2 text-sm text-gray-500">
                    &copy; Copyright 2021 Sequence Co., Ltd.
                </div>
            </div>
        </AuthLayout>
    );
};

// export const getServerSideProps = async (context) => {
//     return { props: {} };
// };

export default Register;
