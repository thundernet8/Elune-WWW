/**
 * Generated on Mon, 06 Nov 2017 16:20:25 GMT 
 * 本文件由routes.yaml模板生成, 请不要直接修改
 */

import Home from "entries/home";
import Blog from "entries/blog";
import Channels from "entries/channels";
import Channel from "entries/channel";
import Topic from "entries/topic";
import Article from "entries/article";
import Uc from "entries/uc";
import Creation from "entries/creation";
import Activation from "entries/activation";
import Notification from "entries/notification";
import Following from "entries/following";
import NotFound from "entries/notFound";

const routes = [
    { path: "/", exact: true, component: Home },
    { path: "/blog", exact: true, component: Blog },
    { path: "/channels", exact: true, component: Channels },
    { path: "/channel/:slug", exact: false, component: Channel },
    { path: "/topic/:id", exact: false, component: Topic },
    { path: "/article/:id", exact: false, component: Article },
    { path: "/u/:username", exact: true, component: Uc },
    { path: "/u/:username/:tab", exact: false, component: Uc },
    { path: "/creation", exact: false, component: Creation },
    { path: "/activation", exact: false, component: Activation },
    { path: "/notification", exact: true, component: Notification },
    { path: "/notification/system", exact: false, component: Notification },
    { path: "/following", exact: true, component: Following },
    { path: "", exact: false, component: NotFound }
];

export default routes;
