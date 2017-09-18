import * as React from "react";

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
                <div className="widget-content">
                    <a href="https://webapproach.net/go/do" target="_blank">
                        <img
                            src="https://webapproach.net/wp-content/uploads/2017/08/DigitalOcean-free-35d.png"
                            style={{ maxWidth: "100%" }}
                        />
                    </a>
                </div>
            </aside>
        );
    }
}
