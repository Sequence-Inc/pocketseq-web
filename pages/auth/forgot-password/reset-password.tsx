import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, PasswordInput, Logo } from "@element";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLayout from "src/layouts/AuthLayout";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "src/apollo/queries/auth.queries";
import { getSession } from "next-auth/react";
import { config } from "src/utils";

const schema = yup.object().shape({
    password: yup.string().min(8).required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const ResetPassword = ({ email, code }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [resetPassword, { loading: resetLoading }] = useMutation(
        RESET_PASSWORD,
        {
            onError: (err) => alert(err?.message),
            onCompleted: (data) => {
                router.replace("/auth/login");
            },
        }
    );

    const onSubmit = async (formData) => {
        setIsLoading(true);
        const resetBody = {
            email,
            code: parseInt(code),
            newPassword: formData.password,
        };
        await resetPassword({ variables: { input: resetBody } });
        setIsLoading(false);
    };

    useEffect(() => {
        if (!email && !code) {
            router.replace("/auth/login");
        }
    }, []);

    return (
        <AuthLayout>
            <Head>
                <title>パスワードをリセットする - {config.appName}</title>
            </Head>
            <div className="w-96 lg:w-1/3 mx-auto px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Logo />
                <h3 className="font-medium text-center text-green-600">
                    確認コードの確認完了しました
                </h3>
                <h2 className="mt-2 text-sm font-normal text-center text-gray-600">
                    パスワードをリセットする
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <PasswordInput
                        {...register("password")}
                        error={errors.password ? true : false}
                        errorMessage={errors?.password?.message}
                        label="パスワード"
                        id="password"
                        disabled={isLoading}
                    />

                    <PasswordInput
                        {...register("confirmPassword")}
                        error={errors.confirmPassword ? true : false}
                        errorMessage={errors.confirmPassword?.message}
                        label="パスワード確認"
                        id="confirmPassword"
                        disabled={isLoading}
                        hintText=""
                    />

                    <Button variant="primary" loading={isLoading} type="submit">
                        パスワードをリセットする
                    </Button>
                </form>
            </div>
            <div className="py-2 mt-2 w-96 lg:w-1/3 mx-auto text-center">
                <div className="py-2 text-md ">
                    <Link href="/">
                        <a className="text-gray-500 hover:text-green-600">
                            {config.appName}にもどる
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

export default ResetPassword;

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const { callbackUrl, email, code } = context.query;
    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: callbackUrl || "/",
            },
        };
    }
    return {
        props: {
            email,
            code,
        },
    };
}
