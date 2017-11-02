import WebApi from "api/WebApi";

export interface OnlineStatisticResp {
    total: number;
    logged: number;
    anonymous: number;
}

export function OnlineStatistic() {
    return WebApi.Post<OnlineStatisticResp>("status/online", {});
}

export default {
    OnlineStatistic
};
