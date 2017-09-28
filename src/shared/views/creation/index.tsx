import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import LocalEditor from "components/editor";
import Modal from "common/modal";
import Channel from "model/Channel";
import CreateTopicStore from "store/CreateTopicStore";

const styles = require("./styles/index.less");

interface CreationViewProps {
    history: any;
}

interface CreationViewState {
    title: string;
    raw: string;
    html: string;
    text: string;
    showChannels: boolean;
    channel?: Channel;
    pendingChannel?: Channel;
}

@observer
class CreationView extends React.Component<
    CreationViewProps,
    CreationViewState
> {
    private editor: LocalEditor;
    private store: CreateTopicStore;

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            raw: "",
            html: "",
            text: "",
            showChannels: false
        };
        this.store = CreateTopicStore.getInstance();
    }

    refEditor = (editor: LocalEditor) => {
        this.editor = editor;
    };

    fallback = () => {
        const { history } = this.props;
        if (history.length > 0) {
            history.goBack();
        }
    };

    onInputTitle = (e: any) => {
        this.setState({
            title: e.target.value
        });
    };

    contentChange = (raw: string, html: string, plainText: string) => {
        // console.log(raw);
        // console.log(html);
        // console.log(plainText);
        this.setState({
            raw,
            html,
            text: plainText
        });
    };

    toggleChannelsModal = () => {
        this.setState({
            showChannels: !this.state.showChannels
        });
    };

    renderChannelsModal = () => {
        // const { showChannels, channel, pendingChannel } = this.state;
        // if (!showChannels) {
        //     return null;
        // }
        const { channel, pendingChannel } = this.state;

        const selectChannel = channel || pendingChannel;

        return (
            <Modal
                className={ClassNames("animated zoomIn", [
                    styles.channelsModal
                ])}
                visible
                showClose
                onClose={this.toggleChannelsModal}
            >
                <form>
                    <div className={styles.header}>
                        <h3 className={styles.title}>为新话题选择一个频道</h3>
                    </div>
                    <div className={styles.body}>
                        <ul className={styles.channelList}>
                            <li className={styles.pinned}>
                                <span
                                    className={styles.channelIcon}
                                    style={{
                                        backgroundColor: "rgb(72, 191, 131)"
                                    }}
                                />
                                <span
                                    className={styles.channelName}
                                    style={{ color: "rgb(72, 191, 131)" }}
                                >
                                    开发
                                </span>
                                <span className={styles.channelDesc}>
                                    Elune开发相关
                                </span>
                            </li>
                            <li className={styles.pinned}>
                                <span
                                    className={styles.channelIcon}
                                    style={{
                                        backgroundColor: "rgb(75, 147, 209)"
                                    }}
                                />
                                <span
                                    className={styles.channelName}
                                    style={{ color: "rgb(75, 147, 209)" }}
                                >
                                    支持
                                </span>
                                <span className={styles.channelDesc}>
                                    使用问题反馈支持
                                </span>
                            </li>
                            <li className={styles.pinned}>
                                <span
                                    className={styles.channelIcon}
                                    style={{
                                        backgroundColor: "rgb(181, 158, 140)"
                                    }}
                                />
                                <span
                                    className={styles.channelName}
                                    style={{ color: "rgb(181, 158, 140)" }}
                                >
                                    测试
                                </span>
                                <span className={styles.channelDesc}>
                                    测试发布话题专用频道
                                </span>
                            </li>
                            <li>
                                <span className={styles.channelIcon} />
                                <span className={styles.channelName}>灌水</span>
                                <span className={styles.channelDesc}>
                                    灌水闲聊休闲区
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.footer}>
                        <div className="form-group">
                            <button
                                className="btn btn--primary btn--block"
                                type="submit"
                                onClick={this.toggleChannelsModal}
                                disabled={!selectChannel}
                            >
                                <span className="btn-label">确定</span>
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        );
    };

    render() {
        const canGoBack = this.props.history.length > 0;
        const { title } = this.state;
        return (
            <div className={styles.creationview}>
                {canGoBack && (
                    <button
                        className={ClassNames("btn btn--icon", [styles.close])}
                        onClick={this.fallback}
                    >
                        <i className="icon fa fa-fw fa-close btn-icon" />
                    </button>
                )}
                <section className={styles.header}>
                    <h2>新的话题</h2>
                    <ul>
                        <li className={styles.channels}>
                            <span className={styles.choose}>选择频道</span>
                        </li>
                        <li className={styles.title}>
                            <h3>
                                <input
                                    className={ClassNames(
                                        "form-control",
                                        styles.titleInput
                                    )}
                                    value={title}
                                    onChange={this.onInputTitle}
                                    placeholder="话题标题"
                                />
                            </h3>
                        </li>
                    </ul>
                </section>
                <section className={styles.contentEditor}>
                    <LocalEditor
                        ref={this.refEditor}
                        rawContent={""}
                        onChange={this.contentChange}
                    />
                </section>
                <section className={styles.footer}>
                    <button
                        className={ClassNames("btn btn--primary", [
                            styles.publishBtn
                        ])}
                        type="button"
                    >
                        发布话题
                    </button>
                </section>
                {this.renderChannelsModal()}
            </div>
        );
    }
}

const CreationViewWithRouter = withRouter(CreationView);

export default CreationViewWithRouter;
