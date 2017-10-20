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
                                [styles.menuItem],
                                [styles.itemPosts],
                                { [styles.active]: tab === "posts" }
                            )}
                        >
                            <Link to={`/u/${user.username}`}>
                                <i className="fa fa-fw fa-comment-o" />
                                <span className={styles.label}>
                                    回复<span className={styles.count}>
                                        {user.postsCount || 0}
                                    </span>
                                </span>
                            </Link>
                        </li>
                        <li
                            className={ClassNames(
                                [styles.menuItem],
                                [styles.itemTopics],
                                { [styles.active]: tab === "topics" }
                            )}
                        >
                            <Link to={`/u/${user.username}/topics`}>
                                <i className="fa fa-fw fa-reorder" />
                                <span className={styles.label}>
                                    话题<span className={styles.count}>
                                        {user.topicsCount || 0}
                                    </span>
                                </span>
                            </Link>
                        </li>
                        <li
                            className={ClassNames(
                                [styles.menuItem],
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
                            me.id > 0 &&
                            me.id === user.id && (
                                <li
                                    className={ClassNames(
                                        [styles.menuItem],
                                        [styles.itemFavorites],
                                        { [styles.active]: tab === "favorites" }
                                    )}
                                >
                                    <Link to={`/u/${user.username}/favorites`}>
                                        <i className="fa fa-fw fa-star-o" />
                                        <span className={styles.label}>
                                            收藏<span className={styles.count}>
                                                {user.favoritesCount || 0}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            )}
                        {me &&
                            me.id > 0 &&
                            me.id === user.id && (
                                <li
                                    className={ClassNames(
                                        [styles.settingsMenuItem],
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
