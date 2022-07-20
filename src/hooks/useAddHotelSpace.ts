import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    useFieldArray,
    useForm,
    UseFormProps,
    UseFieldArrayReturn,
    FieldArrayWithId,
} from "react-hook-form";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";
import {
    ADD_HOTEL_SPACE,
    ADD_HOTEL_ROOMS,
    ADD_PRICING_SCHEME,
    ROOMS_BY_HOTEL_ID,
    ADD_HOTEL_PACKAGE_PLANS,
    UPDATE_HOTEL_SPACE,
    UPDATE_HOTEL_ROOMS,
    UPDATE_PACKAGE_PLAN,
    MY_PACKGAE_PLANS,
} from "src/apollo/queries/hotel.queries";
import handleUpload from "src/utils/uploadImages";
import {
    DAY_OF_WEEK,
    PRICE_SCHEME_ADULTS,
    PRICE_SCHEME_CHILD,
} from "src/config";
import { Description } from "@headlessui/react/dist/components/description/description";
import { useToast } from "./useToasts";
import { onError } from "apollo-link-error";

const noOp = () => {};

const ROOM_CHARGE_KEY = "roomCharge";

export const AddPriceSchemaInputKeys = [
    ROOM_CHARGE_KEY,
    ...PRICE_SCHEME_ADULTS.map((item) => item.key),
    ...PRICE_SCHEME_CHILD.map((item) => item.key),
];

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

type TOptions = {
    onCompleted?: Function;
    onError?: Function;
    refetchQueries?: any;
};

type AddPriceShcemaProps = {
    hotelId: string;
    formProps: UseFormProps;
    options?: TOptions;
};

type AddPlansProps = {
    hotelId: string;
    addAlert: any;
    initialValue?: any;
};

// const addGeneralDefault = {
//     name: null,
//     description: null,
//     photos: null,
//     zipCode: null,
//     prefecture: null,
//     city: null,
//     addressLine1: null,
//     addressLine2: null,
//     nearestStations: null,
//     checkInTime: null,
//     checkOutTime: null,
// };

export const useAddGeneral = (fn, initialValue) => {
    const { addAlert } = useToast();
    const [zipCode, setZipCode] = useState("");
    const [cache, setCache] = useState({});
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
    } = useForm();

    const { data: prefectures } = useQuery(AVAILABLE_PREFECTURES);
    const confirmRef = useRef(null);

    const [mutate] = useMutation(ADD_HOTEL_SPACE, {
        onCompleted: (data) => {
            if (data?.addSpace?.message) {
                confirmRef.current.open(data?.addSpace?.message);
            }
        },
    });

    const [updateHotelGeneral] = useMutation(UPDATE_HOTEL_SPACE, {
        onCompleted: () => {
            addAlert({ type: "success", message: "Update successful" });
            setLoading(false);
        },
        onError: () => {
            addAlert({ type: "error", message: "Could not update " });
            setLoading(false);
        },
    });

    useEffect(() => {
        if (initialValue) {
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            setValue("photos", initialValue.photos);
            setValue("zipCode", initialValue.address.postalCode);
            setValue("prefecture", initialValue.address.prefecture.id);
            setValue("city", initialValue.address.city);
            setValue("addressLine1", initialValue.address.addressLine1);
            setValue("addressLine2", initialValue.address.addressLine2);
            setValue("nearestStations", initialValue.nearestStations);
            setValue("checkInTime", initialValue.checkInTime);
            setValue("checkOutTime", initialValue.checkOutTime);
            // setValue("address", initialValue.address);
        }
    }, [initialValue]);

    const onUpdate = useCallback(
        async (formData) => {
            const payload = {
                id: initialValue.id,
                name: formData.name,
                description: formData.description,
                checkInTime: formData.checkInTime,
                checkOutTime: formData.checkOutTime,
            };

            await updateHotelGeneral({
                variables: { input: payload },
            });
        },
        [initialValue]
    );
    const onCreate = useCallback(async (formData) => {
        const payloadPhotos = formData.photos.map((res) => ({
            mime: res.type,
        }));
        const payload = {
            name: formData.name,
            description: formData.description,
            photos: payloadPhotos,
            nearestStations: formData.nearestStations,
            checkInTime: formData.checkInTime,
            checkOutTime: formData.checkOutTime,
            address: {
                postalCode: formData.zipCode,
                prefectureId: formData.prefecture,
                city: formData.city,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
            },
        };
        const { data, errors } = await mutate({
            variables: { input: payload },
        });

        if (errors) {
            console.log("Errors", errors);
            setLoading(false);
            return;
        }
        if (data) {
            try {
                await handleUpload(data.addHotel.uploadRes, formData.photos);
            } catch (err) {
                console.log(err);
            }
        }

        if (data?.addHotel?.hotel?.id) {
            return fn(data?.addHotel?.hotel?.id);
        }
    }, []);
    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);

        if (!initialValue) {
            return onCreate(formData);
        }
        if (initialValue) {
            return onUpdate(formData);
        }
    });

    return {
        register,
        unregister,
        loading,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
        getValues,
        zipCode,
        setZipCode,
        cache,
        setCache,
        prefectures,
    };
};

