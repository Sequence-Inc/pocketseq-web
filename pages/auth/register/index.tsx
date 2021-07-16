import React from "react";
import Head from "next/head";
import useRegister from "@hooks/useRegister";
import { PasswordInput, TextField, PinDialog, Button, Logo } from "@element";
import { useRouter } from "next/router";
import { AuthLayout } from "@layout";
import Link from "next/link";

const Register = () => {
    const {
        register,
        errors,
        handleSubmit,
        handleRegister,
        isLoading,
        pinRef,
        handleLogin,
        email,
        getValues,
    } = useRegister();
    const router = useRouter();

    return (
        <AuthLayout>
            <Head>
                <title>Signup | Space Rental</title>
            </Head>
            <PinDialog
                ref={pinRef}
                callback={handleLogin}
                emailAddress={email}
            />
            <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                <Logo />
                <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                    Create an account
                </h2>
                <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="space-y-4"
                >
                    <TextField
                        {...register("firstName", { required: true })}
                        error={errors.firstName ? true : false}
                        errorMessage={errors?.firstName?.message}
                        label="First Name"
                        id="firstName"
                        autoFocus={true}
                        disabled={isLoading}
                        value={getValues("firstName")}
                    />
                    <TextField
                        {...register("lastName", { required: true })}
                        error={errors.lastName ? true : false}
                        errorMessage={errors?.lastName?.message}
                        label="Last Name"
                        id="lastName"
                        disabled={isLoading}
                        value={getValues("lastName")}
                    />
                    <TextField
                        {...register("email", { required: true })}
                        error={errors.email ? true : false}
                        errorMessage={errors?.email?.message}
                        label="Email Address"
                        id="email"
                        disabled={isLoading}
                        value={getValues("email")}
                    />
                    <PasswordInput
                        {...register("password", { required: true })}
                        error={errors.password ? true : false}
                        errorMessage={errors?.password?.message}
                        label="Password"
                        id="password"
                        disabled={isLoading}
                    />
                    <PasswordInput
                        {...register("confirmPassword", { required: true })}
                        error={errors.confirmPassword ? true : false}
                        errorMessage={errors?.confirmPassword?.message}
                        label="Confirm Password"
                        id="confirmPassword"
                        disabled={isLoading}
                    />
                    <div className="text-sm">
                        <a
                            href="#"
                            className="text-xs text-gray-400 hover:text-lightBlue-500"
                        >
                            Agree to term
                        </a>
                    </div>

                    <div>
                        <Button
                            variant="primary"
                            loading={isLoading}
                            type="submit"
                        >
                            Register
                        </Button>
                    </div>
                    <div className="relative text-center">
                        <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                        <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                            Already have an account
                        </span>
                    </div>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            router.push("/auth/login");
                        }}
                    >
                        Login
                    </Button>
                </form>
            </div>
            <div className="flex flex-col items-center py-2 mt-2 w-96">
                <div className="py-2 text-md ">
                    <Link href="/">
                        <a className="text-gray-500 hover:text-green-600">
                            Go back to Timebook
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

export const getServerSideProps = async (context) => {
    return { props: {} };
};

export default Register;
