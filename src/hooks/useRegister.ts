import { useForm } from 'react-hook-form';
// import { useMutation } from "react-query";
// import { axios } from '../../app/network/axios.instance';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';

// form validation schema
const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
        .string()
        .email("Invalid Email")
        .required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], "Password must match")
});

const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const pinRef = useRef();

    const { register, formState: { errors }, watch, handleSubmit, getValues } = useForm({
        resolver: yupResolver(schema)
    });

    // form submit function
    const handleRegister = async (formData) => {
        // setIsLoading(true);
        // setEmail(getValues('email'));
        // delete formData.confirmPassword;
        // try {
        //     const { data } = await axios.post('register', formData);
        //     if (data.data.result) {
        //         // login after successfull user register 
        //         const obj = { email: formData.email };
        //         pinRef.current.open(obj);
        //         // handleLogin({ email: formData.email, password: formData.password })
        //     }
        // } catch (err) {
        //     console.log('err_____', err);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleLogin = async () => {
        // const body = {
        //     email: watch().email,
        //     password: watch().password
        // };
        // const loginResponse = await axios.post('login', body);
        // console.log('loginResponse______', loginResponse);
        // setCookie(null, 'token', 'value', {
        //     maxAge: 30 * 24 * 60 * 60,
        //     path: '/'
        // });
        // router.replace('/dashboard/courses');
    };

    return {
        register,
        errors,
        watch,
        handleRegister,
        handleLogin,
        handleSubmit,
        isLoading,
        email,
        pinRef
    };
};

export default useRegister;
