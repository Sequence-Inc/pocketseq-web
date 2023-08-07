import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFieldArray, useForm, UseFieldArrayReturn } from "react-hook-form";
import {
    ADD_DEFAULT_SPACE_PRICE,
    ADD_DEFAULT_SPACE_SETTINGS,
    ADD_SPACE,
    ADD_SPACE_ADDRESS,
    GET_AVAILABLE_SPACE_TYPES,
    GET_LINES_BY_PREFECTURE,
    GET_STATIONS_BY_LINE,
    MY_SPACES,
    UPDATE_DEFAULT_SPACE_PRICE,
    UPDATE_SPACE,
    UPDATE_SPACE_ADDRESS,
    UPDATE_SPACE_SETTING,
    UPDATE_TYPES_IN_SPACE,
    GET_SPACE_BY_ID,
    REMOVE_SPACE_PHOTO,
    GET_UPLOAD_TOKEN,
    CHANGE_DEFAULT_SPACE_PHOTO,
} from "src/apollo/queries/space.queries";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";
import { queries as CancelPolicyQueires } from "src/apollo/queries/cancelPolicies";
import handleUpload from "src/utils/uploadImages";

interface IData {
    id: string;
    title: string;
    descrption: string;
}

interface IAllSpaceType {
    allSpaceTypes?: IData[];
    availableSpaceTypes?: IData[];
}

interface ISpacePricePlan {
    planTitle: string;
    hourlyPrice: number;
    dailyPrice: number;
    maintenanceFee: number;
    lastMinuteDiscount: number;
    cooldownTime: number;
}

interface INearestStations {
    stationId: number;
    via: string;
    time: number;
}

interface IFormState {
    name: string;
    maximumCapacity: number;
    numberOfSeats: number;
    spaceSize: number;
    spacePricePlan: ISpacePricePlan[];
    nearestStations: INearestStations[];
    spaceTypes: string;
    prefecture: string;
    trainLine: string | number;
    zipCode: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    subscriptionPriceEnabled?: boolean;
    subcriptionPrice?: number;
}

const defaultPriceObj = {
    planTitle: "",
    hourlyPrice: 0,
    dailyPrice: 0,
    maintenanceFee: 0,
    lastMinuteDiscount: 0,
    cooldownTime: 0,
};

const defaultStationObj = {
    stationId: 0,
    via: "",
    time: 0,
};

const defaultValues = {
    spacePricePlan: [defaultPriceObj],
    nearestStations: [defaultStationObj],
};

export const useSpacePhotos = (spaceId) => {
    const [loading, setLoading] = useState(false);
    const [addSpacePhotos] = useMutation(GET_UPLOAD_TOKEN);

    const handleAddSpacePhotos = useCallback(async (photos) => {
        const payloadPhotos = Array.from(photos)?.map((res: File) => ({
            mime: res.type,
        }));
        setLoading(true);
        const { data, errors } = await addSpacePhotos({
            variables: {
                spaceId,
                imageInputs: payloadPhotos,
            },
        });

        if (data) {
            try {
                await handleUpload(data.addSpacePhotos, photos);
                return true;
            } catch (err) {
                throw err;
            }
        }
        if (errors) {
            throw errors;
        }

        setLoading(false);
    }, []);
    const [removeSpacePhoto] = useMutation(REMOVE_SPACE_PHOTO, {
        refetchQueries: [
            {
                query: GET_SPACE_BY_ID,
                variables: { id: spaceId },
            },
        ],
    });

    const [changeDefaultSpacePhoto] = useMutation(CHANGE_DEFAULT_SPACE_PHOTO, {
        refetchQueries: [
            {
                query: GET_SPACE_BY_ID,
                variables: { id: spaceId },
            },
        ],
    });

    const handleRemovePhoto = useCallback(async (photo) => {
        setLoading(true);
        return removeSpacePhoto({
            variables: {
                photoId: photo?.id,
            },
            onCompleted: () => {
                setLoading(false);
            },
        });
    }, []);

    const handleDefault = useCallback(async (photo) => {
        setLoading(true);
        return changeDefaultSpacePhoto({
            variables: {
                photoId: photo?.id,
                spaceId,
            },
            onCompleted: () => {
                setLoading(false);
            },
        });
    }, []);

    return { handleRemovePhoto, handleAddSpacePhotos, handleDefault, loading };
};

