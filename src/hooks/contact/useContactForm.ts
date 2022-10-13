import { useMutation } from "@apollo/client";
import { Console } from "console";
import React from "react";
import { useForm } from "react-hook-form";
import { CONTACT_FORM } from "src/apollo/queries/contact.queries";

type ContactFormDataType = {
    customerType:
        | "ー"
        | "未登録の方はこちら"
        | "ホスト（スペース・宿泊施設を貸す方）はこちら"
        | "ゲスト（スペース・宿泊施設を借りる方）はこちら";
    email: string;
    inquiryType: string;
    subject: string;
    description: string;
};
const defaultValue: ContactFormDataType = {
    customerType: "ー",
    email: "",
    inquiryType: "",
    subject: "",
    description: "",
};
const useContactForm = ({
    onSuccess,
    onError,
}: {
    onSuccess?: Function;
    onError?: Function;
}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const {
        register,
        unregister,
        control,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
    } = useForm();
    const [mutate] = useMutation(CONTACT_FORM, {
        onCompleted: (data) => {
            onSuccess && onSuccess(data);
            setLoading(false);
        },
        onError: (err) => {
            console.log({ err });
            onError && onError();
            setLoading(false);
        },
    });
    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        const { customerType, email, inquiryType, subject, description } =
            formData;

        return mutate({
            variables: {
                customerType: customerType || "ー",
                email,
                inquiryType,
                subject,
                description,
            },
        });
    });

    return {
        loading,
        errors,
        dirtyFields,
        register,
        unregister,
        control,
        watch,
        setValue,
        handleSubmit,
        onSubmit,
        getValues,
    };
};

export default useContactForm;
