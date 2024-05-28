import RestController from "./RestController";

const authenticationBaseURL = "/userAuth";

type LoginPayload = {
    email: string,
    password: string,
    usePasskeyAuth: boolean,
    challenge: string,
    digest: string
}

export default {
    login: (payload: LoginPayload): Promise<string> => {
        return RestController.post(authenticationBaseURL + "/login", payload);
    }
};

export type { LoginPayload };