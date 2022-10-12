import { gql } from "@apollo/client";

export const CONTACT_FORM = gql`
    mutation ContactForm(
        $customerType: String!
        $email: String!
        $inquiryType: String!
        $subject: String!
        $description: String!
    ) {
        contactForm(
            customerType: $customerType
            email: $email
            inquiryType: $inquiryType
            subject: $subject
            description: $description
        ) {
            message
            action
        }
    }
`;
