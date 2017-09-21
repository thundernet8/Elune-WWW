import * as React from "react";

interface NotFoundProps {}

interface NotFoundState {}

export default class NotFound extends React.Component<
    NotFoundProps,
    NotFoundState
> {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>NotFound</div>;
    }
}
