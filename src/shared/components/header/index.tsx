import * as React from "react";
import ClassNames from "classnames";

const styles = require("./index.less");

export default class Header extends React.Component<any, any> {
    render() {
        return (
            <header id="header" className={styles.appHeader}>
                <div className={ClassNames("container", [styles.container])}>
                    <h1 className={styles.headerTitle}>
                        <a href="/">Elune Forum</a>
                    </h1>
                    <div className={styles.headerPrimary}>
                        <ul className={styles.headerControls}>
                            <li>
                                <a
                                    href="/"
                                    className={ClassNames("btn btn-link", [
                                        styles.btnLink
                                    ])}
                                >
                                    <i className="fa fa-home" />首页
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.headerSecondary}>
                        <ul className={styles.headerControls}>
                            <li className={styles.itemSearch}>
                                <div className={styles.search}>
                                    <div className={styles.searchInput}>
                                        <input
                                            className="form-control"
                                            placeholder="搜索其实很简单"
                                        />
                                    </div>
                                    <ul className={styles.searchResults} />
                                </div>
                            </li>
                            {/* <li className={styles.itemNotifications}></li>
                        <li className={styles.itemSession}></li> */}
                            <li className={styles.itemSignup}>
                                <button
                                    className={ClassNames("btn btn-link", [
                                        styles.btnLink
                                    ])}
                                    type="button"
                                    title="注册"
                                >
                                    <span className={styles.btnLabel}>注册</span>
                                </button>
                            </li>
                            <li className={styles.itemSignin}>
                                <button
                                    className={ClassNames("btn btn-link", [
                                        styles.btnLink
                                    ])}
                                    type="button"
                                    title="登录"
                                >
                                    <span className={styles.btnLabel}>登录</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
}
