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
import { useMutation } from "@apollo/client";
import { CONTACT_FORM } from "src/apollo/queries/contact.queries";

type ContactFormDataType = {
    customerType:
        | "ー"
        | "未登録の方はこちら"
        | "ホスト（スペース・宿泊施設を貸す方）はこちら"
        | "ゲスト（スペース・宿泊施設を借りる方）はこちら";
    email: string;
    inquiryType: string;
    subject: string;
    description: string;
};

const defaultValue: ContactFormDataType = {
    customerType: "ー",
    email: "",
    inquiryType: "",
    subject: "",
    description: "",
};

const defaultErrorValue = {
    customerType: false,
    email: false,
    inquiryType: false,
    subject: false,
    description: false,
};

const Contact = ({ userSession }) => {
    const [formData, setFormData] = useState(defaultValue);
    const [errors, setErrors] = useState(defaultErrorValue);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [sendMessage] = useMutation(CONTACT_FORM, {
        onCompleted: (data) => {
            setErrorMessage("");
            setFormData(defaultValue);
            setErrors(defaultErrorValue);
            setSuccessMessage(data.contactForm.message);
            setLoading(false);
        },
        onError: (error) => {
            setSuccessMessage("");
            setErrorMessage(error.message);
            setLoading(false);
        },
    });

    const updateData = (key, value) => {
        const newData = { ...formData, [key]: value };
        setFormData(newData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors(defaultErrorValue);

        // perform validation
        const { customerType, email, inquiryType, subject, description } =
            formData;

        let error = [];
        if (email.trim() === "") {
            error.push("email");
        }
        if (inquiryType.trim() === "") {
            error.push("inquiryType");
        }
        if (subject.trim() === "") {
            error.push("subject");
        }
        if (description.trim() === "") {
            error.push("description");
        }

        if (error.length > 0) {
            const e = defaultErrorValue;
            error.map((key) => {
                e[key] = true;
            });
            setErrors(e);
            return;
        }

        // no errors
        // make api request
        try {
            setLoading(true);
            await sendMessage({
                variables: {
                    customerType,
                    email,
                    inquiryType,
                    subject,
                    description,
                },
            });
        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

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
                        onSubmit={handleSubmit}
                        className="w-full sm:w-1/2 mx-auto py-4 px-4 bg-gray-100 rounded-md"
                    >
                        <h3 className="text-lg font-black mb-4">お問合せ</h3>

                        <div className="px-0 space-y-6">
                            <div className=" sm:w-full">
                                <FormLabel
                                    className="text-xs leading-5 font-bold"
                                    value="お客様種別をお選びください"
                                />

                                <Select
                                    options={[
                                        "ー",
                                        "未登録の方はこちら",
                                        "ホスト（スペース・宿泊施設を貸す方）はこちら",
                                        "ゲスト（スペース・宿泊施設を借りる方）はこちら",
                                    ]}
                                    value={formData.customerType}
                                    onChange={(value) => {
                                        updateData("customerType", value);
                                    }}
                                    disabled={loading}
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
                                    autoFocus
                                    onChange={(event) => {
                                        updateData("email", event.target.value);
                                    }}
                                    value={formData.email}
                                    type="email"
                                    error={errors.email}
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
                                    autoFocus
                                    onChange={(event) => {
                                        updateData(
                                            "inquiryType",
                                            event.target.value
                                        );
                                    }}
                                    value={formData.inquiryType}
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
                                    autoFocus
                                    onChange={(event) => {
                                        updateData(
                                            "subject",
                                            event.target.value
                                        );
                                    }}
                                    value={formData.subject}
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
                                    autoFocus
                                    onChange={(event) => {
                                        updateData(
                                            "description",
                                            event.target.value
                                        );
                                    }}
                                    value={formData.description}
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
