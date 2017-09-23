import * as React from "react";
import GlobalStore from "store/GlobalStore";
import { IS_NODE } from "../../../env";

export default class TopicEntry extends React.Component<any, any> {
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
        return <div>Topic</div>;
    }
}
