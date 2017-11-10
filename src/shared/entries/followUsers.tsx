import * as React from "react";
import Header from "components/header";
import FollowView from "views/follow";
import Footer from "components/footer";
import GlobalStore from "store/GlobalStore";
import FollowStore from "store/FollowStore";
import { IS_NODE } from "../../../env";

interface FollowUsersEntryProps {
    location: any;
    match: any;
}

interface FollowUsersEntryState {}

export default class FollowUsersEntry extends React.Component<
    FollowUsersEntryProps,
    FollowUsersEntryState
> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [GlobalStore, FollowStore];

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
                    <FollowView type="users" />
                </main>
                <Footer />
            </div>
        );
    }
}
