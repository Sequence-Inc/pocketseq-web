import {
    Button,
    Container,
    FormLabel,
    Select,
    TextArea,
    TextField,
} from "@element";
import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { Header, Footer } from "@layout";
import Head from "next/head";
import { config } from "src/utils";
import { useContactForm } from "@hooks/contact";
import { Controller } from "react-hook-form";

export const CUSTOMER_TYPES = [
    { label: "ー", value: "ー" },
    { label: "未登録の方はこちら", value: "未登録の方はこちら" },
    {
        label: "ホスト（スペース・宿泊施設を貸す方）はこちら",
        value: "ホスト（スペース・宿泊施設を貸す方）はこちら",
    },
    {
        label: "ゲスト（スペース・宿泊施設を借りる方）はこちら",
        value: "ゲスト（スペース・宿泊施設を借りる方）はこちら",
    },
];

const Contact = ({ userSession }) => {
    const { onSubmit, register, errors, control, loading } = useContactForm({
        onSuccess: (data) => {
            setErrorMessage("");
            setSuccessMessage(data.contactForm.message);
        },
        onError: (err) => {
            setSuccessMessage("");
            setErrorMessage(err.message);
        },
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    return (
        <div className="bg-gray-50">
            <Head>
                <title>
                    お問合せ | {config.appName} ({config.appNameEnglish}) |
                    「人×場所×体験」を繋げる 目的に合った場所を検索しよう
                </title>
                <meta
                    name="description"
                    content={`${config.appName} (${config.appNameEnglish})は、会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                <meta
                    name="keywords"
                    content={`${config.appName} (${config.appNameEnglish}),レンタルスペース, ペット可`}
                />
                <meta
                    property="og:title"
                    content={`${config.appName} (${config.appNameEnglish}) | 「人×場所×体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="og:description"
                    content={`${config.appName} (${config.appNameEnglish})は、会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                {/* <meta
                    property="og:image"
                    content="OGP用の紹介画像のパスを指定してください"
                /> */}
            </Head>
            <Header userSession={userSession} />
            <main>
                <Container className="py-20 align-middle space-y-4 ">
                    <form
                        onSubmit={onSubmit}
                        className="w-full sm:w-1/2 mx-auto py-4 px-4 bg-gray-100 rounded-md"
                    >
                        <h3 className="text-lg font-black mb-4">お問合せ</h3>

                        <div className="px-0 space-y-6">
                            <div className="sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="お客様種別をお選びください"
                                />

                                <Controller
                                    name={`customerType`}
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label=""
                                            options={CUSTOMER_TYPES}
                                            error={errors?.customerType && true}
                                            labelKey="label"
                                            valueKey="value"
                                            disabled={loading}
                                            className="sm:w-full"
                                        />
                                    )}
                                />
                            </div>
                            <div className=" sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="メールアドレス"
                                    required
                                />

                                <TextField
                                    label={""}
                                    errorMessage="メールアドレス is required"
                                    {...register("email", {
                                        required: true,
                                    })}
                                    type="email"
                                    error={errors?.email && true}
                                    disabled={loading}
                                />
                            </div>

                            <div className=" sm:w-full space-y-2">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="問い合わせ種別"
                                    required
                                />

                                <TextField
                                    label={""}
                                    errorMessage="問い合わせ種別 is required"
                                    {...register("inquiryType", {
                                        required: true,
                                    })}
                                    error={errors.inquiryType}
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500">
                                    お問合せ種別を選択してください
                                </p>
                            </div>

                            <div className=" sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="件名"
                                    required
                                />

                                <TextField
                                    label={""}
                                    errorMessage="件名 is required"
                                    {...register("subject", {
                                        required: true,
                                    })}
                                    error={errors.subject}
                                    disabled={loading}
                                />
                            </div>

                            <div className=" sm:w-full space-y-2">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="お問い合わせ内容"
                                    required
                                />

                                <TextArea
                                    label={""}
                                    rows={6}
                                    errorMessage="お問い合わせ内容 is required"
                                    {...register("description", {
                                        required: true,
                                    })}
                                    error={errors.description}
                                    disabled={loading}
                                />

                                <p className="text-xs text-gray-500">
                                    お問合せの詳細をご入力ください。なお、スペースの掲載内容に関するお問合せについては、ポケットシークでは回答できかねます。
                                </p>
                            </div>
                            {errorMessage && (
                                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md border border-red-200">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-100 text-green-600 px-4 py-2 rounded-md border border-green-200">
                                    {successMessage}
                                </div>
                            )}
                            <Button
                                variant={loading ? "disabled" : "primary"}
                                type="submit"
                                disabled={loading}
                            >
                                送信
                            </Button>
                        </div>
                    </form>
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
        },
    };
};
