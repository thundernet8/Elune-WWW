import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { UploadImage } from "api/Upload";
import ClassNames from "classnames";
import { EditorSuggestion } from "interface/EditorSuggestion";

const styles = require("./index.less");

interface PostEditorProps {
    editorState: EditorState;
    onChange?: (state: EditorState) => void;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    toolBarClassName?: string;
    mentions?: EditorSuggestion[];
}

interface PostEditorState {}

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
    }

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

    render() {
        const {
            readOnly,
            placeholder,
            className,
            toolBarClassName,
            mentions,
            editorState,
            onChange
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
                    onEditorStateChange={onChange}
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
