import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import LocalEditor from "components/editor";
import Modal from "common/modal";
import CreateTopicStore from "store/CreateTopicStore";
import { Button, Message } from "element-react/next";
import DocumentMeta from "react-document-meta";

const styles = require("./styles/index.less");

interface CreationViewProps {
    history: any;
}

interface CreationViewState {}

@observer
class CreationView extends React.Component<
    CreationViewProps,
    CreationViewState
> {
    private editor: LocalEditor;
    private store: CreateTopicStore;

    constructor(props) {
        super(props);
        this.store = CreateTopicStore.getInstance();
    }

    componentWillUnmount() {
        this.store.destroy();
    }

    refEditor = (editor: LocalEditor) => {
        this.editor = editor;
    };

    fallback = () => {
        // const { history } = this.props;
        // if (history.length > 0) {
        //     history.goBack();
        // }
        location.href = "/";
    };

    formClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };

    publishTopic = () => {
        const { publishTopic, requesting } = this.store;
        if (requesting) {
            return;
        }
        publishTopic()
            .then(() => {
                this.editor.clean();
                Message({
                    message: "创建话题成功",
                    type: "success"
                });
                setTimeout(this.fallback, 1000);
            })
            .catch(err => {
                Message({
                    message: err.message || err.toString(),
                    type: "error"
                });
            });
    };

    renderChannelsModal = () => {
        const {
            showChannels,
            selectedChannel,
            pendingSelectChannel,
            topChannels,
            subChannels,
            toggleChannelsModal,
            preSelectChannel,
            confirmSelectChannel
        } = this.store;
        if (!showChannels) {
            return null;
        }

        const channel = selectedChannel || pendingSelectChannel;

        return (
            <Modal
                className={ClassNames("animated zoomIn", [
                    styles.channelsModal
                ])}
                visible
                showClose
                onClose={toggleChannelsModal}
            >
                <form onClick={this.formClick}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>为新话题选择一个频道</h3>
                    </div>
                    <div className={styles.body}>
                        <ul className={styles.channelList}>
                            {topChannels.map((topChannel, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={ClassNames([styles.pinned], {
                                            [styles.active]:
                                                pendingSelectChannel &&
                                                pendingSelectChannel.id ===
                                                    topChannel.id
                                        })}
                                        onClick={preSelectChannel.bind(
                                            this.store,
                                            topChannel.id
                                        )}
                                    >
                                        <span
                                            className={styles.channelIcon}
                                            style={{
                                                backgroundColor:
                                                    topChannel.color
                                            }}
                                        />
                                        <span
                                            className={styles.channelName}
                                            style={{ color: topChannel.color }}
                                        >
                                            {topChannel.title}
                                        </span>
                                        <span className={styles.channelDesc}>
                                            {topChannel.description}
                                        </span>
                                    </li>
                                );
                            })}
                            {subChannels.map((subChannel, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={ClassNames({
                                            [styles.active]:
                                                pendingSelectChannel &&
                                                pendingSelectChannel.id ===
                                                    subChannel.id
                                        })}
                                        onClick={preSelectChannel.bind(
                                            this.store,
                                            subChannel.id
                                        )}
                                    >
                                        <span className={styles.channelIcon} />
                                        <span className={styles.channelName}>
                                            {subChannel.title}
                                        </span>
                                        <span className={styles.channelDesc}>
                                            {subChannel.description}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={styles.footer}>
                        <div className="form-group">
                            <button
                                className="btn btn--primary btn--block"
                                type="submit"
                                onClick={confirmSelectChannel}
                                disabled={!channel}
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
        const meta = {
            title:
                "创建话题-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript",
            description: "",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Elune,forum,wordpress,php,java,javascript,react"
                }
            }
        };
        const canGoBack = this.props.history.length > 0;
        const {
            selectedChannel,
            toggleChannelsModal,
            publishBtnDisabled,
            title,
            onInputTitle,
            contentChange,
            requesting
        } = this.store;
        return (
            <div className={styles.creationview}>
                <DocumentMeta {...meta} />
                {canGoBack && (
                    <button
                        className={ClassNames("btn btn--icon", [styles.close])}
                        onClick={this.fallback}
                    >
                        <i className="el-icon-close" />
                    </button>
                )}
                <section className={styles.header}>
                    <h2>新的话题</h2>
                    <ul>
                        <li className={styles.channels}>
                            {selectedChannel && (
                                <span
                                    className={styles.channel}
                                    onClick={toggleChannelsModal}
                                    style={{
                                        backgroundColor: selectedChannel.color
                                    }}
                                    title={selectedChannel.description}
                                >
                                    {selectedChannel.title}
                                </span>
                            )}
                            {!selectedChannel && (
                                <span
                                    className={styles.choose}
                                    onClick={toggleChannelsModal}
                                >
                                    选择频道
                                </span>
                            )}
                        </li>
                        <li className={styles.title}>
                            <h3>
                                <input
                                    className={ClassNames(
                                        "form-control",
                                        styles.titleInput
                                    )}
                                    value={title}
                                    onChange={onInputTitle}
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
                        onChange={contentChange}
                    />
                </section>
                <section className={styles.footer}>
                    <Button
                        className={ClassNames([styles.publishBtn])}
                        type="primary"
                        size="large"
                        disabled={publishBtnDisabled}
                        onClick={this.publishTopic}
                    >
                        发布话题
                        {requesting && (
                            <i className="el-icon-loading el-icon-right" />
                        )}
                    </Button>
                </section>
                {this.renderChannelsModal()}
            </div>
        );
    }
}

const CreationViewWithRouter = withRouter(CreationView);

export default CreationViewWithRouter;
