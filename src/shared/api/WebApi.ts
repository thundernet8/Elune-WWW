import { apiBase, isProd } from "../../../env";
import axios from "axios";

// axios.defaults.withCredentials = true;

function webApi<T>(httpMethod: string, path: string, params: any): Promise<T> {
    path = path.startsWith("/") ? path.substring(1) : path;
    /* tslint:disable */
    const csrfToken =
        typeof window !== "undefined"
            ? window["csrfToken"]
            : global["csrfToken"];
    /* tslint:enable */

    const ax = axios.create({
        baseURL: apiBase,
        timeout: 10000,
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "X-CSRF-Token": csrfToken
        }
    });
    return ax
        .request({
            url: path,
            method: httpMethod,
            params: httpMethod.toLowerCase() === "get" ? params : null,
            data: httpMethod.toLowerCase() !== "get" ? params : null,
            validateStatus: function(status) {
                return status >= 200 && status < 300; // default
            }
        })
        .then<T>(resp => {
            if (!isProd) {
                console.dir(resp);
            }
            return resp.data;
        })
        .catch(error => {
            if (!isProd) {
                console.dir(error);
            }
            throw error;
        });
}

export function webApiGet<T>(path: string, params: any): Promise<T> {
    return webApi("get", path, params);
}

export function webApiPost<T>(path: string, params: any): Promise<T> {
    return webApi("post", path, params);
}

export function webApiDel<T>(path: string, params: any): Promise<T> {
    return webApi("delete", path, params);
}

export function webApiPut<T>(path: string, params: any): Promise<T> {
    return webApi("put", path, params);
}

export default {
    Get: webApiGet,
    Post: webApiPost,
    Put: webApiPut,
    Delete: webApiDel
};
