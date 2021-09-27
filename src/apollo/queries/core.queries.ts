export const IMAGE = `
    url
    height
    width
`;

export const PROFILE_PHOTO = `
    id
    mime
    thumbnail {
        ${IMAGE}
    }
    medium {
        ${IMAGE}
    }
`;

export const PHOTO = `
    id
    mime
    thumbnail {
        ${IMAGE}
    }
    small {
        ${IMAGE}
    }
    medium {
        ${IMAGE}
    }
    large {
        ${IMAGE}
    }
`;

export const STRIPE_ACCOUNT = `
    message
    url
    balance {
        available {
            currency
            amount
        }
        pending {
            currency
            amount
        }
    }
`;

export const PREFECTURE = `
    id
    name
    nameKana
    nameRomaji
    available
`;

export const ADDRESS = `
    id
    addressLine1
    addressLine2
    city
    longitude
    latitude
    postalCode
    prefecture {
        ${PREFECTURE}
    }
`;

export const HOST = `
    id
    type
    name
    approved
    photoId {
        id
        mime
        thumbnail {
            ${IMAGE}
        }
        medium {
            ${IMAGE}
        }
    }
    profilePhoto {
        id
        mime
        thumbnail {
            ${IMAGE}
        }
        medium {
            ${IMAGE}
        }
    }
    stripeAccountId
    account {
        ${STRIPE_ACCOUNT}
    }
    createdAt
    updatedAt

`;

export const USER_ACCOUNT = `
    ...on UserProfile {
        id
        firstName
        lastName
        firstNameKana
        lastNameKana
        roles
        email
        phoneNumber
        emailVerified
        profilePhoto {
            ${PROFILE_PHOTO}
        }
        address {
            ${ADDRESS}
        }
        host {
            ${HOST}
        }
        approved
        suspended
        createdAt
        updatedAt
    }
`;

export const COMPANY_ACCOUNT = `
    ...on CompanyProfile {
        id
        name
        nameKana
        roles
        email
        phoneNumber
        emailVerified
        registrationNumber
        profilePhoto {
            ${PROFILE_PHOTO}
        }
        address {
             ${ADDRESS}
        }
        host {
            ${HOST}
        }
        approved
        suspended
        createdAt
        updatedAt
    }
`;

export const RESULT = `
    message
    action
`;

export const IMAGE_UPLOAD_RESULT = `
    type
    mime
    key
    url
`;

export const SPACE_TYPE = `
    id
    title
    description
    available
    photo {
        ${PHOTO}
    }
`;
