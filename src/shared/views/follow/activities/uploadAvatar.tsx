import * as React from "react";
import Userlog from "model/Userlog";
import { Link } from "react-router-dom";
import { Tooltip } from "element-react/next";
import moment from "moment";
import { getTimeDiff, getGMT8DateStr } from "utils/DateTimeKit";

const styles = require("../styles/index.less");

interface UploadAvatarActivityProps {
    activity: Userlog;
}

interface UploadAvatarActivityState {}

export default class UploadAvatarActivity extends React.Component<
    UploadAvatarActivityProps,
    UploadAvatarActivityState
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
                    <img src={activity.link} />
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
                    <p>{activity.username} 更新了头像</p>
                </div>
            </div>
        );
    }
}
