import { observable, action, computed } from "mobx";
import { FetchTopic, FavoriteTopic, UnFavoriteTopic } from "api/Topic";
import { FetchTopicPosts, CreatePost } from "api/Post";
import Topic from "model/Topic";
import Post from "model/Post";
import CommonResp from "model/Resp";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import { EditorSuggestion } from "interface/EditorSuggestion";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html-fork";
import {
    hasFavoriteTopic,
    favoriteTopic,
    unFavoriteTopic
} from "utils/CacheKit";
import GlobalStore from "store/GlobalStore";
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
            if (initialState && initialState.topicStore) {
                this.fromJSON(initialState.topicStore);
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
        return FetchTopic({ id: Number(id) })
            .then(resp => {
                this.setTopic(resp);
                this.setField("loading", false);
            })
            .then(() => {
                if (!IS_NODE) {
                    this.checkFavoriteStatus();
                }
            });
    };

    @observable postsLoading: boolean = false;
    @observable postPage: number = 1;
    @observable postPageSize: number = 20;
    @observable order: SortOrder = SortOrder.ASC;
    @observable orderBy: SortOrderBy = SortOrderBy.ID;

    @observable posts: Post[] = [];

    @observable postTotal: number = -1;

    @computed
    get mentions() {
        const { topic, posts, editingPostMentions } = this;
        let mentions: EditorSuggestion[] = [];
        const mentionValues = editingPostMentions.map(x => x.value);
        const includeReply = mentionValues.some(x => /(.+)(#[0-9]+)$/.test(x));
        if (!includeReply) {
            mentions.push({
                text: `${topic.author.nickname} 回复#0 - ${topic.content}`,
                value: `${topic.authorName}#0`,
                url: "#thread"
            });
        }

        if (mentionValues.indexOf(topic.authorName) < 0) {
            mentions.push({
                text: topic.author.nickname,
                value: `${topic.authorName}`,
                url: "javascript:;"
            });
        }

        const postsMap = {};
        posts.forEach(post => {
            if (!postsMap[post.authorId]) {
                postsMap[post.authorId] = [post];
            } else {
                postsMap[post.authorId].push(post);
            }
        });

        Object.keys(postsMap).forEach(authorId => {
            postsMap[authorId].forEach(post => {
                if (!includeReply) {
                    mentions.push({
                        text: `${post.author
                            .nickname} 回复#${post.id} - ${post.content.substr(
                            0,
                            20
                        )}`,
                        value: `${post.authorName}#${post.id}`,
                        url: `#post-${post.id}`
                    });
                }
            });
            if (
                postsMap[authorId][0].authorId !== topic.authorId &&
                mentionValues.indexOf(postsMap[authorId][0].authorName) < 0
            ) {
                mentions.push({
                    text: postsMap[authorId][0].author.nickname,
                    value: `${postsMap[authorId][0].authorName}`,
                    url: "javascript:;"
                });
            }
        });

        return mentions;
    }

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

    // 正在编辑的评论/回复
    @computed
    get editingPostText() {
        const { postEditorState } = this;
        return postEditorState.getCurrentContent().getPlainText();
    }
    @computed
    get editingPostMentions() {
        const { postEditorState } = this;
        const raw = convertToRaw(postEditorState.getCurrentContent());
        const entities = Object.keys(raw.entityMap).map(
            key => raw.entityMap[key]
        );
        const mentions: EditorSuggestion[] = entities
            .filter((value: any) => value.type === "MENTION")
            .map((m: any) => m.data);

        return mentions;
    }
    @computed
    get postBtnDisabled() {
        return this.editingPostText.length < 1;
    }

    @observable submittingPost: boolean = false;

    @action
    goComment = () => {
        const { topic } = this;
        const value = `${topic.authorName}#0`;
        const raw = `{"entityMap":{"0":{"type":"MENTION","mutability":"IMMUTABLE","data":{"text":"@${value}","value":"${value}","url":"#thread"}}},"blocks":[{"key":"ob2h","text":"@${value} ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":${value.length +
            1},"key":0}],"data":{}}]}`;

        this.postEditorState = EditorState.createWithContent(
            convertFromRaw(JSON.parse(raw))
        );
    };

    @action
    goReply = (post: Post) => {
        const value = `${post.authorName}#${post.id}`;
        const raw = `{"entityMap":{"0":{"type":"MENTION","mutability":"IMMUTABLE","data":{"text":"@${value}","value":"${value}","url":"#post-${post.id}"}}},"blocks":[{"key":"ob2h","text":"@${value} ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":${value.length +
            1},"key":0}],"data":{}}]}`;

        this.postEditorState = EditorState.createWithContent(
            convertFromRaw(JSON.parse(raw))
        );
    };

    @action
    createPost = () => {
        const {
            postEditorState,
            editingPostText,
            editingPostMentions,
            topic
        } = this;

        const contentRaw = convertToRaw(postEditorState.getCurrentContent());

        const editingPostRaw = JSON.stringify(contentRaw);
        const editingPostHtml = draftToHtml(contentRaw);

        if (!editingPostRaw || !editingPostHtml || !editingPostText) {
            return Promise.reject(false);
        }

        let parentId = 0;
        let mentions: string[] = [];
        editingPostMentions.forEach(mention => {
            const match1 = mention.text.match(/@([^#]+)$/);
            if (match1 && match1.length > 1) {
                mentions.push(match1[1]);
                return;
            }
            const match2 = mention.text.match(/@(.+)#([0-9]+)$/);
            if (match2 && match2.length > 2) {
                if (!parentId) {
                    parentId = Number(match2[2]);
                }
                mentions.push(match2[1]);
            }
        });

        mentions = Array.from(new Set(mentions));

        this.submittingPost = true;

        return CreatePost({
            topicId: topic.id,
            parentId: parentId,
            content: editingPostText,
            contentHtml: editingPostHtml,
            contentRaw: editingPostRaw,
            topicOwner: topic.authorName,
            topicOwnerId: topic.authorId,
            mentions
        })
            .then((resp: CommonResp<number>) => {
                this.setField("submittingPost", false);
                this.setField("postEditorState", EditorState.createEmpty());
                this.getPosts();
                return resp;
            })
            .catch(err => {
                this.setField("submittingPost", false);
                throw new Error(err);
            });
    };

    @observable postEditorState: EditorState = EditorState.createEmpty();

    @action
    postEditorStateChange = (state: EditorState) => {
        this.postEditorState = state;
    };

    @action
    cleanPostEditor = () => {
        this.postEditorState = EditorState.createEmpty();
    };

    /**
     * 收藏
     */

    @observable favoriteActing: boolean = false;
    @observable hasFavorited: boolean = false;

    @action
    setFavorite = (status: boolean = true) => {
        this.hasFavorited = status;
    };

    @action
    favoriteTopic = () => {
        const { topic, favoriteActing } = this;
        const { id } = topic;
        if (favoriteActing) {
            return Promise.reject(false);
        }
        this.favoriteActing = true;
        return FavoriteTopic({
            id
        })
            .then(result => {
                if (result) {
                    this.setFavorite(true);
                }
                favoriteTopic(GlobalStore.Instance.user.id, id);
                const newTopic = Object.assign({}, topic, {
                    favoritesCount: topic.favoritesCount + 1
                });
                this.setTopic(newTopic);
                return result;
            })
            .finally(() => {
                this.favoriteActing = false;
            });
    };

    @action
    unFavoriteTopic = () => {
        const { topic, favoriteActing } = this;
        const { id } = topic;
        if (favoriteActing) {
            return Promise.reject(false);
        }
        this.favoriteActing = true;
        return UnFavoriteTopic({
            id
        })
            .then(result => {
                if (result) {
                    this.setFavorite(false);
                }
                unFavoriteTopic(GlobalStore.Instance.user.id, id);
                const newTopic = Object.assign({}, topic, {
                    favoritesCount: topic.favoritesCount - 1
                });
                this.setTopic(newTopic);
                return result;
            })
            .finally(() => {
                this.favoriteActing = false;
            });
    };

    @action
    handleFavorite = () => {
        if (this.hasFavorited) {
            return this.unFavoriteTopic();
        } else {
            return this.favoriteTopic();
        }
    };

    @action
    checkFavoriteStatus = () => {
        const globalStore = GlobalStore.Instance;
        const { user } = globalStore;
        const { topic } = this;
        if (
            !user ||
            !user.id ||
            !topic ||
            user.favoriteTopicIds.includes(topic.id)
        ) {
            return;
        }
        if (hasFavoriteTopic(user.id, topic.id)) {
            this.setFavorite(true);
        }
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
