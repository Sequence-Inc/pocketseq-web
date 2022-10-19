import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Button, TextField, PinDialog, Logo } from "@element";
import { useForm } from "react-hook-form";
import AuthLayout from "src/layouts/AuthLayout";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD, LOGIN } from "src/apollo/queries/auth.queries";
import { getSession } from "next-auth/react";
import { config } from "src/utils";
import moment from "moment";

const ForgotPassword = ({ userSession }) => {
    const router = useRouter();
    const pinRef = useRef(null);
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otherError, setOtherError] = useState("");
    const [mutate] = useMutation(FORGOT_PASSWORD, {
        onError: (err) => {
            const error: Error = { ...err.graphQLErrors[0] };
            setOtherError(err.message);
        },
    });

    const onSubmit = async (formData) => {
        setIsLoading(true);
        setOtherError("");
        setEmail(watch().email);
        const data = await mutate({ variables: { email: formData.email } });
        if (data?.data?.forgotPassword) {
            pinRef.current.open(formData);
        }
        setIsLoading(false);
    };

    const handleResetRedirect = (queryData) => {
        router.push({
            pathname: "/auth/forgot-password/reset-password",
            query: { email: queryData.email, code: queryData.code },
        });
    };

    return (
        <AuthLayout userSession={userSession}>
            <Head>
                <title>パスワードをリセットする - {config.appName}</title>
            </Head>
            <PinDialog
                ref={pinRef}
                location="forgotPassword"
                callback={handleResetRedirect}
                emailAddress={email}
            />
            <div className="w-96 lg:w-1/3 mx-auto px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Logo />
                <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                    パスワードをリセットする
                </h2>
                {otherError.trim() !== "" && (
                    <>
                        <div className="flex px-4 py-2 text-sm text-red-500 border border-red-300 rounded bg-red-50">
                            <svg
                                className="w-5 h-5 mr-2 stroke-current"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {otherError}, あとでもう一度試してみてください
                        </div>
                    </>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                        {...register("email", { required: true })}
                        error={errors.email ? true : false}
                        errorMessage={
                            errors.email && "Email Address is required"
                        }
                        label="メールアドレス"
                        id="email"
                        type="string"
                        placeholder="eg@eg.com"
                        disabled={isLoading}
                        autoFocus={true}
                    />

                    <Button
                        variant="primary"
                        loadingText="loading"
                        loading={isLoading}
                        type="submit"
                    >
                        リセットする
                    </Button>

                    <div className="relative text-center">
                        <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                        <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                            アカウントをお持ちの方
                        </span>
                    </div>

                    <Button
                        loading={isLoading}
                        onClick={(e) => {
                            e.preventDefault();
                            router.push("/auth/login");
                        }}
                    >
                        ログインする
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
                    &copy; Copyright {moment().format("YYYY")} Sequence Co.,
                    Ltd.
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;

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
