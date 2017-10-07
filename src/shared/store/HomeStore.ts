import { observable, action, computed } from "mobx";
import Channel from "model/Channel";
// import CommonResp from "model/Resp";
// import Pagination from "model/Pagination";
import Topic from "model/Topic";
import { GetAllChannels } from "api/Channel";
import { FetchTopics } from "api/Topic";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 首页Store(单例)
 */
export default class HomeStore extends AbstractStore {
    private static instance: HomeStore;

    public static get Instance() {
        return HomeStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!HomeStore.instance) {
            HomeStore.instance = new HomeStore(arg);
        }
        return HomeStore.instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.homeStore) {
                this.fromJSON(initialState.homeStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        HomeStore.instance = null as any;
    }

    @action
    setField = (field: string, value: any) => {
        this[field] = value;
    };

    /**
     * 所有频道列表
     */
    @observable channels: Channel[] = [];

    @action
    setChannels = (channels: Channel[]) => {
        this.channels = channels;
    };

    @computed
    get topChannels() {
        return this.channels.filter(x => x.pid === 0);
    }

    @computed
    get subChannels() {
        return this.channels.filter(x => x.pid !== 0);
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

    getChannels = () => {
        return GetAllChannels().then(resp => {
            this.setChannels(resp);
            return resp;
        });
    };

    @observable topicsLoading: boolean = false;

    @observable order: SortOrder = SortOrder.DESC;
    @observable orderBy: SortOrderBy = SortOrderBy.LAST_POST_TIME;

    @action
    switchSort = (orderBy: SortOrderBy) => {
        this.orderBy = orderBy;
        this.refreshTopics();
    };

    @action
    getTopics = (keepExist: boolean = false) => {
        const { page, pageSize, topics, order, orderBy } = this;
        const params = {
            page,
            pageSize,
            order,
            orderBy
        };
        this.setField("topicsLoading", true);
        return FetchTopics(params)
            .then(resp => {
                this.setTopics(
                    keepExist ? topics.concat(resp.items) : resp.items
                );
                this.setField("topicsLoading", false);
                if (page === 1) {
                    this.setField("total", resp.total);
                }
                return resp;
            })
            .catch(() => {
                this.setField("topicsLoading", false);
            });
    };

    @action
    getNextPageTopics = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize >= total) {
            return;
        }
        this.setField("page", page + 1);
        this.getTopics(true);
    };

    @action
    refreshTopics = () => {
        this.setTopics([]);
        this.setField("page", 1);
        this.setField("total", 0);
        this.getTopics();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.getChannels());
        promises.push(this.getTopics());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            channels: this.channels,
            topics: this.topics,
            total: this.total
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { channels, topics, total } = json;
        if (typeof channels !== "undefined") {
            this.setChannels(channels);
        }
        if (typeof topics !== "undefined") {
            this.setTopics(topics);
        }
        this.setField("total", total);
        return this;
    }
}
