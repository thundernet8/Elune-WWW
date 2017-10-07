import * as React from "react";
import DocumentMeta from "react-document-meta";
// import Topic from "model/Topic";
import TopicStore from "store/TopicStore";

const styles = require("./styles/main.less");

interface TopicMainProps {
    store: TopicStore;
}

interface TopicMainState {}

export default class TopicMain extends React.Component<
    TopicMainProps,
    TopicMainState
> {
    renderMainThread = () => {
        return null;
    };

    renderPostList = () => {
        return null;
    };

    renderPostBox = () => {
        return null;
    };

    render() {
        const { store } = this.props;
        const { loading, topic } = store;
        if (loading) {
            return (
                <div className={styles.topicLoading}>
                    <i className="el-icon-loading" />
                </div>
            );
        }
        const meta = {
            title: `${topic.title}-Eleun Forum-Web development community,WordPress,PHP,Java,JavaScript`,
            description: topic.content.substr(0, 100),
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Eleun,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <main className={styles.mainView}>
                <DocumentMeta {...meta} />
                <div className={styles.mainWrapper}>
                    {this.renderMainThread()}
                    {this.renderPostList()}
                    {this.renderPostBox()}
                </div>
            </main>
        );
    }
}
