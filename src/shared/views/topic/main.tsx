import * as React from "react";
import { observer } from "mobx-react";
import DocumentMeta from "react-document-meta";
// import Topic from "model/Topic";
import PostItem from "components/PostItem";
import TopicStore from "store/TopicStore";
import GlobalStore from "store/GlobalStore";

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
        return <PostItem post={topic} store={store} />;
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