const useAddSpace = () => {
    const {
        register,
        unregister,
        control,
        formState: { errors },
        setValue,
        watch,
        handleSubmit,
        reset,
        getValues,
    } = useForm<IFormState, IFormState>({ defaultValues });

    const { fields, prepend, remove } = useFieldArray({
        name: "spacePricePlan",
        control,
    });
    const {
        fields: stationsField,
        prepend: stationsPrepend,
        remove: stationsRemove,
    } = useFieldArray({
        name: "nearestStations",
        control,
    });

    const [mutateTrainLines, { data: trainLines }] = useLazyQuery(
        GET_LINES_BY_PREFECTURE
    );

    const [mutateStationId, { data: stationId }] =
        useLazyQuery(GET_STATIONS_BY_LINE);

    const { data: spaceTypes } = useQuery<IAllSpaceType>(
        GET_AVAILABLE_SPACE_TYPES,
        { fetchPolicy: "network-only" }
    );
    const confirmRef = useRef(null);

    const [mutate, { loading }] = useMutation(ADD_SPACE, {
        onCompleted: (data) => {
            if (data?.addSpace?.message) {
                confirmRef.current.open(data?.addSpace?.message);
            }
        },
        refetchQueries: [{ query: MY_SPACES }],
    });

    const onSubmit = handleSubmit((formData: IFormState) => {
        delete formData.prefecture;
        delete formData.trainLine;
        mutate({ variables: { input: formData } });
    });

    const getTrainLine = (trainLineId) => {
        mutateTrainLines({
            variables: { prefectureId: parseInt(trainLineId) },
        });
    };

    const getStationId = (trainLineId) => {
        mutateStationId({ variables: { lineId: trainLineId } });
    };

    return {
        spaceTypes,
        register,
        unregister,
        watch,
        control,
        setValue,
        errors,
        fields,
        prepend,
        remove,
        stationsField,
        stationsPrepend,
        stationsRemove,
        onSubmit,
        trainLines,
        getTrainLine,
        stationId,
        getStationId,
        loading,
        confirmRef,
        defaultPriceObj,
        defaultStationObj,
    };
};

export default useAddSpace;

export const useGetInitialSpace = (id) => {
    const {
        data: initialValue,
        loading: spaceDetailLoading,
        error: fetchSpaceDetailsError,
        refetch: refetchSpaceDetail,
    } = useQuery(GET_SPACE_BY_ID, {
        skip: !id,
        variables: {
            id,
        },
    });
    return {
        initialValue: initialValue?.spaceById,
        spaceDetailLoading,
        refetchSpaceDetail,
        fetchSpaceDetailsError,
    };
};

