import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { Link } from "react-router-dom";
import GlobalStore from "store/GlobalStore";
import ChannelsStore from "store/ChannelsStore";
import DocumentMeta from "react-document-meta";

const styles = require("./styles/index.less");

interface ChannelsViewProps {}

interface ChannelsViewState {}

@observer
export default class ChannelsView extends React.Component<
    ChannelsViewProps,
    ChannelsViewState
> {
    private store: ChannelsStore;

    constructor(props) {
        super(props);
        this.store = ChannelsStore.getInstance();
    }

    componentWillUnmount() {
        this.store.destroy();
    }

    renderNav = () => {
        const globalStore = GlobalStore.Instance;
        const { user, showLoginAuthModal } = globalStore;
        const isLogged = user && user.id;

        return (
            <nav className={styles.nav}>
                <ul>
                    <li className={styles.newTopic}>
                        {isLogged && (
                            <Link to="/creation">
                                <button
                                    className={ClassNames("btn btn--primary", [
                                        styles.newTopicBtn
                                    ])}
                                    type="button"
                                    title="新的话题"
                                >
                                    <span className="btn-label">新的话题</span>
                                </button>
                            </Link>
                        )}
                        {!isLogged && (
                            <button
                                className={ClassNames("btn btn--primary", [
                                    styles.newTopicBtn
                                ])}
                                type="button"
                                title="新的话题"
                                onClick={showLoginAuthModal}
                            >
                                <span className="btn-label">新的话题</span>
                            </button>
                        )}
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
                                {isLogged && (
                                    <li
                                        className={ClassNames([
                                            styles.following
                                        ])}
                                    >
                                        <Link to="/following" title="关注">
                                            <i className="icon fa fa-fw fa-star btn-icon" />
                                            <span className="btn-label">
                                                关注
                                            </span>
                                        </Link>
                                    </li>
                                )}
                                <li className={ClassNames([styles.channels])}>
                                    <Link to="/channels" title="频道">
                                        <i className="icon fa fa-fw fa-th-large btn-icon" />
                                        <span className="btn-label">频道</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        );
    };

    renderChannelList = () => {
        const { topChannels, subChannelsMap, loading } = this.store;
        if (loading) {
            return (
                <div className={styles.channelsLoading}>
                    <i className="el-icon-loading" />
                </div>
            );
        }
        return (
            <div className={styles.channelList}>
                <ul>
                    {topChannels.map((channel, index) => {
                        return (
                            <li
                                key={index}
                                className={ClassNames(
                                    [styles.channel],
                                    [styles.channelTile]
                                )}
                                style={{ background: channel.color }}
                            >
                                <Link
                                    to={`/channel/${channel.slug}`}
                                    className={styles.channelInfo}
                                >
                                    <h3>{channel.title}</h3>
                                    <p>{channel.description}</p>
                                </Link>
                                <div className={styles.subChannels}>
                                    <ul>
                                        {(function() {
                                            const subChannels =
                                                subChannelsMap[channel.id];
                                            if (
                                                !subChannels ||
                                                subChannels.length < 1
                                            ) {
                                                return null;
                                            }
                                            return subChannels.map(
                                                (subChannel, i) => {
                                                    return (
                                                        <li
                                                            key={i}
                                                            className={
                                                                styles.subChannel
                                                            }
                                                        >
                                                            <Link
                                                                to={`/channel/${subChannel.slug}`}
                                                                title={
                                                                    subChannel.description
                                                                }
                                                            >
                                                                {
                                                                    subChannel.title
                                                                }
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            );
                                        })()}
                                    </ul>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    render() {
        const meta = {
            title:
                "所有频道-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript",
            description: "Elune Forum所有频道",
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Elune,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <div className={ClassNames("container", [styles.channelsView])}>
                <DocumentMeta {...meta} />
                {this.renderNav()}
                {this.renderChannelList()}
            </div>
        );
    }
}
