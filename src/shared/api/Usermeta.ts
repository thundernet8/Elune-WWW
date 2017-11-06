import FormApi from "api/FormApi";
import Pagination from "model/Pagination";
import Topic from "model/Topic";
import { BaseUserInfo } from "model/User";

export interface FetchUserFollowingsReq {
    page: number;
    pageSize: number;
}

export interface FollowTopicReq {
    id: number;
}

export interface UnFollowTopicReq {
    id: number;
}

export interface FetchFollowingUsersReq {
    page: number;
    pageSize: number;
}

export interface FollowUserReq {
    id: number;
}

export interface UnFollowUserReq {
    id: number;
}

export function FetchUserFollowings(payload: FetchUserFollowingsReq) {
    return FormApi.Get<Pagination<Topic>>(
        "usermetas/following/topics",
        payload
    );
}

export function FollowTopic(payload: FollowTopicReq) {
    return FormApi.Post<Boolean>("usermetas/following/topics", payload);
}

export function UnFollowTopic(payload: UnFollowTopicReq) {
    return FormApi.Delete<Boolean>(
        `usermetas/following/topics/${payload.id}`,
        {}
    );
}

export function FetchFollowingUsers(payload: FetchFollowingUsersReq) {
    return FormApi.Get<Pagination<BaseUserInfo>>(
        "usermetas/following/users",
        payload
    );
}

export function FollowUser(payload: FollowUserReq) {
    return FormApi.Post<Boolean>("usermetas/following/users", payload);
}

export function UnFollowUser(payload: UnFollowUserReq) {
    return FormApi.Delete<Boolean>(
        `usermetas/following/users/${payload.id}`,
        {}
    );
}

export default {
    FetchUserFollowings,
    FollowTopic,
    UnFollowTopic,
    FetchFollowingUsers,
    FollowUser,
    UnFollowUser
};
