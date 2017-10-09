import * as React from "react";
import { observer } from "mobx-react";
import DocumentMeta from "react-document-meta";
// import Topic from "model/Topic";
import PostItem from "components/PostItem";
import TopicStore from "store/TopicStore";
import GlobalStore from "store/GlobalStore";
// import LocalEditor from "components/editor";
// import ReactDOMServer from "react-dom/server";
import { Parser as HtmlToReactParser } from "html-to-react";
import { Tooltip } from "element-react/next";
import { getTimeDiff, getLocalDate } from "utils/DateTimeKit";
import { Link } from "react-router-dom";

const styles = require("./styles/main.less");

const defaultAvatar = require("IMG/avatar-default.png");

interface TopicMainProps {
    store: TopicStore;
}

interface TopicMainState {}

@observer
export default class TopicMain extends React.Component<
    TopicMainProps,
    TopicMainState
> {
    renderMainThread = () => {
        const { store } = this.props;
        const { topic } = store;
        const htmlToReactParser = new HtmlToReactParser();
        return (
            <div className={styles.topicWrapper}>
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
        const { loading, postsLoading } = store;
        const globalStore = GlobalStore.Instance;
        const { user, showLoginAuthModal } = globalStore;
        if (loading || postsLoading) {
            return null;
        }

        return (
            <div className={styles.commentPlaceholder}>
                {(function() {
                    if (user && user.id) {
                        return (
                            <div className={styles.inner}>
                                <header>
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
                })()}
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
