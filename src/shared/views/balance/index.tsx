import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import DocumentMeta from "react-document-meta";
import BalanceStore from "store/BalanceStore";
import { Tabs, TabPane, Pagination } from "element-react/next";
// import { Link } from "react-router-dom";
import moment from "moment";
import { getGMT8DateStr } from "utils/DateTimeKit";

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
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={styles.detailList}>
                {details.map((detail, index) => {
                    return (
                        <li key={index}>
                            <div className={styles.col}>
                                {getGMT8DateStr(
                                    moment(detail.createTime * 1000)
                                )}
                            </div>
                            <div className={styles.col}>
                                {detail.afterStatus}
                            </div>
                        </li>
                    );
                })}
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
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
            <ul className={styles.costrankList}>
                {ranks.map((rank, index) => {
                    return <li key={index}>{rank.uid}</li>;
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
                {costranks.map((costrank, index) => {
                    return <li key={index}>{costrank.uid}</li>;
                })}
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
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
