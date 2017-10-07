import * as React from "react";
import GlobalStore from "store/GlobalStore";
import TopicStore from "store/TopicStore";
import Header from "components/header";
import Footer from "components/footer";
import TopicView from "views/topic";
import { IS_NODE } from "../../../env";

export default class TopicEntry extends React.Component<any, any> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore, TopicStore];

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
                    <TopicView />
                </main>
                <Footer />
            </div>
        );
    }
}
