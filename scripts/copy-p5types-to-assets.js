// Copies the p5types folder into assets/1.11/p5types for packaging/runtime resolution
// Safe to run multiple times; overwrites existing files.
const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    try { fs.mkdirSync(dest, { recursive: true }); } catch { }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(s, d);
        } else if (entry.isSymbolicLink && entry.isSymbolicLink()) {
            try { fs.copyFileSync(s, d); } catch { }
        } else {
            try { fs.copyFileSync(s, d); } catch { }
        }
    }
}

(function main() {
    const repoRoot = __dirname ? path.resolve(__dirname, '..') : process.cwd();
    const src = path.join(repoRoot, 'p5types');
    const dest111 = path.join(repoRoot, 'assets', '1.11', 'p5types');
    try { fs.mkdirSync(path.join(repoRoot, 'assets', '1.11'), { recursive: true }); } catch { }
    if (!fs.existsSync(src)) {
        // Optional: if no local p5types folder is present, skip silently.
        return;
    }
    copyDirSync(src, dest111);
    console.log('[copy-p5types-to-assets] Copied p5types to', dest111);
})();
