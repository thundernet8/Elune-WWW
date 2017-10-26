import * as React from "react";
import { observer } from "mobx-react";
import ClassNames from "classnames";
import UCStore from "store/UCStore";
import { Button } from "element-react/next";
import PostItemSimple from "components/postItemSimple";

const styles = require("../styles/postsTab.less");

interface PostsTabProps {
    store: UCStore;
}

interface PostsTabState {}

@observer
export default class PostsTab extends React.Component<
    PostsTabProps,
    PostsTabState
> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { store } = this.props;
        const { postsTotal } = store;
        if (postsTotal === -1) {
            store.getUserPosts();
        }
    }

    renderPostList = () => {
        const { store } = this.props;
        const { postsTotal, posts, postsLoading } = store;
        if (postsTotal === 0 && !postsLoading) {
            return (
                <div
                    className={ClassNames(
                        [styles.postList],
                        [styles.emptyList]
                    )}
                >
                    空空如也~
                </div>
            );
        }
        return (
            <ul className={styles.postList}>
                {posts.map((post, index) => {
                    return (
                        <li key={index}>
                            <PostItemSimple key={index} post={post} />
                        </li>
                    );
                })}
                {postsLoading && (
                    <div className={styles.postsLoading}>
                        <i className="el-icon-loading" />
                    </div>
                )}
            </ul>
        );
    };

    render() {
        const { store } = this.props;
        const {
            postsLoading,
            hasMorePost,
            getNextPagePosts,
            postsTotal
        } = store;
        return (
            <div className={styles.postsTab}>
                {this.renderPostList()}
                {!postsLoading &&
                    hasMorePost &&
                    postsTotal !== -1 && (
                        <div className={styles.loadMore}>
                            <Button onClick={getNextPagePosts}>载入更多</Button>
                        </div>
                    )}
            </div>
        );
    }
}
