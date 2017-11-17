import { observable, action, computed } from "mobx";
import {
    FetchTopic,
    UpdateTopic,
    FavoriteTopic,
    UnFavoriteTopic,
    LikeTopic,
    UnLikeTopic,
    StickyTopic,
    UnStickyTopic
} from "api/Topic";
import { FetchTopicPosts, CreatePost, LikePost } from "api/Post";
import Topic from "model/Topic";
import Post from "model/Post";
import CommonResp from "model/Resp";
import IStoreArgument from "interface/IStoreArgument";
import { SortOrder, SortOrderBy } from "enum/Sort";
import Role from "enum/Role";
import { EditorSuggestion } from "interface/EditorSuggestion";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html-fork";
import {
    hasFavoriteTopic,
    favoriteTopic,
    unFavoriteTopic,
    hasLikeTopic,
    likeTopic,
    unLikeTopic,
    getLikedPosts,
    likePost
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
     * 话题编辑
     */
    @computed
    get canEditTopic() {
        const me = GlobalStore.Instance.user;
        const { topic } = this;
        if (!me || !topic) {
            return false;
        }
        // 普通用户话题发布3600秒后不可再编辑
        return (
            me.roleId <= Role.ADMIN ||
            (me.roleId <= Role.NORMAL_USER &&
                me.id === topic.authorId &&
                new Date().getTime() / 1000 - topic.createTime < 3600)
        );
    }

    @observable editTopicContent: string = "";
    @observable editTopciContentHtml: string = "";
    @observable editTopicContentRaw: string = "";

    @action
    editTopic = (raw: string, html: string, plainText: string) => {
        this.editTopicContent = plainText;
        this.editTopciContentHtml = html;
        this.editTopicContentRaw = raw;
    };

    @observable submittingEditTopic: boolean = false;

    @action
    submitEditTopic = () => {
        const {
            editTopicContent,
            editTopciContentHtml,
            editTopicContentRaw,
            topic
        } = this;
        if (!editTopicContent || editTopicContent.length < 50) {
            return Promise.reject("话题不能少于50字");
        }
        this.submittingEditTopic = true;
        return UpdateTopic({
            id: topic.id,
            content: editTopicContent,
            contentHtml: editTopciContentHtml,
            contentRaw: editTopicContentRaw
        })
            .then(resp => {
                if (!resp.result) {
                    throw new Error("更新话题失败");
                } else {
                    const newTopic = Object.assign({}, topic, {
                        content: editTopicContent,
                        contentHtml: editTopciContentHtml,
                        contentRaw: editTopicContentRaw
                    });
                    this.topic = newTopic;
                    return resp;
                }
            })
            .finally(() => {
                this.submittingEditTopic = false;
            });
    };

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
                    this.checkLikeStatus();
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
            topic,
            submittingPost
        } = this;

        if (submittingPost) {
            return Promise.reject(false);
        }

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
        if (!user || !user.id || !topic) {
            return;
        }
        if (user.favoriteTopicIds.includes(topic.id)) {
            favoriteTopic(user.id, topic.id);
            this.setFavorite(true);
            return;
        }
        if (hasFavoriteTopic(user.id, topic.id)) {
            this.setFavorite(true);
        }
    };

    /**
     * 喜欢(话题)
     */

    @observable likeActing: boolean = false;
    @observable hasLiked: boolean = false;

    @action
    setLike = (status: boolean = true) => {
        this.hasLiked = status;
    };

    @action
    likeTopic = () => {
        const { topic, likeActing } = this;
        const { id } = topic;
        if (likeActing) {
            return Promise.reject(false);
        }
        this.likeActing = true;
        return LikeTopic({
            id
        })
            .then(result => {
                if (result) {
                    this.setLike(true);
                    likeTopic(GlobalStore.Instance.user.id, id);
                    const newTopic = Object.assign({}, topic, {
                        upvotesCount: topic.upvotesCount + 1
                    });
                    this.setTopic(newTopic);
                }
                return result;
            })
            .finally(() => {
                this.likeActing = false;
            });
    };

    @action
    unLikeTopic = () => {
        const { topic, likeActing } = this;
        const { id } = topic;
        if (likeActing) {
            return Promise.reject(false);
        }
        this.likeActing = true;
        return UnLikeTopic({
            id
        })
            .then(result => {
                if (result) {
                    this.setLike(false);
                }
                unLikeTopic(GlobalStore.Instance.user.id, id);
                const newTopic = Object.assign({}, topic, {
                    upvotesCount: topic.upvotesCount - 1
                });
                this.setTopic(newTopic);
                return result;
            })
            .finally(() => {
                this.likeActing = false;
            });
    };

    @action
    handleLike = () => {
        if (this.hasLiked) {
            // return this.unLikeTopic();
            return; // 暂时不允许取消赞
        } else {
            return this.likeTopic();
        }
    };

    @action
    checkLikeStatus = () => {
        const globalStore = GlobalStore.Instance;
        const { user } = globalStore;
        const { topic } = this;
        if (!user || !user.id || !topic) {
            return;
        }
        if (hasLikeTopic(user.id, topic.id)) {
            this.setLike(true);
        }
    };

    /**
     * 喜欢(评论)
     */

    @observable likePostActing: boolean = false;
    @observable likedPosts: number[] = [];

    @action
    likePost = (id: number) => {
        const { likePostActing, posts, likedPosts } = this;
        if (likePostActing) {
            return Promise.reject(false);
        }
        this.likePostActing = true;
        return LikePost({
            id
        })
            .then(result => {
                if (result) {
                    likedPosts.push(id);
                    this.likedPosts = Array.from(new Set(likedPosts));
                    likePost(GlobalStore.Instance.user.id, id);
                    const newPosts = posts.map(post => {
                        if (post.id === id) {
                            const count = post.upvotesCount + 1;
                            return Object.assign({}, post, {
                                upvotesCount: count
                            });
                        }
                        return post;
                    });
                    this.posts = newPosts;
                }
                return result;
            })
            .finally(() => {
                this.likePostActing = false;
            });
    };

    @action
    syncLikePostsCache = () => {
        const globalStore = GlobalStore.Instance;
        const { user } = globalStore;
        if (!user || !user.id) {
            return;
        }
        this.likedPosts = getLikedPosts(user.id);
    };

    /**
     * 置顶话题
     */

    @observable stickyActing: boolean = false;

    @computed
    get canStickyTopic() {
        const me = GlobalStore.Instance.user;
        const { topic } = this;
        if (!me || !topic) {
            return false;
        }
        return me.roleId <= Role.ADMIN;
    }

    @action
    stickyTopic = () => {
        const { topic, stickyActing } = this;
        const { id } = topic;
        if (stickyActing) {
            return Promise.reject(false);
        }
        this.stickyActing = true;
        return StickyTopic({
            id
        })
            .then(result => {
                if (result) {
                    const newTopic = Object.assign({}, topic, {
                        isPinned: 1
                    });
                    this.setTopic(newTopic);
                }
                return result;
            })
            .finally(() => {
                this.stickyActing = false;
            });
    };

    @action
    unStickyTopic = () => {
        const { topic, stickyActing } = this;
        const { id } = topic;
        if (stickyActing) {
            return Promise.reject(false);
        }
        this.stickyActing = true;
        return UnStickyTopic({
            id
        })
            .then(result => {
                if (result) {
                    const newTopic = Object.assign({}, topic, {
                        isPinned: 0
                    });
                    this.setTopic(newTopic);
                }

                return result;
            })
            .finally(() => {
                this.stickyActing = false;
            });
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
