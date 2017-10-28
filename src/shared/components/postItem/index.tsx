import * as React from "react";
import ClassNames from "classnames";
import { observer } from "mobx-react";
import Post from "model/Post";
import GlobalStore from "store/GlobalStore";
import TopicStore from "store/TopicStore";
import { Link } from "react-router-dom";
import { Tooltip, Button, Message } from "element-react/next";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";
import CharAvatar from "components/charAvatar";
import PureHtmlContent from "components/pureHtmlContent";
import { CopyToClipboard } from "react-copy-to-clipboard";

const styles = require("./index.less");

interface PostItemProps {
    index: number;
    post: Post;
    store: TopicStore;
    goReply: (post: Post) => void;
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

    goReply = () => {
        const { goReply, post } = this.props;
        goReply(post);
    };

    refReplyLink = () => {
        Message({
            message: "已成功复制帖子链接",
            type: "success"
        });
    };

    render() {
        // const parent = posts.find(x => x.id === post.pid);
        // const htmlToReactParser = new HtmlToReactParser();

        const { post, store } = this.props;
        const { topic } = store;
        const { posts } = store;
        const replyIndex = this.props.index + 1;

        const replies = posts.filter(x => x.pid === post.id);
        return (
            <div className={styles.postItem} id={`post-${post.id}`}>
                <div className={styles.inner}>
                    <header>
                        <ul>
                            <li className={styles.author}>
                                <h3>
                                    <Link to={`/u/${post.authorName}`}>
                                        {post.author.avatar ? (
                                            <span className={styles.avatar}>
                                                <img src={post.author.avatar} />
                                            </span>
                                        ) : (
                                            <CharAvatar
                                                className={styles.avatar}
                                                text={post.authorName[0]}
                                            />
                                        )}
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
                                    content={getGMT8DateStr(
                                        new Date(post.createTime * 1000)
                                    )}
                                >
                                    <span>
                                        {getTimeDiff(
                                            new Date(post.createTime * 1000)
                                        )}
                                    </span>
                                </Tooltip>
                            </li>
                            {topic.authorId === post.authorId && (
                                <li className={styles.idBadge}>
                                    <span>楼主</span>
                                </li>
                            )}
                            {replyIndex === 1 && (
                                <li
                                    className={ClassNames(
                                        [styles.orderBadge],
                                        [styles.orderBadge1]
                                    )}
                                >
                                    <span>沙发</span>
                                </li>
                            )}
                            {replyIndex === 2 && (
                                <li
                                    className={ClassNames(
                                        [styles.orderBadge],
                                        [styles.orderBadge2]
                                    )}
                                >
                                    <span>板凳</span>
                                </li>
                            )}
                            {replyIndex === 3 && (
                                <li
                                    className={ClassNames(
                                        [styles.orderBadge],
                                        [styles.orderBadge3]
                                    )}
                                >
                                    <span>地板</span>
                                </li>
                            )}
                        </ul>
                    </header>
                    <div className={styles.postBody}>
                        <PureHtmlContent html={post.contentHtml} />
                    </div>
                    <aside className={styles.postActions}>
                        <ul>
                            <li className={styles.replyBtn}>
                                <Button type="text" onClick={this.goReply}>
                                    回复
                                </Button>
                                <CopyToClipboard
                                    text={`${GlobalStore.Instance.getRefUrl()}#reply${replyIndex}`}
                                    onCopy={this.refReplyLink}
                                >
                                    <Button type="text">
                                        <i
                                            title="引用"
                                            className="fa fa-fw fa-link"
                                        />
                                    </Button>
                                </CopyToClipboard>
                            </li>
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
                                                <Tooltip
                                                    effect="dark"
                                                    placement="top"
                                                    content={
                                                        <div
                                                            className={
                                                                styles.replyTooltipContent
                                                            }
                                                        >
                                                            {reply.content.trim()}
                                                        </div>
                                                    }
                                                    className={
                                                        styles.replyTooltip
                                                    }
                                                >
                                                    <i className="icon fa fa-fw fa-reply" />
                                                    {reply.authorName} 回复了它
                                                </Tooltip>
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
