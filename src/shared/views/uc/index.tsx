import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import DocumentMeta from "react-document-meta";
import UCStore from "store/UCStore";
import GlobalStore from "store/GlobalStore";
import { getCharColor } from "utils/ColorKit";
import { getTimeDiff } from "utils/DateTimeKit";
import { Link } from "react-router-dom";
import CharAvatar from "components/charAvatar";
import UCAsideView from "./aside";
import PostsTab from "./tabs/postsTab";
import TopicsTab from "./tabs/topicsTab";
import MentionsTab from "./tabs/mentionsTab";
import SettingsTab from "./tabs/settingsTab";

const styles = require("./styles/index.less");
// const defaultAvatar = require("IMG/avatar-default.png");

interface UCViewProps {
    match: any;
    location: any;
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

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const { username } = match.params;
        const prevUsername = prevProps.match.params.username;
        if (username !== prevUsername) {
            this.store = UCStore.rebuild({ location, match, cookies: "" });
        }
    }

    renderBrand = () => {
        const { match } = this.props;
        const { username } = match.params;
        const { user } = this.store;

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
                                <Link to={`/u/${username}`}>
                                    <CharAvatar
                                        className={styles.avatar}
                                        text={username[0]}
                                    />
                                    <span className={styles.username}>
                                        {user.nickname || username}
                                    </span>
                                </Link>
                            </h2>
                            <ul className={styles.info}>
                                <li className={styles.bio}>
                                    <p>{user.bio}</p>
                                </li>
                                {!!user.lastSeen && (
                                    <li className={styles.lastSeen}>
                                        <span>
                                            <i className="fa fa-fw fa-clock-o" />
                                            {getTimeDiff(
                                                new Date(user.lastSeen * 1000)
                                            )}
                                        </span>
                                    </li>
                                )}
                                {user.joinTime && (
                                    <li className={styles.joined}>
                                        <span>
                                            加入于{getTimeDiff(new Date(user.joinTime * 1000))}
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
                return <PostsTab />;
            case "topics":
                return <TopicsTab store={store} />;
            case "mentions":
                return <MentionsTab />;
            case "settings":
                return <SettingsTab />;
            default:
                return null;
        }
    };

    render() {
        const { user } = this.store;
        const globalStore = GlobalStore.Instance;
        const me = globalStore.user;
        let { tab, username } = this.props.match.params;
        tab = (tab || "posts").toLowerCase();

        if (["mentions", "topics", "posts", "settings"].indexOf(tab) < 0) {
            // TODO 404 redirect
            return null;
        }

        const meta = {
            title: `${username}的个人主页-Eleun Forum-Web development community,WordPress,PHP,Java,JavaScript`,
            description: "",
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Eleun,forum,wordpress,php,java,javascript,react"
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
