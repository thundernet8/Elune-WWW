import * as React from "react";
import ClassNames from "classnames";
import BannerMsg from "components/bannerMsg";
import HomeAside from "../home/aside";
import FollowingMain from "./main";
import Sidebar from "components/sidebar";
import DocumentMeta from "react-document-meta";

const styles = require("../home/styles/index.less");

interface FollowingViewProps {}

interface FollowingViewState {}

export default class FollowingView extends React.Component<
    FollowingViewProps,
    FollowingViewState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const meta = {
            title:
                "关注话题-Elune Forum-Web development community,WordPress,PHP,Java,JavaScript",
            description: "Elune Forum",
            // canonical: "https://elune.me",
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
                <BannerMsg />
                <div className={ClassNames("container", [styles.container])}>
                    <div className={styles.mainWrapper}>
                        <HomeAside />
                        <FollowingMain />
                    </div>
                    <Sidebar where="following" />
                </div>
            </div>
        );
    }
}
