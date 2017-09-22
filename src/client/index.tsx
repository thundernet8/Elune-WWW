import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "mobx-react";
import routes from "./routes";

require("STYLES/global/index.less");
require("STYLES/app.less");

interface LazyComponentWrapperProps {
    history: any;
    location: any;
    match: any;
    getComponent: (component: any) => void;
}

interface LazyComponentWrapperState {
    LazyComponent: any;
}

class LazyComponentWrapper extends React.Component<
    LazyComponentWrapperProps,
    LazyComponentWrapperState
> {
    constructor(props) {
        super(props);
        this.state = {
            LazyComponent: null
        };
    }

    componentDidMount() {
        const { getComponent } = this.props;
        if (!getComponent || typeof getComponent !== "function") {
            return;
        }

        this.props.getComponent(LazyComponent => {
            this.setState({
                LazyComponent
            });
        });
    }

    render() {
        const { LazyComponent } = this.state;
        if (!LazyComponent) {
            return <div>Loading</div>; // TODO a common loading component
        }
        return React.createElement(LazyComponent, this.props);
    }
}

export default function Client() {
    return (
        <Provider stores={{}}>
            <Router>
                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            exact={!!route.exact}
                            path={route.path}
                            component={props => (
                                <LazyComponentWrapper
                                    {...props}
                                    getComponent={route.getComponent}
                                />
                            )}
                        />
                    ))}
                </Switch>
            </Router>
        </Provider>
    );
}
