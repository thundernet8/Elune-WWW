import * as React from "react";
import Header from "components/header";
import NotificationView from "views/notification";
import Footer from "components/footer";
import GlobalStore from "store/GlobalStore";
import NotificationStore from "store/NotificationStore";
import { IS_NODE } from "../../../env";

interface SysNotificationEntryProps {
    location: any;
    match: any;
}

interface SysNotificationEntryState {}

export default class SysNotificationEntry extends React.Component<
    SysNotificationEntryProps,
    SysNotificationEntryState
> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore, NotificationStore];

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
                    <NotificationView type="system" />
                </main>
                <Footer />
            </div>
        );
    }
}
