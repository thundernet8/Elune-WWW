import WebApi from "api/WebApi";
import FormApi from "api/FormApi";
import Pagination from "model/Pagination";
import Userlog from "model/Userlog";
import { SortOrder } from "enum/Sort";

export interface FetchUsersActivitiesReq {
    page: number;
    pageSize: number;
    order: SortOrder;
    ids: number[];
}

export interface FetchFollowingActivitiesReq {
    page: number;
    pageSize: number;
    order: SortOrder;
}

export interface FetchBalanceActivitiesReq {
    page: number;
    pageSize: number;
    order: SortOrder;
}

export function FetchUsersActivities(payload: FetchUsersActivitiesReq) {
    return WebApi.Post<
        Pagination<Userlog>
    >(
        `activities?page=${payload.page}&pageSize=${payload.pageSize}&order=${payload.order}`,
        { ids: payload.ids }
    );
}

export function FetchFollowingActivities(payload: FetchFollowingActivitiesReq) {
    return FormApi.Get<Pagination<Userlog>>("activities/following", payload);
}

export function FetchBalanceActivities(payload: FetchBalanceActivitiesReq) {
    return FormApi.Get<Pagination<Userlog>>("activities/balance", payload);
}

export default {
    FetchUsersActivities,
    FetchFollowingActivities,
    FetchBalanceActivities
};
