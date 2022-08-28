import { useMutation } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useState } from "react";
import { mutations as SubscriptionMutation } from "src/apollo/queries/subscription";

type CreateSubscriptionProps = {
    onCompleted?: Function;
    onError?: Function;
};

const noOp = (data) => data;

const useCreateSubscriptions = (props: CreateSubscriptionProps) => {
    const { onCompleted = noOp, onError = noOp } = props;
    const [creatingSubscription, setCreatingSubscription] =
        useState<boolean>(false);

    const { addAlert } = useToast();

    const [createSubscription] = useMutation(
        SubscriptionMutation.CREATE_SUBSCRIPTION,
        {
            onCompleted: (data) => {
                setCreatingSubscription(false);

                addAlert({
                    type: "success",
                    message: "Successfully created subscription",
                });

                onCompleted(data);
            },
            onError: (err) => {
                setCreatingSubscription(false);

                addAlert({
                    type: "error",
                    message: "Could not create subscription",
                });

                onError(err);
            },
        }
    );

    const onSubmit = useCallback(async (priceId) => {
        setCreatingSubscription(true);

        return createSubscription({
            variables: {
                priceId,
            },
        });
    }, []);

    return {
        creatingSubscription,
        onSubmit,
    };
};

export default useCreateSubscriptions;
