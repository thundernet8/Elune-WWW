import * as React from "react";
import { Modal } from "semantic-ui-react";

interface LoginModalProps {
    open: boolean;
}

interface LoginModalState {}

export default class LoginModal extends React.Component<
    LoginModalProps,
    LoginModalState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { open } = this.props;
        return (
            <Modal dimmer open={open}>
                <Modal.Header>注册</Modal.Header>
                <Modal.Content>
                    <p>That's everything!</p>
                </Modal.Content>
            </Modal>
        );
    }
}
