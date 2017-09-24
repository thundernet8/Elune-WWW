import * as React from "react";
import GlobalStore from "store/GlobalStore";
import CreationView from "views/creation";
import { IS_NODE } from "../../../env";

interface CreationEntryProps {}

interface CreationEntryState {}

export default class CreationEntry extends React.Component<
    CreationEntryProps,
    CreationEntryState
> {
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
                <main className="app-content">
                    <CreationView />
                </main>
            </div>
        );
    }
}
