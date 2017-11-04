import CommonResp from "model/Resp";
import WebApi from "api/WebApi";
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
    return WebApi.FormPost<CommonResp<UserInfo>>("signin", payload);
}

export function Register(payload: RegisterReq) {
    return WebApi.FormPost<CommonResp<UserInfo>>(
        payload.ref ? `signup?ref=${payload.ref}` : "signup",
        payload
    );
}

export function Logout() {
    return WebApi.FormPost<CommonResp<{}>>("signout", {});
}

export function WhoAmI() {
    return WebApi.FormPost<CommonResp<UserInfo>>("user/me", {});
}

export function Activate(payload: ActivateReq) {
    return WebApi.FormPost<boolean>(`activate${payload.tokenSearch}`, {});
}

export function ReActivate(payload: ReActivateReq) {
    return WebApi.FormPost<boolean>("reactivate", payload);
}

export default {
    Login,
    Register,
    Logout,
    WhoAmI,
    Activate,
    ReActivate
};
