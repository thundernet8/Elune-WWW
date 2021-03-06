import { API_BASE, IS_PROD } from "../../../env";
import axios from "axios";
import https from "https";
import qs from "qs";
// import GlobalStore from "store/GlobalStore";
// import { SESSION_COOKIE_NAME } from "../../../env";

// axios.defaults.withCredentials = true;

export function webApi<T>(
    httpMethod: string,
    path: string,
    params: any,
    contentType: string = "application/json"
): Promise<T> {
    path = path.startsWith("/") ? path.substring(1) : path;
    /* tslint:disable */
    const csrfToken =
        typeof window !== "undefined"
            ? window["csrfToken"]
            : global["csrfToken"];
    /* tslint:enable */

    const headers: any = {
        Accept: "*/*",
        "Content-type":
            typeof FormData !== "undefined" && params instanceof FormData
                ? "multipart/form-data"
                : contentType
    };

    if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
    }

    // if (GlobalStore.Instance.Cookies) {
    //     headers.Cookie = GlobalStore.Instance.Cookies;
    // }

    // console.log(`HEADERS for axios: ${JSON.stringify(headers)}`);

    const ax = axios.create({
        baseURL: API_BASE,
        timeout: 60000,
        withCredentials: true,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        headers
    });
    return ax
        .request({
            url: path,
            method: httpMethod,
            params: httpMethod.toLowerCase() === "get" ? params : null,
            data:
                httpMethod.toLowerCase() !== "get"
                    ? headers["Content-type"] ===
                      "application/x-www-form-urlencoded"
                      ? qs.stringify(params)
                      : params
                    : null,
            validateStatus: function(status) {
                return status >= 200 && status < 500;
            }
        })
        .then<T>(resp => {
            if (!IS_PROD) {
                console.dir(resp);
            }
            if (resp.status >= 400) {
                throw new Error(resp.data);
            }
            return resp.data;
        })
        .catch(error => {
            if (!IS_PROD) {
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
