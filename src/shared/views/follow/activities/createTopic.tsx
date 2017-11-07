import * as React from "react";
import Userlog from "model/Userlog";
import { Link } from "react-router-dom";
import { getCharColor } from "utils/ColorKit";
import { Tooltip } from "element-react/next";
import moment from "moment";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";

const styles = require("../styles/index.less");

interface CreateTopicActivityProps {
    activity: Userlog;
}

interface CreateTopicActivityState {}

export default class CreateTopicActivity extends React.Component<
    CreateTopicActivityProps,
    CreateTopicActivityState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { activity } = this.props;
        if (!activity) {
            return null;
        }

        return (
            <div className={styles.activityRow}>
                <div className={styles.icon}>
                    <span style={{ background: getCharColor("t") }}>
                        <i className="fa fa-fw fa-comments-o" />
                    </span>
                </div>
                <div className={styles.content}>
                    <header>
                        <span className={styles.username}>
                            <Link to={`/u/${activity.username}`}>
                                {activity.username}
                            </Link>
                        </span>
                        <span className={styles.divider}>·</span>
                        <span className={styles.time}>
                            <Tooltip
                                effect="dark"
                                placement="top"
                                content={getGMT8DateStr(
                                    moment(activity.createTime * 1000)
                                )}
                            >
                                {getTimeDiff(
                                    moment(activity.createTime * 1000)
                                )}
                            </Tooltip>
                        </span>
                    </header>
                    <p>
                        <a href={activity.link} target="_blank">
                            {activity.afterStatus}
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}
