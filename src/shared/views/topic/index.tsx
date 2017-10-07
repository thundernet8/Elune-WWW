import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import TopicHero from "components/topicHero";
import { withRouter } from "react-router";
import TopicStore from "store/TopicStore";
import Sidebar from "components/sidebar";
import TopicMain from "./main";

const styles = require("./styles/index.less");

interface TopicViewProps {
    match: any;
    location: any;
}

interface TopicViewState {}

@observer
class TopicView extends React.Component<TopicViewProps, TopicViewState> {
    private store: TopicStore;

    constructor(props) {
        super(props);
        const { match, location } = this.props;
        this.store = TopicStore.getInstance({ match, location, cookies: "" });
    }

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const { id } = match.params;
        const prevId = prevProps.match.params.id;
        if (id !== prevId) {
            this.store = TopicStore.rebuild({ location, match, cookies: "" });
        }
    }

    componentWillUnmount() {
        this.store.destroy();
    }

    render() {
        const { topic } = this.store;

        return (
            <div className={styles.topicView}>
                <TopicHero topic={topic} />
                <div className={ClassNames("container", [styles.container])}>
                    <TopicMain store={this.store} />
                    <Sidebar where="topic" />
                </div>
            </div>
        );
    }
}

const TopicViewWithRouter = withRouter(TopicView);

export default TopicViewWithRouter;
