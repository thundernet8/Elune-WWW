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

    private constructor(arg: IStoreArgument, type) {
        super(arg);

        this.type = type;
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

    /**
     * 用户列表
     */
    @observable users: BaseUserInfo[] = [];

    @observable userPage: number = 1;
    @observable userPageSize: number = 10;
    @observable userTotal = -1;

    @computed
    get hasMoreUsers() {
        const { userPage, userPageSize, userTotal } = this;
        return userTotal === -1 || userPage * userPageSize < userTotal;
    }

    @action
    getFollowUsers = () => {
        const { userPage, userPageSize, users, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page: userPage,
            pageSize: userPageSize,
            order
        };

        this.loading = true;
        return FetchFollowingUsers(params)
            .then(resp => {
                this.users = users.concat(resp.items);
                if (userPage === 1) {
                    this.userTotal = resp.total;
                }
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageUsers = () => {
        const { userPage, userPageSize, userTotal } = this;
        if ((userPage - 1) * userPageSize > userTotal) {
            return;
        }
        this.userPage = userPage + 1;
        this.getFollowUsers();
    };

    @action
    refreshUsers = () => {
        this.users = [];
        this.userPage = 1;
        this.userTotal = 0;
        this.getFollowUsers();
    };

    /**
     * 用户动态列表
     */
    @observable activities: Userlog[] = [];

    @observable logPage: number = 1;
    @observable logPageSize: number = 20;
    @observable logTotal = -1;

    @computed
    get hasMoreActivities() {
        const { logPage, logPageSize, logTotal } = this;
        return logTotal === -1 || logPage * logPageSize < logTotal;
    }

    @action
    getFollowActivities = () => {
        const { logPage, logPageSize, activities, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page: logPage,
            pageSize: logPageSize,
            order
        };

        this.loading = true;
        return FetchFollowingActivities(params)
            .then(resp => {
                this.activities = activities.concat(resp.items);
                if (logPage === 1) {
                    this.logTotal = resp.total;
                }
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageActivities = () => {
        const { logPage, logPageSize, logTotal } = this;
        if ((logPage - 1) * logPageSize > logTotal) {
            return;
        }
        this.logPage = logPage + 1;
        this.getFollowActivities();
    };

    @action
    refreshActivities = () => {
        this.activities = [];
        this.logPage = 1;
        this.logTotal = 0;
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
        const { users, activities, userTotal, logTotal } = this;
        return Object.assign(obj, {
            users,
            activities,
            userTotal,
            logTotal
        });
    }

    @action
    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { users, activities, userTotal, logTotal } = json;
        if (typeof users !== "undefined") {
            this.users = users;
        }
        if (typeof userTotal !== "undefined") {
            this.userTotal = Number(userTotal);
        }
        if (typeof activities !== "undefined") {
            this.activities = activities;
        }
        if (typeof logTotal !== "undefined") {
            this.logTotal = Number(logTotal);
        }
        return this;
    }
}
