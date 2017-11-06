import * as React from "react";
import { observer } from "mobx-react";
import FollowingStore from "store/FollowingStore";
import TopicList from "components/topicList";

interface FollowingMainProps {}

interface FollowingMainState {}

@observer
export default class FollowingMain extends React.Component<
    FollowingMainProps,
    FollowingMainState
> {
    private store: FollowingStore;

    constructor(props) {
        super(props);
        this.store = FollowingStore.getInstance();
    }

    render() {
        return <TopicList store={this.store} />;
    }
}
