import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
    ADD_DEFAULT_SPACE_SETTINGS,
    ADD_SPACE,
    ADD_SPACE_ADDRESS,
    GET_AVAILABLE_SPACE_TYPES,
    GET_LINES_BY_PREFECTURE,
    GET_STATIONS_BY_LINE,
    MY_SPACES,
    UPDATE_SPACE,
    UPDATE_SPACE_ADDRESS,
    UPDATE_SPACE_SETTING,
    UPDATE_TYPES_IN_SPACE,
} from "src/apollo/queries/space.queries";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";

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

const useAddSpace = () => {
    const {
        register,
        unregister,
        control,
        formState: { errors },
        setValue,
        watch,
        handleSubmit,
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

export const useBasicSpace = (fn, initialValue) => {
    const [zipCode, setZipCode] = useState("");
    const [freeCoords, setFreeCoords] = useState<
        { lat: any; lng: any } | undefined
    >();
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
    } = useForm({
        defaultValues: {
            name: undefined,
            description: undefined,
            maximumCapacity: undefined,
            numberOfSeats: undefined,
            needApproval: false,
            spaceSize: undefined,
            spaceTypes: undefined,
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
        },
    });

    const { data: prefectures } = useQuery(AVAILABLE_PREFECTURES);

    const [mutate] = useMutation(ADD_SPACE);
    const [mutateSpaceAddress] = useMutation(ADD_SPACE_ADDRESS);
    const [mutateSpaceTypes] = useMutation(UPDATE_TYPES_IN_SPACE);
    const [mutateSpaceSettings] = useMutation(ADD_DEFAULT_SPACE_SETTINGS);
    // update api
    const [updateSpace] = useMutation(UPDATE_SPACE);
    const [updateSpaceAddress] = useMutation(UPDATE_SPACE_ADDRESS);
    const [updateSpaceSetting] = useMutation(UPDATE_SPACE_SETTING);

    const [loading, setLoading] = useState(false);

    const filterDefaultSpaceSetting = (settings) => {
        if (!settings) return null;
        return settings.filter((setting) => setting.isDefault)[0];
    };

    useEffect(() => {
        if (initialValue) {
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            setValue("maximumCapacity", initialValue.maximumCapacity);
            setValue("numberOfSeats", initialValue.numberOfSeats);
            setValue("spaceSize", initialValue.spaceSize);
            setValue("spaceTypes", initialValue.spaceTypes[0]?.id);
            setValue("needApproval", initialValue.needApproval);
            setValue("zipCode", initialValue.address?.postalCode);
            setValue("prefecture", initialValue.address?.prefecture?.id);
            setValue("city", initialValue.address?.city);
            setValue("addressLine1", initialValue.address?.addressLine1);
            setValue("addressLine2", initialValue.address?.addressLine2);
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
        }
    }, [initialValue]);

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        const basicModel = {
            name: formData.name,
            description: formData.description,
            maximumCapacity: formData.maximumCapacity,
            numberOfSeats: formData.numberOfSeats,
            spaceSize: formData.spaceSize,
            needApproval: formData.needApproval,
        };
        const addressModel = {
            postalCode: formData.zipCode,
            prefectureId: formData.prefecture,
            city: formData.city,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            // latitude: freeCoords?.lat || 0,
            // longitude: freeCoords?.lng || 0
        };

        const spaceSettingModel = {
            totalStock: formData.totalStock,
            businessDays: formData.businessDays,
            openingHr: formData.openingHr,
            closingHr: formData.closingHr,
            breakFromHr: formData.breakFromHr,
            breakToHr: formData.breakToHr,
        };

        if (initialValue) {
            const defaultSetting = filterDefaultSpaceSetting(
                initialValue.settings
            );

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
            ];
            if (defaultSetting) {
                console.log(
                    "Update spaceID:",
                    initialValue.id,
                    "settingID:",
                    defaultSetting.id,
                    "with values",
                    spaceSettingModel
                );
                updateMutations.push(
                    updateSpaceSetting({
                        variables: {
                            input: {
                                ...spaceSettingModel,
                                id: defaultSetting.id,
                            },
                        },
                    })
                );
            }
            await Promise.all(updateMutations);
            alert("successfully updated!!");
        } else {
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
                            spaceTypeIds: [formData.spaceTypes],
                        },
                    },
                }),
                mutateSpaceSettings({
                    variables: {
                        spaceId: addSpacesData.data.addSpace.space.id,
                        spaceSetting: spaceSettingModel,
                    },
                }),
            ]);
            addSpacesData.data.addSpace.space.id &&
                fn(addSpacesData.data.addSpace.space.id);
        }
        setLoading(false);
    });

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
        console.log(formData);
        // mutate({ variables: { input: formData } })
    });

    return { register, control, errors, watch, setValue, onSubmit, loading };
};
