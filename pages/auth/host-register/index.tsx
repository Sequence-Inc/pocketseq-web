import React from "react";
import Head from "next/head";
import { PasswordInput, TextField, PinDialog, Button, Logo } from "@element";
import { useRouter } from "next/router";
import { AuthLayout } from "@layout";
import Link from "next/link";
import useRegisterHost from "@hooks/useRegisterHost";
import ErrorModal from "src/elements/ErrorModal";
import clsx from "clsx";
import { RadioGroup } from "@headlessui/react";
import { Controller } from "react-hook-form";

const Register = () => {
    const {
        register,
        control,
        errors,
        watch,
        handleSubmit,
        handleRegister,
        loading,
        pinRef,
        email,
        errorRef
    } = useRegisterHost();
    const router = useRouter();

    return (
        <AuthLayout>
            <Head>
                <title>Signup | Space Rental</title>
            </Head>
            <ErrorModal ref={errorRef} />
            <PinDialog
                ref={pinRef}
                callback={() => router.replace('/')}
                emailAddress={email}
                location="register"
            />
            <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                <Logo />
                <h2 className="mt-2 text-base font-normal text-center text-gray-500">
                    Create a host account
                </h2>
                <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="space-y-4"
                >
                    <div>
                        <Controller
                            name="hostType"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <RadioGroup {...field} disabled={loading}>
                                    <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
                                    <div className="relative flex bg-white rounded-md">
                                        {['Individual', 'Corporate'].map((hostType, index) => (
                                            <RadioGroup.Option
                                                key={hostType}
                                                value={hostType}
                                                className={({ checked }) =>
                                                    clsx(
                                                        index === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                                        checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                                                        'relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none'
                                                    )
                                                }
                                            >
                                                {({ active, checked }) => (
                                                    <>
                                                        <div className="flex items-center w-full space-x-3 text-sm">
                                                            <div
                                                                className={clsx(
                                                                    checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                                                                    active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                                                                    'h-4 w-4 rounded-full border flex items-center justify-center'
                                                                )}
                                                                aria-hidden="true"
                                                            >
                                                                <span className="rounded-full bg-white w-1.5 h-1.5 m-1" />
                                                            </div>
                                                            <RadioGroup.Label
                                                                as="div"
                                                                className={clsx(checked ? 'text-indigo-900' : 'text-gray-900', 'font-medium')}
                                                            >
                                                                {hostType}
                                                            </RadioGroup.Label>
                                                        </div>
                                                    </>
                                                )}
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>} />
                        <p className="mt-1 text-sm text-gray-500">Select any one type of host that fits your needs.</p>
                    </div>


                    {watch().hostType === 'Corporate' ?
                        <>
                            {/* Corporate form */}
                            <TextField
                                {...register("company.name", { required: true })}
                                error={errors?.company?.name ? true : false}
                                errorMessage={errors?.company?.name?.message}
                                label="Comapny Name"
                                id="name"
                                autoFocus={true}
                                disabled={loading}
                            />
                            <TextField
                                {...register("company.nameKana", { required: true })}
                                error={errors?.company?.nameKana ? true : false}
                                errorMessage={errors?.company?.nameKana?.message}
                                label="Company Name Kana"
                                id="nameKana"
                                disabled={loading}
                            />
                            <TextField
                                {...register("company.email", { required: true })}
                                error={errors?.company?.email ? true : false}
                                errorMessage={errors?.company?.email?.message}
                                label="Email Address"
                                id="email"
                                disabled={loading}
                            />
                            <TextField
                                {...register("company.registrationNumber", { required: true })}
                                error={errors?.company?.registrationNumber ? true : false}
                                errorMessage={errors?.company?.registrationNumber?.message}
                                label="Registration Number"
                                id="registrationNumber"
                                disabled={loading}
                            />
                            <PasswordInput
                                {...register("company.password", { required: true })}
                                error={errors?.company?.password ? true : false}
                                errorMessage={errors?.company?.password?.message}
                                label="Password"
                                id="password"
                                disabled={loading}
                            />
                            <PasswordInput
                                {...register("company.confirmPassword", { required: true })}
                                error={errors?.company?.confirmPassword ? true : false}
                                errorMessage={errors?.company?.confirmPassword?.message}
                                label="Confirm Password"
                                id="confirmPassword"
                                disabled={loading}
                            />
                        </>
                        : watch().hostType === 'Individual' ?
                            <>
                                {/* Individual form */}
                                <TextField
                                    {...register("user.firstName", { required: true })}
                                    error={errors?.user?.firstName ? true : false}
                                    errorMessage={errors?.user?.firstName?.message}
                                    label="First Name"
                                    id="firstName"
                                    autoFocus={true}
                                    disabled={loading}
                                />
                                <TextField
                                    {...register("user.lastName", { required: true })}
                                    error={errors?.user?.lastName ? true : false}
                                    errorMessage={errors?.user?.lastName?.message}
                                    label="Last Name"
                                    id="lastName"
                                    autoFocus={true}
                                    disabled={loading}
                                />
                                <TextField
                                    {...register("user.firstNameKana", { required: true })}
                                    error={errors?.user?.firstNameKana ? true : false}
                                    errorMessage={errors?.user?.firstNameKana?.message}
                                    label="First Name Kana"
                                    id="firstNameKana"
                                    disabled={loading}
                                />
                                <TextField
                                    {...register("user.lastNameKana", { required: true })}
                                    error={errors?.user?.lastNameKana ? true : false}
                                    errorMessage={errors?.user?.lastNameKana?.message}
                                    label="Last Name Kana"
                                    id="lastNameKana"
                                    disabled={loading}
                                />
                                <TextField
                                    {...register("user.email", { required: true })}
                                    error={errors?.user?.email ? true : false}
                                    errorMessage={errors?.user?.email?.message}
                                    label="Email Address"
                                    id="email"
                                    disabled={loading}
                                />
                                <PasswordInput
                                    {...register("user.password", { required: true })}
                                    error={errors?.user?.password ? true : false}
                                    errorMessage={errors?.user?.password?.message}
                                    label="Password"
                                    id="password"
                                    disabled={loading}
                                />
                                <PasswordInput
                                    {...register("user.confirmPassword", { required: true })}
                                    error={errors?.user?.confirmPassword ? true : false}
                                    errorMessage={errors?.user?.confirmPassword?.message}
                                    label="Confirm Password"
                                    id="confirmPassword"
                                    disabled={loading}
                                /></> : null}
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
                            loading={loading}
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

// export const getServerSideProps = async (context) => {
//     return { props: {} };
// };

export default Register;
