import * as React from "react";
import { PublicUserInfo } from "model/User";

const styles = require("./styles/aside.less");

interface UCAsideViewProps {
    user: PublicUserInfo;
    switchTab: (tab: string) => void;
}

interface UCAsideViewState {}

export default class UCAsideView extends React.Component<
    UCAsideViewProps,
    UCAsideViewState
> {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.ucAsideView}>UCAsideView</div>;
    }
}
