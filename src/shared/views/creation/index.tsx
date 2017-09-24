import * as React from "react";
import ClassNames from "classnames";
import { withRouter } from "react-router";

const styles = require("./styles/index.less");

interface CreationViewProps {
    history: any;
}

interface CreationViewState {}

class CreationView extends React.Component<
    CreationViewProps,
    CreationViewState
> {
    constructor(props) {
        super(props);
    }

    fallback = () => {
        const { history } = this.props;
        if (history.length > 0) {
            history.goBack();
        }
    };

    render() {
        const canGoBack = this.props.history.length > 0;
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
                CreationView
            </div>
        );
    }
}

const CreationViewWithRouter = withRouter(CreationView);

export default CreationViewWithRouter;
