import * as React from "react";
import { observer } from "mobx-react";
import TopicItem from "components/topicItem";
import Select from "common/select";
import HomeStore from "store/HomeStore";
import ChannelStore from "store/ChannelStore";
import { Button } from "element-react/next";
import { SortOrderBy } from "enum/Sort";
import ClassNames from "classnames";
import { Link } from "react-router-dom";

const styles = require("./index.less");

interface TopicListProps {
    store: HomeStore | ChannelStore;
}

interface TopicListState {}

@observer
export default class TopicList extends React.Component<
    TopicListProps,
    TopicListState
> {
    constructor(props) {
        super(props);
    }

    renderTopicList = () => {
        const { store } = this.props;
        const { topics, topicsLoading, total } = store;

        if (total === 0 && !topicsLoading) {
            return (
                <div
                    className={ClassNames(
                        [styles.topicList],
                        [styles.emptyList]
                    )}
                >
                    空空如也，何不<Link to="/creation">创作</Link>一个？
                </div>
            );
        }
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
        const { store } = this.props;
        const {
            hasMoreTopic,
            topicsLoading,
            getNextPageTopics,
            refreshTopics,
            switchSort,
            orderBy
        } = store;
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
                        {/* <li className="item-markAllAsRead">
                            <button
                                title="标记所有为已读"
                                className="btn btn--icon hasIcon"
                                type="button"
                            >
                                <i className="icon fa fa-fw fa-check btn-icon" />
                            </button>
                        </li> */}
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
