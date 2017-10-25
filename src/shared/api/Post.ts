import CommonResp from "model/Resp";
import WebApi from "api/WebApi";
import Post from "model/Post";
import Pagination from "model/Pagination";
import { SortOrder, SortOrderBy } from "enum/Sort";

export interface CreatePostReq {
    topicId: number;
    parentId: number;
    content: string;
    contentHtml: string;
    contentRaw: string;
    topicOwner: string;
    topicOwnerId: number;
    mentions: string[];
}

export interface UpdatePostReq extends CreatePostReq {
    id: number;
}

export interface FetchTopicPostsReq {
    topicId: number;
    page: number;
    pageSize: number;
    order: SortOrder;
    orderBy: SortOrderBy;
}

export interface FetchUserPostsReq {
    authorId: number;
    page: number;
    pageSize: number;
    order: SortOrder;
    orderBy: SortOrderBy;
}

export function CreatePost(payload: CreatePostReq) {
    return WebApi.Post<CommonResp<number>>("posts", payload);
}

export function UpdatePost(payload: UpdatePostReq) {
    return WebApi.Put<CommonResp<boolean>>(`posts/${payload.id}`, payload);
}

export function FetchTopicPosts(payload: FetchTopicPostsReq) {
    return WebApi.Get<Pagination<Post>>(`posts`, payload);
}

export function FetchUserPosts(payload: FetchUserPostsReq) {
    return WebApi.Get<Pagination<Post>>(`posts`, payload);
}

export default {
    CreatePost,
    UpdatePost,
    FetchTopicPosts,
    FetchUserPosts
};
