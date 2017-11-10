import FormApi from "api/FormApi";
import Userlog from "model/Userlog";
import BalanceRank from "model/BalanceRank";
import Pagination from "model/Pagination";
import { SortOrder } from "enum/Sort";

export interface FetchBalanceDetailReq {
    page: number;
    pageSize: number;
    order: SortOrder;
}

export interface FetchBalanceRankReq {
    page: number;
    pageSize: number;
    order: SortOrder;
}

export interface FetchBalanceCostRankReq {
    page: number;
    pageSize: number;
    order: SortOrder;
}

export function FetchBalanceDetail(payload: FetchBalanceDetailReq) {
    return FormApi.Get<Pagination<Userlog>>("balance", payload);
}

export function FetchBalanceRank(payload: FetchBalanceRankReq) {
    return FormApi.Get<Pagination<BalanceRank>>("balance/rank", payload);
}

export function FetchBalanceCostRank(payload: FetchBalanceCostRankReq) {
    return FormApi.Get<Pagination<BalanceRank>>("balance/costrank", payload);
}

export default {
    FetchBalanceDetail,
    FetchBalanceRank,
    FetchBalanceCostRank
};
