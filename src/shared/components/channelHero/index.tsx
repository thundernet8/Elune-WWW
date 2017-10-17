import * as React from "react";
import ClassNames from "classnames";
import Channel from "model/Channel";

const styles = require("./index.less");

interface ChannelHeroProps {
    channel: Channel;
}

interface ChannelHeroState {}

export default class ChannelHero extends React.Component<
    ChannelHeroProps,
    ChannelHeroState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { channel } = this.props;
        if (!channel) {
            return null;
        }
        return (
            <header
                className={styles.hero}
                style={{ backgroundColor: channel.color }}
            >
                <div className={ClassNames("container", [styles.container])}>
                    <div className={styles.inner}>
                        <h2 className="Hero-title">{channel.title}</h2>
                        <p className="Hero-subtitle">{channel.description}</p>
                    </div>
                </div>
            </header>
        );
    }
}
