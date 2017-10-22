import WebApi from "api/WebApi";
import { PublicUserInfo } from "model/User";

export interface FetchUserReq {
    username: string;
}

export function FetchNamedUser(payload: FetchUserReq) {
    return WebApi.Post<PublicUserInfo>(`users/name/${payload.username}`, {});
}

export default {
    FetchNamedUser
};
