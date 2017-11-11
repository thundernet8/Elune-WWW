import WebApi from "api/WebApi";
import FormApi from "api/FormApi";
import { PublicUserInfo, BaseUserInfo } from "model/User";
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
    return FormApi.Post<PublicUserInfo>("users/name", payload);
}

export function FetchUserFavorites(payload: FetchUserFavoritesReq) {
    return FormApi.Get<Pagination<Topic>>("usermetas/favorites", payload);
}

export function FetchFollowingUsers(payload: {}) {
    return FormApi.Get<Pagination<BaseUserInfo>>(
        "usermetas/following/users",
        payload
    );
}

export function UpdateUserProfile(payload: UserProfileSetting) {
    return WebApi.Post<Boolean>("users/profile", payload);
}

export function DailySign() {
    return FormApi.Post<CommonResp<number>>("users/dailySign", {});
}

export default {
    FetchNamedUser,
    FetchUserFavorites,
    FetchFollowingUsers,
    UpdateUserProfile,
    DailySign
};
