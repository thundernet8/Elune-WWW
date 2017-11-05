import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import GlobalStore from "store/GlobalStore";

const styles = require("./index.less");

interface FooterProps {}

interface FooterState {}

@observer
export default class Footer extends React.Component<FooterProps, FooterState> {
    constructor(props) {
        super(props);
    }

    render() {
        const year = new Date().getFullYear();
        const { onlineStatistic } = GlobalStore.Instance;
        return (
            <footer id="footer" className={styles.footer}>
                <div className={ClassNames("container", [styles.container])}>
                    <p>
                        <i className={styles.copyIcon}>&copy;</i>2017-{year}{" "}
                        <b style={{ color: "#ff4425" }}>♥</b> Elune All Right
                        Reserved.
                        {onlineStatistic && (
                            <span
                                className={styles.status}
                            >{`当前在线用户 ${onlineStatistic.total} 已登录 ${onlineStatistic.logged}`}</span>
                        )}
                    </p>
                </div>
            </footer>
        );
    }
}
