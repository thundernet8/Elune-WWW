import * as React from "react";
import { observer } from "mobx-react";
import TopicItem from "components/topicItem";
import Select from "common/select";
import HomeStore from "store/HomeStore";
import { Button } from "element-react/next";
import { SortOrderBy } from "enum/Sort";

const styles = require("./styles/main.less");

interface HomeMainProps {}

interface HomeMainState {}

@observer
export default class HomeMain extends React.Component<
    HomeMainProps,
    HomeMainState
> {
    private store: HomeStore;

    constructor(props) {
        super(props);
        this.store = HomeStore.getInstance();
    }

    renderTopicList = () => {
        const { topics, topicsLoading } = this.store;
        return (
            <ul className={styles.topicList}>
                {topics.map((topic, index) => {
                    return (
                        <li key={index}>
                            <TopicItem key={index} topic={topic} />
                        </li>
                    );
                })}
                {topicsLoading && (
                    <div className={styles.topicsLoading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    render() {
        const {
            hasMoreTopic,
            topicsLoading,
            getNextPageTopics,
            refreshTopics,
            switchSort,
            orderBy
        } = this.store;
        return (
            <div className={styles.main}>
                <div className={styles.toolbar}>
                    <Select value={orderBy} onSelect={switchSort}>
                        <Select.Option value={SortOrderBy.LAST_POST_TIME}>
                            最新回复
                        </Select.Option>
                        <Select.Option value={SortOrderBy.POSTS_COUNT}>
                            热门话题
                        </Select.Option>
                        <Select.Option value={SortOrderBy.CREATE_TIME}>
                            近期话题
                        </Select.Option>
                    </Select>
                    <ul className={styles.actions}>
                        <li className="item-refresh">
                            <button
                                title="刷新"
                                className="btn btn--icon hasIcon"
                                type="button"
                                onClick={refreshTopics}
                            >
                                <i className="icon fa fa-fw fa-refresh btn-icon" />
                            </button>
                        </li>
                        <li className="item-markAllAsRead">
                            <button
                                title="标记所有为已读"
                                className="btn btn--icon hasIcon"
                                type="button"
                            >
                                <i className="icon fa fa-fw fa-check btn-icon" />
                            </button>
                        </li>
                    </ul>
                </div>
                <div className={styles.topicListWrapper}>
                    {this.renderTopicList()}
                    {!topicsLoading &&
                        hasMoreTopic && (
                            <div className={styles.loadMore}>
                                <Button onClick={getNextPageTopics}>
                                    载入更多
                                </Button>
                            </div>
                        )}
                </div>
            </div>
        );
    }
}
