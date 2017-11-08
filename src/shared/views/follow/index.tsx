import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import DocumentMeta from "react-document-meta";
import FollowStore from "store/FollowStore";
import { Tabs, TabPane, Layout, Pagination } from "element-react/next";
import { Link } from "react-router-dom";
import moment from "moment";
import { getTimeDiff } from "utils/DateTimeKit";
import Avatar from "components/avatar";
import { getCharColor } from "utils/ColorKit";
import Activity from "./activity";

const styles = require("./styles/index.less");

interface FollowViewProps {
    type: string;
    match: any;
    location: any;
    history: any;
}

interface FollowViewState {}

@observer
class FollowView extends React.Component<FollowViewProps, FollowViewState> {
    private store: FollowStore;

    constructor(props) {
        super(props);
        const { match, location, type } = props;
        this.store = FollowStore.getInstance(
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
        history.push(`/following/${tabName}`);
    };

    onPageChange = (nextpage: number) => {
        const { history, type } = this.props;
        const { page } = this.store;
        if ((page > 1 && nextpage === 1) || (page === 1 && nextpage > 1)) {
            this.store.destroy();
        }
        const pageSuffix = nextpage === 1 ? "" : `/page/${nextpage}`;
        history.push(`/following/${type}${pageSuffix}`);
    };

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const page = Number(match.params.page) || 1;
        const prevPage = Number(prevProps.match.params.page) || 1;
        if (page !== prevPage) {
            this.store = FollowStore.rebuild({ location, match, cookies: "" });
        }
    }

    renderTabs = () => {
        const { type } = this.props;
        return (
            <header className={styles.tabs}>
                <Tabs activeName={type} onTabClick={this.switchTab}>
                    <TabPane label="关注用户" name="users" />
                    <TabPane label="关注动态" name="activities" />
                </Tabs>
            </header>
        );
    };

    renderUserList = () => {
        const { total, users, loading } = this.store;
        if (total === 0 && !loading) {
            return (
                <div
                    className={ClassNames(
                        [styles.followList],
                        [styles.userList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={ClassNames([styles.followList], [styles.userList])}>
                <Layout.Row gutter={20}>
                    {users.map((user, index) => {
                        return (
                            <Layout.Col
                                className={styles.listItem}
                                span={12}
                                key={index}
                            >
                                <div
                                    className={styles.mask}
                                    style={{
                                        background: getCharColor(
                                            user.username[0]
                                        )
                                    }}
                                />
                                <li key={index}>
                                    <header>
                                        <Avatar
                                            user={user}
                                            className={styles.avatar}
                                        />
                                        <div className={styles.userInfo}>
                                            <div className={styles.nickname}>
                                                {user.nickname}
                                            </div>
                                            <Link to={`/u/${user.username}`}>
                                                @{user.username}
                                            </Link>
                                        </div>
                                    </header>
                                    <div className={styles.userMetas}>
                                        <p>
                                            <i className="fa fa-fw fa-clock-o" />
                                            加入于{" "}
                                            {getTimeDiff(moment(user.joinTime * 1000))},
                                            本站第 {user.id} 位用户
                                        </p>
                                        {user.bio && (
                                            <p>
                                                <i className="fa fa-fw fa-newspaper-o" />
                                                {user.bio}
                                            </p>
                                        )}
                                        {user.url && (
                                            <p>
                                                <i className="fa fa-fw fa-link" />
                                                <a
                                                    href={user.url}
                                                    target="_blank"
                                                >
                                                    {user.url}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </li>
                            </Layout.Col>
                        );
                    })}
                </Layout.Row>
                {loading && (
                    <div className={styles.loading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    renderActitityList = () => {
        const { total, activities, loading } = this.store;
        if (total === 0 && !loading) {
            return (
                <div
                    className={ClassNames(
                        [styles.followList],
                        [styles.logList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={ClassNames([styles.followList], [styles.logList])}>
                {activities.map((activity, index) => {
                    return (
                        <li key={index}>
                            <Activity activity={activity} />
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

    render() {
        const { type } = this.props;
        const meta = {
            title: `${type === "users"
                ? "关注用户"
                : "关注动态"}-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript`,
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
            <div className={styles.followView}>
                <DocumentMeta {...meta} />
                <div className={ClassNames("container", [styles.container])}>
                    {this.renderTabs()}
                    {type === "users"
                        ? this.renderUserList()
                        : this.renderActitityList()}
                    {this.renderPagination()}
                </div>
            </div>
        );
    }
}

const FollowViewWithRouter = withRouter(FollowView);

export default FollowViewWithRouter;
