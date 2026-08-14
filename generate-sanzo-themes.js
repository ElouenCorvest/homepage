import fs from "node:fs";

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

fs.writeFileSync('./src/lib/assets/sanzo-palettes.css', cssOutput);
fs.writeFileSync('./src/lib/assets/sanzo-palettes.json', JSON.stringify(Object.keys(combinations_3c).map(id => `sanzo${id}`), null, 2));