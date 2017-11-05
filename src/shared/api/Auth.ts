import CommonResp from "model/Resp";
import WebApi from "api/WebApi";
import FormApi from "api/FormApi";
import UserInfo from "model/User";

export interface LoginReq {
    username: string;
    password: string;
}

export interface RegisterReq {
    username: string;
    email: string;
    password: string;
    ref?: number;
}

export interface ActivateReq {
    tokenSearch: string;
}

export interface ReActivateReq {
    email: string;
}

export function Login(payload: LoginReq) {
    return FormApi.Post<CommonResp<UserInfo>>("signin", payload);
}

export function Register(payload: RegisterReq) {
    return FormApi.Post<CommonResp<UserInfo>>(
        payload.ref ? `signup?ref=${payload.ref}` : "signup",
        payload
    );
}

export function Logout() {
    return FormApi.Post<CommonResp<{}>>("signout", {});
}

export function WhoAmI() {
    return FormApi.Post<CommonResp<UserInfo>>("user/me", {});
}

export function Activate(payload: ActivateReq) {
    return FormApi.Post<boolean>(`activate${payload.tokenSearch}`, {});
}

export function ReActivate(payload: ReActivateReq) {
    return FormApi.Post<boolean>("reactivate", payload);
}

export default {
    Login,
    Register,
    Logout,
    WhoAmI,
    Activate,
    ReActivate
};
