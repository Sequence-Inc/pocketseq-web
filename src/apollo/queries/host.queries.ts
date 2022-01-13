import { gql } from "@apollo/client";
import { IMAGE_UPLOAD_RESULT, PHOTO, STRIPE_ACCOUNT } from "./core.queries";

export const HOST = gql`
    query Host {
        host {
            id
            name
            stripeAccountId
            account {
                ${STRIPE_ACCOUNT}
            }
            photoId{
                ${PHOTO}
            }
            approved
            createdAt
            updatedAt
        }
    }
`;

export const ADD_PHOTO_ID = gql`
    mutation AddPhotoId($input: ImageUploadInput!) {
        addPhotoId(input: $input) {
            ${IMAGE_UPLOAD_RESULT}
        }
    }
`;

export const RESERVATIONS = gql`
    query Reservations($spaceId: ID, $paginate: PaginationOption, $filter: ReservationsFilter){
        reservations(spaceId: $spaceId, paginate: $paginate, filter:$filter){
            data {
            id
            fromDateTime
            toDateTime
            status
            createdAt
            updatedAt
            approved
            approvedOn
            space {
                id
                name
            }
            }
            paginationInfo {
            hasNext
            hasPrevious
            nextCursor
            }
        }
    }
`;

export const APPROVE_RESERVATION = gql`
    mutation ApproveReservation($reservationId: ID!){
        approveReservation(reservationId: $reservationId){
            message
            action
        }
    }
`;
