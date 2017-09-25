import CommonResp from "model/Resp";
import * as ApiPath from "api/ApiPath";
import WebApi from "api/WebApi";
import UserInfo from "model/User";

export function Login(username: string, password: string) {
    return WebApi.Post<CommonResp<UserInfo>>(ApiPath.login, {
        username,
        password
    }).then((resp: CommonResp<UserInfo>) => {
        this.setUser(resp.result);
        return resp;
    });
}

export function Register(username: string, email: string, password: string) {
    return WebApi.Post<CommonResp<UserInfo>>(ApiPath.register, {
        username,
        email,
        password
    }).then((resp: CommonResp<UserInfo>) => {
        this.setUser(resp.result);
        return resp;
    });
}

export function Logout() {
    return WebApi.Post<CommonResp<{}>>(
        ApiPath.logout,
        {}
    ).then((resp: CommonResp<{}>) => {
        this.setUser({} as UserInfo);
        return resp;
    });
}

export function WhoAmI() {
    return WebApi.Post<CommonResp<UserInfo>>(
        ApiPath.checkMe,
        {}
    ).then((resp: CommonResp<UserInfo>) => {
        this.setUser(resp.result);
        return resp;
    });
}

export default {
    Login,
    Register,
    Logout
};
