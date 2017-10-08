import * as React from "react";
import RenderInBody from "../renderInBody";
import ClassNames from "classnames";

const styles = require("./index.less");

interface ModalProps {
    visible: boolean;
    showClose?: boolean;
    onClose: () => void;
    className?: any;
}

interface ModalState {}

export default class Modal extends React.Component<ModalProps, ModalState> {
    static defaultProps = {
        visible: false,
        showClose: false,
        className: ""
    };

    constructor(props) {
        super(props);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.visible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    render() {
        const { visible, showClose, onClose, children, className } = this.props;
        if (!visible) {
            return null;
        }
        return (
            <RenderInBody
                className={ClassNames([styles.modalMask])}
                onClick={onClose}
            >
                <div className={ClassNames([styles.modalManager], [className])}>
                    <div className={styles.modalContent}>
                        {showClose && (
                            <div className={styles.modalClose}>
                                <button type="button">
                                    <i className="el-icon-close" />
                                </button>
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </RenderInBody>
        );
    }
}
