import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
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
    const [resendLoading, setResendLoading] = useState<boolean>(false);
    const isLoading = false;
    const [verifyEmail] = useMutation<IVerifyEmailData, IVerifyEmailVariables>(VERIFY_EMAIL, {
        onError: (err) => alert(err?.message),
        onCompleted: (data) => {
            const forgotBody = {
                email: response.email,
                code
            };
            callback(location === 'forgotPassword' ? forgotBody : response);
        }
    })

    // const { refetch } = useQuery(location !== 'forgotPassword' && RESEND_VERIFICATION_CODE, {
    //     variables: { email: response.email }
    // });

    const [verifyResetPasswordRequest] = useMutation(VERIFY_RESET_PASSWORD_REQUEST);

    const [forgotPassword] = useMutation(FORGOT_PASSWORD);

    const resendCode = async (email?) => {
        // Resend code does not work for register page
        if (location === 'forgotPassword') {
            forgotPassword({ variables: { email } })
        }
    };

    const verifyPin = (e) => {
        e.preventDefault();
        const input: IInput = {
            email: response.email,
            code
        };

        if (location === 'forgotPassword') {
            console.log("eta aayo!")
            verifyResetPasswordRequest({ variables: { input } });
        } else {
            verifyEmail({ variables: { input } });
        }
    };

    return { verifyPin, setCode, resendCode, isLoading, resendLoading };
};

export default usePinDialogContent;
