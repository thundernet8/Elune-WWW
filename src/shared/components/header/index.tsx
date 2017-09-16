import * as React from "react";
import ClassNames from "classnames";
import AuthModal, { AuthType } from "components/authModal";

const styles = require("./index.less");

interface HeaderProps {}

interface HeaderState {
    authType: AuthType;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props) {
        super(props);
        this.state = {
            authType: AuthType.None
        };
    }

    closeAuthPannel = () => {
        this.setState({
            authType: AuthType.None
        });
    };

    switchAuthType = (authType: AuthType) => {
        this.setState({
            authType
        });
    };

    renderAuthPanel = () => {
        const { authType } = this.state;
        return (
            <AuthModal
                open={authType !== AuthType.None}
                onClose={this.closeAuthPannel}
                authType={authType}
                switchType={this.switchAuthType}
            />
        );
    };

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
                                    onClick={this.switchAuthType.bind(
                                        this,
                                        AuthType.Register
                                    )}
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
                                    onClick={this.switchAuthType.bind(
                                        this,
                                        AuthType.Login
                                    )}
                                >
                                    <span className={styles.btnLabel}>登录</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.renderAuthPanel()}
            </header>
        );
    }
}
