import { observable, action, computed } from "mobx";
import IStoreArgument from "interface/IStoreArgument";
import { FetchFollowingUsers } from "api/User";
import { FetchFollowingActivities } from "api/Activities";
import Userlog from "model/Userlog";
import { BaseUserInfo } from "model/User";
import { SortOrder } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 关注用户及用户动态Store(单例)
 */
export default class FollowStore extends AbstractStore {
    private static instance: FollowStore;

    private type: string;

    public static get Instance() {
        return FollowStore.getInstance({} as any);
    }

    public static getInstance(
        arg: IStoreArgument = {} as IStoreArgument,
        type: string = "users"
    ) {
        if (!FollowStore.instance || FollowStore.instance.type !== type) {
            FollowStore.instance = new FollowStore(arg, type);
        }
        return FollowStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = FollowStore.getInstance(arg);
        instance.reset(arg);
        instance.loading = false;
        instance.users = [];
        instance.activities = [];
        instance.page = Number(arg.match.params.page) || 1;
        instance.total = -1;
        instance.fetchData();
        return instance;
    }

    private constructor(arg: IStoreArgument, type) {
        super(arg);

        this.type = type;
        this.page = Number(arg.match.params.page) || 1;
        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.followStore) {
                this.fromJSON(initialState.followStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        FollowStore.instance = null as any;
    }

    @observable loading: boolean = false;
    @observable order: SortOrder = SortOrder.DESC;

    @observable page: number = 1;
    @observable pageSize: number = 10;
    @observable total = -1;

    /**
     * 用户列表
     */
    @observable users: BaseUserInfo[] = [];

    @computed
    get hasMoreUsers() {
        const { page, pageSize, total } = this;
        return total === -1 || page * pageSize < total;
    }

    @action
    getFollowUsers = () => {
        const { page, pageSize, users, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page,
            pageSize,
            order
        };

        this.loading = true;
        return FetchFollowingUsers(params)
            .then(resp => {
                this.users = users.concat(resp.items);
                this.total = resp.total;
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageUsers = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize > total) {
            return;
        }
        this.page = page + 1;
        this.getFollowUsers();
    };

    @action
    refreshUsers = () => {
        this.users = [];
        this.page = 1;
        this.total = 0;
        this.getFollowUsers();
    };

    /**
     * 用户动态列表
     */
    @observable activities: Userlog[] = [];

    @computed
    get hasMoreActivities() {
        const { page, pageSize, total } = this;
        return total === -1 || page * pageSize < total;
    }

    @action
    getFollowActivities = () => {
        const { page, pageSize, activities, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page,
            pageSize,
            order
        };

        this.loading = true;
        return FetchFollowingActivities(params)
            .then(resp => {
                this.activities = activities.concat(resp.items);
                this.total = resp.total;
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageActivities = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize > total) {
            return;
        }
        this.page = page + 1;
        this.getFollowActivities();
    };

    @action
    refreshActivities = () => {
        this.activities = [];
        this.page = 1;
        this.total = 0;
        this.getFollowActivities();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        if (this.type === "users") {
            promises.push(this.getFollowUsers());
        } else {
            promises.push(this.getFollowActivities());
        }
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        const { users, activities, total } = this;
        return Object.assign(obj, {
            users,
            activities,
            total
        });
    }

    @action
    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { users, activities, total } = json;
        if (typeof users !== "undefined") {
            this.users = users;
        }
        if (typeof activities !== "undefined") {
            this.activities = activities;
        }
        if (typeof total !== "undefined") {
            this.total = Number(total);
        }
        return this;
    }
}
