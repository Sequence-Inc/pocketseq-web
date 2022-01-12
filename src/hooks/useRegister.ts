import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from "react";
import { REGISTER_USER } from "src/apollo/queries/auth.queries";
import { Console } from "console";

// form validation schema
const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    firstNameKana: yup.string().required("First Name Kana is required"),
    lastName: yup.string().required("Last Name is required"),
    lastNameKana: yup.string().required("Last Name Kana is required"),
    email: yup.string().email("Invalid Email").required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Password must match"),
});

const useRegister = () => {
    const errorRef = useRef(null);
    const pinRef = useRef(null);

    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        control,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        onError: (error) => {
            const err: Error = { ...error.graphQLErrors[0] };
            errorRef.current?.open(err.message);
        },
        onCompleted: ({ registerUser }) => {
            // debugger;
            if (registerUser?.action === "verify-email") {
                // login after successfull user register
                const obj = { email: watch().email };
                pinRef?.current.open(obj);
            }
        },
    });

    // form submit function
    const handleRegister = async (formData) => {
        const formModel = { ...formData };
        if (!formModel.terms) {
            setError("terms", { type: "manual", message: "Need to accept" });
        } else {
            delete formModel.confirmPassword;
            delete formModel.terms;
            registerUser({ variables: { input: formModel } });
        }
    };

    return {
        register,
        errors,
        watch,
        handleRegister,
        handleSubmit,
        loading,
        pinRef,
        errorRef,
        control,
    };
};

export default useRegister;
