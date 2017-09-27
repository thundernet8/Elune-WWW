import CommonResp from "model/Resp";
import WebApi from "api/WebApi";

export interface CreateTopicReq {
    title: string;
    channelId: number;
    content: string;
    contentHtml: string;
    contentRaw: string;
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

export default {
    CreateTopic,
    UpdateTopic
};
