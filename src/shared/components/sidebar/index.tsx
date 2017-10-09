import * as React from "react";
import ClassNames from "classnames";

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
        return (
            <aside className={styles.sidebar}>
                <div className={ClassNames("widget", [styles.widget])}>
                    <div className="widget-content">
                        <a href="https://webapproach.net/go/do" target="_blank">
                            <img
                                src="https://webapproach.net/wp-content/uploads/2017/08/DigitalOcean-free-35d.png"
                                style={{ maxWidth: "100%" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="widget">
                    <div className="widget-content">
                        <a
                            href="https://my.cloudleft.com/aff.php?aff=137"
                            target="_blank"
                        >
                            <img
                                src="https://webapproach.net/wp-content/uploads/2017/01/cloudleft300x250.jpg"
                                style={{ maxWidth: "100%" }}
                            />
                        </a>
                    </div>
                </div>
            </aside>
        );
    }
}
