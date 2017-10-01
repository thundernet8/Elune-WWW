export const enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}

export const enum SortOrderBy {
    ID = "id",
    CREATE_TIME = "create_time",
    UPDATE_TIME = "update_time",
    LAST_POST_TIME = "post_time", // 最后回复评论时间
    POSTS_COUNT = "posts_count", // 评论数量
    VIEWS_COUNT = "views_count" // 浏览数
}
