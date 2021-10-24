import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import { LOGIN } from "src/apollo/queries/auth.queries";
import { storeSession, storeProfile } from "src/utils/auth";
import { currentSession, isLoggedIn, profile } from "src/apollo/cache";

type Error = {
    message: string;
    action?: string;
    code?: string;
    info?: any;
};

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
    } = useForm({ resolver: yupResolver(schema) });
    const router = useRouter();
    const pinRef = useRef(null);
    const errorRef = useRef(null);
    const [login, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            isLoggedIn(true);
            currentSession(data.login);
            profile(data.login.profile);
            const newData = { ...data.login };
            delete newData.profile;
            storeSession(newData);
            storeProfile(data.login.profile);
            location.href = "/";
        },
        onError: (err) => {
            const error: Error = { ...err.graphQLErrors[0] };
            if (error?.action === "verify-email") {
                pinRef?.current.open(watch());
            } else {
                errorRef.current?.open(error.message);
            }
        },
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
        errorRef,
    };
};

export default useLogin;
