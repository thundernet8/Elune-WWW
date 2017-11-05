import FormApi from "api/FormApi";

export interface OnlineStatisticResp {
    total: number;
    logged: number;
    anonymous: number;
}

export function OnlineStatistic() {
    return FormApi.Post<OnlineStatisticResp>("status/online", {});
}

export default {
    OnlineStatistic
};
