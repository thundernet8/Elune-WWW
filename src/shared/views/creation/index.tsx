import * as React from "react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import LocalEditor from "components/editor";

const styles = require("./styles/index.less");

interface CreationViewProps {
    history: any;
}

interface CreationViewState {
    title: string;
    raw: string;
    html: string;
    text: string;
}

class CreationView extends React.Component<
    CreationViewProps,
    CreationViewState
> {
    private editor: LocalEditor;
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            raw: "",
            html: "",
            text: ""
        };
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
        console.log(raw);
        console.log(html);
        console.log(plainText);
        this.setState({
            raw,
            html,
            text: plainText
        });
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
            </div>
        );
    }
}

const CreationViewWithRouter = withRouter(CreationView);

export default CreationViewWithRouter;
