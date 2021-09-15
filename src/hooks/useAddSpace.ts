import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ADD_SPACE, GET_LINES_BY_PREFECTURE, GET_STATIONS_BY_LINE, MY_SPACES } from 'src/apollo/queries/space.queries';
import { GET_ALL_SPACE_TYPES } from 'src/apollo/queries/space.queries';

interface IData {
    id: string;
    title: string;
    descrption: string;
}

interface IAllSpaceType {
    allSpaceTypes: IData[];
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
    const { register, control, formState: { errors }, watch, handleSubmit } = useForm<IFormState, IFormState>({ defaultValues });
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
    const { data: spaceTypes } = useQuery<IAllSpaceType>(GET_ALL_SPACE_TYPES);
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

    return { spaceTypes, register, watch, control, errors, fields, prepend, remove, stationsField, stationsPrepend, stationsRemove, onSubmit, trainLines, getTrainLine, stationId, getStationId, loading, confirmRef, defaultPriceObj, defaultStationObj }
}

export default useAddSpace;