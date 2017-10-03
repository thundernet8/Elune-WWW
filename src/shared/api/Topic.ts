import CommonResp from "model/Resp";
import WebApi from "api/WebApi";
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

export interface UpdateTopicReq extends CreateTopicReq {
    id: number;
}

export function CreateTopic(payload: CreateTopicReq) {
    return WebApi.Post<CommonResp<string>>("topics", payload);
}

export function UpdateTopic(payload: UpdateTopicReq) {
    return WebApi.Put<CommonResp<string>>(`topics/${payload.id}`, payload);
}

export function FetchTopics(payload: FetchTopicsReq) {
    return WebApi.Get<Pagination<Topic>>("topics", payload);
}

export function FetchChannelTopics(payload: FetchChannelTopicsReq) {
    return WebApi.Get<Pagination<Topic>>("topics", payload);
}

export default {
    CreateTopic,
    UpdateTopic,
    FetchTopics
};
