import { useEffect, useState } from 'react';
// import { useMutation } from 'react-query';
// import { axios } from '../../network/axios.instance';

const usePinDialogContent = (response, callback, location) => {
    const [code, setCode] = useState();
    const [resendLoading, setResendLoading] = useState(false);
    const isLoading = false;

    useEffect(() => location !== 'forgotPassword' && resendCode(), []);

    const resendCode = async (email) => {
        // try {
        //     console.log({ email: email || response?.email })
        //     setResendLoading(true);
        //     const res = await axios.post(location === 'forgotPassword' ? 'forgotPassword' : 'resendCode', {
        //         email: email || response?.email
        //     });
        //     console.log(res);
        // } catch (err) {
        //     console.log(err);
        // } finally {
        //     setResendLoading(false);
        // }
    };

    // const { isLoading, mutate } = useMutation(
    //     ({ url, body }) => axios.post(url, body),
    //     {
    //         onSuccess: (data) => {
    //             const forgotBody = {
    //                 email: response.email,
    //                 code
    //             };
    //             callback(location === 'forgotPassword' ? forgotBody : data);
    //         }
    //     }
    // );

    const verifyPin = (e) => {
        e.preventDefault();
        const body = {
            email: response.email,
            code
        };
        const url =
            location === 'forgotPassword'
                ? 'verifyPasswordReset'
                : 'verifyEmail';
        // mutate({ url, body });
    };

    return { verifyPin, setCode, resendCode, isLoading, resendLoading };
};

export default usePinDialogContent;
