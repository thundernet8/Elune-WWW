import CommonResp from "model/Resp";
import WebApi from "api/WebApi";
import FormApi from "api/FormApi";
import { SortOrder, SortOrderBy } from "enum/Sort";
import Pagination from "model/Pagination";
import Topic from "model/Topic";

export interface CreateTopicReq {
    title: string;
    channelId: number;
    content: string;
    contentHtml: string;
    contentRaw: string;
}

export interface FetchTopicsReq {
    page: number;
    pageSize: number;
    order: SortOrder;
    orderBy: SortOrderBy;
}

export interface FetchChannelTopicsReq extends FetchTopicsReq {
    channelId: number;
}

export interface FetchUserTopicsReq extends FetchTopicsReq {
    authorId: number;
}

export interface FetchTopicReq {
    id: number;
}

export interface UpdateTopicReq {
    id: number;
    content: string;
    contentHtml: string;
    contentRaw: string;
}

export interface FavoriteTopicReq {
    id: number;
}

export interface UnFavoriteTopicReq {
    id: number;
}

export interface LikeTopicReq {
    id: number;
}

export interface UnLikeTopicReq {
    id: number;
}

export interface StickyTopicReq {
    id: number;
}

export interface UnStickyTopicReq {
    id: number;
}

export function CreateTopic(payload: CreateTopicReq) {
    return WebApi.Post<CommonResp<string>>("topics", payload);
}

export function UpdateTopic(payload: UpdateTopicReq) {
    return WebApi.Post<CommonResp<string>>(`topics/${payload.id}`, payload);
}

export function FetchTopic(payload: FetchTopicReq) {
    return FormApi.Get<Topic>(`topics/${payload.id}`, {});
}

export function FetchTopics(payload: FetchTopicsReq) {
    return FormApi.Get<Pagination<Topic>>("topics", payload);
}

export function FetchChannelTopics(payload: FetchChannelTopicsReq) {
    return FormApi.Get<Pagination<Topic>>("topics", payload);
}

export function FetchUserTopics(payload: FetchUserTopicsReq) {
    return FormApi.Get<Pagination<Topic>>("topics", payload);
}

export function FavoriteTopic(payload: FavoriteTopicReq) {
    return FormApi.Post<Boolean>(`topics/${payload.id}/favorites`, {});
}

export function UnFavoriteTopic(payload: UnFavoriteTopicReq) {
    return FormApi.Delete<Boolean>(`topics/${payload.id}/favorites`, {});
}

export function LikeTopic(payload: LikeTopicReq) {
    return FormApi.Post<Boolean>(`topics/${payload.id}/likes`, {});
}

export function UnLikeTopic(payload: UnLikeTopicReq) {
    return FormApi.Delete<Boolean>(`topics/${payload.id}/likes`, {});
}

export function StickyTopic(payload: StickyTopicReq) {
    return FormApi.Post<Boolean>(`topics/${payload.id}/sticky`, {});
}

export function UnStickyTopic(payload: UnStickyTopicReq) {
    return FormApi.Delete<Boolean>(`topics/${payload.id}/sticky`, {});
}

export default {
    CreateTopic,
    UpdateTopic,
    FetchTopic,
    FetchTopics,
    FetchChannelTopics,
    FetchUserTopics,
    FavoriteTopic,
    UnFavoriteTopic,
    LikeTopic,
    UnLikeTopic,
    StickyTopic,
    UnStickyTopic
};
