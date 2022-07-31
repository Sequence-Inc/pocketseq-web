import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import useReduceObject from "@hooks/useFilterObject";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
    mutations as OptionMutation,
    OPTION_SCHEMAS,
    queries as OptionQueires,
} from "src/apollo/queries/options";
import handleUpload from "src/utils/uploadImages";

const ADD_OPTIONS_KEYS = [
    "name",
    "description",
    "startUsage",
    "endUsage",
    "startReservation",
    "endReservation",
    "cutOffBeforeDays",
    "cutOffTillTime",
    "paymentTerm",
    "additionalPrice",
    "photos",
];

const UPDATE_OPTIONS_KEYS = [
    "name",
    "description",
    "startUsage",
    "endUsage",
    "startReservation",
    "endReservation",
    "cutOffBeforeDays",
    "cutOffTillTime",
    "paymentTerm",
    "additionalPrice",
];

const noOp = (data) => data;

type TUseOptionsProps = {
    onCreateSuccess?: any;
    onCreateError?: any;
    initialValue?: any;
};

const useOptions = ({
    onCreateSuccess = noOp,
    onCreateError = noOp,
    initialValue,
}: TUseOptionsProps) => {
    const [loading, setLoading] = useState(false);
    const { addAlert } = useToast();
    const {
        register,
        unregister,
        control,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
        reset,
    } = useForm();

    const [createNewOptions] = useMutation(OptionMutation.ADD_OPTIONS, {
        refetchQueries: [
            {
                query: OptionQueires.MY_OPTIONS,
            },
        ],
        onCompleted: (data) => {
            onCreateSuccess(data);
        },
        onError: (err) => {
            onCreateError(err);
            setLoading(false);
        },
    });
    const [updateOption] = useMutation(OptionMutation.UPDATE_OPTIONS, {
        refetchQueries: [
            {
                query: OptionQueires.OPTION_BY_ID,
                variables: {
                    id: initialValue?.id,
                },
                fetchPolicy: "network-only",
            },
        ],
        onCompleted: (data) => {
            addAlert({
                type: "success",
                message: "Updated options successfully",
            });
            setLoading(false);
        },
        onError: (err) => {
            addAlert({ type: "error", message: "Could not update options" });

            setLoading(false);
        },
    });

    const [removeOption] = useMutation(OptionMutation.REMOVE_OPTIONS, {
        refetchQueries: [
            {
                query: OptionQueires.MY_OPTIONS,
            },
        ],
        onCompleted: (data) => {
            setLoading(false);
            addAlert({
                type: "success",
                message: "Removed option successfully.",
            });
            onCreateSuccess(data);
        },
        onError: (err) => {
            addAlert({ type: "error", message: "Could not remove option." });

            setLoading(false);
        },
    });

    const [addPhotosToOption] = useMutation(OptionMutation.ADD_OPTION_PHOTOS);
    const [removeOptionsPhotos] = useMutation(
        OptionMutation.REMOVE_OPTIONS_PHOTO,
        {
            refetchQueries: [
                {
                    query: OptionQueires.OPTION_BY_ID,
                    variables: {
                        id: initialValue?.id,
                    },
                },
            ],
            onCompleted: () =>
                addAlert({ type: "success", message: "Removed photo " }),
            onError: () =>
                addAlert({
                    type: "error",
                    message: "Could not removed photo ",
                }),
        }
    );

    const watchShowUsage = watch("usagePeriod", false);
    const watchShowReservation = watch("reservationPeriod", false);
    const watchShowCutOff = watch("cutOffPeriod", false);
    const watchAdditionalPrice = watch("additionalPriceAllowed", false);

    useEffect(() => {
        if (!watchShowUsage) {
            reset({
                ...getValues(),
                startUsage: undefined,
                endUsage: undefined,
            });
            unregister(["startUsage", "endUsage"]);
        }
        if (watchShowUsage) {
            register("startUsage", { required: true });

            register("endUsage", { required: true });
        }
    }, [watchShowUsage]);

    useEffect(() => {
        if (!watchAdditionalPrice) {
            reset({
                ...getValues(),
                additionalPrice: undefined,
                paymentTerm: undefined,
            });
            unregister(["additionalPrice", "paymentTerm"]);
        }
        if (watchAdditionalPrice) {
            register("additionalPrice", { required: true });
            register("paymentTerm", { required: true });
        }
    }, [watchAdditionalPrice]);

    useEffect(() => {
        if (!watchShowReservation) {
            reset({
                ...getValues(),
                startReservation: undefined,
                endReservation: undefined,
            });
            unregister(["startReservation", "endReservation"]);
        }
        if (watchShowReservation) {
            register("startReservation", { required: true });
            register("endReservation", { required: true });
        }
    }, [watchShowReservation]);

    useEffect(() => {
        if (!watchShowCutOff) {
            reset({
                ...getValues(),
                cutOffBeforeDays: undefined,
                cutOffTillTime: undefined,
            });
            unregister(["cutOffBeforeDays", "cutOffTillTime"]);
        }
        if (watchShowCutOff) {
            register("cutOffBeforeDays", { required: true });
            register("cutOffTillTime", { required: true });
        }
    }, [watchShowCutOff]);

    useEffect(() => {
        if (initialValue) {
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            setValue("photos", initialValue?.photos);

            // for additional options
            if (initialValue?.paymentTerm || initialValue?.additionalPrice) {
                setValue("additionalPriceAllowed", true);
                setValue("additionalPrice", initialValue?.additionalPrice);
                setValue("paymentTerm", initialValue?.paymentTerm);
            }

            // for usage period
            if (initialValue?.startUsage || initialValue?.endUsage) {
                setValue("usagePeriod", true);
                setValue("startUsage", initialValue?.startUsage);
                setValue("endUsage", initialValue?.endUsage);
            }

            // for reservation period
            if (
                initialValue?.startReservation ||
                initialValue?.endReservation
            ) {
                setValue("reservationPeriod", true);
                setValue("startReservation", initialValue?.startReservation);
                setValue("endReservation", initialValue?.endReservation);
            }

            // for cutOffPeriod

            if (
                initialValue?.cutOffBeforeDays ||
                initialValue?.cutOffTillTime
            ) {
                setValue("cutOffPeriod", true);
                setValue("cutOffBeforeDays", initialValue?.cutOffBeforeDays);
                setValue("cutOffTillTime", initialValue?.cutOffTillTime);
            }
        }
    }, [initialValue]);

    const onAddOptionsPhotos = useCallback(
        async (photos) => {
            if (!initialValue) return;
            const payloadPhotos = Array.from(photos)?.map((res: File) => ({
                mime: res.type,
            }));
            const { data, errors } = await addPhotosToOption({
                variables: {
                    optionId: initialValue?.id,
                    photos: payloadPhotos,
                },
            });

            if (data) {
                try {
                    await handleUpload(data.addOptionPhotos.uploadRes, photos);
                    return true;
                } catch (err) {
                    throw err;
                }
            }
            if (errors) {
                throw errors;
            }
        },
        [initialValue]
    );

    const onRemoveOptionPhotos = useCallback(async (photo) => {
        await removeOptionsPhotos({
            variables: {
                photoId: photo?.id,
            },
        });
    }, []);

    const onCreateNew = useCallback(async (formData) => {
        const payload: any = useReduceObject(formData, ADD_OPTIONS_KEYS);
        const payloadPhotos = payload?.photos.map((res) => ({
            mime: res.type,
        }));
        const { data } = await createNewOptions({
            variables: {
                input: { ...payload, photos: payloadPhotos },
            },
        });

        if (data) {
            try {
                await handleUpload(data.addOption.uploadRes, formData.photos);
            } catch (err) {
                console.log(err);
            }
        }

        setLoading(false);
    }, []);

    const onUpdate = useCallback(
        async (formData) => {
            if (initialValue) {
                console.log({ formData });
                const payload = {
                    id: initialValue?.id,
                    name: formData.name || null,
                    description: formData.description || null,
                    startUsage: formData.startUsage || null,
                    endUsage: formData.endUsage || null,
                    startReservation: formData.startReservation || null,
                    endReservation: formData.endReservation || null,
                    cutOffBeforeDays: formData.cutOffBeforeDays || null,
                    cutOffTillTime: formData.cutOffTillTime || null,
                    paymentTerm: formData.paymentTerm || null,
                    additionalPrice: formData.additionalPrice || null,
                };
            
                // let filteredPayload = useReduceObject(
                //     payload,
                //     UPDATE_OPTIONS_KEYS
                // );

                // filteredPayload = {
                //     id: initialValue?.id,
                //     ...filteredPayload,
                // };
                return updateOption({
                    variables: {
                        input: payload,
                    },
                });
            }
        },
        [initialValue]
    );

    const onSubmit = handleSubmit((formData) => {
        setLoading(true);

        if (!initialValue) {
            return onCreateNew(formData);
        }
        if (initialValue) {
            return onUpdate(formData);
        }
    });

    const onRemove = useCallback(() => {
        if (initialValue) {
            setLoading(true);
            return removeOption({
                variables: {
                    id: initialValue?.id,
                },
            });
        }
    }, [initialValue]);

    return {
        loading,
        register,
        unregister,
        control,
        errors,
        dirtyFields,
        watch,
        setValue,
        handleSubmit,
        getValues,
        onSubmit,
        onAddOptionsPhotos,
        onRemoveOptionPhotos,
        onRemove,
        watchShowUsage,
        watchShowReservation,
        watchShowCutOff,
        watchAdditionalPrice,
    };
};

export default useOptions;
