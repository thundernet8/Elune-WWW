import * as React from "react";
import ClassNames from "classnames";
import UserWidget from "./widgets/user";

const styles = require("./index.less");

interface SidebarProps {
    where?: string;
    className?: string;
}

interface SidebarState {}

export default class Sidebar extends React.Component<
    SidebarProps,
    SidebarState
> {
    static defaultProps = {
        where: "home"
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { where } = this.props;
        return (
            <aside className={ClassNames([styles.sidebar], [where], "sidebar")}>
                <UserWidget />
                <div className={ClassNames("widget", [styles.widget])}>
                    <div className="widget-content">
                        <a href="https://webapproach.net/go/do" target="_blank">
                            <img
                                src="https://elune.fuli.news/content/images/2017/10/19/a127058b1f84e24760e7da360978a746.png"
                                style={{ maxWidth: "100%" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="widget">
                    <div className="widget-content">
                        <a href="https://webapproach.net/go/cl" target="_blank">
                            <img
                                src="https://elune.fuli.news/content/images/2017/10/19/b1f7279c640a51c2d4bf5983a328ad64.jpg"
                                style={{ maxWidth: "100%" }}
                            />
                        </a>
                    </div>
                </div>
            </aside>
        );
    }
}
