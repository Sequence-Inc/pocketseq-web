import React from "react";
import Head from "next/head";
import useRegister from "@hooks/useRegister";
import { PasswordInput, TextField, PinDialog, Button, Logo } from "@element";
import { useRouter } from "next/router";
import { AuthLayout } from "@layout";
import Link from "next/link";
import ErrorModal from "src/elements/ErrorModal";

import useTranslation from "next-translate/useTranslation";

const Register = () => {
    const {
        register,
        errors,
        handleSubmit,
        handleRegister,
        loading,
        pinRef,
        errorRef,
    } = useRegister();
    const router = useRouter();

    const { t } = useTranslation("common");

    return (
        <AuthLayout>
            <Head>
                <title>{t("register-an-account")} | Space Rental</title>
            </Head>
            <ErrorModal ref={errorRef} />
            <PinDialog
                ref={pinRef}
                callback={() => router.replace("/auth/login")}
                location="register"
            />
            <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
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
                    {/* <div className="text-sm">
                        <a
                            href="#"
                            className="text-xs text-gray-400 hover:text-lightBlue-500"
                        >
                            Agree to term
                        </a>
                    </div> */}

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
            <div className="flex flex-col items-center py-2 mt-2 w-96">
                <div className="py-2 text-md ">
                    <Link href="/">
                        <a className="text-gray-500 hover:text-green-600">
                            {t("back-to-timebook")}
                        </a>
                    </Link>
                </div>
                <div className="py-2 text-sm text-gray-500">
                    {t("copyright")}
                </div>
            </div>
        </AuthLayout>
    );
};

// export const getServerSideProps = async (context) => {
//     return { props: {} };
// };

export default Register;
