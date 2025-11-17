// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        // TODO: Fix loadShader() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Shader>
        //
        // loadShader(vertFilename: string, fragFilename: string, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): undefined

        /**
         *   Creates a new p5.Shader object. Shaders are 
         *   programs that run on the graphics processing unit 
         *   (GPU). They can process many pixels at the same 
         *   time, making them fast for many graphics tasks. 
         *   They’re written in a language called GLSL and run 
         *   along with the rest of the code in a sketch. 
         * 
         *   Once the p5.Shader object is created, it can be 
         *   used with the shader() function, as in 
         *   shader(myShader). A shader program consists of two 
         *   parts, a vertex shader and a fragment shader. The 
         *   vertex shader affects where 3D geometry is drawn 
         *   on the screen and the fragment shader affects 
         *   color. 
         * 
         *   The first parameter, vertSrc, sets the vertex 
         *   shader. It’s a string that contains the vertex 
         *   shader program written in GLSL. 
         * 
         *   The second parameter, fragSrc, sets the fragment 
         *   shader. It’s a string that contains the fragment 
         *   shader program written in GLSL. 
         * 
         *   A shader can optionally describe hooks, which are 
         *   functions in GLSL that users may choose to provide 
         *   to customize the behavior of the shader using the 
         *   modify() method of p5.Shader. These are added by 
         *   describing the hooks in a third parameter, 
         *   options, and referencing the hooks in your vertSrc 
         *   or fragSrc. Hooks for the vertex or fragment 
         *   shader are described under the vertex and fragment 
         *   keys of options. Each one is an object. where each 
         *   key is the type and name of a hook function, and 
         *   each value is a string with the parameter list and 
         *   default implementation of the hook. For example, 
         *   to let users optionally run code at the start of 
         *   the vertex shader, the options object could 
         *   include: 
         * 
         *   { vertex: { 'void beforeVertex': '() {}' } }
         * 
         *   Then, in your vertex shader source, you can run a 
         *   hook by calling a function with the same name 
         *   prefixed by HOOK_. If you want to check if the 
         *   default hook has been replaced, maybe to avoid 
         *   extra overhead, you can check if the same name 
         *   prefixed by AUGMENTED_HOOK_ has been defined: 
         * 
         *   void main() { // In most cases, just calling the 
         *   hook is fine: HOOK_beforeVertex(); // 
         *   Alternatively, for more efficiency: #ifdef 
         *   AUGMENTED_HOOK_beforeVertex HOOK_beforeVertex(); 
         *   #endif // Add the rest of your shader code here! }
         * 
         *   Note: Only filter shaders can be used in 2D mode. 
         *   All shaders can be used in WebGL mode.
         *   @param vertSrc source code for the vertex shader.
         *   @param fragSrc source code for the fragment 
         *   shader.
         *   @param [options] An optional object describing how 
         *   this shader can be augmented with hooks. It can 
         *   include:
         *   @return new shader object created from the vertex 
         *   and fragment shaders.
         */
        createShader(vertSrc: string, fragSrc: string, options?: object): Shader

        // TODO: Fix loadFilterShader() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Shader>
        //
        // loadFilterShader(fragFilename: string, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): undefined

        /**
         *   Creates a p5.Shader object to be used with the 
         *   filter() function. createFilterShader() works like 
         *   createShader() but has a default vertex shader 
         *   included. createFilterShader() is intended to be 
         *   used along with filter() for filtering the 
         *   contents of a canvas. A filter shader will be 
         *   applied to the whole canvas instead of just 
         *   p5.Geometry objects. 
         * 
         *   The parameter, fragSrc, sets the fragment shader. 
         *   It’s a string that contains the fragment shader 
         *   program written in GLSL. 
         * 
         *   The p5.Shader object that's created has some 
         *   uniforms that can be set: 
         * 
         *   - sampler2D tex0, which contains the canvas 
         *   contents as a texture.
         *   - vec2 canvasSize, which is the width and height 
         *   of the canvas, not including pixel density.
         *   - vec2 texelSize, which is the size of a physical 
         *   pixel including pixel density. This is calculated 
         *   as 1.0 / (width * density) for the pixel width and 
         *   1.0 / (height * density) for the pixel height.
         * 
         *   The p5.Shader that's created also provides varying 
         *   vec2 vTexCoord, a coordinate with values between 0 
         *   and 1. vTexCoord describes where on the canvas the 
         *   pixel will be drawn. 
         * 
         *   For more info about filters and shaders, see Adam 
         *   Ferriss' repo of shader examples or the 
         *   Introduction to Shaders tutorial.
         *   @param fragSrc source code for the fragment 
         *   shader.
         *   @return new shader object created from the 
         *   fragment shader.
         */
        createFilterShader(fragSrc: string): Shader

        /**
         *   Sets the p5.Shader object to apply while drawing. 
         *   Shaders are programs that run on the graphics 
         *   processing unit (GPU). They can process many 
         *   pixels or vertices at the same time, making them 
         *   fast for many graphics tasks. They’re written in a 
         *   language called GLSL and run along with the rest 
         *   of the code in a sketch. p5.Shader objects can be 
         *   created using the createShader() and loadShader() 
         *   functions. 
         * 
         *   The parameter, s, is the p5.Shader object to 
         *   apply. For example, calling shader(myShader) 
         *   applies myShader to process each pixel on the 
         *   canvas. This only changes the fill (the inner part 
         *   of shapes), but does not affect the outlines 
         *   (strokes) or any images drawn using the image() 
         *   function. The source code from a p5.Shader 
         *   object's fragment and vertex shaders will be 
         *   compiled the first time it's passed to shader(). 
         *   See MDN for more information about compiling 
         *   shaders. 
         * 
         *   Calling resetShader() restores a sketch’s default 
         *   shaders. 
         * 
         *   Note: Shaders can only be used in WebGL mode.  
         * 
         * 
         * 
         *   If you want to apply shaders to strokes or images, 
         *   use the following methods: 
         * 
         *   - strokeShader() : Applies a shader to the stroke 
         *   (outline) of shapes, allowing independent control 
         *   over the stroke rendering using shaders.
         *   - imageShader() : Applies a shader to images or 
         *   textures, controlling how the shader modifies 
         *   their appearance during rendering.
         *   @param s p5.Shader object to apply.
         */
        shader(s: Shader): void

        /**
         *   Sets the p5.Shader object to apply for strokes. 
         *   This method applies the given shader to strokes, 
         *   allowing customization of how lines and outlines 
         *   are drawn in 3D space. The shader will be used for 
         *   strokes until resetShader() is called or another 
         *   strokeShader is applied. 
         * 
         *   The shader will be used for: 
         * 
         *   - Strokes only, regardless of whether the uniform 
         *   uStrokeWeight is present.
         * 
         *   To further customize its behavior, refer to the 
         *   various hooks provided by the baseStrokeShader() 
         *   method, which allow control over stroke weight, 
         *   vertex positions, colors, and more.
         *   @param s p5.Shader object to apply for strokes.
         */
        strokeShader(s: Shader): void

        /**
         *   Sets the p5.Shader object to apply for images. 
         *   This method allows the user to apply a custom 
         *   shader to images, enabling advanced visual effects 
         *   such as pixel manipulation, color adjustments, or 
         *   dynamic behavior. The shader will be applied to 
         *   the image drawn using the image() function. 
         * 
         *   The shader will be used exclusively for: 
         * 
         *   - image() calls, applying only when drawing 2D 
         *   images.
         *   - This shader will NOT apply to images used in 
         *   texture() or other 3D contexts. Any attempts to 
         *   use the imageShader in these cases will be 
         *   ignored.
         *   @param s p5.Shader object to apply for images.
         */
        imageShader(s: Shader): void

        /**
         *   Get the default shader used with lights, 
         *   materials, and textures. You can call 
         *   baseMaterialShader().modify() and change any of 
         *   the following hooks:  HookDescription 
         * 
         *   void beforeVertex 
         * 
         *   Called at the start of the vertex shader.  
         * 
         *   Vertex getObjectInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   before any positioning has been applied. It takes 
         *   in a Vertex struct, which includes: 
         * 
         *   - vec3 position, the position of the vertex
         *   - vec3 normal, the direction facing out of the 
         *   surface
         *   - vec2 texCoord, the texture coordinates 
         *   associeted with the vertex
         *   - vec4 color, the per-vertex color The struct can 
         *   be modified and returned. 
         * 
         *   Vertex getWorldInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   after transformations such as translate() and 
         *   scale() have been applied, but before the camera 
         *   has been applied. It takes in a Vertex struct 
         *   like, in the getObjectInputs hook above, that can 
         *   be modified and returned.  
         * 
         *   Vertex getCameraInputs 
         * 
         *   Update the vertex data of the model being drawn as 
         *   they appear relative to the camera. It takes in a 
         *   Vertex struct like, in the getObjectInputs hook 
         *   above, that can be modified and returned.  
         * 
         *   void afterVertex 
         * 
         *   Called at the end of the vertex shader.  
         * 
         *   void beforeFragment 
         * 
         *   Called at the start of the fragment shader.  
         * 
         *   Inputs getPixelInputs 
         * 
         *   Update the per-pixel inputs of the material. It 
         *   takes in an Inputs struct, which includes: 
         * 
         *   - vec3 normal, the direction pointing out of the 
         *   surface
         *   - vec2 texCoord, a vector where x and y are 
         *   between 0 and 1 describing the spot on a texture 
         *   the pixel is mapped to, as a fraction of the 
         *   texture size
         *   - vec3 ambientLight, the ambient light color on 
         *   the vertex
         *   - vec4 color, the base material color of the pixel
         *   - vec3 ambientMaterial, the color of the pixel 
         *   when affected by ambient light
         *   - vec3 specularMaterial, the color of the pixel 
         *   when reflecting specular highlights
         *   - vec3 emissiveMaterial, the light color emitted 
         *   by the pixel
         *   - float shininess, a number representing how sharp 
         *   specular reflections should be, from 1 to infinity
         *   - float metalness, a number representing how 
         *   mirrorlike the material should be, between 0 and 1 
         *   The struct can be modified and returned. 
         * 
         *   vec4 combineColors 
         * 
         *   Take in a ColorComponents struct containing all 
         *   the different components of light, and combining 
         *   them into a single final color. The struct 
         *   contains: 
         * 
         *   - vec3 baseColor, the base color of the pixel
         *   - float opacity, the opacity between 0 and 1 that 
         *   it should be drawn at
         *   - vec3 ambientColor, the color of the pixel when 
         *   affected by ambient light
         *   - vec3 specularColor, the color of the pixel when 
         *   affected by specular reflections
         *   - vec3 diffuse, the amount of diffused light 
         *   hitting the pixel
         *   - vec3 ambient, the amount of ambient light 
         *   hitting the pixel
         *   - vec3 specular, the amount of specular reflection 
         *   hitting the pixel
         *   - vec3 emissive, the amount of light emitted by 
         *   the pixel 
         * 
         *   vec4 getFinalColor 
         * 
         *   Update the final color after mixing. It takes in a 
         *   vec4 color and must return a modified version.  
         * 
         *   void afterFragment 
         * 
         *   Called at the end of the fragment shader.  
         * 
         *   Most of the time, you will need to write your 
         *   hooks in GLSL ES version 300. If you are using 
         *   WebGL 1 instead of 2, write your hooks in GLSL ES 
         *   100 instead. 
         * 
         *   Call baseMaterialShader().inspectHooks() to see 
         *   all the possible hooks and their default 
         *   implementations.
         *   @return The material shader
         */
        baseMaterialShader(): Shader

        /**
         *   Get the base shader for filters. You can then call 
         *   baseFilterShader().modify() and change the 
         *   following hook:  HookDescription 
         * 
         *   vec4 getColor 
         * 
         *   Output the final color for the current pixel. It 
         *   takes in two parameters: FilterInputs inputs, and 
         *   in sampler2D canvasContent, and must return a 
         *   color as a vec4. 
         * 
         *   FilterInputs inputs is a scruct with the following 
         *   properties: 
         * 
         *   - vec2 texCoord, the position on the canvas, with 
         *   coordinates between 0 and 1. Calling 
         *   getTexture(canvasContent, texCoord) returns the 
         *   original color of the current pixel.
         *   - vec2 canvasSize, the width and height of the 
         *   sketch.
         *   - vec2 texelSize, the size of one real pixel 
         *   relative to the size of the whole canvas. This is 
         *   equivalent to 1 / (canvasSize * pixelDensity).
         * 
         *   in sampler2D canvasContent is a texture with the 
         *   contents of the sketch, pre-filter. Call 
         *   getTexture(canvasContent, someCoordinate) to 
         *   retrieve the color of the sketch at that 
         *   coordinate, with coordinate values between 0 and 
         *   1.  
         * 
         *   Most of the time, you will need to write your 
         *   hooks in GLSL ES version 300. If you are using 
         *   WebGL 1, write your hooks in GLSL ES 100 instead.
         *   @return The filter shader
         */
        baseFilterShader(): Shader

        /**
         *   Get the shader used by normalMaterial(). You can 
         *   call baseNormalShader().modify() and change any of 
         *   the following hooks:  HookDescription 
         * 
         *   void beforeVertex 
         * 
         *   Called at the start of the vertex shader.  
         * 
         *   Vertex getObjectInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   before any positioning has been applied. It takes 
         *   in a Vertex struct, which includes: 
         * 
         *   - vec3 position, the position of the vertex
         *   - vec3 normal, the direction facing out of the 
         *   surface
         *   - vec2 texCoord, the texture coordinates 
         *   associeted with the vertex
         *   - vec4 color, the per-vertex color The struct can 
         *   be modified and returned. 
         * 
         *   Vertex getWorldInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   after transformations such as translate() and 
         *   scale() have been applied, but before the camera 
         *   has been applied. It takes in a Vertex struct 
         *   like, in the getObjectInputs hook above, that can 
         *   be modified and returned.  
         * 
         *   Vertex getCameraInputs 
         * 
         *   Update the vertex data of the model being drawn as 
         *   they appear relative to the camera. It takes in a 
         *   Vertex struct like, in the getObjectInputs hook 
         *   above, that can be modified and returned.  
         * 
         *   void afterVertex 
         * 
         *   Called at the end of the vertex shader.  
         * 
         *   void beforeFragment 
         * 
         *   Called at the start of the fragment shader.  
         * 
         *   vec4 getFinalColor 
         * 
         *   Update the final color after mixing. It takes in a 
         *   vec4 color and must return a modified version.  
         * 
         *   void afterFragment 
         * 
         *   Called at the end of the fragment shader.  
         * 
         *   Most of the time, you will need to write your 
         *   hooks in GLSL ES version 300. If you are using 
         *   WebGL 1 instead of 2, write your hooks in GLSL ES 
         *   100 instead. 
         * 
         *   Call baseNormalShader().inspectHooks() to see all 
         *   the possible hooks and their default 
         *   implementations.
         *   @return The normalMaterial shader
         */
        baseNormalShader(): Shader

        /**
         *   Get the shader used when no lights or materials 
         *   are applied. You can call 
         *   baseColorShader().modify() and change any of the 
         *   following hooks:  HookDescription 
         * 
         *   void beforeVertex 
         * 
         *   Called at the start of the vertex shader.  
         * 
         *   Vertex getObjectInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   before any positioning has been applied. It takes 
         *   in a Vertex struct, which includes: 
         * 
         *   - vec3 position, the position of the vertex
         *   - vec3 normal, the direction facing out of the 
         *   surface
         *   - vec2 texCoord, the texture coordinates 
         *   associeted with the vertex
         *   - vec4 color, the per-vertex color The struct can 
         *   be modified and returned. 
         * 
         *   Vertex getWorldInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   after transformations such as translate() and 
         *   scale() have been applied, but before the camera 
         *   has been applied. It takes in a Vertex struct 
         *   like, in the getObjectInputs hook above, that can 
         *   be modified and returned.  
         * 
         *   Vertex getCameraInputs 
         * 
         *   Update the vertex data of the model being drawn as 
         *   they appear relative to the camera. It takes in a 
         *   Vertex struct like, in the getObjectInputs hook 
         *   above, that can be modified and returned.  
         * 
         *   void afterVertex 
         * 
         *   Called at the end of the vertex shader.  
         * 
         *   void beforeFragment 
         * 
         *   Called at the start of the fragment shader.  
         * 
         *   vec4 getFinalColor 
         * 
         *   Update the final color after mixing. It takes in a 
         *   vec4 color and must return a modified version.  
         * 
         *   void afterFragment 
         * 
         *   Called at the end of the fragment shader.  
         * 
         *   Most of the time, you will need to write your 
         *   hooks in GLSL ES version 300. If you are using 
         *   WebGL 1 instead of 2, write your hooks in GLSL ES 
         *   100 instead. 
         * 
         *   Call baseColorShader().inspectHooks() to see all 
         *   the possible hooks and their default 
         *   implementations.
         *   @return The color shader
         */
        baseColorShader(): Shader

        /**
         *   Get the shader used when drawing the strokes of 
         *   shapes. You can call baseStrokeShader().modify() 
         *   and change any of the following hooks:  
         *   HookDescription 
         * 
         *   void beforeVertex 
         * 
         *   Called at the start of the vertex shader.  
         * 
         *   StrokeVertex getObjectInputs 
         * 
         *   Update the vertex data of the stroke being drawn 
         *   before any positioning has been applied. It takes 
         *   in a StrokeVertex struct, which includes: 
         * 
         *   - vec3 position, the position of the vertex
         *   - vec3 tangentIn, the tangent coming in to the 
         *   vertex
         *   - vec3 tangentOut, the tangent coming out of the 
         *   vertex. In straight segments, this will be the 
         *   same as tangentIn. In joins, it will be different. 
         *   In caps, one of the tangents will be 0.
         *   - vec4 color, the per-vertex color
         *   - float weight, the stroke weight The struct can 
         *   be modified and returned. 
         * 
         *   StrokeVertex getWorldInputs 
         * 
         *   Update the vertex data of the model being drawn 
         *   after transformations such as translate() and 
         *   scale() have been applied, but before the camera 
         *   has been applied. It takes in a StrokeVertex 
         *   struct like, in the getObjectInputs hook above, 
         *   that can be modified and returned.  
         * 
         *   StrokeVertex getCameraInputs 
         * 
         *   Update the vertex data of the model being drawn as 
         *   they appear relative to the camera. It takes in a 
         *   StrokeVertex struct like, in the getObjectInputs 
         *   hook above, that can be modified and returned.  
         * 
         *   void afterVertex 
         * 
         *   Called at the end of the vertex shader.  
         * 
         *   void beforeFragment 
         * 
         *   Called at the start of the fragment shader.  
         * 
         *   Inputs getPixelInputs 
         * 
         *   Update the inputs to the shader. It takes in a 
         *   struct Inputs inputs, which includes: 
         * 
         *   - vec4 color, the color of the stroke
         *   - vec2 tangent, the direction of the stroke in 
         *   screen space
         *   - vec2 center, the coordinate of the center of the 
         *   stroke in screen space p5.js pixels
         *   - vec2 position, the coordinate of the current 
         *   pixel in screen space p5.js pixels
         *   - float strokeWeight, the thickness of the stroke 
         *   in p5.js pixels 
         * 
         *   bool shouldDiscard 
         * 
         *   Caps and joins are made by discarded pixels in the 
         *   fragment shader to carve away unwanted areas. Use 
         *   this to change this logic. It takes in a bool 
         *   willDiscard and must return a modified version.  
         * 
         *   vec4 getFinalColor 
         * 
         *   Update the final color after mixing. It takes in a 
         *   vec4 color and must return a modified version.  
         * 
         *   void afterFragment 
         * 
         *   Called at the end of the fragment shader.  
         * 
         *   Most of the time, you will need to write your 
         *   hooks in GLSL ES version 300. If you are using 
         *   WebGL 1 instead of 2, write your hooks in GLSL ES 
         *   100 instead. 
         * 
         *   Call baseStrokeShader().inspectHooks() to see all 
         *   the possible hooks and their default 
         *   implementations.
         *   @return The stroke shader
         */
        baseStrokeShader(): Shader

        /**
         *   Restores the default shaders. resetShader() 
         *   deactivates any shaders previously applied by 
         *   shader(), strokeShader(), or imageShader(). 
         * 
         *   Note: Shaders can only be used in WebGL mode.
         */
        resetShader(): void

        /**
         *   Sets the texture that will be used on shapes. A 
         *   texture is like a skin that wraps around a shape. 
         *   texture() works with built-in shapes, such as 
         *   square() and sphere(), and custom shapes created 
         *   with functions such as buildGeometry(). To texture 
         *   a geometry created with beginShape(), uv 
         *   coordinates must be passed to each vertex() call. 
         * 
         *   The parameter, tex, is the texture to apply. 
         *   texture() can use a range of sources including 
         *   images, videos, and offscreen renderers such as 
         *   p5.Graphics and p5.Framebuffer objects. 
         * 
         *   To texture a geometry created with beginShape(), 
         *   you will need to specify uv coordinates in 
         *   vertex(). 
         * 
         *   Note: texture() can only be used in WebGL mode.
         *   @param tex media to use as the texture.
         */
        texture(tex: Image|MediaElement|Graphics|Framebuffer): void

        // TODO: Fix textureMode() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
        //
        //    param "mode" has invalid type: IMAGE|NORMAL
        //
        // textureMode(mode: IMAGE|NORMAL): void

        // TODO: Fix textureWrap() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
        //
        //    param "wrapX" has invalid type: CLAMP|REPEAT|MIRROR
        //    param "wrapY" has invalid type: CLAMP|REPEAT|MIRROR
        //
        // textureWrap(wrapX: CLAMP|REPEAT|MIRROR, wrapY?: CLAMP|REPEAT|MIRROR): void

        /**
         *   Sets the current material as a normal material. A 
         *   normal material sets surfaces facing the x-axis to 
         *   red, those facing the y-axis to green, and those 
         *   facing the z-axis to blue. Normal material isn't 
         *   affected by light. It’s often used as a 
         *   placeholder material when debugging. 
         * 
         *   Note: normalMaterial() can only be used in WebGL 
         *   mode.
         */
        normalMaterial(): void

        /**
         *   Sets the ambient color of shapes’ surface 
         *   material. The ambientMaterial() color sets the 
         *   components of the ambientLight() color that shapes 
         *   will reflect. For example, calling 
         *   ambientMaterial(255, 255, 0) would cause a shape 
         *   to reflect red and green light, but not blue 
         *   light. 
         * 
         *   ambientMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call ambientMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in ambientMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call ambientMaterial() has one 
         *   parameter, color. A p5.Color object, an array of 
         *   color values, or a CSS color string, as in 
         *   ambientMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call ambientMaterial() has three 
         *   parameters, v1, v2, and v3. RGB, HSB, or HSL 
         *   values, as in ambientMaterial(255, 0, 0), can be 
         *   passed to set the material’s colors. Color values 
         *   will be interpreted using the current colorMode(). 
         * 
         *   Note: ambientMaterial() can only be used in WebGL 
         *   mode.
         *   @param v1 red or hue value in the current 
         *   colorMode().
         *   @param v2 green or saturation value in the current 
         *   colorMode().
         *   @param v3 blue, brightness, or lightness value in 
         *   the current colorMode().
         */
        ambientMaterial(v1: number, v2: number, v3: number): void

        /**
         *   Sets the ambient color of shapes’ surface 
         *   material. The ambientMaterial() color sets the 
         *   components of the ambientLight() color that shapes 
         *   will reflect. For example, calling 
         *   ambientMaterial(255, 255, 0) would cause a shape 
         *   to reflect red and green light, but not blue 
         *   light. 
         * 
         *   ambientMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call ambientMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in ambientMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call ambientMaterial() has one 
         *   parameter, color. A p5.Color object, an array of 
         *   color values, or a CSS color string, as in 
         *   ambientMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call ambientMaterial() has three 
         *   parameters, v1, v2, and v3. RGB, HSB, or HSL 
         *   values, as in ambientMaterial(255, 0, 0), can be 
         *   passed to set the material’s colors. Color values 
         *   will be interpreted using the current colorMode(). 
         * 
         *   Note: ambientMaterial() can only be used in WebGL 
         *   mode.
         *   @param gray grayscale value between 0 (black) and 
         *   255 (white).
         */
        ambientMaterial(gray: number): void

        /**
         *   Sets the ambient color of shapes’ surface 
         *   material. The ambientMaterial() color sets the 
         *   components of the ambientLight() color that shapes 
         *   will reflect. For example, calling 
         *   ambientMaterial(255, 255, 0) would cause a shape 
         *   to reflect red and green light, but not blue 
         *   light. 
         * 
         *   ambientMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call ambientMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in ambientMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call ambientMaterial() has one 
         *   parameter, color. A p5.Color object, an array of 
         *   color values, or a CSS color string, as in 
         *   ambientMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call ambientMaterial() has three 
         *   parameters, v1, v2, and v3. RGB, HSB, or HSL 
         *   values, as in ambientMaterial(255, 0, 0), can be 
         *   passed to set the material’s colors. Color values 
         *   will be interpreted using the current colorMode(). 
         * 
         *   Note: ambientMaterial() can only be used in WebGL 
         *   mode.
         *   @param color color as a p5.Color object, an array 
         *   of color values, or a CSS string.
         */
        ambientMaterial(color: Color|number[]|string): void

        /**
         *   Sets the emissive color of shapes’ surface 
         *   material. The emissiveMaterial() color sets a 
         *   color shapes display at full strength, regardless 
         *   of lighting. This can give the appearance that a 
         *   shape is glowing. However, emissive materials 
         *   don’t actually emit light that can affect 
         *   surrounding objects. 
         * 
         *   emissiveMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call emissiveMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in emissiveMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call emissiveMaterial() has one 
         *   parameter, color. A p5.Color object, an array of 
         *   color values, or a CSS color string, as in 
         *   emissiveMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call emissiveMaterial() has four 
         *   parameters, v1, v2, v3, and alpha. alpha is 
         *   optional. RGBA, HSBA, or HSLA values can be passed 
         *   to set the material’s colors, as in 
         *   emissiveMaterial(255, 0, 0) or 
         *   emissiveMaterial(255, 0, 0, 30). Color values will 
         *   be interpreted using the current colorMode(). 
         * 
         *   Note: emissiveMaterial() can only be used in WebGL 
         *   mode.
         *   @param v1 red or hue value in the current 
         *   colorMode().
         *   @param v2 green or saturation value in the current 
         *   colorMode().
         *   @param v3 blue, brightness, or lightness value in 
         *   the current colorMode().
         *   @param [alpha] alpha value in the current 
         *   colorMode().
         */
        emissiveMaterial(v1: number, v2: number, v3: number, alpha?: number): void

        /**
         *   Sets the emissive color of shapes’ surface 
         *   material. The emissiveMaterial() color sets a 
         *   color shapes display at full strength, regardless 
         *   of lighting. This can give the appearance that a 
         *   shape is glowing. However, emissive materials 
         *   don’t actually emit light that can affect 
         *   surrounding objects. 
         * 
         *   emissiveMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call emissiveMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in emissiveMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call emissiveMaterial() has one 
         *   parameter, color. A p5.Color object, an array of 
         *   color values, or a CSS color string, as in 
         *   emissiveMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call emissiveMaterial() has four 
         *   parameters, v1, v2, v3, and alpha. alpha is 
         *   optional. RGBA, HSBA, or HSLA values can be passed 
         *   to set the material’s colors, as in 
         *   emissiveMaterial(255, 0, 0) or 
         *   emissiveMaterial(255, 0, 0, 30). Color values will 
         *   be interpreted using the current colorMode(). 
         * 
         *   Note: emissiveMaterial() can only be used in WebGL 
         *   mode.
         *   @param gray grayscale value between 0 (black) and 
         *   255 (white).
         */
        emissiveMaterial(gray: number): void

        /**
         *   Sets the emissive color of shapes’ surface 
         *   material. The emissiveMaterial() color sets a 
         *   color shapes display at full strength, regardless 
         *   of lighting. This can give the appearance that a 
         *   shape is glowing. However, emissive materials 
         *   don’t actually emit light that can affect 
         *   surrounding objects. 
         * 
         *   emissiveMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call emissiveMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in emissiveMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call emissiveMaterial() has one 
         *   parameter, color. A p5.Color object, an array of 
         *   color values, or a CSS color string, as in 
         *   emissiveMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call emissiveMaterial() has four 
         *   parameters, v1, v2, v3, and alpha. alpha is 
         *   optional. RGBA, HSBA, or HSLA values can be passed 
         *   to set the material’s colors, as in 
         *   emissiveMaterial(255, 0, 0) or 
         *   emissiveMaterial(255, 0, 0, 30). Color values will 
         *   be interpreted using the current colorMode(). 
         * 
         *   Note: emissiveMaterial() can only be used in WebGL 
         *   mode.
         *   @param color color as a p5.Color object, an array 
         *   of color values, or a CSS string.
         */
        emissiveMaterial(color: Color|number[]|string): void

        /**
         *   Sets the specular color of shapes’ surface 
         *   material. The specularMaterial() color sets the 
         *   components of light color that glossy coats on 
         *   shapes will reflect. For example, calling 
         *   specularMaterial(255, 255, 0) would cause a shape 
         *   to reflect red and green light, but not blue 
         *   light. 
         * 
         *   Unlike ambientMaterial(), specularMaterial() will 
         *   reflect the full color of light sources including 
         *   directionalLight(), pointLight(), and spotLight(). 
         *   This is what gives it shapes their "shiny" 
         *   appearance. The material’s shininess can be 
         *   controlled by the shininess() function. 
         * 
         *   specularMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call specularMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in specularMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call specularMaterial() has one 
         *   parameter, color. A p5.Color> object, an array of 
         *   color values, or a CSS color string, as in 
         *   specularMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call specularMaterial() has four 
         *   parameters, v1, v2, v3, and alpha. alpha is 
         *   optional. RGBA, HSBA, or HSLA values can be passed 
         *   to set the material’s colors, as in 
         *   specularMaterial(255, 0, 0) or 
         *   specularMaterial(255, 0, 0, 30). Color values will 
         *   be interpreted using the current colorMode().
         *   @param gray grayscale value between 0 (black) and 
         *   255 (white).
         *   @param [alpha] alpha value in the current current 
         *   colorMode().
         */
        specularMaterial(gray: number, alpha?: number): void

        /**
         *   Sets the specular color of shapes’ surface 
         *   material. The specularMaterial() color sets the 
         *   components of light color that glossy coats on 
         *   shapes will reflect. For example, calling 
         *   specularMaterial(255, 255, 0) would cause a shape 
         *   to reflect red and green light, but not blue 
         *   light. 
         * 
         *   Unlike ambientMaterial(), specularMaterial() will 
         *   reflect the full color of light sources including 
         *   directionalLight(), pointLight(), and spotLight(). 
         *   This is what gives it shapes their "shiny" 
         *   appearance. The material’s shininess can be 
         *   controlled by the shininess() function. 
         * 
         *   specularMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call specularMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in specularMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call specularMaterial() has one 
         *   parameter, color. A p5.Color> object, an array of 
         *   color values, or a CSS color string, as in 
         *   specularMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call specularMaterial() has four 
         *   parameters, v1, v2, v3, and alpha. alpha is 
         *   optional. RGBA, HSBA, or HSLA values can be passed 
         *   to set the material’s colors, as in 
         *   specularMaterial(255, 0, 0) or 
         *   specularMaterial(255, 0, 0, 30). Color values will 
         *   be interpreted using the current colorMode().
         *   @param v1 red or hue value in the current 
         *   colorMode().
         *   @param v2 green or saturation value in the current 
         *   colorMode().
         *   @param v3 blue, brightness, or lightness value in 
         *   the current colorMode().
         *   @param [alpha] alpha value in the current current 
         *   colorMode().
         */
        specularMaterial(v1: number, v2: number, v3: number, alpha?: number): void

        /**
         *   Sets the specular color of shapes’ surface 
         *   material. The specularMaterial() color sets the 
         *   components of light color that glossy coats on 
         *   shapes will reflect. For example, calling 
         *   specularMaterial(255, 255, 0) would cause a shape 
         *   to reflect red and green light, but not blue 
         *   light. 
         * 
         *   Unlike ambientMaterial(), specularMaterial() will 
         *   reflect the full color of light sources including 
         *   directionalLight(), pointLight(), and spotLight(). 
         *   This is what gives it shapes their "shiny" 
         *   appearance. The material’s shininess can be 
         *   controlled by the shininess() function. 
         * 
         *   specularMaterial() can be called three ways with 
         *   different parameters to set the material’s color. 
         * 
         *   The first way to call specularMaterial() has one 
         *   parameter, gray. Grayscale values between 0 and 
         *   255, as in specularMaterial(50), can be passed to 
         *   set the material’s color. Higher grayscale values 
         *   make shapes appear brighter. 
         * 
         *   The second way to call specularMaterial() has one 
         *   parameter, color. A p5.Color> object, an array of 
         *   color values, or a CSS color string, as in 
         *   specularMaterial('magenta'), can be passed to set 
         *   the material’s color. 
         * 
         *   The third way to call specularMaterial() has four 
         *   parameters, v1, v2, v3, and alpha. alpha is 
         *   optional. RGBA, HSBA, or HSLA values can be passed 
         *   to set the material’s colors, as in 
         *   specularMaterial(255, 0, 0) or 
         *   specularMaterial(255, 0, 0, 30). Color values will 
         *   be interpreted using the current colorMode().
         *   @param color color as a p5.Color object, an array 
         *   of color values, or a CSS string.
         */
        specularMaterial(color: Color|number[]|string): void

        /**
         *   Sets the amount of gloss ("shininess") of a 
         *   specularMaterial(). Shiny materials focus 
         *   reflected light more than dull materials. 
         *   shininess() affects the way materials reflect 
         *   light sources including directionalLight(), 
         *   pointLight(), and spotLight(). 
         * 
         *   The parameter, shine, is a number that sets the 
         *   amount of shininess. shine must be greater than 1, 
         *   which is its default value.
         *   @param shine amount of shine.
         */
        shininess(shine: number): void

        /**
         *   Sets the amount of "metalness" of a 
         *   specularMaterial(). metalness() can make materials 
         *   appear more metallic. It affects the way materials 
         *   reflect light sources including affects the way 
         *   materials reflect light sources including 
         *   directionalLight(), pointLight(), spotLight(), and 
         *   imageLight(). 
         * 
         *   The parameter, metallic, is a number that sets the 
         *   amount of metalness. metallic must be greater than 
         *   1, which is its default value. Higher values, such 
         *   as metalness(100), make specular materials appear 
         *   more metallic.
         *   @param metallic amount of metalness.
         */
        metalness(metallic: number): void
    }
}
