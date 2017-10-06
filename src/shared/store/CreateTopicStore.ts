import { observable, action, computed } from "mobx";
import Channel from "model/Channel";
// import CommonResp from "model/Resp";
import { GetAllChannels } from "api/Channel";
import { CreateTopic } from "api/Topic";
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

    public destroy() {
        CreateTopicStore.instance = null as any;
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
     * 是否显示频道选择Modal
     */
    @observable showChannels: boolean = false;

    @action
    toggleChannelsModal = () => {
        this.showChannels = !this.showChannels;
    };

    /**
     * 已选择的频道
     */
    @observable selectedChannel: Channel = null as any;

    @observable pendingSelectChannel: Channel = null as any;

    @action
    preSelectChannel = (id: number) => {
        const channel = this.channels.find(x => x.id === id);
        this.pendingSelectChannel = channel as Channel;
    };

    @action
    confirmSelectChannel = () => {
        this.selectedChannel = this.pendingSelectChannel;
        this.showChannels = false;
    };

    @observable title: string = "";

    /**
     * 输入文章标题
     */
    @action
    onInputTitle = (e: any) => {
        this.title = e.target.value;
    };

    @observable contentPlain: string = "";
    @observable contentHtml: string = "";
    @observable contentRaw: string = "";

    /**
     * 输入文章内容
     */
    @action
    contentChange = (raw: string, html: string, plainText: string) => {
        // console.log(raw);
        // console.log(html);
        // console.log(plainText);
        this.contentPlain = plainText;
        this.contentHtml = html;
        this.contentRaw = raw;
    };

    @observable requesting: boolean = false;

    /**
     * 发布话题
     */
    @action
    publishTopic = () => {
        const {
            publishBtnDisabled,
            title,
            contentPlain,
            contentHtml,
            contentRaw,
            selectedChannel,
            requesting
        } = this;
        if (publishBtnDisabled || requesting) {
            Promise.reject(false);
        }

        this.requesting = true;
        return CreateTopic({
            title,
            channelId: selectedChannel.id,
            content: contentPlain,
            contentHtml,
            contentRaw
        })
            .then(resp => {
                alert(resp.msg);
                this.clearData();
                this.setField("requesting", false);
            })
            .catch(err => {
                alert(err.message || err.toString());
                this.setField("requesting", false);
            });
    };

    @action
    clearData = () => {
        this.title = "";
        this.contentPlain = "";
        this.contentHtml = "";
        this.contentRaw = "";
    };

    /**
     * 发布按钮禁用状态
     */
    @computed
    get publishBtnDisabled() {
        const { title, contentPlain, selectedChannel } = this;
        return (
            !selectedChannel ||
            !title ||
            !contentPlain ||
            title.length < 10 ||
            contentPlain.length < 50
        );
    }

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
