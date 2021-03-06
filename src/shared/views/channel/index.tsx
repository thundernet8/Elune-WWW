import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import { withRouter } from "react-router";
import ChannelHero from "components/channelHero";
import ChannelStore from "store/ChannelStore";
import Sidebar from "components/sidebar";
import DocumentMeta from "react-document-meta";
import Aside from "../home/aside";
import ChannelMain from "./main";

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

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const { slug } = match.params;
        const prevSlug = prevProps.match.params.slug;
        if (slug !== prevSlug) {
            this.store = ChannelStore.rebuild({ location, match, cookies: "" });
        }
    }

    componentWillUnmount() {
        this.store.destroy();
    }

    render() {
        const { channel } = this.store;
        const meta = {
            title: `${channel
                ? channel.title + "-"
                : ""}Elune Forum-Web development community,WordPress,PHP,Java,JavaScript`,
            description: channel ? channel.description : "",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Elune,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        return (
            <div className={styles.homeview}>
                <DocumentMeta {...meta} />
                <ChannelHero channel={channel} />
                <div className={ClassNames("container", [styles.container])}>
                    <div className={styles.mainWrapper}>
                        <Aside channel={channel ? channel : null as any} />
                        <ChannelMain />
                    </div>
                    <Sidebar where="channel" />
                </div>
            </div>
        );
    }
}

const ChannelViewWithRouter = withRouter(ChannelView);

export default ChannelViewWithRouter;
