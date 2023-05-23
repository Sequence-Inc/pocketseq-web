import { useRouter } from "next/router";
import React from "react";

const Checkout = () => {
    const { query } = useRouter();
    return (
        <div>
            <div>{JSON.stringify(query)}</div>
        </div>
    );
};

export default Checkout;
