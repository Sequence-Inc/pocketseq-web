import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";

import { Plans, Room } from "src/apollo/queries/hotel";
import { queries as OptionQueires } from "src/apollo/queries/options";

import handleUpload from "src/utils/uploadImages";
import { DAY_OF_WEEK } from "src/config";

import {
    useFieldArray,
    useForm,
    UseFieldArrayReturn,
    FieldArrayWithId,
} from "react-hook-form";
import useReduceObject from "@hooks/useFilterObject";

type AddPlansProps = {
    hotelId: string;
    addAlert: any;
    initialValue?: any;
    onCompleted?: any;
};
type PRICE_SETTINGS = {
    dayOfWeek: string;
    priceSchemeId?: string;
};
interface IFields extends FieldArrayWithId {
    hotelRoomId: string;
    priceSettings: PRICE_SETTINGS[];
}
const { queries: planQueries, mutations: planMutations } = Plans;
const { queries: roomQueries } = Room;

const MY_ROOMS_BY_HOTEL_ID = gql`
    query HotelRoomsByHotelId($hotelId: ID!) {
        myHotelRooms(hotelId: $hotelId) {
            id
            name
        }
    }
`;

const ADD_PLAN_INPUT_KEYS = [
    "name",
    "description",
    "paymentTerm",
    "stock",
    "startUsage",
    "endUsage",
    "startReservation",
    "endReservation",
    "cutOffBeforeDays",
    "cutOffTillTime",
    "roomTypes",
    "photos",
    "options",
];
const UPDATE_PLAN_KEYS = [
    "id",
    "name",
    "description",
    "paymentTerm",
    "stock",
    "startUsage",
    "endUsage",
    "startReservation",
    "endReservation",
    "cutOffBeforeDays",
    "cutOffTillTime",
];

