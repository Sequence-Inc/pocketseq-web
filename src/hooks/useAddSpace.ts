import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ADD_SPACE, ADD_SPACE_ADDRESS, GET_AVAILABLE_SPACE_TYPES, GET_LINES_BY_PREFECTURE, GET_STATIONS_BY_LINE, MY_SPACES, UPDATE_SPACE, UPDATE_SPACE_ADDRESS, UPDATE_TYPES_IN_SPACE } from 'src/apollo/queries/space.queries';
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
    hourlyPrice: number,
    dailyPrice: number,
    maintenanceFee: number,
    lastMinuteDiscount: number,
    cooldownTime: number
}

interface INearestStations {
    stationId: number;
    via: string;
    time: number;
}

interface IFormState {
    name: string,
    maximumCapacity: number,
    numberOfSeats: number,
    spaceSize: number,
    spacePricePlan: ISpacePricePlan[],
    nearestStations: INearestStations[],
    spaceTypes: string;
    prefecture: string;
    trainLine: string | number;
    zipCode: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
}

const defaultPriceObj = {
    planTitle: '',
    hourlyPrice: 0,
    dailyPrice: 0,
    maintenanceFee: 0,
    lastMinuteDiscount: 0,
    cooldownTime: 0
}

const defaultStationObj = {
    stationId: 0,
    via: '',
    time: 0
}

const defaultValues = {
    spacePricePlan: [defaultPriceObj],
    nearestStations: [defaultStationObj]
}

const useAddSpace = () => {
    const { register, control, formState: { errors }, setValue, watch, handleSubmit } = useForm<IFormState, IFormState>({ defaultValues });
    const { fields, prepend, remove } = useFieldArray({
        name: "spacePricePlan",
        control,
    });
    const { fields: stationsField, prepend: stationsPrepend, remove: stationsRemove } = useFieldArray({
        name: "nearestStations",
        control
    });
    const [mutateTrainLines, { data: trainLines }] = useLazyQuery(GET_LINES_BY_PREFECTURE);
    const [mutateStationId, { data: stationId }] = useLazyQuery(GET_STATIONS_BY_LINE);
    const { data: spaceTypes } = useQuery<IAllSpaceType>(GET_AVAILABLE_SPACE_TYPES);
    const confirmRef = useRef(null);

    const [mutate, { loading }] = useMutation(ADD_SPACE, {
        onCompleted: (data) => {
            if (data?.addSpace?.message) {
                confirmRef.current.open(data?.addSpace?.message)
            }
        },
        refetchQueries: [{ query: MY_SPACES }],
    });

    const onSubmit = handleSubmit((formData: IFormState) => {
        delete formData.prefecture;
        delete formData.trainLine;
        mutate({ variables: { input: formData } })
    })

    const getTrainLine = (trainLineId) => {
        mutateTrainLines({ variables: { prefectureId: parseInt(trainLineId) } })
    }

    const getStationId = (trainLineId) => {
        mutateStationId({ variables: { lineId: trainLineId } })
    }

    return { spaceTypes, register, watch, control, setValue, errors, fields, prepend, remove, stationsField, stationsPrepend, stationsRemove, onSubmit, trainLines, getTrainLine, stationId, getStationId, loading, confirmRef, defaultPriceObj, defaultStationObj }
}

export default useAddSpace;

export const useBasicSpace = (fn, initialValue) => {
    const [zipCode, setZipCode] = useState("");
    const [cache, setCache] = useState({});
    const { register, control, formState: { errors }, watch, setValue, handleSubmit } = useForm();
    const { data: prefectures } = useQuery(AVAILABLE_PREFECTURES);
    const [mutate] = useMutation(ADD_SPACE);
    const [mutateSpaceAddress] = useMutation(ADD_SPACE_ADDRESS);
    const [mutateSpaceTypes] = useMutation(UPDATE_TYPES_IN_SPACE);
    // update api
    const [updateSpace] = useMutation(UPDATE_SPACE);
    const [updateSpaceAddress] = useMutation(UPDATE_SPACE_ADDRESS);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValue) {
            setValue('name', initialValue?.name)
            setValue('description', initialValue?.description)
            setValue('maximumCapacity', initialValue?.maximumCapacity)
            setValue('numberOfSeats', initialValue?.numberOfSeats)
            setValue('spaceSize', initialValue?.spaceSize)
            setValue('spaceTypes', initialValue?.spaceTypes?.id)
            setValue('zipCode', initialValue?.address?.postalCode)
            setValue('prefecture', initialValue?.address?.prefecture?.id)
            setValue('city', initialValue?.address?.city)
            setValue('addressLine1', initialValue?.address?.addressLine1)
            setValue('addressLine2', initialValue?.address?.addressLine2)
        }
    }, [initialValue])

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true)
        const basicModel = {
            name: formData.name,
            description: formData.description,
            maximumCapacity: formData.maximumCapacity,
            numberOfSeats: formData.numberOfSeats,
            spaceSize: formData.spaceSize
        };
        const addressModel = {
            postalCode: formData.zipCode,
            prefectureId: formData.prefecture,
            city: formData.city,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            latitude: 0,
            longitude: 0
        };
        if (initialValue) {
            const updateSpacesData = await updateSpace({ variables: { input: { ...basicModel, id: initialValue.id } } });
            await Promise.all([
                updateSpaceAddress({ variables: { spaceId: initialValue.id, address: { ...addressModel, id: initialValue.address?.id } } }),
                // mutateSpaceTypes({ variables: { input: { spaceId: initialValue.spaceTypes?.id, spaceTypeIds: [formData.spaceTypes] } } })
            ]);
            alert("successfully updated!!")
        } else {
            const addSpacesData = await mutate({ variables: { input: basicModel } });
            await Promise.all([
                mutateSpaceAddress({ variables: { spaceId: addSpacesData.data.addSpace.spaceId, address: addressModel } }),
                mutateSpaceTypes({ variables: { input: { spaceId: addSpacesData.data.addSpace.spaceId, spaceTypeIds: [formData.spaceTypes] } } })
            ]);
            addSpacesData.data.addSpace.spaceId && fn(addSpacesData.data.addSpace.spaceId);
        }
        setLoading(false)
    })

    return { zipCode, setZipCode, cache, setCache, register, control, errors, watch, setValue, onSubmit, loading, prefectures }
}

export const usePriceSpace = () => {
    const { register, control, formState: { errors }, watch, setValue, handleSubmit } = useForm();
    const loading = false;

    const onSubmit = handleSubmit((formData) => {
        console.log(formData);
        // mutate({ variables: { input: formData } })
    })

    return { register, control, errors, watch, setValue, onSubmit, loading }
}