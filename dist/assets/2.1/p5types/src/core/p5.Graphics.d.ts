// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    // Work-around for p5.Graphics inheriting from both p5 and p5.Element
    class __Graphics__ extends Element {
        // TODO: Fix p5.Graphics() errors in src/scripts/parsers/in/p5.js/src/core/p5.Graphics.js, line 688:
        //
        //    param "renderer" has invalid type: P2D|WEBGL|P2DHDR
        //    param "pInst" has invalid type: p5
        //
        // constructor(w: number, h: number, renderer: P2D|WEBGL|P2DHDR, pInst?: p5, canvas?: HTMLCanvasElement);

        /**
         *   Resets the graphics buffer's transformations and 
         *   lighting. By default, the main canvas resets 
         *   certain transformation and lighting values each 
         *   time draw() executes. p5.Graphics objects must 
         *   reset these values manually by calling 
         *   myGraphics.reset().
         */
        reset(): void

        /**
         *   Removes the graphics buffer from the web page. 
         *   Calling myGraphics.remove() removes the graphics 
         *   buffer's <canvas> element from the web page. The 
         *   graphics buffer also uses a bit of memory on the 
         *   CPU that can be freed like so: 
         * 
         *   // Remove the graphics buffer from the web page. 
         *   myGraphics.remove(); // Delete the graphics buffer 
         *   from CPU memory. myGraphics = undefined;
         * 
         *   Note: All variables that reference the graphics 
         *   buffer must be assigned the value undefined to 
         *   delete the graphics buffer from CPU memory. If any 
         *   variable still refers to the graphics buffer, then 
         *   it won't be garbage collected.
         */
        remove(): void

        /**
         *   Creates a new p5.Framebuffer object with the same 
         *   WebGL context as the graphics buffer. 
         *   p5.Framebuffer objects are separate drawing 
         *   surfaces that can be used as textures in WebGL 
         *   mode. They're similar to p5.Graphics objects and 
         *   generally run much faster when used as textures. 
         *   Creating a p5.Framebuffer object in the same 
         *   context as the graphics buffer makes this speedup 
         *   possible. 
         * 
         *   The parameter, options, is optional. An object can 
         *   be passed to configure the p5.Framebuffer object. 
         *   The available properties are: 
         * 
         *   - format: data format of the texture, either 
         *   UNSIGNED_BYTE, FLOAT, or HALF_FLOAT. Default is 
         *   UNSIGNED_BYTE.
         *   - channels: whether to store RGB or RGBA color 
         *   channels. Default is to match the graphics buffer 
         *   which is RGBA.
         *   - depth: whether to include a depth buffer. 
         *   Default is true.
         *   - depthFormat: data format of depth information, 
         *   either UNSIGNED_INT or FLOAT. Default is FLOAT.
         *   - stencil: whether to include a stencil buffer for 
         *   masking. depth must be true for this feature to 
         *   work. Defaults to the value of depth which is 
         *   true.
         *   - antialias: whether to perform anti-aliasing. If 
         *   set to true, as in { antialias: true }, 2 samples 
         *   will be used by default. The number of samples can 
         *   also be set, as in { antialias: 4 }. Default is to 
         *   match setAttributes() which is false (true in 
         *   Safari).
         *   - width: width of the p5.Framebuffer object. 
         *   Default is to always match the graphics buffer 
         *   width.
         *   - height: height of the p5.Framebuffer object. 
         *   Default is to always match the graphics buffer 
         *   height.
         *   - density: pixel density of the p5.Framebuffer 
         *   object. Default is to always match the graphics 
         *   buffer pixel density.
         *   - textureFiltering: how to read values from the 
         *   p5.Framebuffer object. Either LINEAR (nearby 
         *   pixels will be interpolated) or NEAREST (no 
         *   interpolation). Generally, use LINEAR when using 
         *   the texture as an image and NEAREST if reading the 
         *   texture as data. Default is LINEAR.
         * 
         *   If the width, height, or density attributes are 
         *   set, they won't automatically match the graphics 
         *   buffer and must be changed manually.
         *   @param [options] configuration options.
         *   @return new framebuffer.
         */
        createFramebuffer(options?: object): Framebuffer
    }
    // Work-around for p5.Graphics inheriting from both p5 and p5.Element
    type Graphics = __Graphics__ & p5;
}
