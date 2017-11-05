import * as React from "react";
import { StaticRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "mobx-react";
import routes from "./routes";
require("polyfill");

export const Routes = routes;

export default function Server(location, context, stores) {
    return (
        <Provider stores={stores}>
            <Router location={location} context={context}>
                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            exact={!!route.exact}
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </Switch>
            </Router>
        </Provider>
    );
}
