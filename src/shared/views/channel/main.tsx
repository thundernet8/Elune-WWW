import * as React from "react";
import { observer } from "mobx-react";
import ChannelStore from "store/ChannelStore";
import TopicList from "components/topicList";

interface ChannelMainProps {}

interface ChannelMainState {}

@observer
export default class ChannelMain extends React.Component<
    ChannelMainProps,
    ChannelMainState
> {
    private store: ChannelStore;

    constructor(props) {
        super(props);
        this.store = ChannelStore.getInstance();
    }

    render() {
        return <TopicList store={this.store} />;
    }
}
