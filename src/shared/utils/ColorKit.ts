const Colors = {
    a: "#e5a2a0",
    b: "#a0b6e5",
    c: "#b9e5a0",
    d: "#e5cda0",
    e: "#e5dda0",
    f: "#a0e5da",
    g: "#dde5a0",
    h: "#a0e5cd",
    i: "#67ccea",
    j: "#e5d6a0",
    k: "#b1a0e5",
    l: "#e5b3a0",
    m: "#9face5",
    n: "#e5a0e3",
    o: "#ffb54d",
    p: "#a0e2e5",
    q: "#97a0c7",
    r: "#a0e5dc",
    s: "#b4a0e5",
    t: "#c3a0e5",
    u: "#999867",
    v: "#a0e5b9",
    w: "#e5cba0",
    x: "#dce5a0",
    y: "#e2c783",
    z: "#b3e5a0"
};

export const getUserColor = (username: string) => {
    const charCode = username.charCodeAt(0);
    const colorKeys = Object.keys(Colors);
    const colorsCount = colorKeys.length;
    const index = charCode % colorsCount;
    return Colors[colorKeys[index]];
};

export const getCharColor = (char: string) => {
    const color = Colors[char.toLowerCase()];
    if (color) {
        return color;
    }

    const colorKeys = Object.keys(Colors);
    const colorsCount = colorKeys.length;
    const index = char.charCodeAt(0) % colorsCount;
    return Colors[colorKeys[index]];
};
