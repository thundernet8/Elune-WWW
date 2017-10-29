import * as React from "react";
import Dropdown from "common/dropdown";
import ClassNames from "classnames";
import { Link } from "react-router-dom";
import Topic from "model/Topic";
import { Tooltip } from "element-react/next";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";
import Avatar from "components/avatar";

const styles = require("./index.less");

interface TopicItemProps {
    topic: Topic;
    className?: string;
}

interface TopicItemState {
    read: boolean;
}

export default class TopicItem extends React.Component<
    TopicItemProps,
    TopicItemState
> {
    constructor(props) {
        super(props);
        this.state = {
            read: false
        };
    }

    render() {
        const { read } = this.state;
        const { topic, className } = this.props;
        const {
            id,
            title,
            content,
            channel,
            author,
            tags,
            postsCount,
            isPinned,
            createTime,
            postTime,
            poster
        } = topic;
        const latestPostTime = postTime ? new Date(postTime * 1000) : null;
        return (
            <div className={ClassNames([styles.topicItem], [className])}>
                <Dropdown
                    className={ClassNames("dropdown btn-flat", [
                        styles.actionDropdown
                    ])}
                    anchorNode={
                        <span className="btn-label">
                            <i className="fa fa-fw fa-ellipsis-v" />
                        </span>
                    }
                >
                    <Dropdown.Item hasIcon>
                        <button>
                            <i className="fa fa-fw fa-star" />
                            <span className="btn-label">关注</span>
                        </button>
                    </Dropdown.Item>
                </Dropdown>
                <div
                    className={ClassNames([styles.content], {
                        [styles.read]: read
                    })}
                >
                    <Link
                        to={`/u/${author.username}`}
                        className={ClassNames("author", [styles.author])}
                    >
                        <Tooltip
                            effect="dark"
                            placement="bottom"
                            content={`${author.nickname} 发布于 ${getGMT8DateStr(
                                new Date(createTime * 1000)
                            )}`}
                        >
                            {author.avatar ? (
                                <span
                                    className={ClassNames("avatar", [
                                        styles.avatar
                                    ])}
                                >
                                    <img src={author.avatar} />
                                </span>
                            ) : (
                                <Avatar
                                    className={ClassNames("avatar", [
                                        styles.avatar
                                    ])}
                                    user={author}
                                />
                            )}
                        </Tooltip>
                    </Link>
                    <ul className={styles.badges}>
                        {!!isPinned && (
                            <li className="item-sticky">
                                <Tooltip
                                    effect="dark"
                                    placement="top"
                                    content="置顶"
                                >
                                    <span
                                        className={ClassNames(
                                            [styles.badge],
                                            [styles.sticky]
                                        )}
                                    >
                                        <i className="icon fa fa-fw fa-thumb-tack badge-icon" />
                                    </span>
                                </Tooltip>
                            </li>
                        )}
                    </ul>
                    <Link to={`/topic/${id}`} className={styles.main}>
                        <h3 className={styles.title}>{title}</h3>
                        <ul className={styles.info}>
                            <li className={styles.channels}>
                                <span className={styles.channelLabels}>
                                    <span
                                        className={ClassNames([
                                            styles.channelLabel,
                                            styles.colored
                                        ])}
                                        style={{
                                            color: channel.color,
                                            backgroundColor: channel.color
                                        }}
                                    >
                                        <span
                                            className={styles.channelLabelText}
                                        >
                                            {channel.title}
                                        </span>
                                    </span>
                                    {tags.map((tag, index) => {
                                        if (index > 1) {
                                            return null;
                                        }
                                        return (
                                            <span
                                                key={index}
                                                className={ClassNames(
                                                    [styles.channelLabel],
                                                    [styles.tagLabel]
                                                )}
                                            >
                                                <span
                                                    className={ClassNames(
                                                        [
                                                            styles.channelLabelText
                                                        ],
                                                        [styles.tagLabelText]
                                                    )}
                                                >
                                                    {tag.title}
                                                </span>
                                            </span>
                                        );
                                    })}
                                </span>
                            </li>
                            {latestPostTime &&
                                poster && (
                                    <li className={styles.reply}>
                                        <span>
                                            <i className="icon fa fa-fw fa-reply " />
                                            <span className={styles.username}>
                                                {poster}
                                            </span>{" "}
                                            回复于{" "}
                                            <time
                                                data-pubdate="true"
                                                title={
                                                    latestPostTime
                                                        ? getGMT8DateStr(
                                                              latestPostTime
                                                          )
                                                        : ""
                                                }
                                            >
                                                {getTimeDiff(latestPostTime)}
                                            </time>
                                        </span>
                                    </li>
                                )}
                            <li className={styles.excerpt}>
                                <span>
                                    {content.substr(0, 100)}
                                    {content.length > 100 ? "..." : ""}
                                </span>
                            </li>
                        </ul>
                    </Link>
                    <span className={styles.count} title="">
                        <i className="fa fa-fw fa-comment" />
                        {postsCount}
                    </span>
                </div>
            </div>
        );
    }
}
