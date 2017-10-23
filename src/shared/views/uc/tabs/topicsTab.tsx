import * as React from "react";
import { observer } from "mobx-react";
import UCStore from "store/UCStore";

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
        return null;
    };

    render() {
        const { store } = this.props;
        const { topicsLoading } = store;
        return (
            <div className={styles.topicsTab}>
                {this.renderTopicList()}
                {topicsLoading && (
                    <div className={styles.postsLoading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </div>
        );
    }
}
