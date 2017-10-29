import * as React from "react";
import ClassNames from "classnames";
import { BaseUserInfo } from "model/User";
import CharAvatar from "components/charAvatar";

const styles = require("./index.less");

interface AvatarProps {
    className?: string;
    username?: string;
    user?: BaseUserInfo;
}

interface AvatarState {}

export default class Avatar extends React.Component<AvatarProps, AvatarState> {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, username, user } = this.props;
        if (user && user.avatar) {
            return (
                <span className={ClassNames([styles.avatar], [className])}>
                    <img src={user.avatar} />
                </span>
            );
        }

        const char = username ? username[0] : user ? user.username[0] : "#";
        return <CharAvatar text={char} />;
    }
}
