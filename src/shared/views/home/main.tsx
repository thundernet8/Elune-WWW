import * as React from "react";
import { observer } from "mobx-react";
import TopicItem from "components/topicItem";
import Select from "common/select";
import HomeStore from "store/HomeStore";
import { Button } from "element-react/next";

const styles = require("./styles/main.less");

interface HomeMainProps {}

interface HomeMainState {
    sort: string;
}

@observer
export default class HomeMain extends React.Component<
    HomeMainProps,
    HomeMainState
> {
    private store: HomeStore;

    constructor(props) {
        super(props);
        this.state = {
            sort: "latest"
        };
        this.store = HomeStore.getInstance();
    }

    selectSort = (value: string) => {
        this.setState({
            sort: value
        });
    };

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
        const { sort } = this.state;
        const {
            hasMoreTopic,
            topicsLoading,
            getNextPageTopics,
            refreshTopics
        } = this.store;
        return (
            <div className={styles.main}>
                <div className={styles.toolbar}>
                    <Select value={sort} onSelect={this.selectSort}>
                        <Select.Option value="latest">最新回复</Select.Option>
                        <Select.Option value="top">热门话题</Select.Option>
                        <Select.Option value="newest">近期话题</Select.Option>
                        <Select.Option value="oldest">历史话题</Select.Option>
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
                                <Button
                                    title="载入更多"
                                    onClick={getNextPageTopics}
                                >
                                    载入更多
                                </Button>
                            </div>
                        )}
                </div>
            </div>
        );
    }
}
