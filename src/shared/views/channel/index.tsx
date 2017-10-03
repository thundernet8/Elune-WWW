import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import ChannelHero from "components/channelHero";
import ChannelStore from "store/ChannelStore";
import Sidebar from "components/sidebar";
import DocumentMeta from "react-document-meta";
import HomeAside from "../home/aside";
import HomeMain from "../home/main";

const styles = require("./styles/index.less");

interface ChannelViewProps {
    history: any;
    match: any;
    location: any;
}

interface ChannelViewState {}

@observer
class ChannelView extends React.Component<ChannelViewProps, ChannelViewState> {
    private store: ChannelStore;

    constructor(props) {
        super(props);
        const { location, match } = props;
        this.store = ChannelStore.getInstance({ location, match, cookies: "" });
    }

    render() {
        const { channel } = this.store;
        const meta = {
            title:
                "Eleun Forum-Web development community,WordPress,PHP,Java,JavaScript",
            description: "I am a description, and I can create multiple tags",
            canonical: "https://elune.fuli.news",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Eleun,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <div className={styles.homeview}>
                <DocumentMeta {...meta} />
                <ChannelHero channel={channel} />
                <div className={ClassNames("container", [styles.container])}>
                    <HomeAside color={channel ? channel.color : ""} />
                    <HomeMain />
                    <Sidebar where="channel" />
                </div>
            </div>
        );
    }
}

const ChannelViewWithRouter = withRouter(ChannelView);

export default ChannelViewWithRouter;
