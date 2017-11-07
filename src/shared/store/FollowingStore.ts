import { observable, action, computed } from "mobx";
import Topic from "model/Topic";
import { FetchUserFollowings } from "api/Usermeta";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * Following页Store(单例)
 */
export default class FollowingStore extends AbstractStore {
    private static instance: FollowingStore;

    public static get Instance() {
        return FollowingStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!FollowingStore.instance) {
            FollowingStore.instance = new FollowingStore(arg);
        }
        return FollowingStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = FollowingStore.getInstance(arg);
        instance.reset(arg);
        instance.topicsLoading = true;
        instance.topics = [];
        instance.page = 1;
        instance.total = -1;
        instance.fetchData();
        return instance;
    }

    public destroy() {
        FollowingStore.instance = null as any;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.followingStore) {
                this.fromJSON(initialState.followingStore);
            } else {
                this.fetchData();
            }
        }
    }

    /**
     * 当前页的Topic列表
     */
    @observable topics: Topic[] = [];

    @action
    setTopics = (topics: Topic[]) => {
        this.topics = topics;
    };

    @observable page: number = 1;
    @observable pageSize: number = 20;
    @observable total: number = -1;

    @computed
    get hasMoreTopic() {
        const { page, pageSize, total } = this;
        return total === -1 || page * pageSize < total;
    }

    @observable topicsLoading: boolean = false;

    @observable order: SortOrder = SortOrder.DESC;
    @observable orderBy: SortOrderBy = SortOrderBy.ID;

    @action
    switchSort = (orderBy: SortOrderBy) => {
        this.orderBy = orderBy;
        this.refreshTopics();
    };

    @action
    getFollowingTopics = () => {
        const { page, pageSize, topics, order } = this;
        const params = {
            page,
            pageSize,
            order
        };
        this.topicsLoading = true;
        return FetchUserFollowings(params)
            .then(resp => {
                this.setTopics(topics.concat(resp.items));
                if (page === 1) {
                    this.total = resp.total;
                }
                return resp;
            })
            .finally(() => {
                this.topicsLoading = false;
            });
    };

    @action
    getNextPageTopics = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize >= total) {
            return;
        }
        this.page = page + 1;
        this.getFollowingTopics();
    };

    @action
    refreshTopics = () => {
        this.setTopics([]);
        this.page = 1;
        this.total = 0;
        this.getFollowingTopics();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.getFollowingTopics());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            topics: this.topics,
            total: this.total
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { topics, total } = json;
        if (typeof topics !== "undefined") {
            this.setTopics(topics);
        }
        this.total = total || -1;
        return this;
    }
}
