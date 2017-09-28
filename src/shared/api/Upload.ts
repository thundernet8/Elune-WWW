import CommonResp from "model/Resp";
import WebApi from "api/WebApi";

export function UploadImage(fileData: FormData) {
    return WebApi.Put<CommonResp<string>>("images", fileData);
}

export function UploadAvatar(fileData: FormData) {
    return WebApi.Put<CommonResp<string>>("avatars", fileData);
}

export default {
    UploadImage,
    UploadAvatar
};
