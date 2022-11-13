import React from "react";
import Head from "next/head";
import useRegister from "@hooks/useRegister";
import { PasswordInput, TextField, PinDialog, Button, Logo } from "@element";
import { useRouter } from "next/router";
import { AuthLayout } from "@layout";
import { Controller } from "react-hook-form";
import Link from "next/link";
import ErrorModal from "src/elements/ErrorModal";

import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/react";
import moment from "moment";

const Register = ({ userSession }) => {
    const {
        register,
        errors,
        handleSubmit,
        handleRegister,
        loading,
        pinRef,
        errorRef,
        watch,
        control,
    } = useRegister();
    const router = useRouter();

    const { t } = useTranslation("common");

    return (
        <AuthLayout userSession={userSession}>
            <Head>
                <title>{t("register-an-account")} | Space Rental</title>
            </Head>
            <ErrorModal ref={errorRef} />
            <PinDialog
                ref={pinRef}
                callback={() => router.replace("/auth/login")}
                location="register"
            />
            <div className="w-96 lg:w-1/3 mx-auto px-4 pt-6 pb-4 mt-20 space-y-4 lg:space-y-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Logo />
                <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                    {t("register-an-account")}
                </h2>
                <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="space-y-4"
                >
                    <TextField
                        {...register("lastName", { required: true })}
                        error={errors.lastName ? true : false}
                        errorMessage={errors?.lastName?.message}
                        label={t("lastname")}
                        id="lastName"
                        placeholder={t("lastname-example")}
                        autoFocus={true}
                        disabled={loading}
                    />
                    <TextField
                        {...register("firstName", { required: true })}
                        error={errors.firstName ? true : false}
                        errorMessage={errors?.firstName?.message}
                        label={t("firstname")}
                        id="firstName"
                        placeholder={t("firstname-example")}
                        disabled={loading}
                    />
                    <TextField
                        {...register("lastNameKana", { required: true })}
                        error={errors.lastName ? true : false}
                        errorMessage={errors?.lastName?.message}
                        label={t("lastname-kana")}
                        id="lastNameKana"
                        placeholder={t("lastname-kana-example")}
                        disabled={loading}
                    />
                    <TextField
                        {...register("firstNameKana", { required: true })}
                        error={errors.firstName ? true : false}
                        errorMessage={errors?.firstName?.message}
                        label={t("firstname-kana")}
                        id="firstNameKana"
                        placeholder={t("firstname-kana-example")}
                        disabled={loading}
                    />
                    <TextField
                        {...register("email", { required: true })}
                        error={errors.email ? true : false}
                        errorMessage={errors?.email?.message}
                        label={t("email")}
                        id="email"
                        placeholder={t("email-example")}
                        disabled={loading}
                    />
                    <PasswordInput
                        {...register("password", { required: true })}
                        error={errors.password ? true : false}
                        errorMessage={errors?.password?.message}
                        label={t("password")}
                        id="password"
                        disabled={loading}
                    />
                    <PasswordInput
                        {...register("confirmPassword", { required: true })}
                        error={errors.confirmPassword ? true : false}
                        errorMessage={errors?.confirmPassword?.message}
                        label={t("password-confirm")}
                        id="confirmPassword"
                        disabled={loading}
                    />

                    <Controller
                        key="terms"
                        name="terms"
                        control={control}
                        rules={{ validate: (val) => val && true }}
                        render={({ field }: any) => (
                            <div>
                                <input
                                    {...register("terms", {
                                        required: true,
                                        validate: (val) => val && true,
                                    })}
                                    id="terms"
                                    aria-describedby="terms-description"
                                    type="checkbox"
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label
                                    htmlFor="terms"
                                    className="ml-3 text-sm text-gray-500 align-baseline"
                                >
                                    <a
                                        href="https://timebook-public-media.s3.ap-northeast-1.amazonaws.com/assets/%E3%82%B2%E3%82%B9%E3%83%88%E5%90%91%E3%81%91PocketseQ%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84.pdf"
                                        className="inline-block text-gray-500 hover:text-primary"
                                        target="_blank"
                                    >
                                        利用規約
                                    </a>
                                    に同意いたします
                                </label>
                            </div>
                        )}
                    />
                    {errors?.terms && (
                        <span className="text-xs text-red-600">
                            You must agree to terms and conditions to continue
                        </span>
                    )}

                    <Controller
                        key="privacy"
                        name="privacy"
                        control={control}
                        rules={{ validate: (val) => val && true }}
                        render={({ field }: any) => (
                            <div>
                                <input
                                    {...register("privacy", {
                                        required: true,
                                        validate: (val) => val && true,
                                    })}
                                    id="privacy"
                                    aria-describedby="privacy-description"
                                    type="checkbox"
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label
                                    htmlFor="privacy"
                                    className="ml-3 text-sm text-gray-500 align-baseline"
                                >
                                    <a
                                        href="https://timebook-public-media.s3.ap-northeast-1.amazonaws.com/assets/%E3%82%B2%E3%82%B9%E3%83%88%E5%90%91%E3%81%91PocketseQ%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84.pdf"
                                        className="inline-block text-gray-500 hover:text-primary"
                                        target="_blank"
                                    >
                                        プライバシーポリシー
                                    </a>
                                    に同意いたします
                                </label>
                            </div>
                        )}
                    />
                    {errors?.privacy && (
                        <span className="text-xs text-red-600">
                            You must agree to privacy policy to continue
                        </span>
                    )}

                    <div>
                        <Button
                            variant="primary"
                            loading={loading}
                            type="submit"
                        >
                            {t("do-register")}
                        </Button>
                    </div>
                    <div className="relative text-center">
                        <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                        <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                            {t("already-have-an-account")}
                        </span>
                    </div>

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            router.push("/auth/login");
                        }}
                    >
                        {t("do-login")}
                    </Button>
                </form>
            </div>
            <div className="w-96 lg:w-1/3 mx-auto py-2 mt-2 text-center">
                <div className="py-2 text-md ">
                    <Link href="/">
                        <a className="text-gray-500 hover:text-green-600">
                            {t("back-to-timebook")}
                        </a>
                    </Link>
                </div>
                <div className="py-2 text-sm text-gray-500">
                    &copy; Copyright {moment().format("YYYY")} Sequence Co.,
                </div>
            </div>
        </AuthLayout>
    );
};

export default Register;

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (session) {
        const { callbackUrl } = context.query;
        return {
            redirect: {
                permanent: false,
                destination: callbackUrl || "/",
            },
        };
    }
    return {
        props: {},
    };
}
