import * as React from "react";
import { sanitize } from "utils/HtmlKit";

interface PureHtmlContentProps {
    html: string;
}

interface PureHtmlContentState {}

export default class PureHtmlContent extends React.Component<
    PureHtmlContentProps,
    PureHtmlContentState
> {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { html } = this.props;
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: sanitize(html)
                }}
            />
        );
    }
}
