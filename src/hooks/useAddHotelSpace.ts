import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";
import { ADD_HOTEL_SPACE } from "src/apollo/queries/hotel.queries";

const useAddGeneral = (fn) => {
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

    const [mutate, { loading: add_hotel_space_loading }] = useMutation(
        ADD_HOTEL_SPACE,
        {
            onCompleted: (data) => {
                if (data?.addSpace?.message) {
                    confirmRef.current.open(data?.addSpace?.message);
                }
            },
        }
    );
    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
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
                await Promise.all(
                    data.addHotel.uploadRes.map((token, index) => {
                        const { url, mime } = token;
                        const options = {
                            headers: {
                                "Content-Type": mime,
                            },
                        };
                        axios.put(url, formData.photos[index], options);
                    })
                );
            } catch (err) {
                console.log(err);
            }
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

export default useAddGeneral;
