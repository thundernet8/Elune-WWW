import * as React from "react";
import TopicItem from "components/topicItem";
import Select from "common/select";

const styles = require("./main.less");

interface HomeMainProps {}

interface HomeMainState {
    sort: string;
}

export default class HomeMain extends React.Component<
    HomeMainProps,
    HomeMainState
> {
    constructor(props) {
        super(props);
    }

    selectSort = (value: string) => {
        console.log(value);
        this.setState({
            sort: value
        });
    };

    render() {
        return (
            <div className={styles.main}>
                <div className={styles.toolbar}>
                    <Select value="latest" onSelect={this.selectSort}>
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
                    <ul className={styles.topicList}>
                        <li>
                            <TopicItem />
                        </li>
                    </ul>
                    <div className={styles.loadMore}>
                        <button className="btn" type="button" title="载入更多">
                            <span className="btn-label">载入更多</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
