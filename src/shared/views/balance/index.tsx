import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import DocumentMeta from "react-document-meta";
import BalanceStore from "store/BalanceStore";
import { Tabs, TabPane, Pagination, Table } from "element-react/next";
import { Link } from "react-router-dom";
import moment from "moment";
import { getGMT8DateStr } from "utils/DateTimeKit";
import BalanceLogTypes from "model/BalanceLogTypes";
import Avatar from "components/avatar";
import BalanceBadge from "components/balanceBadge";

const styles = require("./styles/index.less");

interface BalanceViewProps {
    type: string;
    match: any;
    location: any;
    history: any;
}

interface BalanceViewState {}

@observer
class BalanceView extends React.Component<BalanceViewProps, BalanceViewState> {
    private store: BalanceStore;

    constructor(props) {
        super(props);
        const { match, location, type } = props;
        this.store = BalanceStore.getInstance(
            { match, location, cookies: "" },
            type
        );
    }

    switchTab = (tab: any) => {
        const { history, type } = this.props;
        const tabName = tab.props.name;
        if (tabName === type) {
            return;
        }
        if (tabName === "rank") {
            history.push("/balance/rank");
        } else if (tabName === "costrank") {
            history.push("/balance/costrank");
        } else {
            history.push("/balance");
        }
    };

    onPageChange = (nextpage: number) => {
        const { history, type } = this.props;
        const { page } = this.store;
        if ((page > 1 && nextpage === 1) || (page === 1 && nextpage > 1)) {
            this.store.destroy();
        }
        const pageSuffix = nextpage === 1 ? "" : `/page/${nextpage}`;
        if (type === "rank") {
            history.push(`/balance/rank${pageSuffix}`);
        } else if (type === "costrank") {
            history.push(`/balance/costrank${pageSuffix}`);
        } else {
            history.push(`/balance${pageSuffix}`);
        }
    };

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const page = Number(match.params.page) || 1;
        const prevPage = Number(prevProps.match.params.page) || 1;
        if (page !== prevPage) {
            this.store = BalanceStore.rebuild({ location, match, cookies: "" });
        }
    }

    renderTabs = () => {
        const { type } = this.props;
        return (
            <header className={styles.tabs}>
                <Tabs activeName={type} onTabClick={this.switchTab}>
                    <TabPane label="积分明细" name="detail" />
                    <TabPane label="财富排行" name="rank" />
                    <TabPane label="消费排行" name="costrank" />
                </Tabs>
            </header>
        );
    };

    renderList = () => {
        const { type } = this.props;
        switch (type) {
            case "rank":
                return this.renderRankList();
            case "costrank":
                return this.renderCostRankList();
            default:
                return this.renderDetailList();
        }
    };

    renderPagination = () => {
        const { store } = this;
        const { total, page, pageSize, loading } = store;
        if (total < 0 || loading) {
            return null;
        }
        return (
            <div className={styles.pagination}>
                <Pagination
                    layout="prev, pager, next"
                    total={total}
                    currentPage={page}
                    pageSize={pageSize}
                    onCurrentChange={this.onPageChange}
                />
            </div>
        );
    };

    renderDetailList = () => {
        const { total, details, loading } = this.store;
        if (total === 0 && !loading) {
            return (
                <div
                    className={ClassNames(
                        [styles.detailList],
                        [styles.emptyList]
                    )}
                >
                    没有任何记录~
                </div>
            );
        }

        const columns = [
            {
                label: "时间",
                prop: "createTime",
                width: 190,
                render: row => {
                    return (
                        <span className={styles.timeCol}>
                            {getGMT8DateStr(moment(row.createTime * 1000))}
                        </span>
                    );
                }
            },
            {
                label: "类型",
                prop: "type",
                width: 150,
                render: row => {
                    return <span>{BalanceLogTypes[row.type.toString()]}</span>;
                }
            },
            {
                label: "数额",
                prop: "amount",
                width: 100,
                render: row => {
                    return (
                        <span
                            className={ClassNames({
                                [styles.green]: row.amount > 0,
                                [styles.red]: row.amount < 0
                            })}
                        >
                            {row.amount > 0 ? "+" : ""}
                            {row.amount}
                        </span>
                    );
                }
            },
            {
                label: "余额",
                prop: "balance",
                width: 120
            },
            {
                label: "事由",
                prop: "content",
                render: row => {
                    return (
                        <span className={styles.desCol}>
                            {row.link ? (
                                <a href={row.link} target="_blank">
                                    {row.content}
                                </a>
                            ) : (
                                row.content
                            )}
                        </span>
                    );
                }
            }
        ];

        const data = details.map(detail => {
            return Object.assign({}, detail);
        });
        return (
            <div className={styles.detailList}>
                <Table
                    className={styles.balanceTable}
                    columns={columns}
                    data={data}
                    stripe
                    border
                />
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </div>
        );
    };

    renderRankList = () => {
        const { total, ranks, loading } = this.store;
        if (total === 0 && !loading) {
            return (
                <div
                    className={ClassNames(
                        [styles.rankList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={styles.rankList}>
                {ranks.map((rank, index) => {
                    return this.renderRankItem(rank, index);
                })}
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    renderCostRankList = () => {
        const { total, costranks, loading } = this.store;
        if (total === 0 && !loading) {
            return (
                <div
                    className={ClassNames(
                        [styles.costrankList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={styles.costrankList}>
                {costranks.map((rank, index) => {
                    return this.renderRankItem(rank, index, true);
                })}
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    renderRankItem = (rank, index, isCostRank = false) => {
        const { page, pageSize } = this.store;
        const { user } = rank;
        const id = index + (page - 1) * pageSize + 1;
        return (
            <li key={index} className={styles.rankItem}>
                <Avatar className={styles.avatar} user={user} />
                <div className={styles.content}>
                    <header>
                        {id}.{" "}
                        <span className={styles.username}>
                            <Link to={`/u/${user.username}`}>
                                {user.nickname}
                            </Link>
                            {id === 1 && (
                                <span className={styles.metal}>🥇</span>
                            )}
                            {id === 2 && (
                                <span className={styles.metal}>🥈</span>
                            )}
                            {id === 3 && (
                                <span className={styles.metal}>🥉</span>
                            )}
                        </span>
                    </header>
                    <div className={styles.main}>
                        {user.bio && <p className={styles.bio}>{user.bio}</p>}
                        {user.url && (
                            <p className={styles.url}>
                                <a href={user.url} target="_blank">
                                    {user.url}
                                </a>
                            </p>
                        )}
                        {isCostRank ? (
                            <label className={styles.costBalanceBadge}>
                                共消费 $<span>{rank.amount}</span>
                            </label>
                        ) : (
                            <BalanceBadge
                                className={styles.balanceBadge}
                                balance={rank.amount}
                            />
                        )}
                    </div>
                    <footer>
                        第 <span>{user.id}</span> 号成员
                    </footer>
                </div>
            </li>
        );
    };

    render() {
        const { type } = this.props;
        let title;
        switch (type) {
            case "rank":
                title = "财富排行";
                break;
            case "costrank":
                title = "消费排行";
                break;
            default:
                title = "积分明细";
        }
        const meta = {
            title: `${title}-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript`,
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
            <div className={styles.balanceView}>
                <DocumentMeta {...meta} />
                <div className={ClassNames("container", [styles.container])}>
                    {this.renderTabs()}
                    {this.renderList()}
                    {this.renderPagination()}
                </div>
            </div>
        );
    }
}

const BalanceViewWithRouter = withRouter(BalanceView);

export default BalanceViewWithRouter;
