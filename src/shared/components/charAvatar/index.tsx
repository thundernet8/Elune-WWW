import * as React from "react";
import ClassNames from "classnames";
import { getCharColor } from "utils/ColorKit";

const styles = require("./index.less");

interface CharAvatarProps {
    className?: string;
    text: string;
}

interface CharAvatarState {}

export default class CharAvatar extends React.Component<
    CharAvatarProps,
    CharAvatarState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, text } = this.props;

        return (
            <span
                className={ClassNames([className], [styles.charAvatar])}
                style={{ backgroundColor: getCharColor(text[0]) }}
            >
                {text[0].toUpperCase()}
            </span>
        );
    }
}
