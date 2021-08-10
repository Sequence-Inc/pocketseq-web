import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { REGISTER_HOST } from "src/apollo/queries/auth.queries";

// form validation schema
const schema = yup.object().shape({
    name: yup.string().required("Company Name is required"),
    nameKana: yup.string().required("Company Name Kana is required"),
    email: yup.string().email("Invalid Email").required("Email is required"),
    registrationNumber: yup.string().required("Registration Number is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Password must match"),
});

const useRegisterHost = () => {
    const [email, setEmail] = useState("");
    const pinRef = useRef(null);
    const errorRef = useRef(null);

    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [registerUser, { loading }] = useMutation(REGISTER_HOST, {
        onError: (error) => {
            const err: Error = { ...error.graphQLErrors[0] }
            errorRef.current?.open(err.message)
        },
        onCompleted: ({ registerUser }) => {
            // debugger;
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
        errorRef,
    };
};

export default useRegisterHost;