const MY_OPTIONS = gql`
    query MyOptions($hotelId: ID, $packagePlanId: ID, $spaceId: ID) {
        myOptions(
            hotelId: $hotelId
            packagePlanId: $packagePlanId
            spaceId: $spaceId
        ) {
            data {
                id
                name
                createdAt
            }
        }
    }
`;
export const useBasicSpace = (fn, selectedSpaceId) => {
    const [zipCode, setZipCode] = useState("");
    const [freeCoords, setFreeCoords] = useState<
        { lat: any; lng: any } | undefined
    >();
    const [cache, setCache] = useState({});
    const { data: prefectures } = useQuery(AVAILABLE_PREFECTURES);

    const { initialValue, spaceDetailLoading } =
        useGetInitialSpace(selectedSpaceId);

    const {
        data: options,
        loading: optionsLoading,
        error: optionsError,
    } = useQuery(MY_OPTIONS);
    const {
        data: cancelPolicies,
        loading: cancelPoliciesLoading,
        error: cancelPoliciesError,
    } = useQuery(CancelPolicyQueires.MY_CANCEL_POLICIES);

    const [mutate] = useMutation(ADD_SPACE);
    const [mutateSpaceAddress] = useMutation(ADD_SPACE_ADDRESS);
    const [mutateSpaceTypes] = useMutation(UPDATE_TYPES_IN_SPACE);
    const [mutateSpaceSettings] = useMutation(ADD_DEFAULT_SPACE_SETTINGS);
    const [mutateSpaceDefaultPrice] = useMutation(ADD_DEFAULT_SPACE_PRICE);
    // update api
    const [updateSpace] = useMutation(UPDATE_SPACE);
    const [updateSpaceAddress] = useMutation(UPDATE_SPACE_ADDRESS);
    const [updateSpaceSetting] = useMutation(UPDATE_SPACE_SETTING);
    const [updateSpaceDefaultPrice] = useMutation(UPDATE_DEFAULT_SPACE_PRICE);

    const [loading, setLoading] = useState(false);

    const {
        register,
        unregister,
        control,
        formState: { errors },
        watch,
        setValue,
        handleSubmit,
        getValues,
        reset,
    } = useForm({
        defaultValues: {
            cancelPolicyId: undefined,
            name: undefined,
            description: undefined,
            maximumCapacity: undefined,
            numberOfSeats: undefined,
            needApproval: false,
            spaceSize: undefined,
            spaceTypes: [],
            zipCode: undefined,
            prefecture: undefined,
            city: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            openingHr: 8.0,
            closingHr: 18.0,
            breakFromHr: 13,
            breakToHr: 14,
            totalStock: 1,
            businessDays: [0, 1, 2, 3, 4, 5],
            pricePlan: {
                dailyAmount: 0,
                hourlyAmount: 0,
                fiveMinuteAmount: 0,
                tenMinuteAmount: 0,
                fifteenMinuteAmount: 0,
                thirtyMinuteAmount: 0,
                fortyFiveMinuteAmount: 0,
            },
            subscriptionPriceEnabled: false,
            subcriptionPrice: 0,
        },
    });

    const watchSubscriptionPrice = watch("subscriptionPriceEnabled", false);

    useEffect(() => {
        if (!watchSubscriptionPrice) {
            reset({
                ...getValues(),
                subcriptionPrice: undefined,
            });
        }
        if (watchSubscriptionPrice) {
            register("subcriptionPrice", { required: true });
        }
    }, [watchSubscriptionPrice]);

    const {
        fields: includedOptions,
        update: updateIncludedOptionFields,
    }: UseFieldArrayReturn & { fields: any[] } = useFieldArray<any, any, any>({
        keyName: "includedOptionFieldId",
        name: "includedOptions",
        control,
    });

    const {
        fields: additionalOptions,
        update: updateAdditionalOptionFields,
    }: UseFieldArrayReturn & { fields: any[] } = useFieldArray<any, any, any>({
        keyName: "additionalOptionId",
        name: "additionalOptions",
        control,
    });

    const filterDefaultSpaceSetting = (settings) => {
        if (!settings) return null;
        return settings.filter((setting) => setting.isDefault)[0];
    };
    const filterDefaultPricePlans = (plans) => {
        let defaultPlan = {
            dailyAmount: 0,
            hourlyAmount: 0,
            fiveMinuteAmount: 0,
            tenMinuteAmount: 0,
            fifteenMinuteAmount: 0,
            thirtyMinuteAmount: 0,
            fortyFiveMinuteAmount: 0,
        };
        plans.map((plan) => {
            if (plan.isDefault === true) {
                if (plan.type === "DAILY") {
                    defaultPlan.dailyAmount = plan.amount;
                } else if (plan.type === "HOURLY") {
                    defaultPlan.hourlyAmount = plan.amount;
                } else if (plan.type === "MINUTES") {
                    if (plan.duration === 5) {
                        defaultPlan.fiveMinuteAmount = plan.amount;
                    } else if (plan.duration === 10) {
                        defaultPlan.tenMinuteAmount = plan.amount;
                    } else if (plan.duration === 15) {
                        defaultPlan.fifteenMinuteAmount = plan.amount;
                    } else if (plan.duration === 30) {
                        defaultPlan.thirtyMinuteAmount = plan.amount;
                    } else if (plan.duration === 45) {
                        defaultPlan.fortyFiveMinuteAmount = plan.amount;
                    }
                }
            }
        });
        return defaultPlan;
    };

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        try {
            // check if formData contains default price
            const {
                dailyAmount,
                hourlyAmount,
                fiveMinuteAmount,
                tenMinuteAmount,
                fifteenMinuteAmount,
                thirtyMinuteAmount,
                fortyFiveMinuteAmount,
            } = formData.pricePlan;
            if (
                dailyAmount === 0 &&
                hourlyAmount === 0 &&
                fiveMinuteAmount === 0 &&
                tenMinuteAmount === 0 &&
                fifteenMinuteAmount === 0 &&
                thirtyMinuteAmount === 0 &&
                fortyFiveMinuteAmount === 0
            ) {
                alert("料金プランを選択してください。");
                setLoading(false);
                return;
            }

            const reducedIncludecOptions = includedOptions
                ?.filter((item: any) => !!item?.isChecked)
                ?.map((option) => option.id);

            const reducedAdditionalOptions = additionalOptions
                ?.filter((item: any) => !!item?.isChecked)
                ?.map((option) => option.id);

            const basicModel = {
                name: formData.name,
                description: formData.description,
                maximumCapacity: formData.maximumCapacity,
                numberOfSeats: formData.numberOfSeats,
                spaceSize: formData.spaceSize,
                needApproval: formData.needApproval,
                includedOptions: reducedIncludecOptions,
                additionalOptions: reducedAdditionalOptions,
                cancelPolicyId: formData.cancelPolicyId,
                subcriptionPrice: formData.subcriptionPrice || undefined,
            };

            const addressModel = {
                postalCode: formData.zipCode,
                prefectureId: formData.prefecture,
                city: formData.city,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
            };

            const spaceSettingModel = {
                totalStock: formData.totalStock,
                businessDays: formData.businessDays,
                openingHr: formData.openingHr,
                closingHr: formData.closingHr,
                breakFromHr: formData.breakFromHr,
                breakToHr: formData.breakToHr,
            };

            // check if need to update
            if (initialValue) {
                // update
                const defaultSetting = filterDefaultSpaceSetting(
                    initialValue.settings
                );
                const spaceSetting = {
                    ...spaceSettingModel,
                    id: defaultSetting.id,
                };
                const updateMutations = [
                    updateSpaceAddress({
                        variables: {
                            spaceId: initialValue.id,
                            address: {
                                ...addressModel,
                                id: initialValue.address?.id,
                            },
                        },
                    }),
                    updateSpace({
                        variables: {
                            input: { ...basicModel, id: initialValue.id },
                        },
                    }),
                    mutateSpaceTypes({
                        variables: {
                            input: {
                                spaceId: initialValue.id,
                                spaceTypeIds: formData.spaceTypes.map(
                                    (item) => item.id
                                ),
                            },
                        },
                    }),
                    updateSpaceDefaultPrice({
                        variables: {
                            spaceId: initialValue.id,
                            input: formData.pricePlan,
                        },
                    }),
                    updateSpaceSetting({
                        variables: {
                            input: {
                                ...spaceSettingModel,
                                id: defaultSetting.id,
                            },
                        },
                    }),
                ];

                await Promise.all(updateMutations);
                alert("スペースを更新しました。");
            } else {
                // add new!
                const addSpacesData = await mutate({
                    variables: { input: basicModel },
                });

                await Promise.all([
                    mutateSpaceAddress({
                        variables: {
                            spaceId: addSpacesData.data.addSpace.space.id,
                            address: addressModel,
                        },
                    }),
                    mutateSpaceTypes({
                        variables: {
                            input: {
                                spaceId: addSpacesData.data.addSpace.space.id,
                                spaceTypeIds: formData.spaceTypes.map(
                                    (item) => item.id
                                ),
                            },
                        },
                    }),
                    mutateSpaceSettings({
                        variables: {
                            spaceId: addSpacesData.data.addSpace.space.id,
                            spaceSetting: spaceSettingModel,
                        },
                    }),
                    mutateSpaceDefaultPrice({
                        variables: {
                            spaceId: addSpacesData.data.addSpace.space.id,
                            input: formData.pricePlan,
                        },
                    }),
                ]);
                addSpacesData.data.addSpace.space.id &&
                    fn(addSpacesData.data.addSpace.space.id);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    });

    const handleIncludedOptionFieldChange = useCallback(
        (fieldIndex, value) => {
            const optionDetails = includedOptions[fieldIndex];

            updateIncludedOptionFields(fieldIndex, {
                ...includedOptions[fieldIndex],
                isChecked: value,
            });

            const targetAdditionalOptionIndex = additionalOptions?.findIndex(
                (item) => item.id === optionDetails.id
            );
            if (targetAdditionalOptionIndex < 0) return;

            if (value) {
                updateAdditionalOptionFields(targetAdditionalOptionIndex, {
                    ...additionalOptions[targetAdditionalOptionIndex],
                    isChecked: !value,
                });
            }
        },
        [includedOptions, additionalOptions]
    );

    const handleAdditionalOptionFieldChange = useCallback(
        (fieldIndex, value) => {
            const optionDetails = additionalOptions[fieldIndex];

            updateAdditionalOptionFields(fieldIndex, {
                ...additionalOptions[fieldIndex],
                isChecked: value,
            });
            const targetIncludedOptionIndex = includedOptions?.findIndex(
                (item) => item.id === optionDetails.id
            );
            if (targetIncludedOptionIndex < 0) return;

            if (value) {
                updateIncludedOptionFields(targetIncludedOptionIndex, {
                    ...includedOptions[targetIncludedOptionIndex],
                    isChecked: !value,
                });
            }
        },
        [additionalOptions, includedOptions]
    );

    const setInitialIncludedOptions = useCallback(() => {
        if (!options?.myOptions?.data?.length) return;

        [...options?.myOptions?.data]
            .sort((a, b) => a.createdAt - b.createdAt)
            .forEach((option, index) => {
                if (!initialValue?.includedOptions?.length) {
                    updateIncludedOptionFields(index, {
                        ...option,
                        isChecked: false,
                    });
                }
                if (initialValue?.includedOptions?.length) {
                    const initValOptionIndex =
                        initialValue?.includedOptions.findIndex(
                            (optionAttachment) =>
                                optionAttachment.id === option.id
                        );

                    if (initValOptionIndex > -1) {
                        updateIncludedOptionFields(index, {
                            ...option,
                            isChecked: true,
                        });
                    }
                    if (initValOptionIndex < 0) {
                        updateIncludedOptionFields(index, {
                            ...option,
                            isChecked: false,
                        });
                    }
                }
            });
    }, [options, initialValue?.includedOptions]);

    const setInitialAdditionalOptions = useCallback(() => {
        if (!options?.myOptions?.data?.length) return;

        [...options?.myOptions?.data]
            .sort((a, b) => a.createdAt - b.createdAt)
            .forEach((option, index) => {
                if (!initialValue?.additionalOptions?.length) {
                    updateAdditionalOptionFields(index, {
                        ...option,
                        isChecked: false,
                    });
                }
                if (initialValue?.additionalOptions?.length) {
                    const initValOptionIndex =
                        initialValue?.additionalOptions.findIndex(
                            (optionAttachment) =>
                                optionAttachment.id === option.id
                        );

                    if (initValOptionIndex > -1) {
                        updateAdditionalOptionFields(index, {
                            ...option,
                            isChecked: true,
                        });
                    }
                    if (initValOptionIndex < 0) {
                        updateAdditionalOptionFields(index, {
                            ...option,
                            isChecked: false,
                        });
                    }
                }
            });
    }, [options, initialValue?.additionalOptions]);

    useEffect(setInitialAdditionalOptions, [setInitialAdditionalOptions]);

    useEffect(setInitialIncludedOptions, [setInitialIncludedOptions]);

    useEffect(() => {
        if (initialValue) {
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            setValue("maximumCapacity", initialValue.maximumCapacity);
            setValue("numberOfSeats", initialValue.numberOfSeats);
            setValue("spaceSize", initialValue.spaceSize);
            setValue("spaceTypes", initialValue.spaceTypes);
            setValue("needApproval", initialValue.needApproval);
            setValue("zipCode", initialValue.address?.postalCode);
            setValue("prefecture", initialValue.address?.prefecture?.id);
            setValue("city", initialValue.address?.city);
            setValue("addressLine1", initialValue.address?.addressLine1);
            setValue("addressLine2", initialValue.address?.addressLine2);
            setValue("cancelPolicyId", initialValue?.cancelPolicy?.id);
            setFreeCoords({
                lat: initialValue.address?.latitude,
                lng: initialValue.address?.longitude,
            });

            if (initialValue.settings?.length > 0) {
                const defaultSetting = filterDefaultSpaceSetting(
                    initialValue.settings
                );
                if (defaultSetting) {
                    setValue("openingHr", defaultSetting.openingHr);
                    setValue("closingHr", defaultSetting.closingHr);
                    setValue("breakFromHr", defaultSetting.breakFromHr);
                    setValue("breakToHr", defaultSetting.breakToHr);
                    setValue("businessDays", defaultSetting.businessDays);
                    setValue("totalStock", defaultSetting.totalStock);
                }
            }
            if (initialValue?.subcriptionPrice) {
                setValue("subscriptionPriceEnabled", true);
                setValue("subcriptionPrice", initialValue?.subcriptionPrice);
            }
            if (initialValue.pricePlans?.length > 0) {
                setValue(
                    "pricePlan",
                    filterDefaultPricePlans(initialValue.pricePlans)
                );
            }
        }
    }, [initialValue]);

    return {
        zipCode,
        setZipCode,
        cache,
        setCache,
        freeCoords,
        setFreeCoords,
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
        loading,
        prefectures,
        getValues,
        includedOptions,
        additionalOptions,
        cancelPolicies: cancelPolicies?.myCancelPolicies?.data || [],
        handleIncludedOptionFieldChange,
        handleAdditionalOptionFieldChange,
        initialValue,
        spaceDetailLoading,
        watchSubscriptionPrice,
    };
};

export const usePriceSpace = () => {
    const {
        register,
        control,
        formState: { errors },
        watch,
        setValue,
        handleSubmit,
    } = useForm();
    const loading = false;

    const onSubmit = handleSubmit((formData) => {
        // mutate({ variables: { input: formData } })
    });

    return { register, control, errors, watch, setValue, onSubmit, loading };
};
