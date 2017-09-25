import CommonResp from "model/Resp";
import * as ApiPath from "api/ApiPath";
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
    return WebApi.Post<CommonResp<UserInfo>>(ApiPath.login, payload);
}

export function Register(payload: RegisterReq) {
    return WebApi.Post<CommonResp<UserInfo>>(ApiPath.register, payload);
}

export function Logout() {
    return WebApi.Post<CommonResp<{}>>(ApiPath.logout, {});
}

export function WhoAmI() {
    return WebApi.Post<CommonResp<UserInfo>>(ApiPath.checkMe, {});
}

export default {
    Login,
    Register,
    Logout
};
