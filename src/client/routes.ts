/**
 * Generated on Mon, 06 Nov 2017 16:20:25 GMT 
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
        path: "/channel/:slug",
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
        exact: true,
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
        path: "/u/:username/:tab",
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
        path: "/creation",
        module: "entries/creation",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/creation"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/creation")["default"]);
                    /* tslint:enable */
                },
                "creation"
            );
        }
    },
    {
        path: "/activation",
        module: "entries/activation",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/activation"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/activation")["default"]);
                    /* tslint:enable */
                },
                "activation"
            );
        }
    },
    {
        path: "/notification",
        module: "entries/notification",
        exact: true,
        getComponent(cb) {
            require.ensure(
                ["entries/notification"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/notification")["default"]);
                    /* tslint:enable */
                },
                "notification"
            );
        }
    },
    {
        path: "/notification/system",
        module: "entries/sysNotification",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["entries/sysNotification"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/sysNotification")["default"]);
                    /* tslint:enable */
                },
                "notification"
            );
        }
    },
    {
        path: "/following",
        module: "entries/following",
        exact: true,
        getComponent(cb) {
            require.ensure(
                ["entries/following"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("entries/following")["default"]);
                    /* tslint:enable */
                },
                "following"
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
