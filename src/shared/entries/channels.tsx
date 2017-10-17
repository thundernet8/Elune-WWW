import * as React from "react";
import Header from "components/header";
import Footer from "components/footer";
import ChannelsView from "views/channels";
import GlobalStore from "store/GlobalStore";
import ChannelsStore from "store/ChannelsStore";
import { IS_NODE } from "../../../env";

export default class ChannelListEntry extends React.Component<any, any> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore, ChannelsStore];

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
                    <ChannelsView />
                </main>
                <Footer />
            </div>
        );
    }
}
