import moment from "moment";

export const getTimeDiff = (
    targetTime: moment.Moment,
    sourceTime?: moment.Moment
) => {
    sourceTime = sourceTime || moment();
    const tail = targetTime < sourceTime ? "前" : "后";
    const seconds = Math.abs(
        Number(
            ((targetTime.valueOf() - sourceTime.valueOf() + 8 * 3600000) /
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

    return targetTime.format("YYYY年MM月DD日");
};

export const getLocalDate = (gmtDate: moment.Moment) => {
    const now = moment();
    const offset = now.utcOffset() * 60000;
    return moment(gmtDate.valueOf() - offset);
};

export const getGMT8DateStr = (date: moment.Moment) => {
    return date.add(8, "hours").format("YYYY-MM-DD HH:mm:ss Z");
};
