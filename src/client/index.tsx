import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import routes from "../shared/routes";

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
            return null;
        }
        return React.createElement(LazyComponent, this.props);
    }
}

export default function Client() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/a">a</Link>
                    </li>
                    <li>
                        <Link to="/b">b</Link>
                    </li>
                </ul>
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
            </div>
        </Router>
    );
}
