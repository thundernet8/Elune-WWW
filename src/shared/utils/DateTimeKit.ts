export const getTimeDiff = (targetTime: Date, sourceTime?: Date) => {
    sourceTime = sourceTime || new Date();
    const tail = targetTime < sourceTime ? "前" : "后";
    const seconds = Math.abs(
        Number(
            ((targetTime.getTime() - sourceTime.getTime() + 8 * 3600000) /
                1000
            ).toFixed(0)
        )
    );

    if (seconds < 60) {
        return "刚刚";
    }

    if (seconds < 3600) {
        return Math.floor(seconds / 60).toString() + "分钟" + tail;
    }

    if (seconds < 3600 * 24) {
        return Math.floor(seconds / 3600).toString() + "小时" + tail;
    }

    if (seconds < 3600 * 24 * 7) {
        return Math.floor(seconds / (3600 * 24)).toString() + "天" + tail;
    }

    return `${targetTime.getFullYear()}年${(targetTime.getMonth() + 101)
        .toString()
        .substring(1)}月${(targetTime.getDate() + 100)
        .toString()
        .substring(1)}日`;
};

export const getLocalDate = (gmtDate: Date) => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(gmtDate.getTime() - offset);
};

export const getGMT8DateStr = (date: Date) => {
    const newDate = new Date(date.getTime() + 8 * 3600000);
    return `${newDate.getUTCFullYear()}/${(newDate.getUTCMonth() + 101)
        .toString()
        .substr(1)}/${(newDate.getUTCDate() + 100)
        .toString()
        .substr(1)} ${(newDate.getUTCHours() + 108)
        .toString()
        .substr(1)}:${(newDate.getUTCMinutes() + 100)
        .toString()
        .substr(1)}:${(newDate.getUTCSeconds() + 100).toString().substr(1)}`;
};
