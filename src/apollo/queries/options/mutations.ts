import { gql } from "@apollo/client";
import { IMAGE_UPLOAD_RESULT } from "../core.queries";
import { OPTION_OBJECT } from "./core.scheme";

export const ADD_OPTIONS = gql`
    mutation AddOption($input:AddOptionInput!){
        addOption(input:$input){
            message
            option{
                ${OPTION_OBJECT}
            }
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;

export const REMOVE_OPTIONS = gql`
    mutation RemoveOptions($id: ID!) {
        removeOption(id: $id) {
            message
        }
    }
`;

export const REMOVE_OPTIONS_PHOTO = gql`
    mutation RemoveOptionPhoto($photoId: ID!) {
        removeOptionPhoto(photoId: $photoId) {
            message
        }
    }
`;

export const UPDATE_OPTIONS = gql`
    mutation UpdateOption($input:UpdateOptionInput!){
        updateOption(input:$input){
            message
            option{
                ${OPTION_OBJECT}
            }
           
        }
    }
`;

export const ADD_OPTION_PHOTOS = gql`
    mutation AddOptionPhotos($optionId:ID!, $photos:[ImageUploadInput!]!){
        addOptionPhotos(optionId:$optionId,photos:$photos) { 
            message
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;
