import { ADDRESS, PHOTO, HOTLE_ROOM, PLAN_OBJECT } from "../../core.queries";

export const HOTEL_GENERAL_SCHEME = `
id
name
description
checkInTime
checkOutTime
status
address {
    ${ADDRESS}
}
isPetAllowed
buildingType
nearestStations {
    station {
        id
        stationName
    }
    time
    accessType
    exit
}
photos {
    ${PHOTO}
}
rooms {
    ${HOTLE_ROOM}
}
packagePlans {
    ${PLAN_OBJECT}
}
createdAt
updatedAt
`;
