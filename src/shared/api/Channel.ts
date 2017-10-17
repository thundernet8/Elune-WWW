import CommonResp from "model/Resp";
import WebApi from "api/WebApi";
import Channel from "model/Channel";

export interface CreateChannelReq {
    parentid: number;
    title: string;
    description: string;
    slug: string;
    coverImg: string;
    mainColor: string;
}

export interface UpdateChannelReq extends CreateChannelReq {
    id: number;
}

export function CreateChannel(payload: CreateChannelReq) {
    return WebApi.Post<CommonResp<number>>("channels", payload);
}

export function UpdateChannel(payload: UpdateChannelReq) {
    return WebApi.Put<CommonResp<boolean>>(`channels/${payload.id}`, payload);
}

export function GetChannel(id: number) {
    return WebApi.Get<Channel>(`channels/${id}`, {});
}

export function GetChannelBySlug(slug: string) {
    return WebApi.Get<Channel>(`channels/${slug}`, {});
}

export function GetAllChannels() {
    return WebApi.Get<Channel[]>(`channels`, {});
}

export default {
    CreateChannel,
    UpdateChannel,
    GetChannel,
    GetChannelBySlug,
    GetAllChannels
};
