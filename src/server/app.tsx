import * as React from "react";
import { StaticRouter as Router, Route } from "react-router-dom";
import routes from "./routes";

export default function Server(location, context) {
    return (
        <Router location={location} context={context}>
            <div>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        exact={!!route.exact}
                        path={route.path}
                        component={route.component}
                    />
                ))}
            </div>
        </Router>
    );
}
