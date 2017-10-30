import * as React from "react";
import ClassNames from "classnames";
import WelcomeHero from "components/welcomeHero";
import BannerMsg from "components/bannerMsg";
import HomeAside from "./aside";
import HomeMain from "./main";
import Sidebar from "components/sidebar";
import DocumentMeta from "react-document-meta";

const styles = require("./styles/index.less");

interface HomeViewProps {}

interface HomeViewState {}

export default class HomeView extends React.Component<
    HomeViewProps,
    HomeViewState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const meta = {
            title:
                "Elune Forum-Web development community,WordPress,PHP,Java,JavaScript",
            description: "Elune Forum",
            // canonical: "https://elune.me",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Elune,forum,wordpress,php,java,javascript,react"
                }
            }
        };

        // DocumentMeta.rewind();

        return (
            <div className={styles.homeview}>
                <DocumentMeta {...meta} />
                <BannerMsg />
                <WelcomeHero />
                <div className={ClassNames("container", [styles.container])}>
                    <div className={styles.mainWrapper}>
                        <HomeAside />
                        <HomeMain />
                    </div>
                    <Sidebar where="home" />
                </div>
            </div>
        );
    }
}
