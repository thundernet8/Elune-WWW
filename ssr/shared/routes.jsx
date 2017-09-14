// import A from "views/a";
// import B from "views/b";
// import Home from "views/home";
// TODO a tool to auto generate this file from a template
// const IS_NODE = new Function(
//     "try {return this===global;}catch(e){return false;}"
// )();
const routes = [
    {
        path: "/",
        module: "views/home",
        exact: true,
        getComponent(cb) {
            require.ensure(["views/home"], require => {
                cb && cb(require("views/home")["default"]);
            }, "home");
        }
    },
    {
        path: "/a",
        module: "views/a",
        getComponent(cb) {
            require.ensure(["views/a"], require => {
                cb && cb(require("views/a")["default"]);
            }, "A");
        }
    },
    {
        path: "/b",
        module: "views/b",
        getComponent(cb) {
            require.ensure(["views/b"], require => {
                cb && cb(require("views/b")["default"]);
            }, "B");
        }
    }
];
export default routes;
