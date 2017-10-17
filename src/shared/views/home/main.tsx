import * as React from "react";
import { observer } from "mobx-react";
import HomeStore from "store/HomeStore";
import TopicList from "components/topicList";

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

    componentWillUnmount() {
        this.store.destroy();
    }

    render() {
        return <TopicList store={this.store} />;
    }
}
