// Type definitions for p5 2.1
// Project: https://github.com/processing/p5.js
// Definitions by: p5-types <https://github.com/p5-types>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

// This file was auto-generated. Please do not edit it.

/// <reference path="src/color/creating_reading.d.ts" />
/// <reference path="src/core/constants.d.ts" />
/// <reference path="src/core/environment.d.ts" />
/// <reference path="src/events/acceleration.d.ts" />
/// <reference path="src/events/keyboard.d.ts" />
/// <reference path="src/events/pointer.d.ts" />
/// <reference path="src/core/reference.d.ts" />
/// <reference path="src/core/rendering.d.ts" />
/// <reference path="src/dom/p5.MediaElement.d.ts" />
/// <reference path="src/image/pixels.d.ts" />
/// <reference path="src/math/trigonometry.d.ts" />
/// <reference path="src/accessibility/describe.d.ts" />
/// <reference path="src/accessibility/outputs.d.ts" />
/// <reference path="src/core/structure.d.ts" />
/// <reference path="src/color/setting.d.ts" />
/// <reference path="src/io/files.d.ts" />
/// <reference path="src/core/transform.d.ts" />
/// <reference path="src/data/local_storage.d.ts" />
/// <reference path="src/dom/dom.d.ts" />
/// <reference path="src/image/image.d.ts" />
/// <reference path="src/image/loading_displaying.d.ts" />
/// <reference path="src/webgl/p5.Framebuffer.d.ts" />
/// <reference path="src/io/p5.XML.d.ts" />
/// <reference path="src/math/calculation.d.ts" />
/// <reference path="src/math/math.d.ts" />
/// <reference path="src/math/noise.d.ts" />
/// <reference path="src/math/random.d.ts" />
/// <reference path="src/shape/2d_primitives.d.ts" />
/// <reference path="src/shape/attributes.d.ts" />
/// <reference path="src/shape/curves.d.ts" />
/// <reference path="src/shape/custom_shapes.d.ts" />
/// <reference path="src/shape/vertex.d.ts" />
/// <reference path="src/strands/p5.strands.d.ts" />
/// <reference path="src/type/p5.Font.d.ts" />
/// <reference path="src/type/textCore.d.ts" />
/// <reference path="src/utilities/conversion.d.ts" />
/// <reference path="src/utilities/time_date.d.ts" />
/// <reference path="src/utilities/utility_functions.d.ts" />
/// <reference path="src/webgl/3d_primitives.d.ts" />
/// <reference path="src/webgl/interaction.d.ts" />
/// <reference path="src/webgl/light.d.ts" />
/// <reference path="src/webgl/loading.d.ts" />
/// <reference path="src/webgl/material.d.ts" />
/// <reference path="src/webgl/p5.Camera.d.ts" />
/// <reference path="src/webgl/p5.Geometry.d.ts" />
/// <reference path="src/webgl/p5.Quat.d.ts" />
/// <reference path="src/webgl/p5.RendererGL.d.ts" />
/// <reference path="src/color/p5.Color.d.ts" />
/// <reference path="src/core/p5.Graphics.d.ts" />
/// <reference path="src/dom/p5.Element.d.ts" />
/// <reference path="src/dom/p5.File.d.ts" />
/// <reference path="src/image/p5.Image.d.ts" />
/// <reference path="src/io/p5.Table.d.ts" />
/// <reference path="src/io/p5.TableRow.d.ts" />
/// <reference path="src/math/p5.Vector.d.ts" />
/// <reference path="src/webgl/p5.Shader.d.ts" />
/// <reference path="src/analysis/Amplitude.d.ts" />
/// <reference path="src/analysis/FFT.d.ts" />
/// <reference path="src/core/p5soundMixEffect.d.ts" />
/// <reference path="src/core/p5soundNode.d.ts" />
/// <reference path="src/core/p5soundSource.d.ts" />
/// <reference path="src/effects/Biquad.d.ts" />
/// <reference path="src/effects/Delay.d.ts" />
/// <reference path="src/effects/Envelope.d.ts" />
/// <reference path="src/effects/Panner.d.ts" />
/// <reference path="src/effects/Panner3D.d.ts" />
/// <reference path="src/effects/PitchShifter.d.ts" />
/// <reference path="src/effects/Reverb.d.ts" />
/// <reference path="src/sources/AudioIn.d.ts" />
/// <reference path="src/sources/Noise.d.ts" />
/// <reference path="src/sources/Oscillator.d.ts" />
/// <reference path="src/sources/SoundFile.d.ts" />
/// <reference path="src/effects/Gain.d.ts" />
export = p5;
declare class p5 {
    // TODO: Fix p5() errors in src/scripts/parsers/in/p5.js/src/core/main.js, line 33:
    //
    //    return has invalid type: p5
    //
    // constructor(sketch: (p1: any) => any, node?: string|HTMLElement);

