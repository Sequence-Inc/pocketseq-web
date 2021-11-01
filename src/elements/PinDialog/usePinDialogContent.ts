import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FORGOT_PASSWORD, RESEND_VERIFICATION_CODE, VERIFY_EMAIL, VERIFY_RESET_PASSWORD_REQUEST } from 'src/apollo/queries/auth.queries';

interface IVerifyEmailData {
    message: string;
    action: string;
}

interface IInput {
    email: string;
    code: number;
}

interface IVerifyEmailVariables {
    input: IInput
}

const usePinDialogContent = (response, callback, location) => {
    const [code, setCode] = useState<number | null>(null);
    const [verifyEmail, { loading: verifyLoading }] = useMutation<IVerifyEmailData, IVerifyEmailVariables>(VERIFY_EMAIL, {
        onError: (err) => alert(err?.message),
        onCompleted: (data) => {
            const forgotBody = {
                email: response.email,
                code
            };
            callback(location === 'forgotPassword' ? forgotBody : response);
        }
    })

    const [refetch, { loading: refetchLoading }] = useLazyQuery(RESEND_VERIFICATION_CODE);

    const [verifyResetPasswordRequest, { loading: resetLoading }] = useMutation(VERIFY_RESET_PASSWORD_REQUEST, {
        onError: (err) => alert(err?.message),
        onCompleted: (data) => {
            const forgotBody = {
                email: response.email,
                code
            };
            callback(forgotBody);
        }
    });

    const [forgotPassword] = useMutation(FORGOT_PASSWORD);

    useEffect(() => {
        location === 'login' && refetch({ variables: { email: response.email } });
    }, [])

    const resendCode = async (email?) => {
        if (location === 'forgotPassword') {
            forgotPassword({ variables: { email: email || response.email } })
        } else {
            refetch({ variables: { email: email || response.email } })
        }
    };

    const verifyPin = (e) => {
        e.preventDefault();
        const input: IInput = {
            email: response.email,
            code
        };
        if (location === 'forgotPassword') {
            verifyResetPasswordRequest({ variables: { input } });
        } else {
            verifyEmail({ variables: { input } });
        }
    };

    return { verifyPin, setCode, resendCode, resetLoading, refetchLoading, verifyLoading };
};

export default usePinDialogContent;
