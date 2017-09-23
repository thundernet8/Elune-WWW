import * as React from "react";
import ClassNames from "classnames";

const styles = require("./index.less");

interface SelectProps {
    className?: any;
    onSelect?: (value: string) => void;
    defaultValue?: string;
    value?: string;
    size?: "default" | "large" | "small";
    children: React.ReactElement<SelectOption>[];
}

interface SelectState {}

export default class Select extends React.Component<SelectProps, SelectState> {
    public static Option;

    onSelect = e => {
        const { onSelect } = this.props;
        onSelect && onSelect(e.target.value);
    };

    render() {
        const { children, size, defaultValue, value } = this.props;
        const cls = ClassNames([styles.selectWrapper], {
            [styles.large]: size === "large",
            [styles.small]: size === "small"
        });
        return (
            <div className={cls}>
                <select
                    className={ClassNames("form-control")}
                    onChange={this.onSelect}
                    value={value || defaultValue}
                >
                    {children}
                </select>
                <i
                    className={ClassNames("icon fa fa-fw fa-sort", [
                        styles.caret
                    ])}
                />
            </div>
        );
    }
}

interface SelectOptionProps {
    value: string;
    title?: string;
    className?: any;
}

interface SelectOptionState {}

class SelectOption extends React.Component<
    SelectOptionProps,
    SelectOptionState
> {
    render() {
        const { value, children, className } = this.props;
        return (
            <option className={className} value={value}>
                {children}
            </option>
        );
    }
}

Select.Option = SelectOption;
