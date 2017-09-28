import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { UploadImage } from "api/upload";

const styles = require("./index.less");

interface LocalEditorProps {
    rawContent: string;
    onChange: (raw: string, html: string, plainText: string) => void;
}

interface LocalEditorState {
    editorState: EditorState;
}

export default class LocalEditor extends React.Component<
    LocalEditorProps,
    LocalEditorState
> {
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
        onChange(json, html, plainText);
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
                    link: resp.result
                }
            };
        });
    };

    render() {
        const { editorState } = this.state;
        return (
            <div className={styles.localEditor}>
                <Editor
                    editorState={editorState}
                    toolbarClassName={styles.editorToolbar}
                    wrapperClassName={styles.editorWrapper}
                    editorClassName={styles.editor}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
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
