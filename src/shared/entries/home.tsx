import * as React from "react";
import Header from "components/header";
import HomeView from "views/home";
import GlobalStore from "store/GlobalStore";

export default class HomeEntry extends React.Component<any, any> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore];

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
