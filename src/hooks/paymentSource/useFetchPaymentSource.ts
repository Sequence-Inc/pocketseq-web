import { useQuery } from "@apollo/client";
import { GET_PAYMENT_SOURCES } from "src/apollo/queries/user.queries";

const useFetchPaymentSources = () => {
    const { data, loading, error } = useQuery(GET_PAYMENT_SOURCES);

    return {
        paymentSource: data?.paymentSource,
        loadingPaymentSources: loading,
        paymentSourcefetchError: error,
    };
};

export default useFetchPaymentSources;
