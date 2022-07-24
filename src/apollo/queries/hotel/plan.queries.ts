import { gql } from "@apollo/client";

import { IMAGE_UPLOAD_RESULT } from "../core.queries";

export const REMOVE_HOTEL_PHOTO = gql`
    mutation RemovePackagePlanPhoto($photoId: ID!) {
        removePackagePlanPhoto(photoId: $photoId) {
            message
        }
    }
`;

export const ADD_PACKAGE_PLAN_PHOTOS = gql`
    mutation AddPackagePlanPhotos($packagePlanId:ID!, $photos:[ImageUploadInput!]!){
        addPackagePlanPhotos(packagePlanId:$packagePlanId,photos:$photos) { 
            message
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;
