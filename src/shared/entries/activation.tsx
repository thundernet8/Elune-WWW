import * as React from "react";
import ActivationView from "views/activation";

interface ActivationProps {}

interface ActivationState {}

export default class NotFound extends React.Component<
    ActivationProps,
    ActivationState
> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [];

    render() {
        return <ActivationView />;
    }
}