const useAddPlans = (props: AddPlansProps) => {
    const { hotelId, addAlert, initialValue = null, onCompleted } = props;
    const [loading, setLoading] = useState(false);
    const {
        data: hotelRooms,
        refetch: refetchRooms,
        error: fetchRoomErrors,
    } = useQuery(MY_ROOMS_BY_HOTEL_ID, {
        variables: {
            hotelId,
        },
        skip: !hotelId,
    });

    const {
        data: options,
        loading: optionsLoading,
        error: optionsError,
    } = useQuery(OptionQueires.MY_OPTIONS);

    const {
        register,
        unregister,
        control,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
        trigger,
        setError,
        reset,
        clearErrors,
    } = useForm();

    const {
        fields,
        append,
        remove,
        update,
    }: UseFieldArrayReturn & { fields: any[] } = useFieldArray<any, any, any>({
        keyName: "rommTypesFieldId",
        name: "roomTypes",
        control,
    });

    const {
        fields: optionFields,
        append: appendOptionFields,
        update: updateOptionFields,
    }: UseFieldArrayReturn & { fields: any[] } = useFieldArray<any, any, any>({
        keyName: "optionFieldId",
        name: "optionFields",
        control,
    });

    const handleOptionFieldChange = useCallback(
        (fieldIndex, value) => {
            updateOptionFields(fieldIndex, {
                ...optionFields[fieldIndex],
                isChecked: value,
            });
        },
        [optionFields]
    );

    const handleRoomFieldUpdate = useCallback(
        (fieldIndex, priceIndex, value) => {
            let { priceSettings } = fields[fieldIndex];

            priceSettings = priceSettings?.map((setting, index) => {
                if (index === priceIndex) {
                    return {
                        ...setting,
                        priceSchemeId: value,
                    };
                }
                return setting;
            });

            clearErrors("roomTypes");

            update(fieldIndex, {
                ...fields[fieldIndex],
                priceSettings,
            });
        },
        [fields]
    );

    const handleRoomTypesChange = useCallback(
        (hotelRoomId, checked) => {
            const fieldIndex = fields?.findIndex(
                (item: IFields) => item?.hotelRoomId === hotelRoomId
            );
            if (fieldIndex > -1 && !checked) {
                remove(fieldIndex);
                clearErrors("roomTypes");
            }
            if (fieldIndex > 1 && checked) {
                update(fieldIndex, {
                    isSelected: true,

                    hotelRoomId,
                    priceSettings: DAY_OF_WEEK.map((day) => ({
                        dayOfWeek: day.value,
                        priceSchemeId: null,
                    })),
                });
                clearErrors("roomTypes");
            }
            if (fieldIndex < 0 && checked) {
                append({
                    isSelected: true,
                    hotelRoomId,
                    priceSettings: DAY_OF_WEEK.map((day) => ({
                        dayOfWeek: day.value,
                        priceSchemeId: null,
                    })),
                });

                clearErrors("roomTypes");
            }
        },
        [fields]
    );
    const watchShowUsage = watch("usagePeriod", false);
    const watchShowReservation = watch("reservationPeriod", false);
    const watchShowCutOff = watch("cutOffPeriod", false);

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
            setValue("paymentTerm", initialValue.paymentTerm);
            setValue("stock", initialValue.stock);
            if (initialValue?.startUsage || initialValue?.endUsage) {
                setValue("usagePeriod", true);
            }

            setValue("startUsage", initialValue?.startUsage);
            setValue("endUsage", initialValue?.endUsage);
            setValue("startReservation", initialValue?.startReservation);
            setValue("endReservation", initialValue?.endReservation);
            setValue("photos", initialValue?.photos);

            if (
                initialValue?.startReservation ||
                initialValue?.endReservation
            ) {
                setValue("reservationPeriod", true);
            }
            setValue("cutOffBeforeDays", initialValue?.cutOffBeforeDays);
            setValue("cutOffTillTime", initialValue?.cutOffTillTime);

            if (
                initialValue?.cutOffBeforeDays ||
                initialValue?.cutOffTillTime
            ) {
                setValue("cutOffPeriod", true);
            }
        }
    }, [initialValue]);

    useEffect(() => {
        if (
            !hotelRooms?.myHotelRooms?.length ||
            !initialValue?.roomTypes?.length
        ) {
            return;
        }

        hotelRooms?.myHotelRooms?.forEach((room, index) => {
            const initValRoomIndex = initialValue.roomTypes.findIndex(
                (roomType) => room.id === roomType.hotelRoom.id
            );

            if (initValRoomIndex !== -1) {
                const roomType = initialValue.roomTypes[initValRoomIndex];

                update(index, {
                    roomPlanId: roomType.id,
                    isSelected: true,
                    hotelRoomId: room.id,
                    priceSettings: [...roomType?.priceSettings]
                        ?.sort((a, b) => {
                            return a.dayOfWeek - b.dayOfWeek;
                        })
                        ?.map((setting) => ({
                            dayOfWeek: setting.dayOfWeek,
                            priceSchemeId: setting.priceScheme.id,
                            ...setting,
                        })),
                });
            }
        });
    }, [hotelRooms, initialValue?.roomTypes]);

    useEffect(() => {
        if (!options?.myOptions?.length) return;

        [...options?.myOptions]
            .sort((a, b) => a.createdAt - b.createdAt)
            .forEach((option, index) => {
                const initValOptionIndex =
                    initialValue.optionsAttachments.findIndex(
                        (optionAttachment) => optionAttachment.id === option.id
                    );
                if (initValOptionIndex !== -1) {
                    updateOptionFields(index, {
                        ...option,
                        isChecked: true,
                    });
                }
                if (initValOptionIndex == -1) {
                    updateOptionFields(index, {
                        ...option,
                        isChecked: false,
                    });
                }
            });
        // options?.myOptions
    }, [options, initialValue?.optionsAttachments]);

    const [mutate] = useMutation(planMutations.ADD_HOTEL_PACKAGE_PLANS, {
        refetchQueries: [
            {
                query: planQueries.PACKAGE_PLAN_BY_HOTEL,
                variables: {
                    hotelId,
                },
            },
        ],
        onCompleted: () => {
            onCompleted && onCompleted();
        },
    });

    const [updatePackagePlanGeneral] = useMutation(
        planMutations.UPDATE_PACKAGE_PLAN,
        {
            refetchQueries: [
                {
                    query: planQueries.PACKAGE_PLAN_BY_ID,
                    variables: {
                        id: initialValue?.id,
                    },
                },
            ],
        }
    );

    const [updateRoomTypePackagePlan] = useMutation(
        planMutations.UPDATE_ROOM_TYPE_PACKAGE_PLAN,
        {
            refetchQueries: [
                {
                    query: planQueries.PACKAGE_PLAN_BY_ID,
                    variables: {
                        id: initialValue?.id,
                    },
                },
            ],
            onCompleted: () => {
                addAlert({
                    type: "success",
                    message: "Updated Room Type Plan",
                });
            },
            onError: () =>
                addAlert({
                    type: "error",
                    message: "Could not update room type plan",
                }),
        }
    );

    const [removePackagePhotos] = useMutation(
        planMutations.REMOVE_PAKCAGE_PLAN_PHOTO,
        {
            refetchQueries: [
                {
                    query: planQueries.PACKAGE_PLAN_BY_ID,
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

    const onRemovePackagePhotos = useCallback(async (photo) => {
        await removePackagePhotos({
            variables: {
                photoId: photo?.id,
            },
        });
    }, []);

    const [addPackagePhotos] = useMutation(
        planMutations.ADD_PACKAGE_PLAN_PHOTOS
    );

    const onAddHotelRoomPhotos = useCallback(
        async (photos) => {
            if (!initialValue) return;
            const payloadPhotos = Array.from(photos)?.map((res: File) => ({
                mime: res.type,
            }));
            const { data, errors } = await addPackagePhotos({
                variables: {
                    packagePlanId: initialValue?.id,
                    photos: payloadPhotos,
                },
            });

            if (data) {
                try {
                    await handleUpload(
                        data.addPackagePlanPhotos.uploadRes,
                        photos
                    );
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

    const onCreate = useCallback(
        async (formData) => {
            const reducedFormData: any = useReduceObject(
                formData,
                ADD_PLAN_INPUT_KEYS
            );

            const { roomTypes } = reducedFormData;

            if (!roomTypes?.length) {
                setError(
                    "roomTypes",
                    {
                        type: "custom",
                        message: "Must Select at least one room type",
                    },
                    { shouldFocus: true }
                );
                return;
            }

            const reducedOptions = optionFields
                ?.filter((item: any) => !!item?.isChecked)
                ?.map((option) => option.id);

            const reducedRoomTypes = roomTypes.map((room) => {
                const { priceSettings, hotelRoomId } = room;

                const checkAllPricingExists = priceSettings.every(
                    (element) => element.priceSchemeId != null
                );
                if (checkAllPricingExists) {
                    return {
                        hotelRoomId,
                        priceSettings,
                    };
                }
            });

            if (reducedRoomTypes.includes(undefined)) {
                setError(
                    "roomTypes",
                    {
                        type: "custom",
                        message: "Must add setting for all days of the week",
                    },
                    { shouldFocus: true }
                );
                return;
            }
            const payloadPhotos = formData.photos.map((res) => ({
                mime: res.type,
            }));

            const payload = {
                ...reducedFormData,
                roomTypes: reducedRoomTypes,
                photos: payloadPhotos,
                stock: parseInt(reducedFormData.stock, 10),
                options: reducedOptions,
            };

            setLoading(true);

            const { data, errors } = await mutate({
                variables: { hotelId, input: payload },
            });

            if (errors) {
                console.log("Errors", errors);
                addAlert({
                    type: "error",
                    message: "Could not add plan. Please try again later!!!",
                });
                setLoading(false);
                return;
            }

            if (data) {
                try {
                    addAlert({
                        type: "success",
                        message: "Plan added successfully",
                    });

                    await handleUpload(
                        data.addPackagePlan.uploadRes,
                        formData.photos
                    );
                    setLoading(false);

                    addAlert({
                        type: "success",
                        message: "Uploaded Photos for plan",
                    });
                } catch (err) {
                    addAlert({
                        type: "error",
                        message: "Could not upload photos for plan",
                    });
                }
            }
        },
        [optionFields]
    );

    const onUpdate = useCallback(
        async (formData) => {
            const reducedFormData: any = useReduceObject(
                formData,
                UPDATE_PLAN_KEYS
            );
            const reducedOptions = optionFields
                ?.filter((item: any) => !!item?.isChecked)
                ?.map((option) => option.id);

            const payload = {
                id: initialValue.id,
                startUsage: formData?.startUsage || null,
                endUsage: formData?.endUsage || null,
                startReservation: formData?.startReservation || null,
                endReservation: formData?.endReservation || null,
                cutOffBeforeDays: formData?.cutOffBeforeDays || null,
                cutOffTillTime: formData?.cutOffTillTime || null,
                options: reducedOptions,
                ...reducedFormData,
            };

            setLoading(true);
            const { data, errors } = await updatePackagePlanGeneral({
                variables: { input: payload },
            });

            if (data) {
                addAlert({
                    type: "success",
                    message: "Succesfully updated plan",
                });
            }
            if (errors) {
                addAlert({ type: "error", message: "Could not update plan" });
            }

            setLoading(false);
        },
        [initialValue, fields, optionFields]
    );

    const updateRoomPlan = useCallback(
        async (fieldIndex) => {
            const { priceSettings, ...rest } = fields[fieldIndex];

            const validateRoomTypes = priceSettings.every(
                (element) => element.priceSchemeId != null
            );
            if (!validateRoomTypes) {
                setError(
                    "roomTypes",
                    {
                        type: "custom",
                        message: "Must add setting for all days of the week",
                    },
                    { shouldFocus: true }
                );
                return;
            }
            const reducedRoomTypesSetting = {
                id: rest.roomPlanId,
                priceSettings: priceSettings.map((setting) => ({
                    id: setting.id,
                    priceSchemeId: setting.priceSchemeId,
                })),
            };

            const { data, errors } = await updateRoomTypePackagePlan({
                variables: {
                    input: reducedRoomTypesSetting,
                },
            });

            return;
        },
        [fields]
    );
    const onSubmit = handleSubmit(async (formData) => {
        if (!initialValue) {
            return onCreate(formData);
        }
        if (initialValue) {
            return onUpdate(formData);
        }
    });

    return {
        hotelRooms,
        loading,
        fetchRoomErrors,
        control,
        errors,
        options: options?.myOptions,
        optionsLoading,
        optionsError,
        refetchRooms,
        register,
        watch,
        setValue,
        handleSubmit,
        getValues,
        trigger,
        setError,
        onSubmit,
        watchShowUsage,
        watchShowReservation,
        watchShowCutOff,
        handleRoomTypesChange,
        fields,
        optionFields,
        handleRoomFieldUpdate,
        updateRoomPlan,
        onRemovePackagePhotos,
        onAddHotelRoomPhotos,
        handleOptionFieldChange,
    };
};

export default useAddPlans;
