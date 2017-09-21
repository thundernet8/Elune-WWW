import { observable, action } from "mobx";
import UserInfo from "model/User";
import CommonResp from "model/Resp";
import * as ApiPath from "api/ApiPath";
import WebApi from "api/WebApi";
import { IS_NODE } from "../../../env";

/**
 * 全局Store(单例)
 */
export default class GlobalStore {
    private static instance: GlobalStore;
    private cookies: string;

    public static get Instance() {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore("");
            if (!IS_NODE) {
                GlobalStore.instance.init();
            }
        }
        return GlobalStore.instance;
    }

    /**
     * @param param0 match when under ssr env
     */
    public static getInstance({ cookies }) {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore(cookies);
            if (!IS_NODE) {
                GlobalStore.instance.init();
            }
        } else {
            GlobalStore.instance.setCookies(cookies);
        }
        return GlobalStore.instance;
    }

    private constructor(cookies: string) {
        this.cookies = cookies;
        // this.init(); // may cause cycle call
    }

    public get Cookies() {
        return this.cookies || "";
    }

    /**
     * SSR时需要转发cookies(包含sessionId)
     */
    setCookies = (cookies: string) => {
        this.cookies = cookies;
    };

    /**
     * 当前用户
     */
    @observable user: UserInfo;

    @action
    setUser = (user: UserInfo) => {
        this.user = user;
    };

    /**
     * 请求登录
     */
    @action
    requestLogin = (username: string, password: string) => {
        return WebApi.Post<CommonResp<UserInfo>>(ApiPath.login, {
            username,
            password
        }).then((resp: CommonResp<UserInfo>) => {
            this.setUser(resp.result);
            return resp;
        });
    };

    /**
     * 请求注册
     */
    @action
    requestRegister = (username: string, email: string, password: string) => {
        return WebApi.Post<CommonResp<UserInfo>>(ApiPath.register, {
            username,
            email,
            password
        }).then((resp: CommonResp<UserInfo>) => {
            this.setUser(resp.result);
            return resp;
        });
    };

    /**
     * 请求注销
     */
    @action
    requestLogout = () => {
        return WebApi.Post<CommonResp<{}>>(
            ApiPath.logout,
            {}
        ).then((resp: CommonResp<{}>) => {
            this.setUser({} as UserInfo);
            return resp;
        });
    };

    /**
     * 初始化
     */
    init = () => {
        this.checkMe();
    };

    /**
     * 初始化 - 根据会话获取当前用户信息
     */
    checkMe = () => {
        return WebApi.Post<CommonResp<UserInfo>>(
            ApiPath.checkMe,
            {}
        ).then((resp: CommonResp<UserInfo>) => {
            this.setUser(resp.result);
            return resp;
        });
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData = () => {
        return this.checkMe();
    };
}
