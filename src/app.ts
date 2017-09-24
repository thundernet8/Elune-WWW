import * as ReactDOM from "react-dom";
import App from "./client";

App().then(root => {
    ReactDOM.render(
        root as React.ReactElement<any>,
        document.getElementById("app")
    );
});
