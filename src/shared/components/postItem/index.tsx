import * as React from "react";
import { observer } from "mobx-react";
import Post from "model/Post";
import TopicStore from "store/TopicStore";
import { Link } from "react-router-dom";
import { Tooltip } from "element-react/next";
import { getTimeDiff } from "utils/DateTimeKit";

const styles = require("./index.less");

const defaultAvatar = require("IMG/avatar-default.png");

interface PostItemProps {
    post: Post;
    store: TopicStore;
}

interface PostItemState {}

@observer
export default class PostItem extends React.Component<
    PostItemProps,
    PostItemState
> {
    constructor(props) {
        super(props);
    }

    render() {
        // const parent = posts.find(x => x.id === post.pid);
        const { post, store } = this.props;
        const { posts } = store;
        const replies = posts.filter(x => x.id === post.pid);
        return (
            <div className={styles.postItem} id={`post-${post.id}`}>
                <div className={styles.inner}>
                    <header>
                        <ul>
                            <li className={styles.author}>
                                <h3>
                                    <Link to={`/u/${post.authorName}`}>
                                        <span className={styles.avatar}>
                                            <img
                                                src={
                                                    post.author.avatar ||
                                                    defaultAvatar
                                                }
                                            />
                                        </span>
                                        <span className={styles.username}>
                                            {post.authorName}
                                        </span>
                                    </Link>
                                </h3>
                            </li>
                            <li className={styles.meta}>
                                <Tooltip
                                    effect="dark"
                                    placement="top"
                                    content={new Date(
                                        post.createTime * 1000
                                    ).toLocaleString()}
                                >
                                    <span>
                                        {getTimeDiff(
                                            new Date(post.createTime * 1000)
                                        )}
                                    </span>
                                </Tooltip>
                            </li>
                        </ul>
                    </header>
                    <div className={styles.postBody}>
                        <p>{post.content}</p>
                    </div>
                    <aside className={styles.postActions}>
                        <ul>
                            <li className={styles.replyBtn}>回复</li>
                        </ul>
                    </aside>
                    <footer>
                        <ul>
                            {!!replies &&
                                replies.length > 0 &&
                                replies.map((reply, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className={styles.reply}
                                        >
                                            <a href={`#post-${reply.id}`}>
                                                <i className="icon fa fa-fw fa-reply" />
                                                <Link
                                                    to={`/u/${reply.authorName}`}
                                                >
                                                    {reply.authorName}
                                                </Link>{" "}
                                                回复了它
                                            </a>
                                        </li>
                                    );
                                })}
                        </ul>
                    </footer>
                </div>
            </div>
        );
    }
}
