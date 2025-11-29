// Copies common/ and import/ folders to the out/vsix or out/build directory for packaging
const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const child of fs.readdirSync(src)) {
            copyRecursiveSync(path.join(src, child), path.join(dest, child));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

const projectRoot = path.resolve(__dirname, '..');
const outDirs = [
    path.join(projectRoot, 'out', 'vsix'),
    path.join(projectRoot, 'out', 'build'),
];

for (const folder of ['common', 'import']) {
    const src = path.join(projectRoot, folder);
    for (const outDir of outDirs) {
        const dest = path.join(outDir, folder);
        copyRecursiveSync(src, dest);
        console.log(`Copied ${src} → ${dest}`);
    }
}
