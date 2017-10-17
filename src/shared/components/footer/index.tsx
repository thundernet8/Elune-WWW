import * as React from "react";
import ClassNames from "classnames";

const styles = require("./index.less");

interface FooterProps {}

interface FooterState {}

export default class Footer extends React.Component<FooterProps, FooterState> {
    constructor(props) {
        super(props);
    }

    render() {
        const year = new Date().getFullYear();
        return (
            <footer id="footer" className={styles.footer}>
                <div className={ClassNames("container", [styles.container])}>
                    <p>
                        <i className={styles.copyIcon}>&copy;</i>2017-{year}{" "}
                        <b style={{ color: "#ff4425" }}>♥</b> Elune All Right
                        Reserved.
                    </p>
                </div>
            </footer>
        );
    }
}
