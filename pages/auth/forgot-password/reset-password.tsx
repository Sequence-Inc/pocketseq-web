import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, PasswordInput } from '@element';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthLayout from 'src/layouts/AuthLayout';

const schema = yup.object().shape({
    password: yup.string().min(8).required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const ResetPassword = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (formData) => {
        // setIsLoading(true);
        // try {
        //     const resetBody = {
        //         email: router.query.email,
        //         code: router.query.code,
        //         newPassword: formData.password
        //     };
        //     const { data } = await axios.post('resetPassword', resetBody);
        //     toast.success(data.data.message);
        //     router.replace('/auth/login');
        // } catch (err) {
        //     console.log(err);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    useEffect(() => {
        if (!router.query.email && !router.query.code) {
            router.replace('/auth/login');
        }
    }, []);

    return (
        <AuthLayout>
            <Head>
                <title>Reset Password | Space Rental</title>
            </Head>
            <div className="px-4 pt-6 pb-4 mt-20 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm w-96">
                {/* <Logo /> */}
                Logo here
                <h3 className="font-medium text-center text-green-600">
                    Code Verification Successfull
                </h3>
                <h2 className="mt-2 text-sm font-normal text-center text-gray-600">
                    Setup New Password
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        errorMessage={errors.confirmPassword?.message}
                        label="Confirm Password"
                        id="confirmPassword"
                        disabled={isLoading}
                        hintText="hint password"
                    />

                    <Button variant="primary" loading={isLoading} type="submit">
                        Update Password
                    </Button>
                </form>
            </div>
            <div className="flex flex-wrap justify-between py-2 mt-2 w-96">
                <div className="py-2 text-sm text-gray-500">
                    &copy; Copyright 2021 JRG Co., Ltd.
                </div>
            </div>
        </AuthLayout>
    );
};

export const getStaticProps = async (context) => {
    return { props: {} };
};

export default ResetPassword;
