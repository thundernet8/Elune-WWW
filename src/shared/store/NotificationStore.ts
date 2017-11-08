import { observable, action, computed } from "mobx";
import IStoreArgument from "interface/IStoreArgument";
import { FetchNotifications } from "api/Notifications";
import Notification from "model/Notification";
import { SortOrder } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 通知中心Store(单例)
 */
export default class NotificationStore extends AbstractStore {
    private static instance: NotificationStore;

    private type: string;

    public static get Instance() {
        return NotificationStore.getInstance({} as any);
    }

    public static getInstance(
        arg: IStoreArgument = {} as IStoreArgument,
        type: string = "user"
    ) {
        if (
            !NotificationStore.instance ||
            NotificationStore.instance.type !== type
        ) {
            NotificationStore.instance = new NotificationStore(arg, type);
        }
        return NotificationStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = NotificationStore.getInstance(arg);
        instance.reset(arg);
        instance.loading = false;
        instance.notifications = [];
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
            if (initialState && initialState.notificationStore) {
                this.fromJSON(initialState.notificationStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        NotificationStore.instance = null as any;
    }

    @observable loading: boolean = false;

    /**
     * 通知列表
     */
    @observable notifications: Notification[] = [];

    @observable page: number = 1;
    @observable pageSize: number = 20;
    @observable total = -1;

    @computed
    get hasMore() {
        const { page, pageSize, total } = this;
        return total === -1 || page * pageSize < total;
    }

    @observable order: SortOrder = SortOrder.DESC;

    @action
    getNotifications = () => {
        const { page, pageSize, notifications, order, loading, type } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page,
            pageSize,
            order
        };

        if (type === "system") {
            params.type = type;
        } else {
            params.type = "user";
        }

        this.loading = true;
        return FetchNotifications(params)
            .then(resp => {
                this.notifications = notifications.concat(resp.items);
                this.total = resp.total;
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageNotifications = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize > total) {
            return;
        }
        this.page = page + 1;
        this.getNotifications();
    };

    @action
    refresh = () => {
        this.notifications = [];
        this.page = 1;
        this.total = 0;
        this.getNotifications();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.getNotifications());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        const { notifications, total } = this;
        return Object.assign(obj, {
            notifications,
            total
        });
    }

    @action
    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { notifications, total } = json;
        if (typeof notifications !== "undefined") {
            this.notifications = notifications;
        }
        if (typeof total !== "undefined") {
            this.total = Number(total);
        }
        return this;
    }
}
