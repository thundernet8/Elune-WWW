import BrandColors from "model/BrandColors";

export const getUserColor = (username: string) => {
    const charCode = username[0].charCodeAt(0);
    const colorKeys = Object.keys(BrandColors);
    const colorsCount = colorKeys.length;
    const index = charCode % colorsCount;
    return BrandColors[colorKeys[index]];
};
