import { observable, action, computed } from "mobx";
import { FetchNamedUser } from "api/User";
import { FetchUserTopics } from "api/Topic";
import { FetchUserPosts } from "api/Post";
import { PublicUserInfo } from "model/User";
import Topic from "model/Topic";
import Post from "model/Post";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 用户中心Store(单例)
 */
export default class UCStore extends AbstractStore {
    private static instance: UCStore;

    public static get Instance() {
        return UCStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (
            !UCStore.instance ||
            (arg.match &&
                UCStore.instance.Match.params.username !==
                    arg.match.params.username)
        ) {
            UCStore.instance = new UCStore(arg);
        }
        return UCStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = UCStore.getInstance(arg);
        instance.reset(arg);
        instance.loading = true;
        instance.user = {} as any;
        instance.fetchData();
        return instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.uCStore) {
                this.fromJSON(initialState.uCStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        UCStore.instance = null as any;
    }

    @action
    setField = (field: string, value: any) => {
        this[field] = value;
    };

    @observable loading: boolean = false;

    /**
     * 当前用户
     */
    @observable user: PublicUserInfo = {} as any;

    @action
    getUser = () => {
        if (this.loading) {
            return Promise.reject(false);
        }
        const { username, tab } = this.Match.params;
        this.loading = true;
        return FetchNamedUser({ username }).then(resp => {
            this.setField("user", resp || {});
            this.setField("loading", false);
            switch (tab) {
                case undefined:
                case "posts":
                    return this.getUserPosts() as Promise<any>;
                case "topics":
                    return this.getUserTopics();
                default:
                    return Promise.resolve(true);
            }
        });
    };

    /**
     * 用户话题相关
     */

    /**
     * 当前页的Topic列表
     */
    @observable topics: Topic[] = [];

    @action
    setTopics = (topics: Topic[]) => {
        this.topics = topics;
    };

    @observable topicsPage: number = 1;
    @observable topicsPageSize: number = 20;
    @observable topicsTotal: number = -1;

    @computed
    get hasMoreTopic() {
        const { topicsPage, topicsPageSize, topicsTotal } = this;
        return topicsTotal === -1 || topicsPage * topicsPageSize < topicsTotal;
    }

    @observable topicsLoading: boolean = false;

    @observable topicsOrder: SortOrder = SortOrder.DESC;
    @observable topicsOrderBy: SortOrderBy = SortOrderBy.ID;

    @action
    switchTopicsSort = (orderBy: SortOrderBy) => {
        this.topicsOrderBy = orderBy;
        this.refreshTopics();
    };

    @action
    getUserTopics = () => {
        const {
            topicsPage,
            topicsPageSize,
            topics,
            topicsOrder,
            topicsOrderBy,
            user
        } = this;
        if (!user || !user.id) {
            return Promise.reject(false);
        }
        const params = {
            page: topicsPage,
            pageSize: topicsPageSize,
            order: topicsOrder,
            orderBy: topicsOrderBy,
            authorId: user.id
        };
        this.setField("topicsLoading", true);
        return FetchUserTopics(params)
            .then(resp => {
                this.setTopics(topics.concat(resp.items));
                this.setField("topicsLoading", false);
                if (topicsPage === 1) {
                    this.setField("topicsTotal", resp.total);
                }
                return resp;
            })
            .catch(() => {
                this.setField("topicsLoading", false);
            });
    };

    @action
    getNextPageTopics = () => {
        const { topicsPage, topicsPageSize, topicsTotal } = this;
        if ((topicsPage - 1) * topicsPageSize >= topicsTotal) {
            return;
        }
        this.setField("topicsPage", topicsPage + 1);
        this.getUserTopics();
    };

    @action
    refreshTopics = () => {
        this.setTopics([]);
        this.setField("topicsPage", 1);
        this.setField("topicsTotal", 0);
        this.getUserTopics();
    };

    /**
     * 用户评论回复相关
     */

    /**
     * 当前页的Post列表
     */
    @observable posts: Post[] = [];

    @action
    setPosts = (posts: Post[]) => {
        this.posts = posts;
    };

    @observable postsPage: number = 1;
    @observable postsPageSize: number = 20;
    @observable postsTotal: number = -1;

    @computed
    get hasMorePost() {
        const { postsPage, postsPageSize, postsTotal } = this;
        return postsTotal === -1 || postsPage * postsPageSize < postsTotal;
    }

    @observable postsLoading: boolean = false;

    @observable postsOrder: SortOrder = SortOrder.DESC;
    @observable postsOrderBy: SortOrderBy = SortOrderBy.ID;

    @action
    switchPostsSort = (orderBy: SortOrderBy) => {
        this.postsOrderBy = orderBy;
        this.refreshPosts();
    };

    @action
    getUserPosts = () => {
        const {
            postsPage,
            postsPageSize,
            posts,
            postsOrder,
            postsOrderBy,
            user
        } = this;
        if (!user || !user.id) {
            return Promise.reject(false);
        }
        const params = {
            page: postsPage,
            pageSize: postsPageSize,
            order: postsOrder,
            orderBy: postsOrderBy,
            authorId: user.id
        };
        this.setField("postsLoading", true);
        return FetchUserPosts(params)
            .then(resp => {
                this.setPosts(posts.concat(resp.items));
                this.setField("postsLoading", false);
                if (postsPage === 1) {
                    this.setField("postsTotal", resp.total);
                }
                return resp;
            })
            .catch(() => {
                this.setField("postsLoading", false);
            });
    };

    @action
    getNextPagePosts = () => {
        const { postsPage, postsPageSize, postsTotal } = this;
        if ((postsPage - 1) * postsPageSize >= postsTotal) {
            return;
        }
        this.setField("postsPage", postsPage + 1);
        this.getUserPosts();
    };

    @action
    refreshPosts = () => {
        this.setPosts([]);
        this.setField("postsPage", 1);
        this.setField("postsTotal", 0);
        this.getUserPosts();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.getUser());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        const { user, topics, posts, topicsTotal, postsTotal } = this;
        return Object.assign(obj, {
            user,
            topics,
            posts,
            topicsTotal,
            postsTotal
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { user, topics, posts, topicsTotal, postsTotal } = json;
        if (typeof user !== "undefined") {
            this.setField("user", user);
        }
        if (typeof topics !== "undefined") {
            this.setField("topics", topics);
        }
        if (typeof posts !== "undefined") {
            this.setField("posts", posts);
        }
        if (typeof topicsTotal !== "undefined") {
            this.setField("topicsTotal", topicsTotal);
        }
        if (typeof postsTotal !== "undefined") {
            this.setField("postsTotal", postsTotal);
        }
        return this;
    }
}
