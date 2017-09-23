"use strict";
exports.__esModule = true;
exports.isEmail = function (email) {
    email = email ? email.toString() : "";
    // TODO
    return true;
};
exports.lowerCaseFirst = function (str) {
    if (!str) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
};
