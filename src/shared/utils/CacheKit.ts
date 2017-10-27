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
