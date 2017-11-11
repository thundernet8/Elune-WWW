export const hasFavoriteTopic = (uid: number, topicId: number) => {
    if (!uid || !topicId) {
        return false;
    }
    const cache = localStorage.getItem(`_user_topic_data_${uid}`);
    if (!cache) {
        return false;
    }
    const data = JSON.parse(cache);
    const topicData = data[topicId.toString()];
    return topicData && !!topicData.favorite;
};

export const favoriteTopic = (
    uid: number,
    topicId: number,
    favorite: boolean = true
) => {
    if (!uid || !topicId) {
        return;
    }
    const cache = JSON.parse(
        localStorage.getItem(`_user_topic_data_${uid}`) || "{}"
    );
    const topicData = cache[topicId.toString()] || {};
    topicData.favorite = favorite ? 1 : 0;
    cache[topicId.toString()] = topicData;
    localStorage.setItem(`_user_topic_data_${uid}`, JSON.stringify(cache));
};

export const unFavoriteTopic = (uid: number, topicId: number) => {
    return favoriteTopic(uid, topicId, false);
};

export const hasLikeTopic = (uid: number, topicId: number) => {
    if (!uid || !topicId) {
        return false;
    }
    const cache = localStorage.getItem(`_user_topic_data_${uid}`);
    if (!cache) {
        return false;
    }
    const data = JSON.parse(cache);
    const topicData = data[topicId.toString()];
    return topicData && !!topicData.like;
};

export const likeTopic = (
    uid: number,
    topicId: number,
    like: boolean = true
) => {
    if (!uid || !topicId) {
        return;
    }
    const cache = JSON.parse(
        localStorage.getItem(`_user_topic_data_${uid}`) || "{}"
    );
    const topicData = cache[topicId.toString()] || {};
    topicData.like = like ? 1 : 0;
    cache[topicId.toString()] = topicData;
    localStorage.setItem(`_user_topic_data_${uid}`, JSON.stringify(cache));
};

export const unLikeTopic = (uid: number, topicId: number) => {
    return likeTopic(uid, topicId, false);
};

export const getLikedPosts = (uid: number) => {
    if (!uid) {
        return [];
    }
    const cache = localStorage.getItem(`_user_post_data_${uid}`);
    if (!cache) {
        return [];
    }
    const data = JSON.parse(cache);
    return data["likes"] || [];
};

export const likePost = (uid: number, postId: number) => {
    if (!uid || !postId) {
        return;
    }
    const cache = JSON.parse(
        localStorage.getItem(`_user_post_data_${uid}`) || "{}"
    );
    const postData = cache["likes"] || [];
    postData.push(postId);
    cache["likes"] = Array.from(new Set(postData));
    localStorage.setItem(`_user_post_data_${uid}`, JSON.stringify(cache));
};

export const bannerClosed = (bannerId: string) => {
    const cache = JSON.parse(localStorage.getItem(`_user_banner_data`) || "{}");
    const bannerData = cache[bannerId];

    return (
        bannerData &&
        new Date().getTime() - Number(bannerData.time) < 24 * 3600 * 1000 &&
        !Number(bannerData.status)
    );
};

export const closeBanner = (bannerId: string) => {
    const cache = JSON.parse(localStorage.getItem(`_user_banner_data`) || "{}");
    cache[bannerId] = {
        time: new Date().getTime().toFixed(0),
        status: "0"
    };
    localStorage.setItem(`_user_banner_data`, JSON.stringify(cache));
};
