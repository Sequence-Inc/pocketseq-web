import { useMutation, useQuery } from '@apollo/client';
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
    stationId: number,
    via: string,
    time: number
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
    const [mutate] = useMutation(ADD_SPACE);
    const { data: spaceTypes } = useQuery<IAllSpaceType>(GET_ALL_SPACE_TYPES)

    const onSubmit = handleSubmit((formData: IFormState) => {
        console.log(formData)
        mutate({ variables: { input: formData } })
    })

    return { spaceTypes, register, control, errors, onSubmit }
}

export default useAddSpace;