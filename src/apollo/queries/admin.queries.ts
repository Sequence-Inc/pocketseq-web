import { gql } from "@apollo/client";
import {
    USER_ACCOUNT,
    COMPANY_ACCOUNT,
    PREFECTURE,
    RESULT,
    SPACE_TYPE,
    IMAGE_UPLOAD_RESULT,
    PAGINATION,
} from "./core.queries";

export const ACCOUNTS = gql`
    query allAccounts(
        $filters: AccountFilterOptions!
        $paginate: PaginationOption!
    ) {
        allAccounts(filters: $filters, paginate: $paginate) {
            data{
                ${USER_ACCOUNT}
                ${COMPANY_ACCOUNT}
            }
            ${PAGINATION}
        }
    }
`;

export const SPACE_TYPES = gql`
    query spaceTypes {
        allSpaceTypes {
            ${SPACE_TYPE}
        }
    }
`;

export const PREFECTURES = gql`
    query prefectures {
        allPrefectures {
            ${PREFECTURE}
        }
    }
`;

export const AVAILABLE_PREFECTURES = gql`
    query AvailablePrefectures {
        availablePrefectures {
            ${PREFECTURE}
        }
    }
`;

export const PREFECTURE_BY_ID = gql`
    query prefectureById($id: ID!) {
        prefectureById(id: $id) {
            ${PREFECTURE}
        }
    }
`;

export const ACCOUNT_BY_ID = gql`
    query accountById($accountId: ID!) {
        accountById(accountId: $accountId) {        
            ${USER_ACCOUNT}
            ${COMPANY_ACCOUNT}
        }
    }
`;

export const APPROVE_LICENSE = gql`
    mutation ApproveLicense($id: ID!) {
        approveLicense(id: $id) {
            message
            action
        }
    }
`;
export const REJECT_LICENSE = gql`
    mutation RejectLicense($id: ID!, $remarks: String) {
        rejectLicense(id: $id, remarks: $remarks) {
            message
            action
        }
    }
`;

export const UPDATE_PREFECTURE = gql`
    mutation updatePrefecture($input: UpdatePrefectureInput!){
        updatePrefecture(input: $input){
            ${PREFECTURE}
        }
    }
`;

export const SPACETYPE_BY_ID = gql`
    query spaceTypeById($id: ID!) {
        spaceTypeById(id: $id) {
            ${SPACE_TYPE}
        }
    }
`;

export const ADD_SPACE_TYPE = gql`
    mutation addSpaceType($input: AddSpaceTypeInput!){
        addSpaceType(input: $input){
            ${RESULT}
            upload {
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;

export const UPDATE_SPACE_TYPE_BASIC = gql`
    mutation updateSpaceTypeBasic($basicInput: UpdateSpaceTypeInput!){
        updateSpaceType(input: $basicInput){
            ${RESULT}
        }
    }
`;

export const UPDATE_SPACE_TYPE_WITH_PHOTO = gql`
    mutation updateSpaceTypeWithPhoto($basicInput: UpdateSpaceTypeInput!, $photoInput: UpdateSpaceTypePhotoInput! ){
        updateSpaceType(input: $basicInput){
            ${RESULT}
        }
        updateSpaceTypePhoto(input: $photoInput){
            ${IMAGE_UPLOAD_RESULT}
        }
    }
`;

export const APPROVE_ACCOUNT = gql`
    mutation approveAccount($accountId: ID!){
        approveAccount(accountId: $accountId){
            ${RESULT}
        }
    }
`;
