import { useRouter } from 'next/router'
import React from 'react'
import { isAuthenticated } from './auth';

const withAuth = (WrapperComponent) => {
    return (props) => {
        if (typeof window !== 'undefined') {
            const router = useRouter();

            if (!isAuthenticated()) {
                router.replace('/');
                return null;
            }

            return <WrapperComponent {...props} />
        }

        return null;
    }
}

export default withAuth;