export const useAddRooms = (
    hotleSpaceId: string,
    { fn, initialValue, addAlert }
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [hotelId] = useState<string>(hotleSpaceId);
    const {
        register,
        unregister,
        control,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
    } = useForm();

    const [mutate] = useMutation(ADD_HOTEL_ROOMS, {
        refetchQueries: [{ query: ROOMS_BY_HOTEL_ID, variables: { hotelId } }],
    });

    const [updateHotelRoomGeneral] = useMutation(UPDATE_HOTEL_ROOMS, {
        refetchQueries: [{ query: ROOMS_BY_HOTEL_ID, variables: { hotelId } }],
    });

    const onCreate = useCallback(
        async (formData) => {
            const payloadPhotos = formData.photos.map((res) => ({
                mime: res.type,
            }));

            const basicPriceSettings = formData.basicPriceSettings.filter(
                (item) => item !== undefined && item?.priceSchemeId
            );

            const payload = {
                name: formData.name,
                description: formData.description,
                photos: payloadPhotos,
                paymentTerm: formData.paymentTerm,
                maxCapacityAdult: formData.maxCapacityAdult,
                maxCapacityChild: formData.maxCapacityChild,
                stock: parseInt(formData?.stock || 0, 10),
                basicPriceSettings: basicPriceSettings,
            };

            const { data, errors } = await mutate({
                variables: { hotelId, input: payload },
            });
            if (errors) {
                console.log("Errors", errors);
                setLoading(false);
                return;
            }

            if (data) {
                try {
                    await handleUpload(
                        data.addHotelRoom.uploadRes,
                        formData.photos
                    );
                } catch (err) {
                    console.log(err);
                }
            }
            setLoading(false);
            return fn();
        },
        [hotelId]
    );

    const onUpdate = useCallback(
        async (formData) => {
            const payload = {
                id: initialValue.id,
                name: formData.name,
                description: formData.description,
                paymentTerm: formData.paymentTerm,
                maxCapacityAdult: formData.maxCapacityAdult,
                maxCapacityChild: formData.maxCapacityChild,
                stock: parseInt(formData.stock, 10),
            };

            const { data, errors } = await updateHotelRoomGeneral({
                variables: {
                    input: payload,
                },
            });

            if (data) {
                addAlert({ type: "success", message: "Update successful" });
            }

            if (errors) {
                console.log({ errors });
                addAlert({ type: "error", message: "Something went wrong" });
            }

            setLoading(false);
        },
        [addAlert]
    );

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        if (!initialValue) {
            return onCreate(formData);
        }
        if (initialValue) {
            return onUpdate(formData);
        }
    });

    useEffect(() => {
        if (initialValue) {
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            setValue("photos", initialValue.photos);
            setValue("paymentTerm", initialValue.paymentTerm);
            setValue("maxCapacityAdult", initialValue.maxCapacityAdult);
            setValue("maxCapacityChild", initialValue.maxCapacityChild);
            setValue("stock", initialValue.stock);
        }
    }, [initialValue]);

    return {
        register,
        unregister,
        loading,
        control,
        errors,
        watch,
        setValue,
        handleSubmit,
        getValues,
        onSubmit,
        dirtyFields,
    };
};

export const useReduceObject = (obj: Object, filterKeys: string[]) => {
    return Object.entries(
        Object.fromEntries(filterKeys.map((key) => [key, obj[key]]))
    ).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});
};

export const useAddPriceScheme = (props: AddPriceShcemaProps) => {
    const { hotelId, formProps, options } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        unregister,
        control,
        formState: { errors, isDirty, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
        trigger,
        setError,
    } = useForm(formProps);

    const [mutate] = useMutation(ADD_PRICING_SCHEME, {
        ...options,
        onCompleted: (data) => {
            options.onCompleted();
            setLoading(false);
        },
        onError: (error) => {
            console.log({ error });
            options?.onError();
            setLoading(false);
        },
    });

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);

        // This piece of code filter all the unnecessary keys & values on formData and
        const payload = Object.entries(
            Object.fromEntries(
                AddPriceSchemaInputKeys.map((key) => [key, formData[key]])
            )
        ).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});

        return mutate({
            variables: { hotelId, input: payload },
        });
    });

    return {
        register,
        unregister,
        loading,
        control,
        errors,
        isDirty,
        watch,
        setValue,
        handleSubmit,
        getValues,
        onSubmit,
        trigger,
        setError,
        dirtyFields,
    };
};

