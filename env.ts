export const isProd = process.env.NODE_ENV === "production";

export const apiBase = isProd
    ? "https://elune.fuli.news/api/"
    : "http://127.0.0.1:9000/api/";
