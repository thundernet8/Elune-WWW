import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import UCStore from "store/UCStore";
import { Button } from "element-react/next";
import TopicItem from "components/topicItem";

const styles = require("../styles/topicsTab.less");

interface FavoritesTabProps {
    store: UCStore;
}

interface FavoritesTabState {}

@observer
export default class FavoritesTab extends React.Component<
    FavoritesTabProps,
    FavoritesTabState
> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { store } = this.props;
        const { favoritesTotal } = store;
        if (favoritesTotal === -1) {
            store.getUserFavorites();
        }
    }

    renderFavoriteList = () => {
        const { store } = this.props;
        const { favoritesTotal, favorites, favoritesLoading } = store;
        if (favoritesTotal === 0 && !favoritesLoading) {
            return (
                <div
                    className={ClassNames(
                        [styles.topicList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={styles.topicList}>
                {favorites.map((topic, index) => {
                    return (
                        <li key={index}>
                            <TopicItem
                                key={index}
                                topic={topic}
                                className={styles.simpleTopicItem}
                            />
                        </li>
                    );
                })}
                {favoritesLoading && (
                    <div className={styles.topicsLoading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    render() {
        const { store } = this.props;
        const {
            favoritesLoading,
            hasMoreFavorites,
            getNextPageFavorites,
            favoritesTotal
        } = store;

        return (
            <div className={styles.topicsTab}>
                {this.renderFavoriteList()}
                {!favoritesLoading &&
                    hasMoreFavorites &&
                    favoritesTotal !== -1 && (
                        <div className={styles.loadMore}>
                            <Button onClick={getNextPageFavorites}>载入更多</Button>
                        </div>
                    )}
            </div>
        );
    }
}
