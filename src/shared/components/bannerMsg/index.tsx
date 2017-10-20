import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import GlobalStore from "store/GlobalStore";

const styles = require("./index.less");

interface BannerMsgMsgProps {}

interface BannerMsgMsgState {}

@observer
export default class BannerMsgMsg extends React.Component<
    BannerMsgMsgProps,
    BannerMsgMsgState
> {
    private store: GlobalStore;
    constructor(props) {
        super(props);
        this.store = GlobalStore.Instance;
    }

    render() {
        const { bannerMsg } = this.store;
        if (!bannerMsg || !bannerMsg.text) {
            return null;
        }

        const { text, link, color } = bannerMsg;
        return (
            <div className={styles.bannerMsg}>
                <div
                    className={styles.inner}
                    style={{ backgroundColor: color || "#0275d8" }}
                >
                    <div
                        className={ClassNames("container", [styles.container])}
                    >
                        {link && (
                            <a href={link} target="_blank">
                                {text}
                            </a>
                        )}
                        {!link && <p>{text}</p>}
                    </div>
                </div>
            </div>
        );
    }
}
