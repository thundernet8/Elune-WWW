import * as React from "react";
import ClassNames from "classnames";
import LoginModal from "components/loginModal";

const styles = require("./index.less");

interface HeaderProps {}

interface HeaderState {
    showLogin: boolean;
    showRegister: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            showRegister: false
        };
    }

    toggleLoginPannel = () => {
        const { showLogin } = this.state;
        this.setState({
            showLogin: !showLogin
        });
        if (!showLogin) {
            this.setState({
                showRegister: false
            });
        }
    };

    toggleRegisterPannel = () => {
        const { showRegister } = this.state;
        this.setState({
            showRegister: !showRegister
        });
        if (!showRegister) {
            this.setState({
                showLogin: false
            });
        }
    };

    renderLoginPanel = () => {
        const { showLogin } = this.state;
        return <LoginModal open={showLogin} onClose={this.toggleLoginPannel} />;
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
                                    onClick={this.toggleRegisterPannel}
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
                                    onClick={this.toggleLoginPannel}
                                >
                                    <span className={styles.btnLabel}>登录</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.renderLoginPanel()}
            </header>
        );
    }
}
