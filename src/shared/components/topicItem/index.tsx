import * as React from "react";
import Dropdown from "common/dropdown";
import ClassNames from "classnames";
import { Link } from "react-router-dom";

const styles = require("./index.less");
const defaultAvatar = require("IMG/avatar-default.png");

interface TopicItemProps {}

interface TopicItemState {
    read: boolean;
}

export default class TopicItem extends React.Component<
    TopicItemProps,
    TopicItemState
> {
    constructor(props) {
        super(props);
        this.state = {
            read: false
        };
    }

    render() {
        const { read } = this.state;
        return (
            <div className={styles.topicItem}>
                <Dropdown
                    className={ClassNames("btn-flat", [styles.actionDropdown])}
                    anchorNode={
                        <span className="btn-label">
                            <i className="fa fa-fw fa-ellipsis-v" />
                        </span>
                    }
                >
                    <Dropdown.Item hasIcon>
                        <button>
                            <i className="fa fa-fw fa-star" />
                            <span className="btn-label">关注</span>
                        </button>
                    </Dropdown.Item>
                </Dropdown>
                <div
                    className={ClassNames([styles.content], {
                        [styles.read]: read
                    })}
                >
                    <Link
                        to="/u/justjavac"
                        className={styles.author}
                        title=""
                        data-original-title="justjavac 发布于 12月 '15"
                    >
                        <img
                            className={styles.avatar}
                            src={defaultAvatar}
                        />
                    </Link>
                    <ul className={styles.badges}>
                        <li className="item-sticky">
                            <span
                                className={ClassNames(
                                    [styles.badge],
                                    [styles.sticky]
                                )}
                                title=""
                                data-original-title="置顶"
                            >
                                <i className="icon fa fa-fw fa-thumb-tack badge-icon" />
                            </span>
                        </li>
                    </ul>
                    <Link to="/topic/325" className={styles.main}>
                        <h3 className={styles.title}>Flarum 新人必看，注意事项以及 FAQ</h3>
                        <ul className={styles.info}>
                            <li className={styles.channels}>
                                <span className={styles.channelLabels}>
                                    <span
                                        className={ClassNames([
                                            styles.channelLabel,
                                            styles.colored
                                        ])}
                                        style={{
                                            color: "rgb(254, 181, 77)",
                                            backgroundColor: "rgb(254, 181, 77)"
                                        }}
                                    >
                                        <span
                                            className={styles.channelLabelText}
                                        >
                                            求助
                                        </span>
                                    </span>
                                    <span className={styles.channelLabel}>
                                        <span
                                            className={styles.channelLabelText}
                                        >
                                            Flarum
                                        </span>
                                    </span>
                                </span>
                            </li>
                            <li className={styles.reply}>
                                <span>
                                    <i className="icon fa fa-fw fa-reply " />
                                    <span className={styles.username}>
                                        TestTest
                                    </span>{" "}
                                    回复于{" "}
                                    <time
                                        data-pubdate="true"
                                        data-datetime="2017-09-15T15:53:30+08:00"
                                        title="2017年9月15日 周五 15:53:30"
                                        data-humantime="true"
                                    >
                                        2 天前
                                    </time>
                                </span>
                            </li>
                            <li className={styles.excerpt}>
                                <span>
                                    Flarum 新人必看，注意事项以及 FAQ 此帖不定期更新 本社区不是 Flarum
                                    的 Demo
                                    演示，所以不要发布无意义的内容，在你提问前，请务必要阅读《提问的智慧》。不仅仅是在
                                    Flarum 社区，以后在任何社区提问，都要遵守提问的智慧。 FAQ
                                    怎么实现的中文搜索？ 如何发图片 安装完成，无法发送邮件
                                    帖子如何排版？如何发布图片？—— markdown 语法
                                    能不能帮我开发一个xxx插件...
                                </span>
                            </li>
                        </ul>
                    </Link>
                    <span className={styles.count} title="标记为已读">
                        <i className="fa fa-fw fa-comment" />54
                    </span>
                </div>
            </div>
        );
    }
}
