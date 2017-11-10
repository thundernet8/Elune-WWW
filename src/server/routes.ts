/**
 * Generated on Wed, 08 Nov 2017 09:51:04 GMT 
 * 本文件由routes.yaml模板生成, 请不要直接修改
 */

import Home from "entries/home";
import Blog from "entries/blog";
import Channels from "entries/channels";
import Topic from "entries/topic";
import Article from "entries/article";
import Uc from "entries/uc";
import Creation from "entries/creation";
import Activation from "entries/activation";
import Notification from "entries/notification";
import Follow from "entries/followUsers";
import Balance from "entries/balance";
import NotFound from "entries/notFound";

const routes = [
    { path: "/", exact: true, component: Home },
    { path: "/blog", exact: true, component: Blog },
    { path: "/channels", exact: true, component: Channels },
    { path: "/channel/:slug", exact: false, component: Home },
    { path: "/topic/:id", exact: false, component: Topic },
    { path: "/article/:id", exact: false, component: Article },
    { path: "/u/:username", exact: true, component: Uc },
    { path: "/u/:username/:tab", exact: false, component: Uc },
    { path: "/creation", exact: false, component: Creation },
    { path: "/activation", exact: false, component: Activation },
    { path: "/notification", exact: true, component: Notification },
    { path: "/notification/page/:page", exact: false, component: Notification },
    { path: "/notification/system", exact: true, component: Notification },
    {
        path: "/notification/system/page/:page",
        exact: false,
        component: Notification
    },
    { path: "/following", exact: true, component: Home },
    { path: "/following/users", exact: true, component: Follow },
    { path: "/following/users/page:page", exact: false, component: Follow },
    { path: "/following/activities", exact: true, component: Follow },
    {
        path: "/following/activities/page/:page",
        exact: false,
        component: Follow
    },
    { path: "/balance", exact: true, component: Balance },
    { path: "/balance/page/:page", exact: false, component: Balance },
    { path: "/balance/rank", exact: true, component: Balance },
    { path: "/balance/rank/page/:page", exact: false, component: Balance },
    { path: "/balance/costrank", exact: true, component: Balance },
    { path: "/balance/costrank/page/:page", exact: false, component: Balance },
    { path: "", exact: false, component: NotFound }
];

export default routes;
