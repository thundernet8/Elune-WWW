import { observable, action } from "mobx";
import UserInfo from "model/User";
import CommonResp from "model/Resp";
import * as ApiPath from "api/ApiPath";
import WebApi from "api/WebApi";

/**
 * 全局Store(单例)
 */
export default class GlobalStore {
    private static instance: GlobalStore;
    private sessionId: string;

    public static get Instance() {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore("");
            GlobalStore.instance.init();
        }
        return GlobalStore.instance;
    }

    public static getInstance(sessionId: string) {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore(sessionId);
            GlobalStore.instance.init();
        } else {
            GlobalStore.instance.setSessionId(sessionId);
        }
        return GlobalStore.instance;
    }

    private constructor(sessionId: string) {
        this.sessionId = sessionId;
        // this.init(); // may cause cycle call
    }

    public get SessionId() {
        return this.sessionId || "";
    }

    /**
     * 保存来自cookie并经由staticRouter context传递的SESSIONID
     */
    setSessionId = (sessiondId: string) => {
        this.sessionId = sessiondId;
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
}
