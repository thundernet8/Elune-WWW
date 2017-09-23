import * as React from "react";
import { observer, inject } from "mobx-react";
import Header from "components/header";
import HomeView from "views/home";
import GlobalStore from "store/GlobalStore";
import { IS_NODE } from "../../../env";

interface HomeEntryProps {
    stores?: any;
    location: any;
    match: any;
}

@inject("stores")
@observer
export default class HomeEntry extends React.Component<HomeEntryProps, any> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore];

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
                    <HomeView />
                </main>
            </div>
        );
    }
}
