import * as path from "path";
import * as DocumentMeta from "react-document-meta";
// import Promise from "bluebird";
import * as ReactDOMServer from "react-dom/server";
import * as ejs from "ejs";
const App = require("../dist/assets/js/server").default;
import { SESSION_COOKIE_NAME } from "../env";

// const getReduxPromise = async (renderProps, store, history) => {
//     let { query, params } = renderProps;
//     let comp =
//         renderProps.components[renderProps.components.length - 1]
//             .WrappedComponent;
//     if (comp.fetchData) {
//         // 组件拥有static方法fetchData用于服务器端渲染时决定如何预加载数据
//         return await comp.fetchData({ query, params, store, history });
//     } else {
//         return;
//     }
// };

export default (req, res) => {
    const sessionId = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : "";
    const context: any = {
        SESSIONID: sessionId + "xxxxxxxxxxxxxxxxxx" // test
    };
    // const result = await getReduxPromise(nextState, store, history);
    const markup = ReactDOMServer.renderToString(App(req.originalUrl, context));
    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(302, context.url);
        return;
    }

    const meta = DocumentMeta.renderAsHTML();
    ejs.renderFile(
        path.resolve(__dirname, "./index.ejs"),
        {
            meta,
            markup
        },
        {},
        function(err, html) {
            if (!err) {
                res.send(html);
            } else {
                res.status(500).send(err.toString());
            }
        }
    );
};
