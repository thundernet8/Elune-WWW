import { observable, action, autorun, computed } from "mobx";
import UserInfo from "model/User";
import CommonResp from "model/Resp";
import { Login, Register, Logout, WhoAmI } from "api/Auth";
import IStoreArgument from "interface/IStoreArgument";
import BannerMsg from "interface/BannerMsg";
import { AuthType } from "enum/Auth";
import { EntityStatus } from "enum/EntityStatus";
import { addQuery } from "utils/UrlKit";
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

        // 如果当前登录用户未激活则展示全局banner消息提醒
        autorun(() => {
            const { user } = this;
            if (user && user.status === EntityStatus.DELETEDORUNACTIVE) {
                this.setBulletion({
                    text: "您的账户尚未激活，请立即查收激活邮件进行激活"
                });
            }
        });
    }

    public destroy() {
        GlobalStore.instance = null as any;
    }

    @computed
    get URL() {
        if (IS_NODE) {
            return this.Location.url;
        }
        return `${location.protocol}//${location.host}${location.pathname}`;
    }

    @computed
    get HREF() {
        if (IS_NODE) {
            return this.Location.url;
        }
        return location.href;
    }

    @action
    getRefUrl = (id?: string) => {
        const { user, HREF } = this;
        if (id || (user && user.id)) {
            return addQuery(HREF || "", "ref", id || user.id.toString(), false);
        }
        return HREF;
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
        return Login({
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
        return Register({
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
        return Logout().then((resp: CommonResp<{}>) => {
            this.setUser({} as UserInfo);
            return resp;
        });
    };

    /**
     * 用于判断展示登录/注销框体
     */
    @observable authType: AuthType = AuthType.None;

    @action
    switchAuthModal = (authType: AuthType) => {
        this.authType = authType;
    };

    @action
    showLoginAuthModal = () => {
        this.authType = AuthType.Login;
    };

    @action
    closeAuthModal = () => {
        this.authType = AuthType.None;
    };

    /**
     * 全局公告消息
     */
    @observable bannerMsg: BannerMsg;

    @action
    setBulletion = (msg: BannerMsg) => {
        this.bannerMsg = msg;
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

    @observable userPromise: Promise<UserInfo>;

    checkMe = () => {
        this.userPromise = WhoAmI().then((resp: CommonResp<UserInfo>) => {
            this.setUser(resp.result);
            return resp.result;
        });
        return this.userPromise;
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
        if (!json) {
            return this;
        }
        const { user, bannerMsg } = json;
        if (typeof user !== "undefined") {
            this.setUser(user);
        }
        if (typeof bannerMsg !== "undefined") {
            this.setBulletion(bannerMsg);
        }
        return this;
    }
}
