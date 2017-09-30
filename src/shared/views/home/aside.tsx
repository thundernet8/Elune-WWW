import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { Link } from "react-router-dom";
import HomeStore from "store/HomeStore";

const styles = require("./styles/aside.less");

interface HomeAsideProps {}

interface HomeAsideState {}

@observer
export default class HomeAside extends React.Component<
    HomeAsideProps,
    HomeAsideState
> {
    private store: HomeStore;

    constructor(props) {
        super(props);
        this.store = HomeStore.getInstance();
    }

    render() {
        const { topChannels, subChannels } = this.store;
        return (
            <nav className={styles.sideNav}>
                <ul>
                    <li className={styles.newTopic}>
                        <Link to="/creation">
                            <button
                                className={ClassNames("btn btn--primary", [
                                    styles.newTopicBtn
                                ])}
                                type="button"
                                title="新的话题"
                            >
                                <i className="icon fa fa-fw fa-edit btn-icon" />
                                <span className="btn-label">新的话题</span>
                            </button>
                        </Link>
                    </li>
                    <li className={styles.itemNav}>
                        <div className={styles.dropdown}>
                            <ul className={styles.menu}>
                                <li
                                    className={ClassNames(
                                        [styles.allTopics],
                                        [styles.active]
                                    )}
                                >
                                    <Link to="/" title="所有话题">
                                        <i className="icon fa fa-fw fa-comments-o btn-icon" />
                                        <span className="btn-label">所有话题</span>
                                    </Link>
                                </li>
                                <li className={ClassNames([styles.following])}>
                                    <Link to="/following" title="关注">
                                        <i className="icon fa fa-fw fa-star btn-icon" />
                                        <span className="btn-label">关注</span>
                                    </Link>
                                </li>
                                <li className={ClassNames([styles.channels])}>
                                    <Link to="/channels" title="频道">
                                        <i className="icon fa fa-fw fa-th-large btn-icon" />
                                        <span className="btn-label">频道</span>
                                    </Link>
                                </li>
                                <li className={styles.divider} />
                                <li
                                    className={ClassNames([styles.channelItem])}
                                >
                                    {topChannels.map((channel, index) => {
                                        return (
                                            <Link
                                                key={index}
                                                to={`/channel/${channel.slug}`}
                                                title={channel.description}
                                            >
                                                <span
                                                    className={ClassNames(
                                                        "icon btn-icon",
                                                        [styles.channelIcon]
                                                    )}
                                                    style={{
                                                        background:
                                                            channel.color
                                                    }}
                                                />
                                                {channel.title}
                                            </Link>
                                        );
                                    })}
                                    {subChannels.map((channel, index) => {
                                        return (
                                            <Link
                                                key={index}
                                                to={`/channel/${channel.slug}`}
                                                title={channel.description}
                                            >
                                                <span
                                                    className={ClassNames(
                                                        "icon btn-icon",
                                                        [styles.channelIcon]
                                                    )}
                                                    style={{
                                                        background:
                                                            channel.color
                                                    }}
                                                />
                                                {channel.title}
                                            </Link>
                                        );
                                    })}
                                    <Link to="/channels" title="更多...">
                                        <span
                                            className={ClassNames(
                                                "icon btn-label",
                                                [styles.channelIcon],
                                                [styles.moreChannel]
                                            )}
                                        />更多...
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        );
    }
}
