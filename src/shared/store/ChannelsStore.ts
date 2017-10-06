import { observable, action, computed } from "mobx";
import Channel from "model/Channel";
import { GetAllChannels } from "api/Channel";
import IStoreArgument from "interface/IStoreArgument";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * Channels页Store(单例)
 */
export default class ChannelsStore extends AbstractStore {
    private static instance: ChannelsStore;

    public static get Instance() {
        return ChannelsStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!ChannelsStore.instance) {
            ChannelsStore.instance = new ChannelsStore(arg);
        }
        return ChannelsStore.instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.ChannelsStore) {
                this.fromJSON(initialState.ChannelsStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        ChannelsStore.instance = null as any;
    }

    @action
    setField = (field: string, value: any) => {
        this[field] = value;
    };

    @observable loading: boolean = false;

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

    @computed
    get subChannelsMap() {
        const map = {};
        this.subChannels.forEach(channel => {
            if (map[channel.pid]) {
                map[channel.pid].push(channel);
            } else {
                map[channel.pid] = [channel];
            }
        });

        return map;
    }

    @action
    getChannels = () => {
        if (this.loading) {
            return Promise.reject(false);
        }
        this.loading = true;
        return GetAllChannels().then(resp => {
            this.setChannels(resp);
            this.loading = false;
        });
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        return this.getChannels();
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            channels: this.channels
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { channels } = json;
        if (typeof channels !== "undefined") {
            this.setChannels(channels);
        }
        return this;
    }
}
