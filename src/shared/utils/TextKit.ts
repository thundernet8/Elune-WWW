export const isEmail = (email: string) => {
    email = email ? email.toString() : "";
    // TODO
    return true;
};

export const lowerCaseFirst = (str: string) => {
    if (!str) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
};
