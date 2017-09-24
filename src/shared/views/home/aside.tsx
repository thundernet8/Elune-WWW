import * as React from "react";
import ClassNames from "classnames";
import { Link } from "react-router-dom";

const styles = require("./styles/aside.less");

interface HomeAsideProps {}

interface HomeAsideState {}

export default class HomeAside extends React.Component<
    HomeAsideProps,
    HomeAsideState
> {
    constructor(props) {
        super(props);
    }

    render() {
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
                                    <Link
                                        to="/channel/1"
                                        title="获取支持，包括使用、安装、开发插件等"
                                    >
                                        <span
                                            className={ClassNames(
                                                "icon btn-icon",
                                                [styles.channelIcon]
                                            )}
                                            style={{
                                                background: "rgb(254, 181, 77)"
                                            }}
                                        />求助
                                    </Link>
                                    <Link
                                        to="/channel/2"
                                        title="获取支持，包括使用、安装、开发插件等"
                                    >
                                        <span
                                            className={ClassNames(
                                                "icon btn-icon",
                                                [styles.channelIcon]
                                            )}
                                            style={{
                                                background: "rgb(103, 204, 234)"
                                            }}
                                        />开发
                                    </Link>
                                    <Link
                                        to="/channel/3"
                                        title="获取支持，包括使用、安装、开发插件等"
                                    >
                                        <span
                                            className={ClassNames(
                                                "icon btn-icon",
                                                [styles.channelIcon]
                                            )}
                                            style={{
                                                background: "rgb(146, 230, 217)"
                                            }}
                                        />开发
                                    </Link>
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
