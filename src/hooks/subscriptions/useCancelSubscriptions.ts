import { useMutation } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useState } from "react";
import { mutations as SubscriptionMutation } from "src/apollo/queries/subscription";

type CancelSubscriptionProps = {
    onCompleted?: Function;
    onError?: Function;
};

const noOp = (data) => data;

const useCreateSubscriptions = (props: CancelSubscriptionProps) => {
    const { onCompleted = noOp, onError = noOp } = props;
    const [cancelingSubscription, setCancelingSubscription] =
        useState<boolean>(false);

    const { addAlert } = useToast();

    const [cancelSubscription] = useMutation(
        SubscriptionMutation.CANCEL_SUBSCRIPTION,
        {
            onCompleted: (data) => {
                setCancelingSubscription(false);

                addAlert({
                    type: "success",
                    message: "Successfully created subscription",
                });

                onCompleted(data);
            },
            onError: (err) => {
                setCancelingSubscription(false);

                addAlert({
                    type: "error",
                    message: "Could not create subscription",
                });

                onError(err);
            },
        }
    );

    const onSubmit = useCallback(async (id) => {
        setCancelingSubscription(true);

        return cancelSubscription({
            variables: {
                id,
            },
        });
    }, []);

    return {
        cancelingSubscription,
        onSubmit,
    };
};

export default useCreateSubscriptions;
