import { webApi } from "./WebApi";

export function formApiGet<T>(path: string, params: any): Promise<T> {
    return webApi("get", path, params, "text/plain");
}

export function formApiPost<T>(path: string, params: any): Promise<T> {
    return webApi("post", path, params, "application/x-www-form-urlencoded");
}

export function formApiDel<T>(path: string, params: any): Promise<T> {
    return webApi("delete", path, params, "application/x-www-form-urlencoded");
}

export function formApiPut<T>(path: string, params: any): Promise<T> {
    return webApi("put", path, params, "application/x-www-form-urlencoded");
}

export default {
    Get: formApiGet,
    Post: formApiPost,
    Put: formApiPut,
    Delete: formApiDel
};
