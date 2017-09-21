/**
 * Generated on Thu, 21 Sep 2017 14:37:58 GMT 
 * 本文件由routes.yaml模板生成, 请不要直接修改
 */

const routes = [
    {
        path: "/",
        module: "entries/home",
        exact: true,
        getComponent(cb) {
            require.ensure(
                ["entries/home"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/home")["default"]);
                    /* tslint:enable */
                },
                "home"
            );
        }
    },
    {
        path: "/blog",
        module: "entries/blog",
        exact: true,
        getComponent(cb) {
            require.ensure(
                ["entries/blog"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/blog")["default"]);
                    /* tslint:enable */
                },
                "blog"
            );
        }
    },
    {
        path: "/channels",
        module: "entries/channels",
        exact: true,
        getComponent(cb) {
            require.ensure(
                ["entries/channels"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/channels")["default"]);
                    /* tslint:enable */
                },
                "channels"
            );
        }
    },
    {
        path: "/channel/:id",
        module: "entries/channel",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/channel"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/channel")["default"]);
                    /* tslint:enable */
                },
                "channel"
            );
        }
    },
    {
        path: "/topic/:id",
        module: "entries/topic",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/topic"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/topic")["default"]);
                    /* tslint:enable */
                },
                "topic"
            );
        }
    },
    {
        path: "/article/:id",
        module: "entries/article",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/article"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/article")["default"]);
                    /* tslint:enable */
                },
                "article"
            );
        }
    },
    {
        path: "/u/:username",
        module: "entries/uc",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/uc"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/uc")["default"]);
                    /* tslint:enable */
                },
                "uc"
            );
        }
    },
    {
        path: "",
        module: "entries/notFound",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/notFound"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/notFound")["default"]);
                    /* tslint:enable */
                },
                "notFound"
            );
        }
    }
];

export default routes;
