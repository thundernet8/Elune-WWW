import { observable, action } from "mobx";
import UserInfo from "model/User";
import CommonResp from "model/Resp";
import * as ApiPath from "api/ApiPath";
import WebApi from "api/WebApi";
import IStoreArgument from "interface/IStoreArgument";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 全局Store(单例)
 */
export default class GlobalStore extends AbstractStore {
    private static instance: GlobalStore;

    public static get Instance() {
        return GlobalStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore(arg);
            if (!IS_NODE) {
                GlobalStore.instance.init();
            }
        }
        return GlobalStore.instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.globalStore) {
                this.fromJSON(initialState.globalStore);
            }
        }
    }

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
    fetchData() {
        return this.checkMe();
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            user: this.user
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) return this;
        const { user } = json;
        if (typeof user !== "undefined") {
            this.setUser(user);
        }
        return this;
    }
}
