import * as React from "react";
import ClassNames from "classnames";

const styles = require("./index.less");

interface WelcomeHeroProps {}

interface WelcomeHeroState {
    open: boolean;
}

export default class WelcomeHero extends React.Component<
    WelcomeHeroProps,
    WelcomeHeroState
> {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
    }

    closeHero = () => {
        this.setState({
            open: false
        });
    };

    render() {
        if (!this.state.open) {
            return null;
        }
        return (
            <header className={styles.hero}>
                <div className={ClassNames("container", [styles.container])}>
                    <button
                        className={ClassNames("btn btn--icon btn--link", [
                            styles.close
                        ])}
                        type="button"
                        onClick={this.closeHero}
                    >
                        <i className="el-icon-close" />
                    </button>
                    <div className={styles.inner}>
                        <h2 className="Hero-title">欢迎访问 Elune Forum(Dev)</h2>
                        <p className="Hero-subtitle">
                            本站不是 Elune 的 Demo 演示，所以<strong>不要</strong>发布无意义的内容，在你提问前，请<strong>务必</strong>要阅读<a
                                href="http://doc.zengrong.net/smart-questions/cn.html"
                                target="_blank"
                            >
                                《提问的智慧》
                            </a>。QQ 群: <strong>xxxxxx</strong>
                        </p>
                    </div>
                </div>
            </header>
        );
    }
}