const MY_ROOMS_BY_HOTEL_ID = gql`
    query HotelRoomsByHotelId($hotelId: ID!) {
        myHotelRooms(hotelId: $hotelId) {
            id
            name
        }
    }
`;

type PRICE_SETTINGS = {
    dayOfWeek: string;
    priceSchemeId?: string;
};
interface IFields extends FieldArrayWithId {
    hotelRoomId: string;
    priceSettings: PRICE_SETTINGS[];
}

export const useAddPlans = (props: AddPlansProps) => {
    const { hotelId, addAlert, initialValue = null } = props;
    const [loading, setLoading] = useState(false);
    const {
        data: hotelRooms,
        refetch: refetchRooms,
        error: fetchRoomErrors,
    } = useQuery(MY_ROOMS_BY_HOTEL_ID, {
        variables: {
            hotelId,
        },
    });

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
    }: UseFieldArrayReturn & { fields: any[] } = useFieldArray({
        name: "roomTypes",
        control,
    });

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
            console.log({ initialValue });
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            setValue("paymentTerm", initialValue.paymentTerm);
            setValue("stock", initialValue.stock);
            if (initialValue?.startUsage || initialValue?.endUsage) {
                setValue("usagePeriod", true);
            }
            // if (initialValue?.roomTypes?.length) {
            //     initialValue?.roomTypes.forEach((element) => {
            //         append({
            //             hotelRoomId: element?.hotelRoom?.id,
            //             priceSettings: element?.priceSettings?.map(
            //                 (setting) => ({
            //                     dayOfWeek: setting.dayOfWeek,
            //                     priceSchemeId: setting.priceScheme.id,
            //                 })
            //             ),
            //         });
            //     });
            // }
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

        console.log({
            hotelRooms: hotelRooms?.myHotelRooms,
            initVal: initialValue,
        });

        hotelRooms.myHotelRooms.forEach((room, index) => {
            const initValRoomIndex = initialValue.roomTypes.findIndex(
                (roomType) => room.id === roomType.hotelRoom.id
            );

            if (initValRoomIndex !== -1) {
                const { roomTypes } = initialValue;

                roomTypes?.forEach((roomType) => {
                    update(index, {
                        isSelected: true,
                        hotelRoomId: room.id,
                        priceSettings: roomType?.priceSettings?.map(
                            (setting) => ({
                                dayOfWeek: setting.dayOfWeek,
                                priceSchemeId: setting.priceScheme.id,
                            })
                        ),
                    });
                });
            }
        });
    }, [hotelRooms, initialValue?.roomTypes]);

    const [mutate] = useMutation(ADD_HOTEL_PACKAGE_PLANS, {
        refetchQueries: [
            {
                query: MY_PACKGAE_PLANS,
                variables: {
                    hotelId,
                },
            },
        ],
    });

    const [updatePackagePlanGeneral] = useMutation(UPDATE_PACKAGE_PLAN, {
        refetchQueries: [
            {
                query: MY_PACKGAE_PLANS,
                variables: {
                    hotelId,
                },
            },
        ],
    });

    const onCreate = useCallback(async (formData) => {
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

        const reducedRoomTypes = roomTypes
            .map((room) => {
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
            })
            ?.filter((ele) => ele !== undefined);
        if (!reducedRoomTypes?.length) {
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
    }, []);

    const onUpdate = useCallback(
        async (formData) => {
            const reducedFormData: any = useReduceObject(
                formData,
                UPDATE_PLAN_KEYS
            );

            const payload = {
                id: initialValue.id,
                startUsage: formData?.startUsage || null,
                endUsage: formData?.endUsage || null,
                startReservation: formData?.startReservation || null,
                endReservation: formData?.endReservation || null,
                cutOffBeforeDays: formData?.cutOffBeforeDays || null,
                cutOffTillTime: formData?.cutOffTillTime || null,
                ...reducedFormData,
            };

            // return;
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
        [initialValue]
    );
    const onSubmit = handleSubmit(async (formData) => {
        if (!initialValue) {
            return onCreate(formData);
        }
        if (initialValue) {
            onUpdate(formData);
        }
    });

    return {
        hotelRooms,
        loading,
        fetchRoomErrors,
        control,
        errors,
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
        handleRoomFieldUpdate,
    };
};