    /**
     *   Removes the sketch from the web page. Calling 
     *   remove() stops the draw loop and removes any HTML 
     *   elements created by the sketch, including the 
     *   canvas. A new sketch can be created by using the 
     *   p5() constructor, as in new p5().
     */
    remove(): void

    /**
     *   Removes the sketch from the web page. Calling 
     *   remove() stops the draw loop and removes any HTML 
     *   elements created by the sketch, including the 
     *   canvas. A new sketch can be created by using the 
     *   p5() constructor, as in new p5().
     */
    remove(): void

    /**
     *   Removes the sketch from the web page. Calling 
     *   remove() stops the draw loop and removes any HTML 
     *   elements created by the sketch, including the 
     *   canvas. A new sketch can be created by using the 
     *   p5() constructor, as in new p5().
     */
    remove(): void

    /**
     *   Removes the sketch from the web page. Calling 
     *   remove() stops the draw loop and removes any HTML 
     *   elements created by the sketch, including the 
     *   canvas. A new sketch can be created by using the 
     *   p5() constructor, as in new p5().
     */
    remove(): void

    /**
     *   A function that's called once when the sketch 
     *   begins running. Declaring the function setup() 
     *   sets a code block to run once automatically when 
     *   the sketch starts running. It's used to perform 
     *   setup tasks such as creating the canvas and 
     *   initializing variables: 
     * 
     *   function setup() { // Code to run once at the 
     *   start of the sketch. }
     * 
     *   Code placed in setup() will run once before code 
     *   placed in draw() begins looping. If setup() is 
     *   declared async (e.g. async function setup()), 
     *   execution pauses at each await until its promise 
     *   resolves. For example, font = await loadFont(...) 
     *   waits for the font asset to load because 
     *   loadFont() function returns a promise, and the 
     *   await keyword means the program will wait for the 
     *   promise to resolve. This ensures that all assets 
     *   are fully loaded before the sketch continues. 
     * 
     *   loading assets. 
     * 
     *   Note: setup() doesn’t have to be declared, but 
     *   it’s common practice to do so.
     */
    setup(): void

    /**
     *   A function that's called repeatedly while the 
     *   sketch runs. Declaring the function draw() sets a 
     *   code block to run repeatedly once the sketch 
     *   starts. It’s used to create animations and respond 
     *   to user inputs: 
     * 
     *   function draw() { // Code to run repeatedly. }
     * 
     *   This is often called the "draw loop" because p5.js 
     *   calls the code in draw() in a loop behind the 
     *   scenes. By default, draw() tries to run 60 times 
     *   per second. The actual rate depends on many 
     *   factors. The drawing rate, called the "frame 
     *   rate", can be controlled by calling frameRate(). 
     *   The number of times draw() has run is stored in 
     *   the system variable frameCount(). 
     * 
     *   Code placed within draw() begins looping after 
     *   setup() runs. draw() will run until the user 
     *   closes the sketch. draw() can be stopped by 
     *   calling the noLoop() function. draw() can be 
     *   resumed by calling the loop() function.
     */
    draw(): void

    /**
     *   Loads a p5.js library. A library is a function 
     *   that adds functionality to p5.js by adding methods 
     *   and properties for sketches to use, or for 
     *   automatically running code at different stages of 
     *   the p5.js lifecycle. Take a look at the 
     *   contributor docs for creating libraries to learn 
     *   more about creating libraries.
     *   @param library The library function to register
     */
    registerAddon(library: (...args: any[]) => any): void

    /**
     *   Turns off the parts of the Friendly Error System 
     *   (FES) that impact performance. The FES can cause 
     *   sketches to draw slowly because it does extra work 
     *   behind the scenes. For example, the FES checks the 
     *   arguments passed to functions, which takes time to 
     *   process. Disabling the FES can significantly 
     *   improve performance by turning off these checks.
     */
    disableFriendlyErrors: boolean
}

// tslint:disable-next-line:no-empty-interface
interface p5 extends p5.p5InstanceExtensions {}

declare namespace p5 {
    type UNKNOWN_P5_CONSTANT = any
    // tslint:disable-next-line:no-empty-interface
    interface p5InstanceExtensions {}
}
