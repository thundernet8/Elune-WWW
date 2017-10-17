import WebApi from "api/WebApi";
import { PublicUserInfo } from "model/User";

export interface FetchUserReq {
    username: string;
}

export function FetchUser(payload: FetchUserReq) {
    return WebApi.Get<PublicUserInfo>(`users/name/${payload.username}`, {});
}

export default {
    FetchUser
};
