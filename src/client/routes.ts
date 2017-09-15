/**
 * Generated on Fri, 15 Sep 2017 15:57:42 GMT 
 * 本文件由routes.yaml模板生成, 请不要直接修改
 */

const routes = [
    {
        path: "/",
        module: "views/home",
        exact: true,
        getComponent(cb) {
            require.ensure(
                ["views/home"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("views/home")["default"]);
                    /* tslint:enable */
                },
                "home"
            );
        }
    },
    {
        path: "/a",
        module: "views/a",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["views/a"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("views/a")["default"]);
                    /* tslint:enable */
                },
                "a"
            );
        }
    },
    {
        path: "/b",
        module: "views/b",
        exact: false,
        getComponent(cb) {
            require.ensure(
                ["views/b"],
                require => {
                    /* tslint:disable */
                    cb && cb(require("views/b")["default"]);
                    /* tslint:enable */
                },
                "b"
            );
        }
    }
];

export default routes;
