import * as React from "react";
import ClassNames from "classnames";
import WelcomeHero from "components/welcomeHero";
import HomeAside from "./aside";
import HomeMain from "./main";

const styles = require("./index.less");

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
        return (
            <div className={styles.homeview}>
                <WelcomeHero />
                <div className={ClassNames("container", [styles.container])}>
                    <HomeAside />
                    <HomeMain />
                </div>
            </div>
        );
    }
}
