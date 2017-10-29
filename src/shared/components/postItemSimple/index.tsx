import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import Post from "model/Post";
import { Link } from "react-router-dom";
import { Tooltip } from "element-react/next";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";
import Avatar from "components/avatar";
import PureHtmlContent from "components/pureHtmlContent";

const styles = require("../postItem/index.less");

interface PostItemSimpleProps {
    post: Post;
}

interface PostItemSimpleState {}

@observer
export default class PostItemSimple extends React.Component<
    PostItemSimpleProps,
    PostItemSimpleState
> {
    constructor(props) {
        super(props);
    }

    render() {
        // const parent = posts.find(x => x.id === post.pid);
        // const htmlToReactParser = new HtmlToReactParser();

        const { post } = this.props;

        return (
            <div
                className={ClassNames(
                    [styles.postItem],
                    [styles.simplePostItem]
                )}
                id={`post-${post.id}`}
            >
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
                                            <Avatar
                                                className={styles.avatar}
                                                user={post.author}
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
                        </ul>
                    </header>
                    <div className={styles.postBody}>
                        <PureHtmlContent html={post.contentHtml} />
                    </div>
                </div>
            </div>
        );
    }
}
