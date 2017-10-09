import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { UploadImage } from "api/Upload";
import ClassNames from "classnames";

const styles = require("./index.less");

interface PostEditorProps {
    rawContent: string;
    onChange?: (raw: string, html: string, plainText: string) => void;
    readOnly?: boolean;
}

interface PostEditorState {
    editorState: EditorState;
}

export default class PostEditor extends React.Component<
    PostEditorProps,
    PostEditorState
> {
    static defaultProps = {
        readOnly: false
    };

    constructor(props) {
        super(props);
        const editorState = props.rawContent
            ? EditorState.createWithContent(
                  convertFromRaw(JSON.parse(props.rawContent))
              )
            : EditorState.createEmpty();

        this.state = {
            editorState: editorState
        };
    }

    onEditorStateChange = (editorState: EditorState) => {
        const { onChange } = this.props;
        const raw = convertToRaw(editorState.getCurrentContent());
        const json = JSON.stringify(raw);
        const html = draftToHtml(raw);
        const plainText = editorState.getCurrentContent().getPlainText();
        if (onChange) {
            onChange(json, html, plainText);
        }
        this.setState({
            editorState
        });
    };

    uploadCallback = (file: File) => {
        const data = new FormData();
        // data.append('foo', 'bar');
        data.append("file", file);
        return UploadImage(data).then(resp => {
            return {
                data: {
                    link: resp.result[0]
                }
            };
        });
    };

    clean = () => {
        this.setState({
            editorState: EditorState.createEmpty()
        });
    };

    render() {
        const { editorState } = this.state;
        const { readOnly } = this.props;
        return (
            <div
                className={ClassNames([styles.PostEditor], {
                    [styles.readOnly]: readOnly
                })}
            >
                <Editor
                    readOnly={readOnly}
                    editorState={editorState}
                    toolbarClassName={styles.editorToolbar}
                    wrapperClassName={styles.editorWrapper}
                    editorClassName={styles.editor}
                    onEditorStateChange={this.onEditorStateChange}
                    placeholder="输入正文..."
                    toolbar={{
                        options: [
                            "inline",
                            "blockType",
                            "fontSize",
                            "fontFamily",
                            "colorPicker",
                            "link",
                            /* "embedded", */
                            "emoji",
                            "image",
                            "list",
                            "textAlign",
                            "remove",
                            "history"
                        ],
                        fontSize: {
                            options: [10, 12, 14, 16, 18, 24, 30]
                        },
                        image: {
                            uploadEnabled: true,
                            uploadCallback: this.uploadCallback
                        }
                    }}
                    localization={{
                        locale: "zh"
                    }}
                />
            </div>
        );
    }
}
