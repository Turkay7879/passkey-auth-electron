import RestController from "./RestController";

const authenticationBaseURL = "/userAuth";

type LoginBasicPayload = {
    email: string,
    password: string,
    usePasskeyAuth: boolean
}

type LoginPasskeyPayload = {
    email: string,
    usePasskeyAuth: boolean,
    challenge: string,
    digest: string
}

type ChallengePayload = {
    email: string
}

type ChallengeResponse = {
    challenge: string,
    keyAuth: string
}

type PasskeyBody = {
    publicKey: string
}

type AddPasskeyPayload = {
    email: string,
    userPasskeys: PasskeyBody[]
}

export default {
    login: (payload: LoginBasicPayload | LoginPasskeyPayload): Promise<string> => {
        return RestController.post(authenticationBaseURL + "/login", payload);
    },
    getChallenge: (payload: ChallengePayload): Promise<ChallengeResponse> => {
        return RestController.post(authenticationBaseURL + "/getChallenge", payload);
    },
    addPasskey: (payload: AddPasskeyPayload): Promise<any> => {
        return RestController.post(authenticationBaseURL + "/addPasskey", payload);
    }
};

export type { LoginBasicPayload, LoginPasskeyPayload, ChallengePayload, AddPasskeyPayload };