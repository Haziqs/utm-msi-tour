const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'public', 'models', 'masjidMSI.glb');
if (!fs.existsSync(glbPath)) {
    console.log("masjidMSI.glb not found.");
    process.exit(1);
}

const buffer = fs.readFileSync(glbPath);
const magic = buffer.readUInt32LE(0);
if (magic !== 0x46546C67) {
    console.log("Not a valid GLB file.");
    process.exit(1);
}

const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);

if (chunkType === 0x4E4F534A) { // 'JSON'
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    const names = new Set();
    if (gltf.nodes) {
        gltf.nodes.forEach(node => {
            if (node.name) names.add(node.name);
        });
    }
    console.log(Array.from(names).join('\n'));
} else {
    console.log("No JSON chunk found.");
}
