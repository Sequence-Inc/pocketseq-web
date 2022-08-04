import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";
import { General } from "src/apollo/queries/hotel";
import handleUpload from "src/utils/uploadImages";

const { query: generalQuery, mutation: generalMutations } = General;

const useAddGeneral = (fn, initialValue) => {
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

    const [mutate] = useMutation(generalMutations.ADD_HOTEL_SPACE, {
        onCompleted: (data) => {
            if (data?.addSpace?.message) {
                confirmRef.current.open(data?.addSpace?.message);
            }
        },
    });

    const [updateHotelGeneral] = useMutation(
        generalMutations.UPDATE_HOTEL_SPACE
    );

    const [updateHotelAddress] = useMutation(
        generalMutations.UPDATE_HOTEL_ADDRESS
    );

    // ADD HOTEL NEAREST STATION STARTS HERE
    const [addHotelNearestStation] = useMutation(
        generalMutations.ADD_HOTEL_NEAREST_STATION,
        {
            refetchQueries: [
                {
                    query: generalQuery.HOTEL_BY_ID,
                    variables: { id: initialValue?.id },
                },
            ],
        }
    );

    const onAddHotelStation = useCallback(
        async (newStation) => {
            if (!initialValue) return;
            addHotelNearestStation({
                variables: {
                    hotelId: initialValue.id,
                    stations: [newStation],
                },
            });
        },
        [initialValue]
    );
    // ADD HOTEL NEAREST STATION ENDS HERE

    const [addHotelPhotos] = useMutation(generalMutations.ADD_HOTEL_PHOTOS, {
        // refetchQueries: [
        //     {
        //         query: generalQuery.HOTEL_BY_ID,
        //         variables: { id: initialValue?.id },
        //     },
        // ],
    });

    const onAddHotelPhotos = useCallback(
        async (photos) => {
            if (!initialValue) return;
            const payloadPhotos = Array.from(photos)?.map((res: File) => ({
                mime: res.type,
            }));
            const { data, errors } = await addHotelPhotos({
                variables: {
                    hotelId: initialValue?.id,
                    photos: payloadPhotos,
                },
            });

            if (data) {
                try {
                    await handleUpload(data.addHotelPhotos.uploadRes, photos);
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

    // Remove Nearest Station Begins here
    const [removeHotelNearestStation] = useMutation(
        generalMutations.REMOVE_HOTEL_NEAREST_STATION,
        {
            refetchQueries: [
                {
                    query: generalQuery.HOTEL_BY_ID,
                    variables: { id: initialValue?.id },
                },
            ],
        }
    );

    const onRemoveStation = useCallback(
        (station) => {
            return removeHotelNearestStation({
                variables: {
                    hotelId: initialValue?.id,
                    stationIds: [station.stationId],
                },
            });
        },
        [initialValue]
    );
    // Remove Nearest Station Ends here

    // Remove Photos Mutation START
    const [removeHotelPhoto] = useMutation(
        generalMutations.REMOVE_HOTEL_PHOTO,
        {
            refetchQueries: [
                {
                    query: generalQuery.HOTEL_BY_ID,
                    variables: { id: initialValue?.id },
                },
            ],
        }
    );

    const onRemoveHotelPhoto = useCallback(
        async (photo) => {
            await removeHotelPhoto({
                variables: {
                    photoId: photo?.id,
                },
            });
        },
        [initialValue]
    );
    // Remove Photos Mutation ENDS

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
            setValue("buildingType", initialValue?.buildingType);
            setValue("isPetAllowed", initialValue?.isPetAllowed);

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
                buildingType: formData.buildingType,
                isPetAllowed: formData.isPetAllowed,
            };

            const addressPayload = {
                id: initialValue.address.id,
                postalCode: formData.zipCode,
                prefectureId: formData.prefecture,
                city: formData.city,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
            };

            const updateMutations = [
                updateHotelGeneral({
                    variables: { input: payload },
                }),

                updateHotelAddress({
                    variables: {
                        input: addressPayload,
                    },
                }),
            ];

            try {
                await Promise.all(updateMutations);
                addAlert({ type: "success", message: "Update successful" });
                setLoading(false);
            } catch (err) {
                addAlert({ type: "error", message: "Could not update " });
                setLoading(false);
            }
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
        onAddHotelStation,
        onRemoveStation,
        onRemoveHotelPhoto,
        onAddHotelPhotos,
    };
};

export default useAddGeneral;
