import { observable, action } from "mobx";
import { FetchNamedUser } from "api/User";
import { PublicUserInfo } from "model/User";
import IStoreArgument from "interface/IStoreArgument";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 用户中心Store(单例)
 */
export default class UCStore extends AbstractStore {
    private static instance: UCStore;

    public static get Instance() {
        return UCStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!UCStore.instance) {
            UCStore.instance = new UCStore(arg);
        }
        return UCStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = UCStore.getInstance(arg);
        instance.reset(arg);
        instance.loading = true;
        instance.user = {} as any;
        instance.fetchData();
        return instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.uCStore) {
                this.fromJSON(initialState.uCStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        UCStore.instance = null as any;
    }

    @action
    setField = (field: string, value: any) => {
        this[field] = value;
    };

    @observable loading: boolean = false;

    /**
     * 当前用户
     */
    @observable user: PublicUserInfo = {} as any;

    @action
    getUser = () => {
        if (this.loading) {
            return Promise.reject(false);
        }
        const { username } = this.Match.params;
        this.loading = true;
        return FetchNamedUser({ username }).then(resp => {
            this.setField("user", resp || {});
            this.setField("loading", false);
        });
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.getUser());
        return Promise.all(promises);
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
        const { user } = json;
        if (typeof user !== "undefined") {
            this.setField("user", user);
        }
        return this;
    }
}
