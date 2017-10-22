import * as React from "react";
import ReactDOM from "react-dom";

interface RenderInBodyProps {
    className: any;
    onClick: () => void;
}

interface RenderInBodyState {}

export default class RenderInBody extends React.Component<
    RenderInBodyProps,
    RenderInBodyState
> {
    private popup: HTMLDivElement;

    componentDidMount() {
        this.popup = document.createElement("div");
        document.body.appendChild(this.popup);
        this.renderLayer();
    }

    componentDidUpdate() {
        this.renderLayer();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.popup);
    }

    renderLayer = () => {
        ReactDOM.hydrate(
            <div {...this.props}>{this.props.children}</div>,
            this.popup
        );
    };

    render() {
        // Render a placeholder
        return <div {...this.props} children={null} />;
    }
}
