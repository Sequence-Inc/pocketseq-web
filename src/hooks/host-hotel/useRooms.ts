import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";

import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";
import { Room, Pricing } from "src/apollo/queries/hotel";
import handleUpload from "src/utils/uploadImages";
import {
    DAY_OF_WEEK,
    PRICE_SCHEME_ADULTS,
    PRICE_SCHEME_CHILD,
} from "src/config";

import {
    useFieldArray,
    useForm,
    UseFormProps,
    UseFieldArrayReturn,
    FieldArrayWithId,
} from "react-hook-form";

const { queries: roomQueries, mutations: roomMutations } = Room;
const { queries: pricingQueries, mutations: pricingMutations } = Pricing;

const useAddRooms = (hotleSpaceId: string, { fn, initialValue, addAlert }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [hotelId] = useState<string>(hotleSpaceId);

    const {
        data: priceSchemes,
        loading: priceSchemeLoading,
        error: priceSchemeError,
    } = useQuery(pricingQueries.PRICING_BY_HOTEL_ID, {
        skip: !hotelId,
        variables: { hotelId },
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
    } = useForm();

    const {
        fields,
        append,
        insert,
        update,
    }: UseFieldArrayReturn & {
        fields: any[];
    } = useFieldArray<any, any, any>({
        keyName: "fieldId",
        name: "basicPriceSettings",
        control,
    });

    const [mutate] = useMutation(roomMutations.ADD_HOTEL_ROOMS, {
        refetchQueries: [
            { query: roomQueries.ROOMS_BY_HOTEL_ID, variables: { hotelId } },
        ],
    });

    const [updateHotelRoomGeneral] = useMutation(
        roomMutations.UPDATE_HOTEL_ROOMS,
        {
            refetchQueries: [
                {
                    query: roomQueries.ROOMS_BY_HOTEL_ID,
                    variables: { hotelId },
                },
            ],
        }
    );

    // ADD HOTEL NEAREST STATION ENDS HERE

    const [addHotelRoomPhotos] = useMutation(
        roomMutations.ADD_HOTEL_ROOM_PHOTOS,
        {
            refetchQueries: [
                {
                    query: roomQueries.ROOMS_BY_HOTEL_ID,
                    variables: { hotelId },
                },
            ],
        }
    );

    const onAddHotelRoomPhotos = useCallback(
        async (photos) => {
            if (!initialValue) return;
            const payloadPhotos = Array.from(photos)?.map((res: File) => ({
                mime: res.type,
            }));
            const { data, errors } = await addHotelRoomPhotos({
                variables: {
                    hotelRoomId: initialValue?.id,
                    photos: payloadPhotos,
                },
            });

            if (data) {
                try {
                    await handleUpload(
                        data.addHotelRoomPhotos.uploadRes,
                        photos
                    );
                    addAlert({ type: "success", message: "Added photos" });
                } catch (err) {
                    addAlert({
                        type: "error",
                        message: "Could not upload all photos",
                    });
                    console.log(err);
                }
            }
        },
        [initialValue]
    );

    // Remove Nearest Station Begins here

    // Remove Photos Mutation START
    const [removeRoomPhoto] = useMutation(
        roomMutations.REMOVE_HOTEL_ROOM_PHOTO,
        {
            refetchQueries: [
                {
                    query: roomQueries.ROOMS_BY_HOTEL_ID,
                    variables: { hotelId },
                },
            ],
        }
    );

    const onRemoveRoomPhoto = useCallback(async (photo) => {
        await removeRoomPhoto({
            variables: {
                photoId: photo?.id,
            },
        });
    }, []);
    // Remove Photos Mutation ENDS

    const [updateHotelRoomPrice] = useMutation(
        roomMutations.UPDATE_HOTEL_ROOMS_PRICE_SETTINGS,
        {
            refetchQueries: [
                {
                    query: roomQueries.ROOMS_BY_HOTEL_ID,
                    variables: { hotelId },
                },
            ],
        }
    );
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

            const priceSettings = fields.map((field: any) => ({
                id: field.id,
                priceSchemeId: field.priceSchemeId,
            }));

            const mutationArray = [
                updateHotelRoomGeneral({
                    variables: {
                        input: payload,
                    },
                }),
                updateHotelRoomPrice({
                    variables: {
                        hotelRoomId: initialValue.id,
                        priceSettings,
                    },
                }),
            ];
            try {
                await Promise.all(mutationArray);
                addAlert({ type: "success", message: "Update successful" });
            } catch (error) {
                addAlert({ type: "error", message: "Something went wrong" });
            }

            setLoading(false);
        },
        [addAlert, fields]
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

    useEffect(() => {
        if (!initialValue?.basicPriceSettings?.length) {
            DAY_OF_WEEK.map((day, index) => {
                setValue(`basicPriceSettings.${index}`, {
                    dayOfWeek: day.value,
                    priceSchemeId: null,
                });
                append({ dayOfWeek: day.value, priceSchemeId: null });
            });
            return;
        }

        DAY_OF_WEEK.forEach((day, index) => {
            const hasDefaultValue = initialValue.basicPriceSettings.findIndex(
                (settings) => settings.dayOfWeek === day.value
            );
            if (hasDefaultValue > -1) {
                setValue(`basicPriceSettings.${index}`, {
                    ...initialValue.basicPriceSettings[hasDefaultValue],
                    priceSchemeId:
                        initialValue.basicPriceSettings[hasDefaultValue]
                            .priceScheme?.id,
                });
                update(index, {
                    ...initialValue.basicPriceSettings[hasDefaultValue],
                    priceSchemeId:
                        initialValue.basicPriceSettings[hasDefaultValue]
                            .priceScheme?.id,
                });
            }
        });
    }, [priceSchemes, initialValue?.basicPriceSettings]);

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
        fields,
        append,
        update,
        priceSchemes,
        priceSchemeLoading,
        onRemoveRoomPhoto,
        onAddHotelRoomPhotos,
    };
};

export default useAddRooms;
