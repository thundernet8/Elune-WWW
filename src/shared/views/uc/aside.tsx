import * as React from "react";
import ClassNames from "classnames";
import UserInfo, { PublicUserInfo } from "model/User";
import { Link } from "react-router-dom";

const styles = require("./styles/aside.less");

interface UCAsideViewProps {
    user: PublicUserInfo;
    me: UserInfo;
    tab: string;
}

interface UCAsideViewState {}

export default class UCAsideView extends React.Component<
    UCAsideViewProps,
    UCAsideViewState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { user, me, tab } = this.props;
        return (
            <nav className={styles.ucAsideView}>
                <div className={styles.inner}>
                    <ul className={styles.menuList}>
                        <li
                            className={ClassNames(
                                [styles.postsMenuItem],
                                [styles.itemPosts],
                                { [styles.active]: tab === "posts" }
                            )}
                        >
                            <Link to={`/u/${user.username}`}>
                                <i className="fa fa-fw fa-comment-o" />
                                <span className={styles.label}>
                                    回复<span className={styles.count}>
                                        {user.postsCount}
                                    </span>
                                </span>
                            </Link>
                        </li>
                        <li
                            className={ClassNames(
                                [styles.postsMenuItem],
                                [styles.itemTopics],
                                { [styles.active]: tab === "topics" }
                            )}
                        >
                            <Link to={`/u/${user.username}/topics`}>
                                <i className="fa fa-fw fa-reorder" />
                                <span className={styles.label}>
                                    话题<span className={styles.count}>
                                        {user.topicCount}
                                    </span>
                                </span>
                            </Link>
                        </li>
                        <li
                            className={ClassNames(
                                [styles.postsMenuItem],
                                [styles.itemMentions],
                                { [styles.active]: tab === "mentions" }
                            )}
                        >
                            <Link to={`/u/${user.username}/mentions`}>
                                <i className="fa fa-fw fa-at" />
                                <span className={styles.label}>提到用户</span>
                            </Link>
                        </li>
                        {me &&
                            me.id > 0 && (
                                <li
                                    className={ClassNames(
                                        [styles.postsMenuItem],
                                        [styles.itemSettings],
                                        { [styles.active]: tab === "settings" }
                                    )}
                                >
                                    <Link to={`/u/${user.username}/settings`}>
                                        <i className="fa fa-fw fa-cog" />
                                        <span className={styles.label}>
                                            个人设置
                                        </span>
                                    </Link>
                                </li>
                            )}
                    </ul>
                </div>
            </nav>
        );
    }
}
