/**
 * Generated on Sat, 16 Sep 2017 06:09:18 GMT
 * 本文件由routes.yaml模板生成, 请不要直接修改
 */

import Home from "entries/home";
import Blog from "entries/blog";
import Channels from "entries/channels";
import Channel from "entries/channel";
import Topic from "entries/topic";
import Article from "entries/article";
import Uc from "entries/uc";

const routes = [
    { path: "/", exact: true, component: Home },
    { path: "/blog", exact: true, component: Blog },
    { path: "/channels", exact: true, component: Channels },
    { path: "/channel/:id", exact: false, component: Channel },
    { path: "/topic/:id", exact: false, component: Topic },
    { path: "/article/:id", exact: false, component: Article },
    { path: "/u/:username", exact: false, component: Uc }
];

export default routes;
