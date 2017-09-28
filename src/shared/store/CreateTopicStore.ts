import { observable, action } from "mobx";
import Channel from "model/channel";
// import CommonResp from "model/Resp";
import { GetAllChannels } from "api/Channel";
// import { CreateTopic } from "api/Topic";
import IStoreArgument from "interface/IStoreArgument";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 创建话题页面Store(单例)
 */
export default class CreateTopicStore extends AbstractStore {
    private static instance: CreateTopicStore;

    public static get Instance() {
        return CreateTopicStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!CreateTopicStore.instance) {
            CreateTopicStore.instance = new CreateTopicStore(arg);
        }
        return CreateTopicStore.instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.createTopicStore) {
                this.fromJSON(initialState.createTopicStore);
            } else {
                this.fetchData();
            }
        }
    }

    /**
     * 所有频道列表 // TODO 频道层级
     */
    @observable channels: Channel[] = [];

    @action
    setChannels = (channels: Channel[]) => {
        this.channels = channels;
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        return GetAllChannels().then(resp => {
            this.setChannels(resp);
        });
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
