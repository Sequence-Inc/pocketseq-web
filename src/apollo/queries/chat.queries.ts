import { gql } from "@apollo/client";
import { PHOTO } from "./core.queries";

export const MY_CHAT = gql`
    query MyChat{
  myChats{
    id
    type
    members{
      __typename
      ... on UserProfile{
        id
        accountId
        firstName
        lastName
        profilePhoto {
          ${PHOTO}
        }
        host {
            name
            profilePhoto {
                ${PHOTO}
            }
        }
      }
      ... on CompanyProfile{
        id
        accountId
        name
        profilePhoto {
          ${PHOTO}
        }
        host {
            name
            profilePhoto {
                ${PHOTO}
            }
        }
      }
    }
    messages{
      id
      message
      sender{
        ... on UserProfile{
            id
        }
        ... on CompanyProfile{
            id
        }
      }
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`;

export const CREATE_NEW_CHAT = gql`
    mutation CreateNewChat($input: CreateNewChatInput!) {
        createNewChat(input: $input) {
            chatId
            messageId
            delivered
        }
    }
`;

export const SEND_MESSAGE = gql`
    mutation SendMessage($input: SendMessageInput!) {
        sendMessage(input: $input) {
            chatId
            messageId
            delivered
        }
    }
`;
