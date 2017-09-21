import * as path from "path";
import { matchPath } from "react-router-dom";
import * as DocumentMeta from "react-document-meta";
import * as Promise from "bluebird";
import * as ReactDOMServer from "react-dom/server";
import * as ejs from "ejs";
import { lowerCaseFirst } from "../src/shared/utils/TextKit";
const App = require("../dist/assets/js/server").default;
const routes = require("../dist/assets/js/server").Routes;

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
    const promises: any[] = [];
    const stores: any = {};
    routes.forEach(route => {
        const match = matchPath(req.originalUrl, route);
        if (match) {
            match.cookies = req.headers.cookie;
            const storeClasses = route.component["STORE_CLASSES"];
            storeClasses &&
                storeClasses.forEach((clazz: any) => {
                    clazz.getInstance &&
                        (stores[lowerCaseFirst(clazz.name)] = clazz.getInstance(
                            match
                        ));
                });
        }
    });
    Object.keys(stores).forEach((key: string) => {
        promises.push(stores[key].fetchData());
    });

    Promise.all(promises)
        .then(() => {
            const context: any = {};
            // const result = await getReduxPromise(nextState, store, history);
            const markup = ReactDOMServer.renderToString(
                App(req.originalUrl, context, stores)
            );
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
        })
        .catch(() => {
            ejs.renderFile(
                path.resolve(__dirname, "../dist/index.html"),
                {},
                {},
                function(err, html) {
                    if (!err) {
                        res.send(html);
                    } else {
                        res.status(500).send(err.toString());
                    }
                }
            );
        });
};
