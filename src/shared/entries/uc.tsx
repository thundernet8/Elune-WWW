import * as React from "react";
import GlobalStore from "store/GlobalStore";
import UCStore from "store/UCStore";
import Header from "components/header";
import Footer from "components/footer";
import UCView from "views/uc";
import { IS_NODE } from "../../../env";

export default class UCEntry extends React.Component<any, any> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore, UCStore];

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
                    <UCView />
                </main>
                <Footer />
            </div>
        );
    }
}
