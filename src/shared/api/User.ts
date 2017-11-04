import WebApi from "api/WebApi";
import { PublicUserInfo } from "model/User";
import Pagination from "model/Pagination";
import UserProfileSetting from "interface/UserProfileSetting";
import Topic from "model/Topic";
import CommonResp from "model/Resp";

export interface FetchUserReq {
    username: string;
}

export interface FetchUserFavoritesReq {
    page: number;
    pageSize: number;
}

export function FetchNamedUser(payload: FetchUserReq) {
    return WebApi.FormPost<PublicUserInfo>("users/name", payload);
}

export function FetchUserFavorites(payload: FetchUserFavoritesReq) {
    return WebApi.Get<Pagination<Topic>>("usermetas/favorites", payload);
}

export function UpdateUserProfile(payload: UserProfileSetting) {
    return WebApi.Post<Boolean>("users/profile", payload);
}

export function DailySign() {
    return WebApi.FormPost<CommonResp<number>>("users/dailySign", {});
}

export default {
    FetchNamedUser,
    FetchUserFavorites,
    UpdateUserProfile,
    DailySign
};
