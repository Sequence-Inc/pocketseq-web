import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";
import { ADD_HOTEL_SPACE } from "src/apollo/queries/hotel.queries";

const useAddGeneral = (fn) => {
    const [zipCode, setZipCode] = useState("");
    const [cache, setCache] = useState({});

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

    const [mutate, { loading }] = useMutation(ADD_HOTEL_SPACE, {
        onCompleted: (data) => {
            if (data?.addSpace?.message) {
                confirmRef.current.open(data?.addSpace?.message);
            }
        },
    });
    const onSubmit = handleSubmit(async (formData) => {
        const payload = {
            name: formData.name,
            description: formData.description,
            photos: formData.photos,
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
        console.log({ payload });
        const addHotelData = await mutate({
            variables: { input: payload },
        });

        return addHotelData;
    });

    return {
        register,
        unregister,
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

export default useAddGeneral;
