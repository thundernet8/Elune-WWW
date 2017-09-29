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
}

export function Login(payload: LoginReq) {
    return WebApi.Post<CommonResp<UserInfo>>("signin", payload);
}

export function Register(payload: RegisterReq) {
    return WebApi.Post<CommonResp<UserInfo>>("signup", payload);
}

export function Logout() {
    return WebApi.Post<CommonResp<{}>>("signout", {});
}

export function WhoAmI() {
    return WebApi.Post<CommonResp<UserInfo>>("user/me", {});
}

export default {
    Login,
    Register,
    Logout
};
