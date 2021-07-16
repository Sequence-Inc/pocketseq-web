import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Button, TextField, PinDialog, Logo } from "@element";
import { useForm } from "react-hook-form";
import AuthLayout from "src/layouts/AuthLayout";

const ForgotPassword = () => {
    const router = useRouter();
    const pinRef = useRef();
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otherError, setOtherError] = useState("");

    const onSubmit = async (formData) => {
        // setIsLoading(true);
        // setOtherError('');
        // setEmail(getValues('email'));
        // try {
        //     const { data } = await axios.post('forgotPassword', formData);
        //     if (data.result) {
        //         pinRef.current.open(formData);
        //     }
        // } catch (err) {
        //     console.log(err);
        //     setOtherError(err.message);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleResetRedirect = (queryData) => {
        router.push({
            pathname: "/forgot-password/reset-password",
            query: { email: queryData.email, code: queryData.code },
        });
    };

    return (
        <AuthLayout>
            <Head>
                <title>Forgot Password | Space Rental</title>
            </Head>
            <PinDialog
                ref={pinRef}
                location="forgotPassword"
                callback={handleResetRedirect}
                emailAddress={email}
            />
            <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                <Logo />
                <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                    Reset Password
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
                            {otherError}, Try Again Later
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
                        label="Email Address"
                        id="email"
                        type="string"
                        placeholder="eg@eg.com"
                        value={email}
                        disabled={isLoading}
                        autoFocus={true}
                    />

                    <Button
                        variant="primary"
                        loadingText="loading"
                        loading={isLoading}
                        type="submit"
                    >
                        Reset
                    </Button>

                    <div className="relative text-center">
                        <span className="absolute w-full top-2.5 left-0 h-1 border-b border-gray-300"></span>
                        <span className="relative inline-block px-3 text-sm text-gray-400 bg-white">
                            Have Account
                        </span>
                    </div>

                    <Button
                        loading={isLoading}
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

export default ForgotPassword;
