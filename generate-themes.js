import fs from "node:fs";
import chroma from 'chroma-js';

const rawData = fs.readFileSync("static/sanzo-api.json", "utf-8");
const colorsData = JSON.parse(rawData);

let colors = Object.fromEntries(
    colorsData.map((color, index) => [
        index + 1,                                  // The Key
        { name: color.name, hex: color.hex }        // The Value
    ])
);

let combinations = {};
colorsData.forEach((color, colorIndex) => {
    color.combinations.forEach((combinationId) => {
        if (!combinations[combinationId]) {
            combinations[combinationId] = [];
        }
        combinations[combinationId].push(colorIndex + 1);
    });
});
Object.values(combinations).forEach((colorArray) => {
    colorArray.sort((a, b) => a - b);
});

const combinations_3c = Object.fromEntries(
    Object.entries(combinations)
    .filter(([comboId, colorArray]) => colorArray.length === 3)
);

let cssOutput = `/* AUTO-GENERATED SANZO WADA PALETTES - DO NOT EDIT MANUALLY */\n\n`;

Object.entries(combinations_3c).forEach(([comboId, colorArray]) => {
    cssOutput += `[color-theme="sanzo${comboId}"] {
    --theme-primary: ${colors[colorArray[0]].hex};
    --theme-secondary: ${colors[colorArray[1]].hex};
    --theme-accent: ${colors[colorArray[2]].hex};
}\n\n`;

})

fs.writeFileSync('./src/lib/assets/sanzo-3-palettes.css', cssOutput);
fs.writeFileSync('./src/lib/assets/sanzo-3-palettes.json', JSON.stringify(Object.keys(combinations_3c).map(id => `sanzo${id}`), null, 2));

// Generate themes from primary colors

let ElouensPrimaryColors = [
    { name: "blue", primary: "#1c4286" },
    { name: "green", primary: "#008842" },
    { name: "red", primary: "#dd4027" }
]

let ElouensColors = []
const toSecondaryDeg = 30;

ElouensPrimaryColors.forEach((color) => {
    const primaryColor = chroma(color.primary);
    const secondaryColorPos = primaryColor.set('hsl.h', `+${toSecondaryDeg}`).set('hsl.l', '+0.1').set('hsl.s', '-0.05');
    const accentColorPos = chroma.mix(primaryColor, secondaryColorPos, 0.5, "hsl").set('hsl.h', `+180`).set('hsl.l', '-0.1');

    ElouensColors.push({
        name: color.name + "1",
        primary: primaryColor,
        secondary: secondaryColorPos,
        accent: accentColorPos
    });

    const secondaryColorNeg = primaryColor.set('hsl.h', `-${toSecondaryDeg}`).set('hsl.l', '+0.1').set('hsl.s', '-0.05');
    const accentColorNeg = chroma.mix(primaryColor, secondaryColorNeg, 0.5, "hsl").set('hsl.h', `+180`).set('hsl.l', '-0.1');

    ElouensColors.push({
        name: color.name + "2",
        primary: primaryColor,
        secondary: secondaryColorNeg,
        accent: accentColorNeg
    });
})

let cssOutputFavorites = `/* AUTO-GENERATED THEMES DO NOT EDIT MANUALLY */\n\n`;

ElouensColors.forEach((color) => {
    cssOutputFavorites += `[color-theme="elouensthemes-${color.name}"] {
    --theme-primary: hsl(${color.primary.get('hsl.h')}, ${color.primary.get('hsl.s') * 100}%, ${color.primary.get('hsl.l') * 100}%);
    --theme-secondary: hsl(${color.secondary.get('hsl.h')}, ${color.secondary.get('hsl.s') * 100}%, ${color.secondary.get('hsl.l') * 100}%);
    --theme-accent: hsl(${color.accent.get('hsl.h')}, ${color.accent.get('hsl.s') * 100}%, ${color.accent.get('hsl.l') * 100}%);
}\n\n`;

})

fs.writeFileSync('./src/lib/assets/elouensthemes.css', cssOutputFavorites);
fs.writeFileSync('./src/lib/assets/elouensthemes.json', JSON.stringify(ElouensColors.map(color => `elouensthemes-${color.name}`), null, 2));