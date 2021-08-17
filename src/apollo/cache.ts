import { makeVar } from '@apollo/client';

interface IIsLoggedIn {
    session: boolean;
    role: string;
}

export interface ILocalState {
    isLoggedIn: IIsLoggedIn;
}

const localStateInitialValue: ILocalState = {
    isLoggedIn: {
        session: false,
        role: ""
    }
}

export const userSession = makeVar<ILocalState>(localStateInitialValue);