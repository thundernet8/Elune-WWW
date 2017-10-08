import { observable, action, computed } from "mobx";
import { FetchTopic } from "api/Topic";
import { FetchTopicPosts } from "api/Post";
import Topic from "model/Topic";
import Post from "model/Post";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * Topic详情页Store(单例)
 */
export default class TopicStore extends AbstractStore {
    private static instance: TopicStore;

    public static get Instance() {
        return TopicStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!TopicStore.instance) {
            TopicStore.instance = new TopicStore(arg);
        }
        return TopicStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = TopicStore.getInstance(arg);
        instance.reset(arg);
        instance.loading = true;
        instance.topic = null as any;
        instance.fetchData();
        return instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.TopicStore) {
                this.fromJSON(initialState.TopicStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        TopicStore.instance = null as any;
    }

    @action
    setField = (field: string, value: any) => {
        this[field] = value;
    };

    @observable loading: boolean = false;

    /**
     * 所有频道列表
     */
    @observable topic: Topic = null as any;

    @action
    setTopic = (topic: Topic) => {
        this.topic = topic;
    };

    @action
    getTopic = () => {
        if (this.loading) {
            return Promise.reject(false);
        }
        const { id } = this.Match.params;
        this.loading = true;
        return FetchTopic({ id: Number(id) }).then(resp => {
            this.setTopic(resp);
            this.loading = false;
        });
    };

    @observable postsLoading: boolean = false;
    @observable postPage: number = 1;
    @observable postPageSize: number = 20;
    @observable order: SortOrder = SortOrder.DESC;
    @observable orderBy: SortOrderBy = SortOrderBy.ID;

    @observable posts: Post[] = [];

    @observable postTotal: number = -1;

    @computed
    get hasMorePosts() {
        const { postPage, postPageSize, postTotal } = this;
        return postTotal === -1 || postPage * postPageSize < postTotal;
    }

    @action
    setPosts = (posts: Post[]) => {
        this.posts = posts;
    };

    @action
    getPosts = (keepExist: boolean = false) => {
        const { postPage, postPageSize, posts, order, orderBy } = this;
        const { id } = this.Match.params;
        const params = {
            page: postPage,
            pageSize: postPageSize,
            order,
            orderBy,
            topicId: Number(id)
        };
        this.setField("postsLoading", true);
        return FetchTopicPosts(params)
            .then(resp => {
                this.setPosts(
                    keepExist ? posts.concat(resp.items) : resp.items
                );
                this.setField("postsLoading", false);
                if (postPage === 1) {
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
        const { postPage, postPageSize, postTotal } = this;
        if ((postPage - 1) * postPageSize >= postTotal) {
            return;
        }
        this.setField("postPage", postPage + 1);
        this.getPosts(true);
    };

    @action
    refreshPosts = () => {
        this.setPosts([]);
        this.setField("postPage", 1);
        this.setField("postTotal", 0);
        this.getPosts();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.getTopic());
        promises.push(this.getPosts());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            topic: this.topic,
            posts: this.posts,
            postTotal: this.postTotal
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { topic, posts, postTotal } = json;
        if (typeof topic !== "undefined") {
            this.setTopic(topic);
        }
        if (typeof posts !== "undefined") {
            this.setPosts(posts);
        }
        this.setField("postTotal", postTotal);
        return this;
    }
}
