# Sample App Static (Standalone)

A standalone, CDN-only version of the Blockly "sample-app" that generates JavaScript and updates the page. No bundler or dev server is required.

- Loads Blockly from a CDN
- Custom block `output` and its JavaScript generator
- Workspace state persisted to `localStorage`
- Pure static assets, easy to host anywhere

## Run locally

Serve this folder over HTTP (browsers restrict some features on `file://`).

Options (pick one):

- VS Code Live Server extension
- Python 3
  ```powershell
  cd sample-app-static-standalone
  python -m http.server 3000
  ```
- Node (no bundling, just a static server)
  ```powershell
  cd sample-app-static-standalone
  npx http-server -p 3000
  ```

Open http://localhost:3000

## Deploy

Upload these files to any static host (e.g., GitHub Pages, Netlify, Cloudflare Pages). No build step needed.

## License

Apache-2.0. See LICENSE in this folder.
