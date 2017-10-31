import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import DocumentMeta from "react-document-meta";
import UCStore from "store/UCStore";
import GlobalStore from "store/GlobalStore";
import { getCharColor } from "utils/ColorKit";
import { getTimeDiff } from "utils/DateTimeKit";
// import { Link } from "react-router-dom";
import Avatar from "components/avatar";
import { Upload } from "element-react/next";
import moment from "moment";
import UCAsideView from "./aside";
import PostsTab from "./tabs/postsTab";
import TopicsTab from "./tabs/topicsTab";
import MentionsTab from "./tabs/mentionsTab";
import SettingsTab from "./tabs/settingsTab";
import FavoritesTab from "./tabs/favoritesTab";
import { API_BASE } from "../../../../env";

const styles = require("./styles/index.less");

interface UCViewProps {
    match: any;
    location: any;
    history: any;
}

interface UCViewState {}

@observer
class UCView extends React.Component<UCViewProps, UCViewState> {
    private store: UCStore;

    constructor(props) {
        super(props);
        const { match, location } = this.props;
        this.store = UCStore.getInstance({ match, location, cookies: "" });
    }

    successUploadAvatar = response => {
        this.store.updateLocalUserField("avatar", response.result);
    };

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const { username } = match.params;
        const prevUsername = prevProps.match.params.username;
        if (username !== prevUsername) {
            this.store = UCStore.rebuild({ location, match, cookies: "" });
        }
    }

    componentDidMount() {
        const { match, history } = this.props;
        let { tab } = match.params;
        if (!tab) {
            return;
        }
        if (
            ["mentions", "topics", "posts", "favorites", "settings"].indexOf(
                tab
            ) < 0
        ) {
            history.push("/404");
        }
    }

    renderBrand = () => {
        const { match } = this.props;
        const { username } = match.params;
        const { user } = this.store;
        const globalStore = GlobalStore.Instance;
        const me = globalStore.user;
        const isSelf = me && user && me.id === user.id;
        const isOnline =
            isSelf ||
            (!!user.lastSeen &&
                new Date().getTime() - user.lastSeen * 1000 < 20 * 60000);

        return (
            <div
                className={styles.userHero}
                style={{ backgroundColor: getCharColor(username[0]) }}
            >
                <div className={styles.darkenBg}>
                    <div
                        className={ClassNames("container", [styles.container])}
                    >
                        <div className={styles.profile}>
                            <h2 className={styles.identity}>
                                {isSelf ? (
                                    <Upload
                                        className={styles.avatarUploader}
                                        action={`${API_BASE}upload/avatars`}
                                        multiple={false}
                                        withCredentials
                                        showFileList={false}
                                        accept="image/*"
                                        trigger={<i className="el-icon-plus" />}
                                        onSuccess={this.successUploadAvatar}
                                    >
                                        {
                                            <Avatar
                                                className={styles.avatar}
                                                username={username}
                                                user={user}
                                            />
                                        }
                                    </Upload>
                                ) : (
                                    <Avatar
                                        className={styles.avatar}
                                        username={username}
                                        user={user}
                                    />
                                )}

                                <span className={styles.username}>
                                    {user.nickname || username}
                                </span>
                            </h2>
                            <ul className={styles.info}>
                                <li className={styles.bio}>
                                    <p>{user.bio}</p>
                                </li>
                                {isOnline && (
                                    <li
                                        className={ClassNames(
                                            [styles.lastSeen],
                                            [styles.online]
                                        )}
                                    >
                                        <span>
                                            <i className="fa fa-fw fa-circle" />
                                            在线
                                        </span>
                                    </li>
                                )}
                                {!isOnline &&
                                    !!user.lastSeen && (
                                        <li className={styles.lastSeen}>
                                            <span>
                                                <i className="fa fa-fw fa-clock-o" />
                                                {getTimeDiff(
                                                    moment(user.lastSeen * 1000)
                                                )}
                                            </span>
                                        </li>
                                    )}
                                {user.joinTime && (
                                    <li className={styles.joined}>
                                        <span>
                                            加入于{getTimeDiff(moment(user.joinTime * 1000))}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderTab = (tab: string) => {
        const { store } = this;
        switch (tab) {
            case "posts":
                return <PostsTab store={store} />;
            case "topics":
                return <TopicsTab store={store} />;
            case "mentions":
                return <MentionsTab />;
            case "favorites":
                return <FavoritesTab store={store} />;
            case "settings":
                return <SettingsTab store={store} />;
            default:
                return null;
        }
    };

    render() {
        const { user } = this.store;
        const globalStore = GlobalStore.Instance;
        const me = globalStore.user;
        const { match } = this.props;
        let { tab, username } = match.params;
        tab = (tab || "posts").toLowerCase();

        if (
            ["mentions", "topics", "posts", "favorites", "settings"].indexOf(
                tab
            ) < 0
        ) {
            return null;
        }

        const meta = {
            title: `${username}的个人主页-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript`,
            description: "",
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Elune,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <div className={styles.ucView}>
                <DocumentMeta {...meta} />
                {this.renderBrand()}
                <div className={ClassNames("container", [styles.container])}>
                    <UCAsideView user={user} me={me} tab={tab} />
                    <div className={styles.tabContainer}>
                        {this.renderTab(tab)}
                    </div>
                </div>
            </div>
        );
    }
}

const UCViewWithRouter = withRouter(UCView);

export default UCViewWithRouter;
