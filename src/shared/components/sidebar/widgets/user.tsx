import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import GlobalStore from "store/GlobalStore";
import Avatar from "components/avatar";
import { Link } from "react-router-dom";
import {
    Layout,
    Tooltip,
    Button,
    Notification,
    Input,
    Message
} from "element-react/next";
import { CopyToClipboard } from "react-copy-to-clipboard";
import BalanceBadge from "components/balanceBadge";

const styles = require("./styles/user.less");

interface UserWidgetProps {}

interface UserWidgetState {}

@observer
export default class UserWidget extends React.Component<
    UserWidgetProps,
    UserWidgetState
> {
    constructor(props) {
        super(props);
    }

    dailySign = () => {
        const store = GlobalStore.Instance;
        store
            .dailySign()
            .then(resp => {
                Notification({
                    title: "签到成功",
                    message: resp.msg || `获得${resp.result}个铜币`,
                    type: "success"
                });
            })
            .catch(err => {
                Notification({
                    title: "签到失败",
                    message: err.message || err.toString(),
                    type: "error"
                });
            });
    };

    getRefLink = () => {
        const store = GlobalStore.Instance;
        const { user } = store;
        return store.getHomeRefUrl(user.id.toString());
    };

    copyRefLink = () => {
        Message({
            message: "复制推广链接成功, 邀请注册成功获得银币奖励",
            type: "success"
        });
    };

    focusRefLinkInput = (e: any) => {
        e.target.select();
    };

    render() {
        const { user } = GlobalStore.Instance;
        if (!user || !user.id) {
            return null;
        }

        const { dailySigned } = user;

        const balance = user.balance || 0;

        return (
            <div className={ClassNames("widget", [styles.widget])}>
                <div className={ClassNames("widget-content", [styles.content])}>
                    <div className={styles.profile}>
                        <header className={styles.header}>
                            <Avatar user={user} className={styles.avatar} />
                            <div className={styles.userInfo}>
                                <Link
                                    className={styles.nickname}
                                    to={`/u/${user.username}`}
                                >
                                    {user.nickname}
                                </Link>
                                <span>{user.username}</span>
                                <Link
                                    className={styles.edit}
                                    to={`/u/${user.username}/settings`}
                                >
                                    <Tooltip
                                        effect="dark"
                                        placement="left"
                                        content={
                                            <div
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    lineHeight: 1
                                                }}
                                            >
                                                设置
                                            </div>
                                        }
                                    >
                                        <i className="fa fa-fw fa-pencil-square-o" />
                                    </Tooltip>
                                </Link>
                            </div>
                        </header>
                        <div className="clear" />
                        <div className={styles.infoData}>
                            <Layout.Row gutter={10}>
                                <Layout.Col span={8}>
                                    <Link to={`/u/${user.username}/favorites`}>
                                        <div className={styles.num}>
                                            {(user.favoriteTopicIds &&
                                                user.favoriteTopicIds.length) ||
                                                0}
                                        </div>
                                        <span className={styles.numText}>
                                            话题收藏
                                        </span>
                                    </Link>
                                </Layout.Col>
                                <Layout.Col span={8}>
                                    <Link to={`/following`}>
                                        <div className={styles.num}>
                                            {(user.followingTopicIds &&
                                                user.followingTopicIds
                                                    .length) ||
                                                0}
                                        </div>
                                        <span className={styles.numText}>
                                            话题关注
                                        </span>
                                    </Link>
                                </Layout.Col>
                                <Layout.Col span={8}>
                                    <Link to={`/following/users`}>
                                        <div className={styles.num}>
                                            {(user.followingUserIds &&
                                                user.followingUserIds.length) ||
                                                0}
                                        </div>
                                        <span className={styles.numText}>
                                            特别关注
                                        </span>
                                    </Link>
                                </Layout.Col>
                            </Layout.Row>
                        </div>
                        <div className={styles.divider} />
                        <footer className={styles.footer}>
                            <div className={styles.balance}>
                                {(function(that) {
                                    if (dailySigned) {
                                        return (
                                            <label>
                                                <i className="fa fa-fw fa-superpowers" />
                                                <Link to="/balance">个人财富</Link>
                                            </label>
                                        );
                                    } else {
                                        return (
                                            <label>
                                                <Button
                                                    type="text"
                                                    loading={false}
                                                    onClick={that.dailySign}
                                                >
                                                    签到领钱币
                                                </Button>
                                            </label>
                                        );
                                    }
                                })(this)}
                                <BalanceBadge balance={balance} onWidget />
                            </div>
                            <div className={styles.refLink}>
                                <Tooltip
                                    effect="dark"
                                    placement="top"
                                    content="新用户通过你的邀请链接注册你将获得10银币财富奖励"
                                >
                                    <CopyToClipboard
                                        text={this.getRefLink()}
                                        onCopy={this.copyRefLink}
                                    >
                                        <Input
                                            value={this.getRefLink()}
                                            prepend="推广链接"
                                            onFocus={this.focusRefLinkInput}
                                        />
                                    </CopyToClipboard>
                                </Tooltip>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
