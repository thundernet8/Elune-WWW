import CommonResp from "model/Resp";
import WebApi from "api/WebApi";

export function UploadImage(fileData: FormData) {
    return WebApi.Put<CommonResp<string>>("upload/images", fileData);
}

export function UploadAvatar(fileData: FormData) {
    return WebApi.Put<CommonResp<string>>("upload/avatars", fileData);
}

export default {
    UploadImage,
    UploadAvatar
};
