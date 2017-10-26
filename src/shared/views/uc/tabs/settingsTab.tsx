import * as React from "react";
import { observer } from "mobx-react";
import { Input, Button, Message } from "element-react/next";
import UCStore from "store/UCStore";

const styles = require("../styles/settingsTab.less");

interface SettingsTabProps {
    store: UCStore;
}

interface SettingsTabState {}

@observer
export default class SettingsTab extends React.Component<
    SettingsTabProps,
    SettingsTabState
> {
    constructor(props) {
        super(props);
    }

    saveProfile = () => {
        const { store } = this.props;
        store
            .saveProfile()
            .then(() => {
                Message({
                    message: "更新资料成功",
                    type: "success"
                });
            })
            .catch(err => {
                Message({
                    message: err,
                    type: "error"
                });
            });
    };

    render() {
        const { store } = this.props;
        const { userProfileSettings, profileSaving } = store;
        if (!userProfileSettings) {
            return null;
        }

        const { nickname, url, bio } = userProfileSettings;
        return (
            <div className={styles.settingsTab}>
                <ul>
                    <li className={styles.itemProfile}>
                        <fieldset className={styles.profileSettings}>
                            <legend>基本资料</legend>
                            <ul>
                                <li>
                                    <label>昵称</label>
                                    <div className={styles.formGroup}>
                                        <Input
                                            placeholder="请输入昵称"
                                            value={nickname}
                                            onChange={store.inputProfileSettings.bind(
                                                store,
                                                "nickname"
                                            )}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <label>主页</label>
                                    <div className={styles.formGroup}>
                                        <Input
                                            placeholder="请输入个人主页地址"
                                            value={url}
                                            onChange={store.inputProfileSettings.bind(
                                                store,
                                                "url"
                                            )}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <label>简介</label>
                                    <div className={styles.formGroup}>
                                        <Input
                                            type="textarea"
                                            autosize={{
                                                minRows: 2,
                                                maxRows: 4
                                            }}
                                            placeholder="写点什么介绍下自己"
                                            value={bio}
                                            onChange={store.inputProfileSettings.bind(
                                                store,
                                                "bio"
                                            )}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.formAction}>
                                        <Button
                                            type="info"
                                            loading={profileSaving}
                                            onClick={this.saveProfile}
                                        >
                                            保存
                                        </Button>
                                    </div>
                                </li>
                            </ul>
                        </fieldset>
                    </li>
                </ul>
            </div>
        );
    }
}
