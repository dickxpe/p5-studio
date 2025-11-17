// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class Shader {
        // TODO: Fix p5.Shader() errors in src/scripts/parsers/in/p5.js/src/webgl/p5.Shader.js, line 1587:
        //
        //    param "renderer" has invalid type: p5.RendererGL
        //
        // constructor(renderer: RendererGL, vertSrc: string, fragSrc: string, options?: object);

        /**
         *   Shaders are written in GLSL, but there are 
         *   different versions of GLSL that it might be 
         *   written in. Calling this method on a p5.Shader 
         *   will return the GLSL version it uses, either 100 
         *   es or 300 es. WebGL 1 shaders will only use 100 
         *   es, and WebGL 2 shaders may use either.
         *   @return The GLSL version used by the shader.
         */
        version(): string

        /**
         *   Logs the hooks available in this shader, and their 
         *   current implementation. Each shader may let you 
         *   override bits of its behavior. Each bit is called 
         *   a hook. A hook is either for the vertex shader, if 
         *   it affects the position of vertices, or in the 
         *   fragment shader, if it affects the pixel color. 
         *   This method logs those values to the console, 
         *   letting you know what you are able to use in a 
         *   call to modify(). 
         * 
         *   For example, this shader will produce the 
         *   following output: 
         * 
         *   myShader = baseMaterialShader().modify({ 
         *   declarations: 'uniform float time;', 'vec3 
         *   getWorldPosition': `(vec3 pos) { pos.y += 20. * 
         *   sin(time * 0.001 + pos.x * 0.05); return pos; }` 
         *   }); myShader.inspectHooks();
         * 
         *   ==== Vertex shader hooks: ==== void beforeVertex() 
         *   {} vec3 getLocalPosition(vec3 position) { return 
         *   position; } [MODIFIED] vec3 getWorldPosition(vec3 
         *   pos) { pos.y += 20. * sin(time * 0.001 + pos.x * 
         *   0.05); return pos; } vec3 getLocalNormal(vec3 
         *   normal) { return normal; } vec3 
         *   getWorldNormal(vec3 normal) { return normal; } 
         *   vec2 getUV(vec2 uv) { return uv; } vec4 
         *   getVertexColor(vec4 color) { return color; } void 
         *   afterVertex() {} ==== Fragment shader hooks: ==== 
         *   void beforeFragment() {} Inputs 
         *   getPixelInputs(Inputs inputs) { return inputs; } 
         *   vec4 combineColors(ColorComponents components) { 
         *   vec4 color = vec4(0.); color.rgb += 
         *   components.diffuse * components.baseColor; 
         *   color.rgb += components.ambient * 
         *   components.ambientColor; color.rgb += 
         *   components.specular * components.specularColor; 
         *   color.rgb += components.emissive; color.a = 
         *   components.opacity; return color; } vec4 
         *   getFinalColor(vec4 color) { return color; } void 
         *   afterFragment() {}
         */
        inspectHooks(): void

        /**
         *   Returns a new shader, based on the original, but 
         *   with custom snippets of shader code replacing 
         *   default behaviour. Each shader may let you 
         *   override bits of its behavior. Each bit is called 
         *   a hook. For example, a hook can let you adjust 
         *   positions of vertices, or the color of a pixel. 
         *   You can inspect the different hooks available by 
         *   calling yourShader.inspectHooks(). You can also 
         *   read the reference for the default material, 
         *   normal material, color, line, and point shaders to 
         *   see what hooks they have available. 
         * 
         *   modify() can be passed a function as a parameter. 
         *   Inside, you can override hooks by calling them as 
         *   functions. Each hook will take in a callback that 
         *   takes in inputs and is expected to return an 
         *   output. For example, here is a function that 
         *   changes the material color to red: 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify(() => { 
         *   getPixelInputs((inputs) => { inputs.color = 
         *   [inputs.texCoord, 0, 1]; return inputs; }); }); } 
         *   function draw() { background(255); noStroke(); 
         *   shader(myShader); // Apply the custom shader 
         *   plane(width, height); // Draw a plane with the 
         *   shader applied }
         * 
         *   In addition to calling hooks, you can create 
         *   uniforms, which are special variables used to pass 
         *   data from p5.js into the shader. They can be 
         *   created by calling uniform + the type of the data, 
         *   such as uniformFloat for a number of 
         *   uniformVector2 for a two-component vector. They 
         *   take in a function that returns the data for the 
         *   variable. You can then reference these variables 
         *   in your hooks, and their values will update every 
         *   time you apply the shader with the result of your 
         *   function. 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify(() => { // Get the 
         *   current time from p5.js let t = uniformFloat(() => 
         *   millis()); getPixelInputs((inputs) => { 
         *   inputs.color = [ inputs.texCoord, sin(t * 0.01) / 
         *   2 + 0.5, 1, ]; return inputs; }); }); } function 
         *   draw() { background(255); noStroke(255); 
         *   shader(myShader); // Apply the custom shader 
         *   plane(width, height); // Draw a plane with the 
         *   shader applied }
         * 
         *   p5.strands functions are special, since they get 
         *   turned into a shader instead of being run like the 
         *   rest of your code. They only have access to p5.js 
         *   functions, and variables you declare inside the 
         *   modify callback. If you need access to local 
         *   variables, you can pass them into modify with an 
         *   optional second parameter, variables. If you are 
         *   using instance mode, you will need to pass your 
         *   sketch object in this way. 
         * 
         *   new p5((sketch) => { let myShader; sketch.setup = 
         *   function() { sketch.createCanvas(200, 200, 
         *   sketch.WEBGL); myShader = 
         *   sketch.baseMaterialShader().modify(() => { 
         *   sketch.getPixelInputs((inputs) => { inputs.color = 
         *   [inputs.texCoord, 0, 1]; return inputs; }); }, { 
         *   sketch }); } sketch.draw = function() { 
         *   sketch.background(255); sketch.noStroke(); 
         *   sketch.shader(myShader); // Apply the custom 
         *   shader sketch.plane(sketch.width, sketch.height); 
         *   // Draw a plane with the shader applied } });
         * 
         *   You can also write GLSL directly in modify if you 
         *   need direct access. To do so, modify() takes one 
         *   parameter, hooks, an object with the hooks you 
         *   want to override. Each key of the hooks object is 
         *   the name of a hook, and the value is a string with 
         *   the GLSL code for your hook. 
         * 
         *   If you supply functions that aren't existing 
         *   hooks, they will get added at the start of the 
         *   shader as helper functions so that you can use 
         *   them in your hooks. 
         * 
         *   To add new uniforms to your shader, you can pass 
         *   in a uniforms object containing the type and name 
         *   of the uniform as the key, and a default value or 
         *   function returning a default value as its value. 
         *   These will be automatically set when the shader is 
         *   set with shader(yourShader). 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify({ uniforms: { 'float 
         *   time': () => millis() // Uniform for time }, 
         *   'Vertex getWorldInputs': `(Vertex inputs) { 
         *   inputs.position.y += 20. * sin(time * 0.001 + 
         *   inputs.position.x * 0.05); return inputs; }` }); } 
         *   function draw() { background(255); 
         *   shader(myShader); // Apply the custom shader 
         *   lights(); // Enable lighting noStroke(); // 
         *   Disable stroke fill('red'); // Set fill color to 
         *   red sphere(50); // Draw a sphere with the shader 
         *   applied }
         * 
         *   You can also add a declarations key, where the 
         *   value is a GLSL string declaring custom uniform 
         *   variables, globals, and functions shared between 
         *   hooks. To add declarations just in a vertex or 
         *   fragment shader, add vertexDeclarations and 
         *   fragmentDeclarations keys. 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify({ // Manually 
         *   specifying a uniform declarations: 'uniform float 
         *   time;', 'Vertex getWorldInputs': `(Vertex inputs) 
         *   { inputs.position.y += 20. * sin(time * 0.001 + 
         *   inputs.position.x * 0.05); return inputs; }` }); } 
         *   function draw() { background(255); 
         *   shader(myShader); myShader.setUniform('time', 
         *   millis()); lights(); noStroke(); fill('red'); 
         *   sphere(50); }
         *   @param callback A function with p5.strands code to 
         *   modify the shader.
         *   @param [variables] An optional object with local 
         *   variables p5.strands should have access to.
         */
        modify(callback: (...args: any[]) => any, variables?: object): Shader

        /**
         *   Returns a new shader, based on the original, but 
         *   with custom snippets of shader code replacing 
         *   default behaviour. Each shader may let you 
         *   override bits of its behavior. Each bit is called 
         *   a hook. For example, a hook can let you adjust 
         *   positions of vertices, or the color of a pixel. 
         *   You can inspect the different hooks available by 
         *   calling yourShader.inspectHooks(). You can also 
         *   read the reference for the default material, 
         *   normal material, color, line, and point shaders to 
         *   see what hooks they have available. 
         * 
         *   modify() can be passed a function as a parameter. 
         *   Inside, you can override hooks by calling them as 
         *   functions. Each hook will take in a callback that 
         *   takes in inputs and is expected to return an 
         *   output. For example, here is a function that 
         *   changes the material color to red: 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify(() => { 
         *   getPixelInputs((inputs) => { inputs.color = 
         *   [inputs.texCoord, 0, 1]; return inputs; }); }); } 
         *   function draw() { background(255); noStroke(); 
         *   shader(myShader); // Apply the custom shader 
         *   plane(width, height); // Draw a plane with the 
         *   shader applied }
         * 
         *   In addition to calling hooks, you can create 
         *   uniforms, which are special variables used to pass 
         *   data from p5.js into the shader. They can be 
         *   created by calling uniform + the type of the data, 
         *   such as uniformFloat for a number of 
         *   uniformVector2 for a two-component vector. They 
         *   take in a function that returns the data for the 
         *   variable. You can then reference these variables 
         *   in your hooks, and their values will update every 
         *   time you apply the shader with the result of your 
         *   function. 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify(() => { // Get the 
         *   current time from p5.js let t = uniformFloat(() => 
         *   millis()); getPixelInputs((inputs) => { 
         *   inputs.color = [ inputs.texCoord, sin(t * 0.01) / 
         *   2 + 0.5, 1, ]; return inputs; }); }); } function 
         *   draw() { background(255); noStroke(255); 
         *   shader(myShader); // Apply the custom shader 
         *   plane(width, height); // Draw a plane with the 
         *   shader applied }
         * 
         *   p5.strands functions are special, since they get 
         *   turned into a shader instead of being run like the 
         *   rest of your code. They only have access to p5.js 
         *   functions, and variables you declare inside the 
         *   modify callback. If you need access to local 
         *   variables, you can pass them into modify with an 
         *   optional second parameter, variables. If you are 
         *   using instance mode, you will need to pass your 
         *   sketch object in this way. 
         * 
         *   new p5((sketch) => { let myShader; sketch.setup = 
         *   function() { sketch.createCanvas(200, 200, 
         *   sketch.WEBGL); myShader = 
         *   sketch.baseMaterialShader().modify(() => { 
         *   sketch.getPixelInputs((inputs) => { inputs.color = 
         *   [inputs.texCoord, 0, 1]; return inputs; }); }, { 
         *   sketch }); } sketch.draw = function() { 
         *   sketch.background(255); sketch.noStroke(); 
         *   sketch.shader(myShader); // Apply the custom 
         *   shader sketch.plane(sketch.width, sketch.height); 
         *   // Draw a plane with the shader applied } });
         * 
         *   You can also write GLSL directly in modify if you 
         *   need direct access. To do so, modify() takes one 
         *   parameter, hooks, an object with the hooks you 
         *   want to override. Each key of the hooks object is 
         *   the name of a hook, and the value is a string with 
         *   the GLSL code for your hook. 
         * 
         *   If you supply functions that aren't existing 
         *   hooks, they will get added at the start of the 
         *   shader as helper functions so that you can use 
         *   them in your hooks. 
         * 
         *   To add new uniforms to your shader, you can pass 
         *   in a uniforms object containing the type and name 
         *   of the uniform as the key, and a default value or 
         *   function returning a default value as its value. 
         *   These will be automatically set when the shader is 
         *   set with shader(yourShader). 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify({ uniforms: { 'float 
         *   time': () => millis() // Uniform for time }, 
         *   'Vertex getWorldInputs': `(Vertex inputs) { 
         *   inputs.position.y += 20. * sin(time * 0.001 + 
         *   inputs.position.x * 0.05); return inputs; }` }); } 
         *   function draw() { background(255); 
         *   shader(myShader); // Apply the custom shader 
         *   lights(); // Enable lighting noStroke(); // 
         *   Disable stroke fill('red'); // Set fill color to 
         *   red sphere(50); // Draw a sphere with the shader 
         *   applied }
         * 
         *   You can also add a declarations key, where the 
         *   value is a GLSL string declaring custom uniform 
         *   variables, globals, and functions shared between 
         *   hooks. To add declarations just in a vertex or 
         *   fragment shader, add vertexDeclarations and 
         *   fragmentDeclarations keys. 
         * 
         *   let myShader; function setup() { createCanvas(200, 
         *   200, WEBGL); myShader = 
         *   baseMaterialShader().modify({ // Manually 
         *   specifying a uniform declarations: 'uniform float 
         *   time;', 'Vertex getWorldInputs': `(Vertex inputs) 
         *   { inputs.position.y += 20. * sin(time * 0.001 + 
         *   inputs.position.x * 0.05); return inputs; }` }); } 
         *   function draw() { background(255); 
         *   shader(myShader); myShader.setUniform('time', 
         *   millis()); lights(); noStroke(); fill('red'); 
         *   sphere(50); }
         *   @param [hooks] The hooks in the shader to replace.
         */
        modify(hooks?: object): Shader

        /**
         *   Copies the shader from one drawing context to 
         *   another. Each p5.Shader object must be compiled by 
         *   calling shader() before it can run. Compilation 
         *   happens in a drawing context which is usually the 
         *   main canvas or an instance of p5.Graphics. A 
         *   shader can only be used in the context where it 
         *   was compiled. The copyToContext() method compiles 
         *   the shader again and copies it to another drawing 
         *   context where it can be reused. 
         * 
         *   The parameter, context, is the drawing context 
         *   where the shader will be used. The shader can be 
         *   copied to an instance of p5.Graphics, as in 
         *   myShader.copyToContext(pg). The shader can also be 
         *   copied from a p5.Graphics object to the main 
         *   canvas using the p5.instance variable, as in 
         *   myShader.copyToContext(p5.instance). 
         * 
         *   Note: A p5.Shader object created with 
         *   createShader(), createFilterShader(), or 
         *   loadShader() can be used directly with a 
         *   p5.Framebuffer object created with 
         *   createFramebuffer(). Both objects have the same 
         *   context as the main canvas.
         *   @param context WebGL context for the copied 
         *   shader.
         *   @return new shader compiled for the target 
         *   context.
         */
        copyToContext(context: Graphics): Shader

        /**
         *   Sets the shader’s uniform (global) variables. 
         *   Shader programs run on the computer’s graphics 
         *   processing unit (GPU). They live in part of the 
         *   computer’s memory that’s completely separate from 
         *   the sketch that runs them. Uniforms are global 
         *   variables within a shader program. They provide a 
         *   way to pass values from a sketch running on the 
         *   CPU to a shader program running on the GPU. 
         * 
         *   The first parameter, uniformName, is a string with 
         *   the uniform’s name. For the shader above, 
         *   uniformName would be 'r'. 
         * 
         *   The second parameter, data, is the value that 
         *   should be used to set the uniform. For example, 
         *   calling myShader.setUniform('r', 0.5) would set 
         *   the r uniform in the shader above to 0.5. data 
         *   should match the uniform’s type. Numbers, strings, 
         *   booleans, arrays, and many types of images can all 
         *   be passed to a shader with setUniform().
         *   @param uniformName name of the uniform. Must match 
         *   the name used in the vertex and fragment shaders.
         *   @param data value to assign to the uniform. Must 
         *   match the uniform’s data type.
         */
        setUniform(uniformName: string, data: boolean|number|number[]|Image|Graphics|MediaElement): void
    }
}
