# LIVE P5 LAUNCHER

## Introduction
LIVE P5 LAUNCHER is a Visual Studio Code extension that brings live coding and rapid prototyping to p5.js sketches. It provides an interactive webview panel for instant feedback, variable control, and error reporting, making it ideal for creative coding, teaching, and experimentation with p5.js in JavaScript or TypeScript.

![LIVE P5 Launcher Screenshot](./readme/p5live_Screenshot.png)

## Features
- **Live Preview:** Instantly see your p5.js sketch update as you type or save.
- **Global Variable Controls:** Automatically detects global variables and provides a UI to adjust them in real time.
- **Error Overlay:** Syntax and runtime errors are shown as overlays in the webview and logged in the Output panel.
- **Reload Button:** Manually reload your sketch and preserve variable values.
- **Auto Reload:** Optionally reload on typing or only on save (configurable).
- **Workspace Imports:** Automatically loads scripts from `common/` and `import/` folders in your workspace.
- **Include:** Automatically loads scripts from `include/` folder in the same folder as the sketch.
- **Resizable Canvas:** Supports auto-resizing.
- **P5 Reference Integration:** Quick access to the p5.js reference and lookup for selected text.
- **Project Bootstrap:** Quick setup to create a folder structure for p5.js projects and a `jsconfig.json` for p5js types intellisense.
- **Capture:** Record animations or graphics from the webview with a record button.
- **OSC Bridge:** Send and Receive OSC messages with SendOSC(address,arguments) and the receivedOSC eventhandler.

## How to Use
1. **Install the Extension:**
   - Search for `P5 LIVE LAUNCHER` in the VS Code Extensions marketplace and install it.

2. **Project Setup:**
   - Run `Live P5: Setup new P5 Project` to scaffold a p5.js project structure with `common/`, `import/`, `media/`, and `sketches/` folders and a jsconfig to enable autocompletion for p5.
   - If no folder/workspace is open, select a folder or create a new one using the dialog window.

2. **Open or Create a Sketch:**
   - Open a `.js` or `.ts` file with your p5.js code.
   - Use P5 Live BUTTON (or the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run `Live P5: Open P5 Panel`.

3. **Live Coding:**
   - Edit your code and see changes instantly in the webview panel.
   - Adjust global variables using the controls at the bottom of the panel.
   - Errors will appear as overlays and in a dedicated output channel per sketch.

4. **Reload Options:**
   - Use the reload button in the webview to manually reload and preserve variable values.
   - Toggle auto-reload on typing or on save via in the settings.

5. **Import Scripts:**
   - Place shared code in `common/` or `import/` folders in your workspace. These scripts are loaded automatically in every sketch.
   - Place media in the `media/` folder and reference them with the MEDIA_FOLDER variable
   ex: mySound = loadSound(MEDIA_FOLDER + '/doorbell');

6. **P5 Reference:**
   - Use the status bar button or command palette to quickly open the p5.js reference.
   - Select text in your code, right click and choose "Search in P5 reference" for a shortcut.

## Configuration
- `liveP5.debounceDelay`: Delay (ms) for live reload on typing.
- `liveP5.reloadWhileTyping`: Enable/disable live reload as you type.
- `liveP5.reloadOnSave`: Enable/disable reload on file save.
- `liveP5.showReloadButton`: Show/hide the reload button in the webview.
- `liveP5.varDrawerDefaultState`: Set the variable drawer to open, collapsed, or hidden by default.

## Tips
- For autocompletion of functions in import/common files, use a `jsconfig.json` and/or JSDoc references.
- Prototype extensions (e.g., `p5.prototype.myFunc`) may require a `.d.ts` or JSDoc shim for IntelliSense.

## License
Unlicense https://unlicense.org

## Attributions
Shout out to: https://github.com/filipesabella/
with his extension vscode-live-p5
His project was the start for mine, initially i made a few UI Changes,
but i had a different vision for this tool and went back to the drawing board.
Not much of the original code is left in my project, but I still wanted to give credit to Filipe for his great work and inspiration!