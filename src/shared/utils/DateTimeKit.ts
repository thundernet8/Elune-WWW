export const getTimeDiff = (targetTime: Date, sourceTime?: Date) => {
    sourceTime = sourceTime || new Date();
    const tail = targetTime < sourceTime ? "前" : "后";
    const seconds = Number(
        ((targetTime.getTime() - sourceTime.getTime()) / 1000).toFixed(0)
    );

    if (seconds < 60) {
        return "刚刚";
    }

    if (seconds < 3600) {
        return Math.floor(seconds / 60).toString() + "分钟" + tail;
    }

    if (seconds < 3600 * 24) {
        return Math.floor(seconds / (3600 * 24)).toString() + "小时" + tail;
    }

    if (seconds < 3600 * 24 * 7) {
        return Math.floor(seconds / (3600 * 24 * 7)).toString() + "天" + tail;
    }

    return `${targetTime.getFullYear()}年${(targetTime.getMonth() + 101)
        .toString()
        .substring(1)}月${(targetTime.getDate() + 100)
        .toString()
        .substring(1)}日`;
};
