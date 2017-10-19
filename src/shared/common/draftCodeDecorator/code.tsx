import * as React from "react";
import { EditorState } from "draft-js";

// const styles = require("./index.less");

interface CodeComponentProps {
    contentState?: EditorState;
    entityKey?: string;
}

interface CodeComponentState {}

export default class CodeComponent extends React.Component<
    CodeComponentProps,
    CodeComponentState
> {
    constructor(props) {
        super(props);
    }

    render() {
        // const {contentState, entityKey} = this.props;
        return <div>CodeComponent</div>;
    }
}
