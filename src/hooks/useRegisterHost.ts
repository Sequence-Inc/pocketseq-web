import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { REGISTER_HOST } from "src/apollo/queries/auth.queries";

type UserInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    firstNameKana: string;
    lastNameKana: string;
    confirmPassword: string;
};

type companyInput = {
    email: string;
    password: string;
    name: string;
    registrationNumber: string;
    nameKana: string;
    confirmPassword: string;
};

type RegisterHost = {
    hostType: "個人" | "法人";
    company: companyInput | undefined;
    user: UserInput | undefined;
    terms: boolean;
    privacy: boolean;
};

// form validation schema
const schema = yup.object().shape({
    hostType: yup.string().required("Host Type is required"),
    company: yup.object({
        name: yup.string().required("Name is required"),
    }),
    // name: yup.string().required("company Name is required"),
    // nameKana: yup.string().required("company Name Kana is required"),
    // email: yup.string().email("Invalid Email").required("Email is required"),
    // registrationNumber: yup.string().required("Registration Number is required"),
    // password: yup.string().required("Password is required"),
    // confirmPassword: yup
    //     .string()
    //     .oneOf([yup.ref("password"), null], "Password must match"),
});

const useRegisterHost = () => {
    const [email, setEmail] = useState("");
    const pinRef = useRef(null);
    const errorRef = useRef(null);

    const {
        register,
        reset,
        control,
        formState: { errors },
        watch,
        handleSubmit,
        setError,
    } = useForm<RegisterHost>({
        // resolver: yupResolver(schema),
        defaultValues: {
            hostType: "個人",
            terms: false,
        },
    });

    const [registerHost, { loading }] = useMutation(REGISTER_HOST, {
        onError: (error) => {
            const err: Error = { ...error.graphQLErrors[0] };
            errorRef.current?.open(err.message);
        },
        onCompleted: ({ registerHost }) => {
            if (registerHost?.action === "verify-email") {
                // login after successfull user register
                const obj = {
                    email: watch().user?.email
                        ? watch().user.email
                        : watch().company.email,
                };
                pinRef?.current.open(obj);
            }
        },
    });

    // form submit function
    const handleRegister = async (formData) => {
        const formModel = { ...formData };

        formModel.hostType =
            formData.hostType === "個人" ? "Individual" : "Corporate";
        formModel.user && delete formModel.user.confirmPassword;
        formModel.company && delete formModel.company.confirmPassword;
        delete formModel.terms;
        registerHost({ variables: { input: formModel } });
    };

    return {
        register,
        reset,
        control,
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
