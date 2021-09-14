import { useRouter } from 'next/router'
import React from 'react'

const Checkout = () => {
    const { query } = useRouter();
    return (
        <div>
            <p>{JSON.stringify(query)}</p>
        </div>
    )
}

export default Checkout;
