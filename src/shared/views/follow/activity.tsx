import * as React from "react";
import UserlogType from "enum/UserlogType";
import Userlog from "model/Userlog";
import CreateTopicActivity from "./activities/createTopic";
import CreatePostActivity from "./activities/createPost";
import FavoriteTopicActivity from "./activities/favoriteTopic";
import LikeTopicActivity from "./activities/likeTopic";
import UploadAvatarActivity from "./activities/uploadAvatar";
import FollowTopicActivity from "./activities/followTopic";
import FollowUserActivity from "./activities/followUser";

interface ActivityProps {
    activity: Userlog;
}

interface ActivityState {}

export default class Activity extends React.Component<
    ActivityProps,
    ActivityState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { activity } = this.props;
        switch (activity.type) {
            case UserlogType.CREATE_TOPIC:
                return <CreateTopicActivity activity={activity} />;
            case UserlogType.CREATE_POST:
                return <CreatePostActivity activity={activity} />;
            case UserlogType.FAVORITE_TOPIC:
                return <FavoriteTopicActivity activity={activity} />;
            case UserlogType.LIKE_TOPIC:
                return <LikeTopicActivity activity={activity} />;
            case UserlogType.UPLOAD_AVATAR:
                return <UploadAvatarActivity activity={activity} />;
            case UserlogType.FOLLOW_TOPIC:
                return <FollowTopicActivity activity={activity} />;
            case UserlogType.FOLLOW_USER:
                return <FollowUserActivity activity={activity} />;
            default:
                return null;
        }
    }
}
