import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import DocumentMeta from "react-document-meta";
// import Topic from "model/Topic";
import PostItem from "components/PostItem";
import TopicStore from "store/TopicStore";
import GlobalStore from "store/GlobalStore";
import PostEditor from "components/postEditor";
// import ReactDOMServer from "react-dom/server";
import { Parser as HtmlToReactParser } from "html-to-react";
import { Tooltip, Button } from "element-react/next";
import { getTimeDiff, getLocalDate } from "utils/DateTimeKit";
import { Link } from "react-router-dom";

const styles = require("./styles/main.less");

const defaultAvatar = require("IMG/avatar-default.png");

interface TopicMainProps {
    store: TopicStore;
}

interface TopicMainState {
    commentting: boolean;
}

@observer
export default class TopicMain extends React.Component<
    TopicMainProps,
    TopicMainState
> {
    private postBox: HTMLDivElement;

    constructor(props) {
        super(props);
        this.state = {
            commentting: false
        };
    }

    refPostBox = box => {
        this.postBox = box;
    };

    goComment = () => {
        this.props.store.goComment();
        this.postBox.scrollIntoView();
        this.toggleCommentting(true);
    };

    toggleCommentting = (status: boolean) => {
        this.setState({
            commentting: status
        });
    };

    renderMainThread = () => {
        const { store } = this.props;
        const { topic } = store;
        const htmlToReactParser = new HtmlToReactParser();
        return (
            <div className={styles.topicWrapper} id="thread">
                <div className={styles.inner}>
                    <header>
                        <ul>
                            <li className={styles.author}>
                                <h3>
                                    <Link to={`/u/${topic.authorName}`}>
                                        <span className={styles.avatar}>
                                            <img
                                                src={
                                                    topic.author.avatar ||
                                                    defaultAvatar
                                                }
                                            />
                                        </span>
                                        <span className={styles.username}>
                                            {topic.authorName}
                                        </span>
                                    </Link>
                                </h3>
                            </li>
                            <li className={styles.meta}>
                                <Tooltip
                                    effect="dark"
                                    placement="top"
                                    content={getLocalDate(
                                        new Date(topic.createTime * 1000)
                                    ).toLocaleString()}
                                >
                                    <span>
                                        {getTimeDiff(
                                            new Date(topic.createTime * 1000)
                                        )}
                                    </span>
                                </Tooltip>
                            </li>
                        </ul>
                    </header>
                    <div className={styles.topicBody}>
                        {htmlToReactParser.parse(topic.contentHtml)}
                    </div>
                    <aside className={styles.asideActions}>
                        <ul>
                            <li className={styles.replyBtn}>
                                <Button type="text" onClick={this.goComment}>
                                    回复
                                </Button>
                            </li>
                        </ul>
                    </aside>
                    <footer>
                        <div className={styles.actions}>
                            <ul>
                                <li className={styles.views}>
                                    <i className="fa fa-eye" />
                                    <span className={styles.count}>
                                        {topic.viewsCount}
                                    </span>次浏览
                                </li>
                                <li className={styles.favorite}>
                                    <i className="el-icon-star-off" />
                                    <span className={styles.count}>
                                        {topic.favoritesCount}
                                    </span>人收藏
                                </li>
                                <li className={styles.upvote}>
                                    <i className="fa fa-thumbs-o-up" />
                                    <span className={styles.count}>
                                        {topic.upvotesCount}
                                    </span>顶
                                </li>
                                <li className={styles.downvote}>
                                    <i className="fa fa-thumbs-o-down" />
                                    <span className={styles.count}>
                                        {topic.downvotesCount}
                                    </span>踩
                                </li>
                            </ul>
                        </div>
                    </footer>
                </div>
            </div>
        );
    };

    renderPostList = () => {
        const { store } = this.props;
        const { loading, postsLoading, posts } = store;
        if (!loading && postsLoading) {
            return (
                <div className={styles.postsLoading}>
                    <i className="el-icon-loading" />
                </div>
            );
        }
        return (
            <div className={styles.postListWrapper}>
                <ul className={styles.postList}>
                    {posts.map((post, index) => {
                        return (
                            <PostItem key={index} post={post} store={store} />
                        );
                    })}
                </ul>
            </div>
        );
    };

    renderPostBox = () => {
        const { store } = this.props;
        const {
            loading,
            postsLoading,
            topic,
            mentions,
            postBtnDisabled,
            editingPostRaw
        } = store;
        const { commentting } = this.state;
        const globalStore = GlobalStore.Instance;
        const { user, showLoginAuthModal } = globalStore;
        if (loading || postsLoading) {
            return null;
        }

        if (user && commentting) {
            return (
                <div
                    ref={this.refPostBox}
                    className={ClassNames(
                        [styles.commentPlaceholder],
                        [styles.commentEditorWrapper]
                    )}
                    suppressContentEditableWarning
                >
                    <div className={styles.inner}>
                        <header>
                            <span className={styles.avatar}>
                                <Tooltip
                                    effect="dark"
                                    placement="top"
                                    content={user.nickname}
                                >
                                    <img src={user.avatar || defaultAvatar} />
                                </Tooltip>
                            </span>
                        </header>
                        <div className={styles.commentEditBody}>
                            <ul>
                                <li>
                                    <h3>
                                        <i className="icon fa fa-fw fa-reply" />{" "}
                                        <span>{topic.title}</span>
                                    </h3>
                                </li>
                                <span
                                    className={styles.close}
                                    onClick={this.toggleCommentting.bind(
                                        this,
                                        false
                                    )}
                                >
                                    <i className="el-icon-close" />
                                </span>
                            </ul>
                            <PostEditor
                                className={styles.commentEditor}
                                toolBarClassName={styles.commentEditorToolbar}
                                rawContent={editingPostRaw}
                                placeholder="输入评论"
                                mentions={mentions}
                                onChange={store.editPost}
                            />
                        </div>
                        <footer>
                            <Button type="primary" disabled={postBtnDisabled}>
                                发表评论
                            </Button>
                        </footer>
                    </div>
                </div>
            );
        }

        return (
            <div ref={this.refPostBox} className={styles.commentPlaceholder}>
                {(function(that) {
                    if (user && user.id) {
                        return (
                            <div className={styles.inner}>
                                <header
                                    onClick={that.toggleCommentting.bind(
                                        that,
                                        true
                                    )}
                                >
                                    <span className={styles.avatar}>
                                        <img
                                            src={user.avatar || defaultAvatar}
                                        />
                                    </span>
                                    说点什么...
                                </header>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                className={styles.inner}
                                onClick={showLoginAuthModal}
                            >
                                <header>
                                    <span className={styles.avatar}>
                                        <img src={defaultAvatar} />
                                    </span>
                                    登录以发表评论
                                </header>
                            </div>
                        );
                    }
                })(this)}
            </div>
        );
    };

    render() {
        const { store } = this.props;
        const { loading, topic } = store;
        if (loading) {
            return (
                <div className={styles.topicLoading}>
                    <i className="el-icon-loading" />
                </div>
            );
        }
        const meta = {
            title: `${topic.title}-Eleun Forum-Web development community,WordPress,PHP,Java,JavaScript`,
            description: topic.content.substr(0, 100),
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Eleun,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <main className={styles.mainView}>
                <DocumentMeta {...meta} />
                <div className={styles.mainWrapper}>
                    {this.renderMainThread()}
                    {this.renderPostList()}
                    {this.renderPostBox()}
                </div>
            </main>
        );
    }
}
