import * as React from "react";
import ClassNames from "classnames";
import Modal from "common/modal";
import { isEmail } from "utils/TextKit";
import GlobalStore from "store/GlobalStore";
import UserInfo from "model/User";
import CommonResp from "model/Resp";

const styles = require("./index.less");

export enum AuthType {
    None,
    Login,
    Register
}

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    authType: AuthType;
    switchType: (authType: AuthType) => void;
}

interface AuthModalState {
    username: string;
    email: string;
    password: string;
    alert: string;
    requesting: boolean;
    [field: string]: string | boolean;
}

export default class AuthModal extends React.Component<
    AuthModalProps,
    AuthModalState
> {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            alert: "",
            requesting: false
        };
    }

    formClick = (e: any) => {
        e.stopPropagation();
    };

    onInput = (field: string, e: any) => {
        this.setState({
            [field]: e.target.value
        });
    };

    onSubmit = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        const { username, email, password, requesting } = this.state;
        const { authType } = this.props;

        if (requesting) {
            return false;
        }

        if (!username || username.length < 4) {
            this.alert("用户名不能为空或少于4位");
            return false;
        }

        if (authType === AuthType.Register && !isEmail(email)) {
            this.alert("邮箱格式不正确");
            return false;
        }

        if (!password || password.length < 6) {
            this.alert("密码不能为空或少于6位");
            return false;
        }

        if (authType === AuthType.Login) {
            this.requestLogin(username, password);
        }
        if (authType === AuthType.Register) {
            this.requestRegister(username, email, password);
        }
    };

    alert = (alert: string) => {
        this.setState({
            alert
        });
        setTimeout(() => {
            this.setState({
                alert: ""
            });
        }, 5000);
    };

    requestLogin = (username: string, password: string) => {
        this.setState({
            requesting: true
        });
        return GlobalStore.Instance
            .requestLogin(username, password)
            .then((resp: CommonResp<UserInfo>) => {
                console.log(resp);
                this.setState({
                    requesting: false
                });
                this.props.switchType(AuthType.None);
            })
            .catch(err => {
                console.dir(err);
                this.alert(err.response ? err.response.data : err.message);
                this.setState({
                    requesting: false
                });
            });
    };

    requestRegister = (username: string, email: string, password: string) => {
        this.setState({
            requesting: true
        });
        return GlobalStore.Instance
            .requestRegister(username, email, password)
            .then((resp: CommonResp<UserInfo>) => {
                console.log(resp);
                this.setState({
                    requesting: false
                });
                this.props.switchType(AuthType.None);
            })
            .catch(err => {
                console.dir(err);
                this.alert(err.response ? err.response.data : err.message);
                this.setState({
                    requesting: false
                });
            });
    };

    render() {
        const { open, authType, switchType } = this.props;
        const { username, email, password, alert, requesting } = this.state;
        const title = authType === AuthType.Login ? "登入" : "注册";
        return (
            <Modal
                className={ClassNames("animated zoomIn", [styles.authModal])}
                visible={open}
                showClose
                onClose={this.props.onClose}
            >
                <form onClick={this.formClick}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>{title}</h3>
                    </div>
                    {alert && (
                        <div className={styles.alert}>
                            <p>{alert}</p>
                        </div>
                    )}
                    <div className={styles.body}>
                        <div className={styles.socialBtns}>
                            <button
                                className={ClassNames(
                                    "btn btn--block",
                                    [styles.loginBtn],
                                    [styles.githubLoginBtn]
                                )}
                                type="button"
                                title="使用 GitHub 登入"
                            >
                                <i className="icon fa fa-fw fa-github" />
                                <span className="Button-label">
                                    使用 GitHub 登入
                                </span>
                            </button>
                        </div>
                        <div className="form form--centered">
                            <div className="form-group">
                                <input
                                    className={ClassNames("form-control", [
                                        styles.formControl
                                    ])}
                                    name="username"
                                    type="text"
                                    placeholder={
                                        authType === AuthType.Login
                                            ? "用户名 或 邮箱"
                                            : "用户名"
                                    }
                                    value={username}
                                    onChange={this.onInput.bind(
                                        this,
                                        "username"
                                    )}
                                />
                            </div>
                            {authType === AuthType.Register && (
                                <div className="form-group">
                                    <input
                                        className={ClassNames("form-control", [
                                            styles.formControl
                                        ])}
                                        name="email"
                                        type="text"
                                        placeholder="邮箱"
                                        value={email}
                                        onChange={this.onInput.bind(
                                            this,
                                            "email"
                                        )}
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <input
                                    className={ClassNames("form-control", [
                                        styles.formControl
                                    ])}
                                    name="password"
                                    type="password"
                                    placeholder="密码"
                                    value={password}
                                    onChange={this.onInput.bind(
                                        this,
                                        "password"
                                    )}
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn--primary btn--block"
                                    type="submit"
                                    title={title}
                                    onClick={this.onSubmit}
                                    disabled={requesting}
                                >
                                    <span className="btn-label">
                                        {title}
                                        {requesting && (
                                            <i className="fa fa-spin fa-spinner" />
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        {(function() {
                            if (authType === AuthType.Login) {
                                return (
                                    <div>
                                        <p>
                                            <a>忘记了密码？</a>
                                        </p>
                                        <p>
                                            还没有注册？{" "}
                                            <a
                                                onClick={
                                                    requesting
                                                        ? () => {}
                                                        : switchType.bind(
                                                              this,
                                                              AuthType.Register
                                                          )
                                                }
                                            >
                                                注册
                                            </a>
                                        </p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>
                                        <p>
                                            已经注册过了？ {" "}
                                            <a
                                                onClick={
                                                    requesting
                                                        ? () => {}
                                                        : switchType.bind(
                                                              this,
                                                              AuthType.Login
                                                          )
                                                }
                                            >
                                                登入
                                            </a>
                                        </p>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </form>
            </Modal>
        );
    }
}
