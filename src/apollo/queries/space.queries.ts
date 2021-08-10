import { gql } from '@apollo/client';

export const GET_ALL_SPACE_TYPES = gql`
    query GetAllSpaceTypes{
        allSpaceTypes{
            id
            title
            description
        }
    }
`

export const ADD_SPACE = gql`
    mutation AddSpace($input: AddSpaceInput!){
        addSpace(input: $input){
            message
            action
        }
    }
`

export const MY_SPACES = gql`
    query MySpaces{
  mySpaces{
    id
    name
    maximumCapacity
    numberOfSeats
    spaceSize
    needApproval
    nearestStations{
      station{
        id
        stationName
        stationZipCode
        address
        longitude
        latitude
      }
      via
      time
    }
    spacePricePlans{
      id
      planTitle
      hourlyPrice
      dailyPrice
      maintenanceFee
      lastMinuteDiscount
      cooldownTime
    }
    spaceTypes{
      id
      title
      description
    }
  }
}
`