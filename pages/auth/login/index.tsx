import Head from "next/head";
import React from "react";
import { Button, PasswordInput, TextField, PinDialog } from "@element";
import useLogin from "@hooks/useLogin";

import { useRouter } from "next/router";
import { AuthLayout } from "@layout";

const Login = () => {
    const {
        register,
        errors,
        handleLogin,
        handleSubmit,
        isLoading,
        pinRef,
        getValues,
    } = useLogin();
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Login | Space Rental</title>
            </Head>
            <PinDialog ref={pinRef} callback={handleLogin} />
            <AuthLayout>
                <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                    {/* <Logo /> */}
                    Logo Here
                    <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                        Login to your account
                    </h2>
                    <form
                        onSubmit={handleSubmit(handleLogin)}
                        className="space-y-4"
                    >
                        <TextField
                            {...register("email")}
                            error={errors.email ? true : false}
                            errorMessage={errors?.email?.message}
                            label="Email Address"
                            placeholder="eg@eg.com"
                            id="email"
                            disabled={isLoading}
                            autoFocus={true}
                            tabIndex={1}
                            value={getValues("email")}
                        />
                        <PasswordInput
                            {...register("password")}
                            error={errors.password ? true : false}
                            errorMessage={errors.password?.message}
                            label="Password"
                            id="password"
                            disabled={isLoading}
                            showForgotPassword
                            tabIndex={2}
                        />
                        <Button
                            loadingText="loading"
                            variant="primary"
                            loading={isLoading}
                            type="submit"
                        >
                            Login
                        </Button>
                        <div className="relative text-center">
                            <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                            <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                                Don't have an account
                            </span>
                        </div>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                router.push("/auth/register");
                            }}
                        >
                            Create Account
                        </Button>
                    </form>
                </div>
                <div className="flex justify-center py-2 mt-2 w-96">
                    <div className="py-2 text-sm text-gray-500">
                        &copy; Copyright 2021 JRG Co., Ltd.
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

// Login.Layout = EmptyLayout;

export const getServerSideProps = async (context) => {
    return { props: {} };
};

export default Login;
