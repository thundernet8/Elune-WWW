import { URL as NodeURL } from "url";
import { IS_NODE } from "../../../env";

const getUrlObj = (url: string) => {
    return IS_NODE ? new NodeURL(url) : new URL(url);
};

export const addQuery = (
    url: string,
    key: string,
    value: string,
    reserveHash: boolean = true
) => {
    const urlObj = getUrlObj(url);
    let search = urlObj.search
        ? `${urlObj.search}&${key}=${value}`
        : `?${key}=${value}`;
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}${search}${reserveHash
        ? urlObj.hash
        : ""}`;
};

export const addQueries = (url: string, keyValuePairs: object) => {
    const urlObj = getUrlObj(url);
    const prefix = urlObj.search ? "&" : "?";
    const suffix = Object.keys(keyValuePairs).reduce((previous, current) => {
        return `${previous ? previous + "&" : ""}${current}=${keyValuePairs[
            current
        ]}`;
    }, "");
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}${urlObj.search}${prefix}${suffix}${urlObj.hash}`;
};

export const getQuery = (url: string, key: string) => {
    const urlObj = getUrlObj(url);
    const search = urlObj.search;
    if (!search || search.length < 3) {
        return "";
    }
    const reg = new RegExp(`${key}=([^?&]*)`, "i");
    const match = search.match(reg);
    return match && match.length > 1 && match[1];
};
