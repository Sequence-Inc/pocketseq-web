import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from '@apollo/client';
import { LOGIN } from "src/apollo/queries/auth.queries";
import { storeSession } from "src/utils/auth";

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
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });
    const [errorModal, setErrorModal] = useState<string>();
    const router = useRouter();
    const pinRef = useRef(null);
    const errorRef = useRef(null);
    const [login, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            storeSession(data.login);
            router.replace('/');
        },
        onError: (err) => {
            const error: Error = { ...err.graphQLErrors[0] }
            console.log(err, error)
            if (error?.action === "verify-email") {
                pinRef?.current.open(watch());
            } else {
                setErrorModal(error.message)
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
        errorModal,
        setErrorModal,
        errorRef
    };
};

export default useLogin;
