import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { REGISTER_USER } from "src/apollo/queries/auth.queries";
import useLogin from "./useLogin";

// form validation schema
const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Password must match"),
});

const useRegister = () => {
    const [email, setEmail] = useState("");
    const pinRef = useRef(null);

    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        onError: (error) => console.log(error),
        onCompleted: ({ registerUser }) => {
            debugger;
            if (registerUser?.action === "verify-email") {
                // login after successfull user register
                const obj = { email: watch().email };
                pinRef?.current.open(obj);
            }
        }
    });

    // form submit function
    const handleRegister = async (formData) => {
        const formModel = { ...formData };
        delete formModel.confirmPassword
        registerUser({ variables: { input: formModel } });
    };

    return {
        register,
        errors,
        watch,
        handleRegister,
        handleSubmit,
        loading,
        email,
        pinRef,
        getValues,
    };
};

export default useRegister;
