import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import GlobalStore from "store/GlobalStore";
import Avatar from "components/avatar";
import { Link } from "react-router-dom";
import { Layout, Tooltip, Button, Notification } from "element-react/next";

const styles = require("./styles/user.less");
const goldImg = require("IMG/gold.png");
const silverImg = require("IMG/silver.png");
const bronzeImg = require("IMG/bronze.png");

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

    render() {
        const { user } = GlobalStore.Instance;
        if (!user) {
            return null;
        }

        const { dailySigned } = user;

        const balance = user.balance || 0;
        const gold = Number((balance / 10000).toFixed(0));
        const silver = Number(((balance - gold * 10000) / 100).toFixed(0));
        const bronze = balance % 100;

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
                                            {(user.followTopicIds &&
                                                user.followTopicIds.length) ||
                                                0}
                                        </div>
                                        <span className={styles.numText}>
                                            话题关注
                                        </span>
                                    </Link>
                                </Layout.Col>
                                <Layout.Col span={8}>
                                    <Link to={`/user/following`}>
                                        <div className={styles.num}>
                                            {(user.followUserIds &&
                                                user.followUserIds.length) ||
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
                                                <i className="fa fa-fw fa-superpowers" />个人财富
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
                                <div className={styles.balanceDetail}>
                                    {
                                        <span className={styles.gold}>
                                            <Tooltip
                                                effect="dark"
                                                placement="top"
                                                content={`${gold} 金币`}
                                            >
                                                <span className={styles.num}>
                                                    {gold}
                                                </span>
                                                <img src={goldImg} />
                                            </Tooltip>
                                        </span>
                                    }
                                    {
                                        <span className={styles.silver}>
                                            <Tooltip
                                                effect="dark"
                                                placement="top"
                                                content={`${silver} 银币`}
                                            >
                                                <span className={styles.num}>
                                                    {silver}
                                                </span>
                                                <img src={silverImg} />
                                            </Tooltip>
                                        </span>
                                    }
                                    <span className={styles.bronze}>
                                        <Tooltip
                                            effect="dark"
                                            placement="left-start"
                                            content={`${bronze} 铜币`}
                                        >
                                            <span className={styles.num}>
                                                {bronze}
                                            </span>
                                            <img src={bronzeImg} />
                                        </Tooltip>
                                    </span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
