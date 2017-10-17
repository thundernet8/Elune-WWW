import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import UCStore from "store/UCStore";
// import GlobalStore from "store/GlobalStore";
import { getUserColor } from "utils/ColorKit";
import { getTimeDiff } from "utils/DateTimeKit";
import { Link } from "react-router-dom";
import UCAsideView from "./aside";

const styles = require("./styles/index.less");
const defaultAvatar = require("IMG/avatar-default.png");

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

    componentWillUnmount() {
        this.store.destroy();
    }

    switchTab = (tab: string) => {
        // TODO
        console.dir(tab);
    };

    renderBrand = () => {
        const { match } = this.props;
        const { username } = match.params;
        const { user } = this.store;
        return (
            <div
                className={styles.userHero}
                style={{ backgroundColor: getUserColor(username) }}
            >
                <div className={styles.darkenBg}>
                    <div
                        className={ClassNames("container", [styles.container])}
                    >
                        <div className={styles.profile}>
                            <h2 className={styles.identity}>
                                <Link to={`/u/${username}`}>
                                    <div className={styles.avatar}>
                                        <img
                                            src={user.avatar || defaultAvatar}
                                        />
                                    </div>
                                    <span className={styles.username}>
                                        {user.nickname || username}
                                    </span>
                                </Link>
                            </h2>
                            <ul className={styles.info}>
                                <li className={styles.bio}>
                                    <p>{user.bio}</p>
                                </li>
                                {user.lastSeen && (
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

    renderTab = () => {
        return null;
    };

    render() {
        const { user } = this.store;

        return (
            <div className={styles.ucView}>
                {this.renderBrand()}
                <div className={ClassNames("container", [styles.container])}>
                    <UCAsideView user={user} switchTab={this.switchTab} />
                </div>
            </div>
        );
    }
}

const UCViewWithRouter = withRouter(UCView);

export default UCViewWithRouter;
