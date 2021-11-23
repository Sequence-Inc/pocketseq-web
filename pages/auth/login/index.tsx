import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, PasswordInput, TextField, PinDialog, Logo } from "@element";
import useLogin from "@hooks/useLogin";

import { useRouter } from "next/router";
import { AuthLayout } from "@layout";
import ErrorModal from "src/elements/ErrorModal";

import useTranslation from "next-translate/useTranslation";

const Login = () => {
    const {
        register,
        errors,
        handleLogin,
        handleSubmit,
        loading,
        pinRef,
        errorRef,
    } = useLogin();
    const router = useRouter();

    const { t } = useTranslation("common");

    return (
        <>
            <Head>
                <title>{t("login")} - time book</title>
            </Head>
            <PinDialog ref={pinRef} callback={handleLogin} location="login" />
            <ErrorModal ref={errorRef} />
            <AuthLayout>
                <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                    <Logo />
                    {/* Logo Here */}
                    <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                        {/* ログイン */}
                        {t("login")}
                    </h2>
                    <form
                        onSubmit={handleSubmit(handleLogin)}
                        className="space-y-4"
                    >
                        <TextField
                            {...register("email")}
                            error={errors.email ? true : false}
                            errorMessage={errors?.email?.message}
                            label={t("email")}
                            placeholder="taro@mail.com"
                            id="email"
                            disabled={loading}
                            autoFocus={true}
                            tabIndex={1}
                        />
                        <PasswordInput
                            {...register("password")}
                            error={errors.password ? true : false}
                            errorMessage={errors.password?.message}
                            label={t("password")}
                            id="password"
                            disabled={loading}
                            showForgotPassword
                            tabIndex={2}
                        />
                        <Button
                            loadingText="loading"
                            variant="primary"
                            loading={loading}
                            type="submit"
                        >
                            {t("do-login")}
                        </Button>
                        <div className="relative text-center">
                            <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                            <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                                {t("dont-have-an-account")}
                            </span>
                        </div>
                        <Button
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                router.push("/auth/register");
                            }}
                        >
                            {t("register-an-account")}
                        </Button>
                    </form>
                </div>
                <div className="flex flex-col items-center py-2 mt-2 w-96">
                    <div className="py-2 text-md ">
                        <Link href="/">
                            <a className="text-gray-500 hover:text-green-600">
                                {t("back-to-timebook")}
                            </a>
                        </Link>
                    </div>
                    <div className="py-2 text-sm text-gray-500">
                        &copy; Copyright 2021 Sequence Co., Ltd.
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

export default Login;
