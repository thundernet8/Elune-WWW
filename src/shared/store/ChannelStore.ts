import { observable, action, computed } from "mobx";
import Channel from "model/Channel";
// import CommonResp from "model/Resp";
// import Pagination from "model/Pagination";
import Topic from "model/Topic";
import { GetChannelBySlug } from "api/Channel";
import { FetchChannelTopics } from "api/Topic";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * Channel页Store(单例)
 */
export default class ChannelStore extends AbstractStore {
    private static instance: ChannelStore;

    public static get Instance() {
        return ChannelStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!ChannelStore.instance) {
            ChannelStore.instance = new ChannelStore(arg);
        }
        return ChannelStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = ChannelStore.getInstance(arg);
        instance.reset(arg);
        instance.topicsLoading = true;
        instance.topics = [];
        instance.page = 1;
        instance.total = -1;
        instance.fetchData();
        return instance;
    }

    public destroy() {
        ChannelStore.instance = null as any;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.channelStore) {
                this.fromJSON(initialState.channelStore);
            } else {
                this.fetchData();
            }
        }
    }

    @action
    setField = (field: string, value: any) => {
        this[field] = value;
    };

    /**
     * 当前频道
     */
    @observable channel: Channel;

    @action
    setChannel = (channel: Channel) => {
        this.channel = channel;
    };

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

    getChannel = () => {
        const { Match } = this;
        if (!Match || !Match.params.slug) {
            return Promise.reject(false);
        }

        const { slug } = Match.params;

        return GetChannelBySlug(slug).then(resp => {
            this.setChannel(resp);
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
    getChannelTopics = (channel: Channel) => {
        const { page, pageSize, topics, order, orderBy } = this;
        const params = {
            page,
            pageSize,
            order,
            orderBy,
            channelId: channel.id
        };
        this.setField("topicsLoading", true);
        return FetchChannelTopics(params)
            .then(resp => {
                this.setTopics(topics.concat(resp.items));
                this.setField("topicsLoading", false);
                this.setField("total", resp.total);
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
        this.getChannelTopics(this.channel);
    };

    @action
    refreshTopics = () => {
        this.setTopics([]);
        this.setField("page", 1);
        this.setField("total", 0);
        this.getChannelTopics(this.channel);
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(
            this.getChannel().then((channel: Channel) => {
                return this.getChannelTopics(channel);
            })
        );
        // promises.push(this.getTopics());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            channel: this.channel,
            topics: this.topics,
            total: this.total
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { channel, topics, total } = json;
        if (typeof channel !== "undefined") {
            this.setChannel(channel);
        }
        if (typeof topics !== "undefined") {
            this.setTopics(topics);
        }
        this.setField("total", total);
        return this;
    }
}
