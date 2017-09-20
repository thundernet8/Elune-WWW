"use strict";
exports.__esModule = true;
var path = require("path");
var DocumentMeta = require("react-document-meta");
// import Promise from "bluebird";
var ReactDOMServer = require("react-dom/server");
var ejs = require("ejs");
var App = require("../dist/assets/js/server")["default"];
var env_1 = require("../env");
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
exports["default"] = function (req, res) {
    var sessionId = req.cookies ? req.cookies[env_1.SESSION_COOKIE_NAME] : "";
    var context = {
        SESSIONID: sessionId + "xxxxxxxxxxxxxxxxxx"
    };
    // const result = await getReduxPromise(nextState, store, history);
    var markup = ReactDOMServer.renderToString(App(req.originalUrl, context));
    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(302, context.url);
        return;
    }
    var meta = DocumentMeta.renderAsHTML();
    ejs.renderFile(path.resolve(__dirname, "./index.ejs"), {
        meta: meta,
        markup: markup
    }, {}, function (err, html) {
        if (!err) {
            res.send(html);
        }
        else {
            res.status(500).send(err.toString());
        }
    });
};
