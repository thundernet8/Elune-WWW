import * as React from "react";
import Dropdown from "common/dropdown";
import ClassNames from "classnames";
import { Link } from "react-router-dom";
import Topic from "model/Topic";
import { Tooltip, Message } from "element-react/next";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";
import Avatar from "components/avatar";
import moment from "moment";
import GlobalStore from "store/GlobalStore";

const styles = require("./index.less");

interface TopicItemProps {
    topic: Topic;
    className?: string;
    following?: boolean;
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

    followTopic = () => {
        const { topic } = this.props;
        const { id } = topic;
        return GlobalStore.Instance
            .followTopic(id)
            .then(() => {
                Message({
                    message: "关注话题成功",
                    type: "success"
                });
            })
            .catch(() => {
                Message({
                    message: "关注话题失败",
                    type: "error"
                });
            });
    };

    unfollowTopic = () => {
        const { topic } = this.props;
        const { id } = topic;
        return GlobalStore.Instance
            .unfollowTopic(id)
            .then(() => {
                Message({
                    message: "取消关注成功",
                    type: "success"
                });
            })
            .catch(() => {
                Message({
                    message: "取消关注失败",
                    type: "error"
                });
            });
    };

    render() {
        const { read } = this.state;
        const { topic, className, following } = this.props;
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
        const { switchingFollowTopicStatus } = GlobalStore.Instance;

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
                        {following ? (
                            <button onClick={this.unfollowTopic}>
                                {switchingFollowTopicStatus ? (
                                    <i className="el-icon-loading" />
                                ) : (
                                    <i className="fa fa-fw fa-star" />
                                )}
                                <span className="btn-label">取消关注</span>
                            </button>
                        ) : (
                            <button onClick={this.followTopic}>
                                {switchingFollowTopicStatus ? (
                                    <i className="el-icon-loading" />
                                ) : (
                                    <i className="fa fa-fw fa-star-o" />
                                )}
                                <span className="btn-label">关注</span>
                            </button>
                        )}
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
                                moment(createTime * 1000)
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
                            {postTime &&
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
                                                title={getGMT8DateStr(
                                                    moment(postTime * 1000)
                                                )}
                                            >
                                                {getTimeDiff(
                                                    moment(postTime * 1000)
                                                )}
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
