import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from '@apollo/client';
import { LOGIN } from "src/apollo/queries/auth.queries";
import { setCookie } from "nookies";

type Error = {
    message: string,
    action?: string,
    code?: string,
    info?: any
}

// form validation schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const useLogin = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        getValues,
    } = useForm({ resolver: yupResolver(schema) });
    const router = useRouter();
    const pinRef = useRef(null);
    const [login, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            console.log(data)
            // setCookie(null, 'session', `Bearer ${data.data.data.token}`, {
            //     maxAge: 30 * 24 * 60 * 60,
            //     path: '/',
            // });
            // router.replace('/');
        },
        onError: ({ graphQLErrors }) => {
            const error: Error = { ...graphQLErrors[0] }
            if (error?.action === "verify-email") {
                pinRef?.current.open(watch());
            }
        }
    });

    const handleLogin = (formData) => {
        login({ variables: { input: formData } });
    };

    return {
        register,
        errors,
        watch,
        handleLogin,
        handleSubmit,
        loading,
        pinRef,
        getValues,
    };
};

export default useLogin;
