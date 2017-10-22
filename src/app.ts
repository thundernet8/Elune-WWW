import * as ReactDOM from "react-dom";
import App from "./client";

App().then(root => {
    ReactDOM.hydrate(
        root as React.ReactElement<any>,
        document.getElementById("app")
    );
});
