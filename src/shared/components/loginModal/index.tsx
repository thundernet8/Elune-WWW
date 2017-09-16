import * as React from "react";
import ClassNames from "classnames";
import { Modal } from "semantic-ui-react";

const styles = require("./index.less");

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

interface LoginModalState {}

export default class LoginModal extends React.Component<
    LoginModalProps,
    LoginModalState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { open } = this.props;
        return (
            <Modal
                className={ClassNames("Modal animated zoomIn", [
                    styles.loginModal
                ])}
                dimmer
                open={open}
                onClose={this.props.onClose}
            >
                <Modal.Content>
                    <div className="Modal-close App-backControl">
                        <button
                            className="Button Button--icon Button--link hasIcon"
                            type="button"
                        >
                            <i className="icon fa fa-fw fa-times Button-icon" />
                        </button>
                    </div>
                    <form>
                        <div className="Modal-header">
                            <h3 className="App-titleControl App-titleControl--text">
                                登入
                            </h3>
                        </div>
                        <div className="Modal-alert" />
                        <div className="Modal-body">
                            <div className="LogInButtons">
                                <button
                                    className="Button LogInButton--github LogInButton hasIcon"
                                    type="button"
                                    title="使用 GitHub 登入"
                                >
                                    <i className="icon fa fa-fw fa-github Button-icon" />
                                    <span className="Button-label">
                                        使用 GitHub 登入
                                    </span>
                                </button>
                            </div>
                            <div className="Form Form--centered">
                                <div className="Form-group">
                                    <input
                                        className="FormControl"
                                        name="email"
                                        type="text"
                                        placeholder="用户名 或 邮箱"
                                    />
                                </div>
                                <div className="Form-group">
                                    <input
                                        className="FormControl"
                                        name="password"
                                        type="password"
                                        placeholder="密码"
                                    />
                                </div>
                                <div className="Form-group">
                                    <button
                                        className="Button Button--primary Button--block"
                                        type="submit"
                                        title="登入"
                                    >
                                        <span className="Button-label">登入</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="Modal-footer">
                            <p className="LogInModal-forgotPassword">
                                <a>忘记了密码？</a>
                            </p>
                            <p className="LogInModal-signUp">
                                还没有注册？ <a>注册</a>
                            </p>
                        </div>
                    </form>
                </Modal.Content>
            </Modal>
        );
    }
}
