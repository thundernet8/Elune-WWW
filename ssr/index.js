"use strict";
exports.__esModule = true;
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var compression = require("compression");
var responseTimer = require("response-time");
var render_1 = require("./render");
var env_1 = require("../env");
var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseTimer());
app.use(express.static(path.resolve(__dirname, "../dist"), {
    index: ""
}));
app.get("*", render_1["default"]);
app.disable("x-powered-by");
app.listen(env_1.SSR_SERVER_PORT, env_1.SSR_SERVER_HOST, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("SSR Node Server Is Listening at http://" + env_1.SSR_SERVER_HOST + ":" + env_1.SSR_SERVER_PORT);
});
