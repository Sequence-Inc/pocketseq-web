import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ADD_SPACE } from 'src/apollo/queries/space.queries';
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
    prefecture: string;
    trainLine: string | number;
    stationId: number;
    via: string;
    time: number;
}

interface IFormState {
    name: string,
    maximumCapacity: number,
    numberOfSeats: number,
    spaceSize: number,
    spacePricePlan: ISpacePricePlan,
    nearestStations: INearestStations,
    spaceTypes: string;
    asdasdasd: string;
}

const useAddSpace = () => {
    const { register, control, formState: { errors }, handleSubmit } = useForm<IFormState, IFormState>();
    const [trainLines, setTrainLines] = useState<any[]>([]);
    const [stationId, setStationId] = useState<any[]>([]);
    const [mutate] = useMutation(ADD_SPACE);
    const { data: spaceTypes } = useQuery<IAllSpaceType>(GET_ALL_SPACE_TYPES)

    const onSubmit = handleSubmit((formData: IFormState) => {
        console.log(formData)
        mutate({ variables: { input: formData } })
    })

    const getTrainLine = () => {
        setTrainLines([{ name: '山の手線', id: 11302 }, { name: '京浜東北線', id: 11332 }])
    }

    const getStationId = () => {
        setStationId([{ name: '上野', id: 1130220 }, { name: '御徒町', id: 1130221 }, { name: '神田', id: 1130223 }, { name: '秋葉原', id: 1130222 }])
    }

    return { spaceTypes, register, control, errors, onSubmit, trainLines, getTrainLine, stationId, getStationId }
}

export default useAddSpace;