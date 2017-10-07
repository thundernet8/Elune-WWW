import * as React from "react";
import ClassNames from "classnames";
import Topic from "model/Topic";
import { Link } from "react-router-dom";
import { Tooltip } from "element-react/next";

const styles = require("./index.less");

interface TopicHeroProps {
    topic: Topic;
}

interface TopicHeroState {}

export default class TopicHero extends React.Component<
    TopicHeroProps,
    TopicHeroState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { topic } = this.props;
        if (!topic) {
            return null;
        }
        const { channel, tags } = topic;
        return (
            <header
                className={styles.hero}
                style={{ backgroundColor: channel.color }}
            >
                <div className={ClassNames("container", [styles.container])}>
                    <div className={styles.inner}>
                        <div className={styles.topicMeta}>
                            {topic.isPinned && (
                                <Tooltip
                                    effect="dark"
                                    placement="top"
                                    content="置顶"
                                >
                                    <span className={styles.sticky}>
                                        <i className="icon fa fa-fw fa-thumb-tack badge-icon" />
                                    </span>
                                </Tooltip>
                            )}
                            <Link to={`/channel/${channel.slug}`}>
                                <span style={{ color: channel.color }}>
                                    {channel.title}
                                </span>
                            </Link>
                            {tags.map((tag, index) => {
                                return (
                                    <Link key={index} to={`/tag/${tag.slug}`}>
                                        <span>{tag.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        <h2 className={styles.topicTitle}>{topic.title}</h2>
                    </div>
                </div>
            </header>
        );
    }
}
