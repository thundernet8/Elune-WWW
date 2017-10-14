import * as React from "react";
import ClassNames from "classnames";
import DocumentMeta from "react-document-meta";
import { withRouter } from "react-router";
import { Activate, ReActivate } from "api/Auth";
import { Message, Input, Button } from "element-react/next";
import { isEmail } from "utils/TextKit";

const styles = require("./styles/index.less");

interface ActivationViewProps {
    location: any;
}

interface ActivationViewState {
    timing: number;
    step: ActivateSteps;
    email: string;
}

enum ActivateSteps {
    ACTIVATING,
    ACTIVATED,
    ACTIVATE_FAILED,
    REACTIVATE
}

class ActivationView extends React.Component<
    ActivationViewProps,
    ActivationViewState
> {
    constructor(props) {
        super(props);
        this.state = {
            timing: 10,
            step: ActivateSteps.ACTIVATING,
            email: ""
        };
    }

    onInputEmail = (email: string) => {
        this.setState({
            email
        });
    };

    onSwitchStep = (step: ActivateSteps) => {
        this.setState({
            step
        });
    };

    reSendMail = () => {
        const { email } = this.state;
        if (!email) {
            Message({
                message: "邮箱不能为空",
                type: "error"
            });
            return false;
        }
        if (!isEmail(email)) {
            Message({
                message: "邮箱不合法",
                type: "error"
            });
            return false;
        }
        ReActivate({ email })
            .then(resp => {
                if (resp) {
                    Message({
                        message: "激活邮件已重新发送",
                        type: "success"
                    });
                    this.setState({
                        email: ""
                    });
                } else {
                    throw new Error("");
                }
            })
            .catch(() => {
                Message({
                    message: "请求失败，请重试",
                    type: "error"
                });
            });
    };

    componentDidMount() {
        const { search } = this.props.location;
        Activate({ tokenSearch: search })
            .then(resp => {
                if (resp) {
                    this.setState({
                        step: ActivateSteps.ACTIVATED
                    });
                    const that = this;
                    setInterval(function() {
                        that.setState({
                            timing: that.state.timing - 1
                        });
                    }, 1000);
                } else {
                    throw new Error("");
                }
            })
            .catch(() => {
                Message({
                    message: "账户激活失败, 您的激活链接已过期或无效",
                    type: "error"
                });
                this.setState({
                    step: ActivateSteps.ACTIVATE_FAILED
                });
            });
    }

    componentDidUpdate() {
        const { timing } = this.state;
        if (timing <= 0 && typeof window !== "undefined") {
            window.location.href = "/";
        }
    }

    renderActivatingStep = () => {
        const { step } = this.state;
        if (step !== ActivateSteps.ACTIVATING) {
            return null;
        }
        return (
            <div className={styles.content}>
                <div className={styles.activating}>
                    <i className="el-icon-loading" />
                    <p>正在尝试激活</p>
                </div>
            </div>
        );
    };

    renderActivatedStep = () => {
        const { step, timing } = this.state;
        if (step !== ActivateSteps.ACTIVATED) {
            return null;
        }
        return (
            <div className={styles.content}>
                <p className={styles.activated}>
                    您的账户已激活成功，将在<span className={styles.timing}>
                        {timing}
                    </span>秒内跳转至首页.
                </p>
            </div>
        );
    };

    renderActivateFailStep = () => {
        const { step } = this.state;
        if (step !== ActivateSteps.ACTIVATE_FAILED) {
            return null;
        }
        return (
            <div className={styles.content}>
                <div className={styles.activateFailed}>
                    <p>激活失败，您的链接已过期或无效</p>
                    <Button
                        type="text"
                        onClick={this.onSwitchStep.bind(
                            this,
                            ActivateSteps.REACTIVATE
                        )}
                    >
                        重新发送激活邮件
                    </Button>
                </div>
            </div>
        );
    };

    renderReActivateStep = () => {
        const { step, email } = this.state;
        if (step !== ActivateSteps.REACTIVATE) {
            return null;
        }
        return (
            <div className={styles.content}>
                <div className={styles.reActivate}>
                    <Input
                        placeholder="输入账户邮箱"
                        value={email}
                        onChange={this.onInputEmail}
                        className={styles.emailInput}
                    />
                    <Button
                        type="primary"
                        onClick={this.reSendMail}
                        disabled={!isEmail(email)}
                    >
                        重新发送
                    </Button>
                </div>
            </div>
        );
    };

    render() {
        const meta = {
            title:
                "账户激活-Eleun Forum-Web development community,WordPress,PHP,Java,JavaScript",
            description: "I am a description, and I can create multiple tags",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Eleun,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <div className={styles.activationView}>
                <DocumentMeta {...meta} />
                <div className={ClassNames("container", [styles.container])}>
                    <h1>账户激活</h1>
                    {this.renderActivatingStep()}
                    {this.renderActivatedStep()}
                    {this.renderActivateFailStep()}
                    {this.renderReActivateStep()}
                </div>
            </div>
        );
    }
}

const ActivationViewWithRouter = withRouter(ActivationView);

export default ActivationViewWithRouter;
