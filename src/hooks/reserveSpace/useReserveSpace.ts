import { gql } from "@apollo/client";
import { SPACE } from "src/apollo/queries/core.queries";

const GET_SPACE_BY_ID = gql`
    query spaceById($id: ID!) {
        spaceById(id: $id) {
            includedOptions {
                id
                name
            }
            additionalOptions {
                id
                name
            }
        }
    }
`;

const useReserveSpace = (spaceId) => {
    return { spaceId };
};

export default useReserveSpace;
