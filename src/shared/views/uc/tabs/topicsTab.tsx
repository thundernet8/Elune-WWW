import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import UCStore from "store/UCStore";
import { Button } from "element-react/next";
import { Link } from "react-router-dom";
import TopicItem from "components/topicItem";

const styles = require("../styles/topicsTab.less");

interface TopicsTabProps {
    store: UCStore;
}

interface TopicsTabState {}

@observer
export default class TopicsTab extends React.Component<
    TopicsTabProps,
    TopicsTabState
> {
    constructor(props) {
        super(props);
    }

    renderTopicList = () => {
        const { store } = this.props;
        const { topicsTotal, topics, topicsLoading } = store;
        if (topicsTotal === 0 && !topicsLoading) {
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
        const { topicsLoading, hasMoreTopic, getNextPageTopics } = store;
        return (
            <div className={styles.topicsTab}>
                {this.renderTopicList()}
                {!topicsLoading &&
                    hasMoreTopic && (
                        <div className={styles.loadMore}>
                            <Button onClick={getNextPageTopics}>载入更多</Button>
                        </div>
                    )}
            </div>
        );
    }
}
