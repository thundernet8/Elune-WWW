import * as React from "react";
import Header from "components/header";
import Footer from "components/footer";
import ChannelView from "views/channel";
import GlobalStore from "store/GlobalStore";
import ChannelStore from "store/HomeStore";
import { IS_NODE } from "../../../env";

interface ChannelEntryProps {
    stores?: any;
    location: any;
    match: any;
}

interface ChannelEntryState {}

export default class ChannelEntry extends React.Component<
    ChannelEntryProps,
    ChannelEntryState
> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore, ChannelStore];

    constructor(props) {
        super(props);
        if (!IS_NODE) {
            const { location, match } = props;
            GlobalStore.getInstance({ location, match, cookies: "" });
        }
    }

    render() {
        return (
            <div>
                <Header />
                <main className="app-content">
                    <ChannelView />
                </main>
                <Footer />
            </div>
        );
    }
}
