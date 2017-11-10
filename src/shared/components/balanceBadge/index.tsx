import * as React from "react";
import ClassNames from "classnames";
import { Tooltip } from "element-react/next";

const styles = require("./index.less");
const goldImg = require("IMG/gold.png");
const silverImg = require("IMG/silver.png");
const bronzeImg = require("IMG/bronze.png");

interface BalanceBadgeProps {
    className?: string;
    balance: number;
    onWidget?: boolean;
}

interface BalanceBadgeState {}

export default class BalanceBadge extends React.Component<
    BalanceBadgeProps,
    BalanceBadgeState
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { balance, className, onWidget } = this.props;
        const gold = Number((balance / 10000).toFixed(0));
        const silver = Math.floor((balance - gold * 10000) / 100);
        const bronze = balance % 100;

        return (
            <div className={ClassNames([styles.balanceDetail], [className])}>
                {
                    <span className={styles.gold}>
                        <Tooltip
                            effect="dark"
                            placement="top"
                            content={`${gold} 金币`}
                        >
                            <span className={styles.num}>{gold}</span>
                            <img src={goldImg} />
                        </Tooltip>
                    </span>}
                {
                    <span className={styles.silver}>
                        <Tooltip
                            effect="dark"
                            placement="top"
                            content={`${silver} 银币`}
                        >
                            <span className={styles.num}>{silver}</span>
                            <img src={silverImg} />
                        </Tooltip>
                    </span>}
                <span className={styles.bronze}>
                    <Tooltip
                        effect="dark"
                        placement={onWidget ? "left-start" : "top"}
                        content={`${bronze} 铜币`}
                    >
                        <span className={styles.num}>{bronze}</span>
                        <img src={bronzeImg} />
                    </Tooltip>
                </span>
            </div>
        );
    }
}
