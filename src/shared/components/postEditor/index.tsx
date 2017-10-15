import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { UploadImage } from "api/Upload";
import ClassNames from "classnames";
import { EditorSuggestion } from "interface/EditorSuggestion";

const styles = require("./index.less");

interface PostEditorProps {
    rawContent: string;
    onChange?: (
        raw: string,
        html: string,
        plainText: string,
        mentions: EditorSuggestion[]
    ) => void;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    toolBarClassName?: string;
    mentions?: EditorSuggestion[];
}

interface PostEditorState {
    editorState: EditorState;
}

export default class PostEditor extends React.Component<
    PostEditorProps,
    PostEditorState
> {
    static defaultProps = {
        readOnly: false,
        mentions: []
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

        const entities = Object.keys(raw.entityMap).map(
            key => raw.entityMap[key]
        );
        const mentions: EditorSuggestion[] = entities
            .filter((value: any) => value.type === "MENTION")
            .map((m: any) => m.data);
        if (onChange) {
            onChange(json, html, plainText, mentions);
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
        const {
            readOnly,
            placeholder,
            className,
            toolBarClassName,
            mentions
        } = this.props;

        return (
            <div
                className={ClassNames(
                    [styles.postEditor],
                    {
                        [styles.readOnly]: readOnly
                    },
                    [className]
                )}
                suppressContentEditableWarning
            >
                <Editor
                    readOnly={readOnly}
                    editorState={editorState}
                    toolbarClassName={ClassNames(
                        [styles.editorToolbar],
                        [toolBarClassName]
                    )}
                    wrapperClassName={styles.editorWrapper}
                    editorClassName={styles.editor}
                    onEditorStateChange={this.onEditorStateChange}
                    placeholder={placeholder}
                    toolbar={{
                        options: [
                            "blockType",
                            "colorPicker",
                            "link",
                            /* "embedded", */
                            "emoji",
                            "image",
                            "list",
                            "history"
                        ],
                        fontFamily: {
                            options: [
                                "宋体",
                                "微软雅黑",
                                "黑体",
                                "楷体_GB2312",
                                "幼圆",
                                "Arial",
                                "Arial Black",
                                "Comic Sans MS",
                                "Georgia",
                                "Times New Roman"
                            ]
                        },
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
                    mention={{
                        separator: " ",
                        trigger: "@",
                        suggestions: mentions
                    }}
                    autoFocus
                />
            </div>
        );
    }
}
