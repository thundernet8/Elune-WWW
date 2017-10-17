import * as React from "react";
import Dropdown from "common/dropdown";
import ClassNames from "classnames";
import { Link } from "react-router-dom";
import Topic from "model/Topic";
import { Tooltip } from "element-react/next";
import { getTimeDiff, getLocalDate } from "utils/DateTimeKit";

const styles = require("./index.less");
const defaultAvatar = require("IMG/avatar-default.png");

interface TopicItemProps {
    topic: Topic;
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
        } = this.props.topic;
        const latestPostTime = postTime ? new Date(postTime * 1000) : null;
        return (
            <div className={styles.topicItem}>
                <Dropdown
                    className={ClassNames("btn-flat", [styles.actionDropdown])}
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
                        className={styles.author}
                    >
                        <Tooltip
                            effect="dark"
                            placement="bottom"
                            content={`${author.nickname} 发布于 ${getLocalDate(
                                new Date(createTime * 1000)
                            ).toLocaleString()}`}
                        >
                            <img
                                className={styles.avatar}
                                src={defaultAvatar}
                            />
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
                            {latestPostTime && (
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
                                                    ? getLocalDate(
                                                          latestPostTime
                                                      ).toLocaleString()
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
