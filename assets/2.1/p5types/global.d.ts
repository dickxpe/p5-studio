// Global mode type definitions for p5

// This file was auto-generated. Please do not edit it.

/// <reference path="./lib/addons/p5.sound.d.ts" />
import * as p5 from './index'
declare global {
    /**
     *   Creates a p5.Color object. By default, the 
     *   parameters are interpreted as RGB values. Calling 
     *   color(255, 204, 0) will return a bright yellow 
     *   color. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of color() with one parameter 
     *   interprets the value one of two ways. If the 
     *   parameter is a number, it's interpreted as a 
     *   grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. 
     * 
     *   The version of color() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of color() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of color() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param gray number specifying value between white 
     *   and black.
     *   @param [alpha] alpha value relative to current 
     *   color range (default is 0-255).
     *   @return resulting color.
     */
    function color(gray: number, alpha?: number): p5.Color

    /**
     *   Creates a p5.Color object. By default, the 
     *   parameters are interpreted as RGB values. Calling 
     *   color(255, 204, 0) will return a bright yellow 
     *   color. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of color() with one parameter 
     *   interprets the value one of two ways. If the 
     *   parameter is a number, it's interpreted as a 
     *   grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. 
     * 
     *   The version of color() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of color() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of color() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param v1 red or hue value relative to the current 
     *   color range.
     *   @param v2 green or saturation value relative to 
     *   the current color range.
     *   @param v3 blue or brightness value relative to the 
     *   current color range.
     *   @param [alpha] alpha value relative to current 
     *   color range (default is 0-255).
     */
    function color(v1: number, v2: number, v3: number, alpha?: number): p5.Color

    /**
     *   Creates a p5.Color object. By default, the 
     *   parameters are interpreted as RGB values. Calling 
     *   color(255, 204, 0) will return a bright yellow 
     *   color. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of color() with one parameter 
     *   interprets the value one of two ways. If the 
     *   parameter is a number, it's interpreted as a 
     *   grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. 
     * 
     *   The version of color() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of color() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of color() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param value a color string.
     */
    function color(value: string): p5.Color

    /**
     *   Creates a p5.Color object. By default, the 
     *   parameters are interpreted as RGB values. Calling 
     *   color(255, 204, 0) will return a bright yellow 
     *   color. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of color() with one parameter 
     *   interprets the value one of two ways. If the 
     *   parameter is a number, it's interpreted as a 
     *   grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. 
     * 
     *   The version of color() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of color() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of color() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param values an array containing the red, green, 
     *   blue, and alpha components of the color.
     */
    function color(values: number[]): p5.Color

    /**
     *   Creates a p5.Color object. By default, the 
     *   parameters are interpreted as RGB values. Calling 
     *   color(255, 204, 0) will return a bright yellow 
     *   color. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of color() with one parameter 
     *   interprets the value one of two ways. If the 
     *   parameter is a number, it's interpreted as a 
     *   grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. 
     * 
     *   The version of color() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of color() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of color() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     */
    function color(color: p5.Color): p5.Color

    /**
     *   Gets the red value of a color. red() extracts the 
     *   red value from a p5.Color object, an array of 
     *   color components, or a CSS color string. 
     * 
     *   By default, red() returns a color's red value in 
     *   the range 0 to 255. If the colorMode() is set to 
     *   RGB, it returns the red value in the given range.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the red value.
     */
    function red(color: p5.Color|number[]|string): number

    /**
     *   Gets the green value of a color. green() extracts 
     *   the green value from a p5.Color object, an array 
     *   of color components, or a CSS color string. 
     * 
     *   By default, green() returns a color's green value 
     *   in the range 0 to 255. If the colorMode() is set 
     *   to RGB, it returns the green value in the given 
     *   range.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the green value.
     */
    function green(color: p5.Color|number[]|string): number

    /**
     *   Gets the blue value of a color. blue() extracts 
     *   the blue value from a p5.Color object, an array of 
     *   color components, or a CSS color string. 
     * 
     *   By default, blue() returns a color's blue value in 
     *   the range 0 to 255. If the colorMode() is set to 
     *   RGB, it returns the blue value in the given range.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the blue value.
     */
    function blue(color: p5.Color|number[]|string): number

    /**
     *   Gets the alpha (transparency) value of a color. 
     *   alpha() extracts the alpha value from a p5.Color 
     *   object, an array of color components, or a CSS 
     *   color string.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the alpha value.
     */
    function alpha(color: p5.Color|number[]|string): number

    /**
     *   Gets the hue value of a color. hue() extracts the 
     *   hue value from a p5.Color object, an array of 
     *   color components, or a CSS color string. 
     * 
     *   Hue describes a color's position on the color 
     *   wheel. By default, hue() returns a color's HSL hue 
     *   in the range 0 to 360. If the colorMode() is set 
     *   to HSB or HSL, it returns the hue value in the 
     *   given mode.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the hue value.
     */
    function hue(color: p5.Color|number[]|string): number

    /**
     *   Gets the saturation value of a color. saturation() 
     *   extracts the saturation value from a p5.Color 
     *   object, an array of color components, or a CSS 
     *   color string. 
     * 
     *   Saturation is scaled differently in HSB and HSL. 
     *   By default, saturation() returns a color's HSL 
     *   saturation in the range 0 to 100. If the 
     *   colorMode() is set to HSB or HSL, it returns the 
     *   saturation value in the given mode.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the saturation value
     */
    function saturation(color: p5.Color|number[]|string): number

    /**
     *   Gets the brightness value of a color. brightness() 
     *   extracts the HSB brightness value from a p5.Color 
     *   object, an array of color components, or a CSS 
     *   color string. 
     * 
     *   By default, brightness() returns a color's HSB 
     *   brightness in the range 0 to 100. If the 
     *   colorMode() is set to HSB, it returns the 
     *   brightness value in the given range.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the brightness value.
     */
    function brightness(color: p5.Color|number[]|string): number

    /**
     *   Gets the lightness value of a color. lightness() 
     *   extracts the HSL lightness value from a p5.Color 
     *   object, an array of color components, or a CSS 
     *   color string. 
     * 
     *   By default, lightness() returns a color's HSL 
     *   lightness in the range 0 to 100. If the 
     *   colorMode() is set to HSL, it returns the 
     *   lightness value in the given range.
     *   @param color p5.Color object, array of color 
     *   components, or CSS color string.
     *   @return the lightness value.
     */
    function lightness(color: p5.Color|number[]|string): number

    /**
     *   Blends two colors to find a third color between 
     *   them. The amt parameter specifies the amount to 
     *   interpolate between the two values. 0 is equal to 
     *   the first color, 0.1 is very near the first color, 
     *   0.5 is halfway between the two colors, and so on. 
     *   Negative numbers are set to 0. Numbers greater 
     *   than 1 are set to 1. This differs from the 
     *   behavior of lerp. It's necessary because numbers 
     *   outside of the interval [0, 1] will produce 
     *   strange and unexpected colors. 
     * 
     *   The way that colors are interpolated depends on 
     *   the current colorMode().
     *   @param c1 interpolate from this color.
     *   @param c2 interpolate to this color.
     *   @param amt number between 0 and 1.
     *   @return interpolated color.
     */
    function lerpColor(c1: p5.Color, c2: p5.Color, amt: number): p5.Color

    /**
     *   Blends multiple colors to find a color between 
     *   them. The amt parameter specifies the amount to 
     *   interpolate between the color stops which are 
     *   colors at each amt value "location" with amt 
     *   values that are between 2 color stops 
     *   interpolating between them based on its relative 
     *   distance to both. 
     * 
     *   The way that colors are interpolated depends on 
     *   the current colorMode().
     *   @param colors_stops color stops to interpolate 
     *   from
     *   @param amt number to use to interpolate relative 
     *   to color stops
     *   @return interpolated color.
     */
    function paletteLerp(colors_stops: string|number|[], amt: number): p5.Color


    /**
     *   HSB (hue, saturation, brightness) is a type of 
     *   color model. You can learn more about it at HSB.
     */








    /**
     *   Version of this p5.js.
     */

    /**
     *   The default, two-dimensional renderer in p5.js. 
     *   Use this when calling  (for example, 
     *   createCanvas(400, 400, P2D)) to specify a 2D 
     *   context.
     */

    /**
     *   A high-dynamic-range (HDR) variant of the default, 
     *   two-dimensional renderer. When available, this 
     *   mode can allow for extended color ranges and more 
     *   dynamic color representation. Use it similarly to 
     *   P2D: createCanvas(400, 400, P2DHDR).
     */

    /**
     *   One of the two render modes in p5.js, used for 
     *   computationally intensive tasks like 3D rendering 
     *   and shaders. WEBGL differs from the default P2D 
     *   renderer in the following ways: 
     * 
     *   - Coordinate System - When drawing in WEBGL mode, 
     *   the origin point (0,0,0) is located at the center 
     *   of the screen, not the top-left corner. See the 
     *   tutorial page about coordinates and 
     *   transformations.
     *   - 3D Shapes - WEBGL mode can be used to draw 
     *   3-dimensional shapes like box(), sphere(), cone(), 
     *   and more. See the tutorial page about custom 
     *   geometry to make more complex objects.
     *   - Shape Detail - When drawing in WEBGL mode, you 
     *   can specify how smooth curves should be drawn by 
     *   using a detail parameter. See the wiki section 
     *   about shapes for a more information and an 
     *   example.
     *   - Textures - A texture is like a skin that wraps 
     *   onto a shape. See the wiki section about textures 
     *   for examples of mapping images onto surfaces with 
     *   textures.
     *   - Materials and Lighting - WEBGL offers different 
     *   types of lights like ambientLight() to place 
     *   around a scene. Materials like specularMaterial() 
     *   reflect the lighting to convey shape and depth. 
     *   See the tutorial page for styling and appearance 
     *   to experiment with different combinations.
     *   - Camera - The viewport of a WEBGL sketch can be 
     *   adjusted by changing camera attributes. See the 
     *   tutorial page section about cameras for an 
     *   explanation of camera controls.
     *   - Text - WEBGL requires opentype/truetype font 
     *   files to be preloaded using loadFont(). See the 
     *   wiki section about text for details, along with a 
     *   workaround.
     *   - Shaders - Shaders are hardware accelerated 
     *   programs that can be used for a variety of effects 
     *   and graphics. See the introduction to shaders to 
     *   get started with shaders in p5.js.
     *   - Graphics Acceleration - WEBGL mode uses the 
     *   graphics card instead of the CPU, so it may help 
     *   boost the performance of your sketch (example: 
     *   drawing more shapes on the screen at once).
     * 
     *   To learn more about WEBGL mode, check out all the 
     *   interactive WEBGL tutorials in the "Tutorials" 
     *   section of this website, or read the wiki article 
     *   "Getting started with WebGL in p5".
     */

    /**
     *   One of the two possible values of a WebGL canvas 
     *   (either WEBGL or WEBGL2), which can be used to 
     *   determine what capabilities the rendering 
     *   environment has.
     */









    /**
     *   A Number constant that's approximately 1.5708. 
     *   HALF_PI is half the value of the mathematical 
     *   constant π. It's useful for many tasks that 
     *   involve rotation and oscillation. For example, 
     *   calling rotate(HALF_PI) rotates the coordinate 
     *   system HALF_PI radians, which is a quarter turn 
     *   (90˚). 
     * 
     *   Note: TWO_PI radians equals 360˚, PI radians 
     *   equals 180˚, HALF_PI radians equals 90˚, and 
     *   QUARTER_PI radians equals 45˚.
     */

    /**
     *   A Number constant that's approximately 3.1416. PI 
     *   is the mathematical constant π. It's useful for 
     *   many tasks that involve rotation and oscillation. 
     *   For example, calling rotate(PI) rotates the 
     *   coordinate system PI radians, which is a half turn 
     *   (180˚). 
     * 
     *   Note: TWO_PI radians equals 360˚, PI radians 
     *   equals 180˚, HALF_PI radians equals 90˚, and 
     *   QUARTER_PI radians equals 45˚.
     */

    /**
     *   A Number constant that's approximately 0.7854. 
     *   QUARTER_PI is one-fourth the value of the 
     *   mathematical constant π. It's useful for many 
     *   tasks that involve rotation and oscillation. For 
     *   example, calling rotate(QUARTER_PI) rotates the 
     *   coordinate system QUARTER_PI radians, which is an 
     *   eighth of a turn (45˚). 
     * 
     *   Note: TWO_PI radians equals 360˚, PI radians 
     *   equals 180˚, HALF_PI radians equals 90˚, and 
     *   QUARTER_PI radians equals 45˚.
     */

    /**
     *   A Number constant that's approximately 6.2382. TAU 
     *   is twice the value of the mathematical constant π. 
     *   It's useful for many tasks that involve rotation 
     *   and oscillation. For example, calling rotate(TAU) 
     *   rotates the coordinate system TAU radians, which 
     *   is one full turn (360˚). TAU and TWO_PI are equal. 
     * 
     *   Note: TAU radians equals 360˚, PI radians equals 
     *   180˚, HALF_PI radians equals 90˚, and QUARTER_PI 
     *   radians equals 45˚.
     */

    /**
     *   A Number constant that's approximately 6.2382. 
     *   TWO_PI is twice the value of the mathematical 
     *   constant π. It's useful for many tasks that 
     *   involve rotation and oscillation. For example, 
     *   calling rotate(TWO_PI) rotates the coordinate 
     *   system TWO_PI radians, which is one full turn 
     *   (360˚). TWO_PI and TAU are equal. 
     * 
     *   Note: TWO_PI radians equals 360˚, PI radians 
     *   equals 180˚, HALF_PI radians equals 90˚, and 
     *   QUARTER_PI radians equals 45˚.
     */

































    /**
     *   AUTO allows us to automatically set the width or 
     *   height of an element (but not both), based on the 
     *   current height and width of the element. Only one 
     *   parameter can be passed to the size function as 
     *   AUTO, at a time.
     */








































































    /**
     *   The splineProperty('ends') mode where splines 
     *   curve through their first and last points.
     */

    /**
     *   The splineProperty('ends') mode where the first 
     *   and last points in a spline affect the direction 
     *   of the curve, but are not rendered.
     */

    /**
     *   Changes the cursor's appearance. The first 
     *   parameter, type, sets the type of cursor to 
     *   display. The built-in options are ARROW, CROSS, 
     *   HAND, MOVE, TEXT, and WAIT. cursor() also 
     *   recognizes standard CSS cursor properties passed 
     *   as strings: 'help', 'wait', 'crosshair', 
     *   'not-allowed', 'zoom-in', and 'grab'. If the path 
     *   to an image is passed, as in 
     *   cursor('assets/target.png'), then the image will 
     *   be used as the cursor. Images must be in .cur, 
     *   .gif, .jpg, .jpeg, or .png format and should be at 
     *   most 32 by 32 pixels large. 
     * 
     *   The parameters x and y are optional. If an image 
     *   is used for the cursor, x and y set the location 
     *   pointed to within the image. They are both 0 by 
     *   default, so the cursor points to the image's 
     *   top-left corner. x and y must be less than the 
     *   image's width and height, respectively.
     *   @param type Built-in: either ARROW, CROSS, HAND, 
     *   MOVE, TEXT, or WAIT. Native CSS properties: 
     *   'grab', 'progress', and so on. Path to cursor 
     *   image.
     *   @param [x] horizontal active spot of the cursor.
     *   @param [y] vertical active spot of the cursor.
     */
    function cursor(type: string, x?: number, y?: number): void

    /**
     *   Sets the number of frames to draw per second. 
     *   Calling frameRate() with one numeric argument, as 
     *   in frameRate(30), attempts to draw 30 frames per 
     *   second (FPS). The target frame rate may not be 
     *   achieved depending on the sketch's processing 
     *   needs. Most computers default to a frame rate of 
     *   60 FPS. Frame rates of 24 FPS and above are fast 
     *   enough for smooth animations. 
     * 
     *   Calling frameRate() without an argument returns 
     *   the current frame rate. The value returned is an 
     *   approximation.
     *   @param fps number of frames to draw per second.
     */
    function frameRate(fps: number): void

    /**
     *   Sets the number of frames to draw per second. 
     *   Calling frameRate() with one numeric argument, as 
     *   in frameRate(30), attempts to draw 30 frames per 
     *   second (FPS). The target frame rate may not be 
     *   achieved depending on the sketch's processing 
     *   needs. Most computers default to a frame rate of 
     *   60 FPS. Frame rates of 24 FPS and above are fast 
     *   enough for smooth animations. 
     * 
     *   Calling frameRate() without an argument returns 
     *   the current frame rate. The value returned is an 
     *   approximation.
     *   @return current frame rate.
     */
    function frameRate(): number

    /**
     *   Returns the target frame rate. The value is either 
     *   the system frame rate or the last value passed to 
     *   frameRate().
     *   @return _targetFrameRate
     */
    function getTargetFrameRate(): number

    /**
     *   Hides the cursor from view.
     */
    function noCursor(): void

    /**
     *   A function that's called when the browser window 
     *   is resized. Code placed in the body of 
     *   windowResized() will run when the browser window's 
     *   size changes. It's a good place to call 
     *   resizeCanvas() or make other adjustments to 
     *   accommodate the new window size. 
     * 
     *   The event parameter is optional. If added to the 
     *   function declaration, it can be used for debugging 
     *   or other purposes.
     *   @param [event] optional resize Event.
     */
    function windowResized(event?: Event): void

    /**
     *   Toggles full-screen mode or returns the current 
     *   mode. Calling fullscreen(true) makes the sketch 
     *   full-screen. Calling fullscreen(false) makes the 
     *   sketch its original size. 
     * 
     *   Calling fullscreen() without an argument returns 
     *   true if the sketch is in full-screen mode and 
     *   false if not. 
     * 
     *   Note: Due to browser restrictions, fullscreen() 
     *   can only be called with user input such as a mouse 
     *   press.
     *   @param [val] whether the sketch should be in 
     *   fullscreen mode.
     *   @return current fullscreen state.
     */
    function fullscreen(val?: boolean): boolean

    /**
     *   Sets the pixel density or returns the current 
     *   density. Computer displays are grids of little 
     *   lights called pixels. A display's pixel density 
     *   describes how many pixels it packs into an area. 
     *   Displays with smaller pixels have a higher pixel 
     *   density and create sharper images. 
     * 
     *   pixelDensity() sets the pixel scaling for high 
     *   pixel density displays. By default, the pixel 
     *   density is set to match the display's density. 
     *   Calling pixelDensity(1) turn this off. 
     * 
     *   Calling pixelDensity() without an argument returns 
     *   the current pixel density.
     *   @param [val] desired pixel density.
     */
    function pixelDensity(val?: number): void

    /**
     *   Sets the pixel density or returns the current 
     *   density. Computer displays are grids of little 
     *   lights called pixels. A display's pixel density 
     *   describes how many pixels it packs into an area. 
     *   Displays with smaller pixels have a higher pixel 
     *   density and create sharper images. 
     * 
     *   pixelDensity() sets the pixel scaling for high 
     *   pixel density displays. By default, the pixel 
     *   density is set to match the display's density. 
     *   Calling pixelDensity(1) turn this off. 
     * 
     *   Calling pixelDensity() without an argument returns 
     *   the current pixel density.
     *   @return current pixel density of the sketch.
     */
    function pixelDensity(): number

    /**
     *   Returns the display's current pixel density.
     *   @return current pixel density of the display.
     */
    function displayDensity(): number

    /**
     *   Returns the sketch's current URL as a String.
     *   @return url
     */
    function getURL(): string

    /**
     *   Returns the current URL path as an Array of 
     *   Strings. For example, consider a sketch hosted at 
     *   the URL https://example.com/sketchbook. Calling 
     *   getURLPath() returns ['sketchbook']. For a sketch 
     *   hosted at the URL 
     *   https://example.com/sketchbook/monday, 
     *   getURLPath() returns ['sketchbook', 'monday'].
     *   @return path components.
     */
    function getURLPath(): string[]

    /**
     *   Returns the current URL parameters in an Object. 
     *   For example, calling getURLParams() in a sketch 
     *   hosted at the URL 
     *   https://p5js.org?year=2014&month=May&day=15 
     *   returns { year: 2014, month: 'May', day: 15 }.
     *   @return URL params
     */
    function getURLParams(): object

    /**
     *   Converts 3D world coordinates to 2D screen 
     *   coordinates. This function takes a 3D vector and 
     *   converts its coordinates from the world space to 
     *   screen space. This can be useful for placing 2D 
     *   elements in a 3D scene or for determining the 
     *   screen position of 3D objects.
     *   @param x The x coordinate in world space. (Or a 
     *   vector for all three coordinates.)
     *   @param y The y coordinate in world space.
     *   @param [z] The z coordinate in world space.
     *   @return A vector containing the 2D screen 
     *   coordinates.
     */
    function worldToScreen(x: number|p5.Vector, y: number, z?: number): p5.Vector

    /**
     *   Converts 2D screen coordinates to 3D world 
     *   coordinates. This function takes a vector and 
     *   converts its coordinates from coordinates on the 
     *   screen to coordinates in the currently drawn 
     *   object. This can be useful for determining the 
     *   mouse position relative to a 2D or 3D object. 
     * 
     *   If given, the Z component of the input coordinates 
     *   is treated as "depth", or distance from the 
     *   camera.
     *   @param x The x coordinate in screen space. (Or a 
     *   vector for all three coordinates.)
     *   @param y The y coordinate in screen space.
     *   @param [z] The z coordinate in screen space.
     *   @return A vector containing the 3D world space 
     *   coordinates.
     */
    function screenToWorld(x: number|p5.Vector, y: number, z?: number): p5.Vector

    /**
     *   A Number variable that tracks the number of frames 
     *   drawn since the sketch started. frameCount's value 
     *   is 0 inside setup(). It increments by 1 each time 
     *   the code in draw() finishes executing.
     */

    /**
     *   A Number variable that tracks the number of 
     *   milliseconds it took to draw the last frame. 
     *   deltaTime contains the amount of time it took 
     *   draw() to execute during the previous frame. It's 
     *   useful for simulating physics.
     */

    /**
     *   A Boolean variable that's true if the browser is 
     *   focused and false if not. Note: The browser window 
     *   can only receive input if it's focused.
     */

    /**
     *   A String variable with the WebGL version in use. 
     *   webglVersion's value equals one of the following 
     *   string constants: 
     * 
     *   - WEBGL2 whose value is 'webgl2',
     *   - WEBGL whose value is 'webgl', or
     *   - P2D whose value is 'p2d'. This is the default 
     *   for 2D sketches.
     *   - P2DHDR whose value is 'p2d-hdr' (used for HDR 2D 
     *   sketches, if available).
     * 
     *   See setAttributes() for ways to set the WebGL 
     *   version.
     */

    /**
     *   A Number variable that stores the width of the 
     *   screen display. displayWidth is useful for running 
     *   full-screen programs. Its value depends on the 
     *   current pixelDensity(). 
     * 
     *   Note: The actual screen width can be computed as 
     *   displayWidth * pixelDensity().
     */

    /**
     *   A Number variable that stores the height of the 
     *   screen display. displayHeight is useful for 
     *   running full-screen programs. Its value depends on 
     *   the current pixelDensity(). 
     * 
     *   Note: The actual screen height can be computed as 
     *   displayHeight * pixelDensity().
     */

    /**
     *   A Number variable that stores the width of the 
     *   browser's viewport. The layout viewport is the 
     *   area within the browser that's available for 
     *   drawing.
     */

    /**
     *   A Number variable that stores the height of the 
     *   browser's viewport. The layout viewport is the 
     *   area within the browser that's available for 
     *   drawing.
     */

    /**
     *   A Number variable that stores the width of the 
     *   canvas in pixels. width's default value is 100. 
     *   Calling createCanvas() or resizeCanvas() changes 
     *   the value of width. Calling noCanvas() sets its 
     *   value to 0.
     */

    /**
     *   A Number variable that stores the height of the 
     *   canvas in pixels. height's default value is 100. 
     *   Calling createCanvas() or resizeCanvas() changes 
     *   the value of height. Calling noCanvas() sets its 
     *   value to 0.
     */

    /**
     *   The setMoveThreshold() function is used to set the 
     *   movement threshold for the deviceMoved() function. 
     *   The default threshold is set to 0.5.
     *   @param value The threshold value
     */
    function setMoveThreshold(value: number): void

    /**
     *   The setShakeThreshold() function is used to set 
     *   the movement threshold for the deviceShaken() 
     *   function. The default threshold is set to 30.
     *   @param value The threshold value
     */
    function setShakeThreshold(value: number): void

    /**
     *   The deviceMoved() function is called when the 
     *   device is moved by more than the threshold value 
     *   along X, Y or Z axis. The default threshold is set 
     *   to 0.5. The threshold value can be changed using 
     *   setMoveThreshold().
     */
    function deviceMoved(): void

    /**
     *   The deviceTurned() function is called when the 
     *   device rotates by more than 90 degrees 
     *   continuously. The axis that triggers the 
     *   deviceTurned() method is stored in the turnAxis 
     *   variable. The deviceTurned() method can be locked 
     *   to trigger on any axis: X, Y or Z by comparing the 
     *   turnAxis variable to 'X', 'Y' or 'Z'.
     */
    function deviceTurned(): void

    /**
     *   The deviceShaken() function is called when the 
     *   device total acceleration changes of accelerationX 
     *   and accelerationY values is more than the 
     *   threshold value. The default threshold is set to 
     *   30. The threshold value can be changed using 
     *   setShakeThreshold().
     */
    function deviceShaken(): void

    /**
     *   The system variable deviceOrientation always 
     *   contains the orientation of the device. The value 
     *   of this variable will either be set 'landscape' or 
     *   'portrait'. If no data is available it will be set 
     *   to 'undefined'. either LANDSCAPE or PORTRAIT.
     */

    /**
     *   The system variable accelerationX always contains 
     *   the acceleration of the device along the x axis. 
     *   Value is represented as meters per second squared.
     */

    /**
     *   The system variable accelerationY always contains 
     *   the acceleration of the device along the y axis. 
     *   Value is represented as meters per second squared.
     */

    /**
     *   The system variable accelerationZ always contains 
     *   the acceleration of the device along the z axis. 
     *   Value is represented as meters per second squared.
     */

    /**
     *   The system variable pAccelerationX always contains 
     *   the acceleration of the device along the x axis in 
     *   the frame previous to the current frame. Value is 
     *   represented as meters per second squared.
     */

    /**
     *   The system variable pAccelerationY always contains 
     *   the acceleration of the device along the y axis in 
     *   the frame previous to the current frame. Value is 
     *   represented as meters per second squared.
     */

    /**
     *   The system variable pAccelerationZ always contains 
     *   the acceleration of the device along the z axis in 
     *   the frame previous to the current frame. Value is 
     *   represented as meters per second squared.
     */

    /**
     *   The system variable rotationX always contains the 
     *   rotation of the device along the x axis. If the 
     *   sketch  angleMode() is set to DEGREES, the value 
     *   will be -180 to 180. If it is set to RADIANS, the 
     *   value will be -PI to PI. Note: The order the 
     *   rotations are called is important, ie. if used 
     *   together, it must be called in the order Z-X-Y or 
     *   there might be unexpected behaviour.
     */

    /**
     *   The system variable rotationY always contains the 
     *   rotation of the device along the y axis. If the 
     *   sketch  angleMode() is set to DEGREES, the value 
     *   will be -90 to 90. If it is set to RADIANS, the 
     *   value will be -PI/2 to PI/2. Note: The order the 
     *   rotations are called is important, ie. if used 
     *   together, it must be called in the order Z-X-Y or 
     *   there might be unexpected behaviour.
     */

    /**
     *   The system variable rotationZ always contains the 
     *   rotation of the device along the z axis. If the 
     *   sketch  angleMode() is set to DEGREES, the value 
     *   will be 0 to 360. If it is set to RADIANS, the 
     *   value will be 0 to 2*PI. Unlike rotationX and 
     *   rotationY, this variable is available for devices 
     *   with a built-in compass only. 
     * 
     *   Note: The order the rotations are called is 
     *   important, ie. if used together, it must be called 
     *   in the order Z-X-Y or there might be unexpected 
     *   behaviour.
     */

    /**
     *   The system variable pRotationX always contains the 
     *   rotation of the device along the x axis in the 
     *   frame previous to the current frame. If the sketch  
     *   angleMode() is set to DEGREES, the value will be 
     *   -180 to 180. If it is set to RADIANS, the value 
     *   will be -PI to PI. pRotationX can also be used 
     *   with rotationX to determine the rotate direction 
     *   of the device along the X-axis.
     */

    /**
     *   The system variable pRotationY always contains the 
     *   rotation of the device along the y axis in the 
     *   frame previous to the current frame. If the sketch  
     *   angleMode() is set to DEGREES, the value will be 
     *   -90 to 90. If it is set to RADIANS, the value will 
     *   be -PI/2 to PI/2. pRotationY can also be used with 
     *   rotationY to determine the rotate direction of the 
     *   device along the Y-axis.
     */

    /**
     *   The system variable pRotationZ always contains the 
     *   rotation of the device along the z axis in the 
     *   frame previous to the current frame. If the sketch  
     *   angleMode() is set to DEGREES, the value will be 0 
     *   to 360. If it is set to RADIANS, the value will be 
     *   0 to 2*PI. pRotationZ can also be used with 
     *   rotationZ to determine the rotate direction of the 
     *   device along the Z-axis.
     */

    /**
     *   When a device is rotated, the axis that triggers 
     *   the deviceTurned() method is stored in the 
     *   turnAxis variable. The turnAxis variable is only 
     *   defined within the scope of deviceTurned().
     */

    /**
     *   A function that's called once when any key is 
     *   pressed. Declaring the function keyPressed() sets 
     *   a code block to run once automatically when the 
     *   user presses any key: 
     * 
     *   function keyPressed() { // Code to run. }
     * 
     *   The key and keyCode variables will be updated with 
     *   the most recently typed value when keyPressed() is 
     *   called by p5.js: 
     * 
     *   function keyPressed() { if (key === 'c') { // Code 
     *   to run. } if (keyCode === 13) { // Enter key // 
     *   Code to run. } }
     * 
     *   The parameter, event, is optional. keyPressed() is 
     *   always passed a KeyboardEvent object with 
     *   properties that describe the key press event: 
     * 
     *   function keyPressed(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   Browsers may have default behaviors attached to 
     *   various key events. For example, some browsers may 
     *   jump to the bottom of a web page when the SPACE 
     *   key is pressed. To prevent any default behavior 
     *   for this event, add return false; to the end of 
     *   the function.
     *   @param [event] optional KeyboardEvent callback 
     *   argument.
     */
    function keyPressed(event?: KeyboardEvent): void

    /**
     *   A function that's called once when any key is 
     *   released. Declaring the function keyReleased() 
     *   sets a code block to run once automatically when 
     *   the user releases any key: 
     * 
     *   function keyReleased() { // Code to run. }
     * 
     *   The key and keyCode variables will be updated with 
     *   the most recently released value when 
     *   keyReleased() is called by p5.js: 
     * 
     *   function keyReleased() { if (key === 'c') { // 
     *   Code to run. } if (keyCode === 13) { // Enter key 
     *   // Code to run. } }
     * 
     *   The parameter, event, is optional. keyReleased() 
     *   is always passed a KeyboardEvent object with 
     *   properties that describe the key press event: 
     * 
     *   function keyReleased(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   Browsers may have default behaviors attached to 
     *   various key events. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function.
     *   @param [event] optional KeyboardEvent callback 
     *   argument.
     */
    function keyReleased(event?: KeyboardEvent): void

    /**
     *   A function that's called once when keys with 
     *   printable characters are pressed. Declaring the 
     *   function keyTyped() sets a code block to run once 
     *   automatically when the user presses any key with a 
     *   printable character such as a or 1. Modifier keys 
     *   such as SHIFT, CONTROL, and the arrow keys will be 
     *   ignored: 
     * 
     *   function keyTyped() { // Code to run. }
     * 
     *   The key and keyCode variables will be updated with 
     *   the most recently released value when keyTyped() 
     *   is called by p5.js: 
     * 
     *   function keyTyped() { // Check for the "c" 
     *   character using key. if (key === 'c') { // Code to 
     *   run. } // Check for "c" using keyCode. if (keyCode 
     *   === 67) { // 67 is the ASCII code for 'c' // Code 
     *   to run. } }
     * 
     *   The parameter, event, is optional. keyTyped() is 
     *   always passed a KeyboardEvent object with 
     *   properties that describe the key press event: 
     * 
     *   function keyReleased(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   Note: Use the keyPressed() function and keyCode 
     *   system variable to respond to modifier keys such 
     *   as ALT. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various key events. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function.
     *   @param [event] optional KeyboardEvent callback 
     *   argument.
     */
    function keyTyped(event?: KeyboardEvent): void

    /**
     *   Returns true if the key it’s checking is pressed 
     *   and false if not. keyIsDown() is helpful when 
     *   checking for multiple different key presses. For 
     *   example, keyIsDown() can be used to check if both 
     *   LEFT_ARROW and UP_ARROW are pressed: 
     * 
     *   if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW)) 
     *   { // Move diagonally. }
     * 
     *   keyIsDown() can check for key presses using 
     *   strings based on KeyboardEvent.key or 
     *   KeyboardEvent.code values, such as keyIsDown('x') 
     *   or keyIsDown('ArrowLeft'). 
     * 
     *   Note: In p5.js 2.0 and newer, numeric keycodes 
     *   (such as 88 for 'X') are no longer supported. This 
     *   is a breaking change from previous versions. 
     * 
     *   You can still use the p5 constants like LEFT_ARROW 
     *   which now map to string values internally rather 
     *   than numeric codes.
     *   @param code key to check.
     *   @return whether the key is down or not.
     */
    function keyIsDown(code: number|string): boolean

    /**
     *   A Boolean system variable that's true if any key 
     *   is currently pressed and false if not.
     */

    /**
     *   A String system variable that contains the value 
     *   of the last key typed. The key variable is helpful 
     *   for checking whether an ASCII key has been typed. 
     *   For example, the expression key === "a" evaluates 
     *   to true if the a key was typed and false if not. 
     *   key doesn’t update for special keys such as 
     *   LEFT_ARROW and ENTER. Use keyCode instead for 
     *   special keys. The keyIsDown() function should be 
     *   used to check for multiple different key presses 
     *   at the same time.
     */

    /**
     *   The code property represents a physical key on the 
     *   keyboard (as opposed to the character generated by 
     *   pressing the key). In other words, this property 
     *   returns a value that isn't altered by keyboard 
     *   layout or the state of the modifier keys. This 
     *   property is useful when you want to handle keys 
     *   based on their physical positions on the input 
     *   device rather than the characters associated with 
     *   those keys; 
     * 
     *   Unlike key, the code property differentiates 
     *   between physical keys that generate the same 
     *   character—for example, CtrlLeft and CtrlRight—so 
     *   each can be handled independently. Here's the MDN 
     *   docs for KeyboardEvent.code 
     * 
     *   Pressing the key physically labeled “A” always 
     *   yields KeyA, regardless of the current keyboard 
     *   layout (QWERTY, Dvorak, AZERTY, etc.) or the 
     *   character that appears in a text field. 
     * 
     *   The code property returns a plain string (e.g., 
     *   'ArrowRight'). You can compare it directly with 
     *   string literals: 
     * 
     *   if (keyIsDown(RIGHT_ARROW)) { // … } // The line 
     *   above is equivalent to: if (code === 'ArrowRight') 
     *   { // … } if (key === 'ArrowRight') { // … }
     * 
     *   The system variables BACKSPACE, DELETE, ENTER, 
     *   RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, 
     *   UP_ARROW, DOWN_ARROW, LEFT_ARROW, and RIGHT_ARROW 
     *   are all helpful shorthands the key codes of 
     *   special keys. These are simply shorthands for the 
     *   same string values: 
     * 
     *   if (code === RIGHT_ARROW) { // .. }
     * 
     *   The table below summarizes how the main 
     *   keyboard-related system variables changed between 
     *   p5.js 1.x and 2.x.    Variable p5.js 1.x  p5.js 
     *   2.x      key Text string (e.g., "ArrowUp"). Text 
     *   string (e.g., "ArrowUp", "f" or "F").   code Not 
     *   supported. Text String (e.g., "ArrowUp", "KeyF").   
     *   keyCode Number (e.g., 70). Number (unchanged; 
     *   e.g., 70).   System variables (BACKSPACE, 
     *   UP_ARROW, …) Number Text String (e.g., "ArrowUp").
     */

    /**
     *   A Number system variable that contains the code of 
     *   the last key pressed. Every key has a numeric key 
     *   code. For example, the letter a key has the key 
     *   code 65. Use this key code to determine which key 
     *   was pressed by comparing it to the numeric value 
     *   of the desired key. 
     * 
     *   For example, to detect when the Enter key is 
     *   pressed: 
     * 
     *   if (keyCode === 13) { // Enter key // Code to run 
     *   if the Enter key was pressed. }
     * 
     *   Alternatively, you can use the key function to 
     *   directly compare the key value: 
     * 
     *   if (key === 'Enter') { // Enter key // Code to run 
     *   if the Enter key was pressed. }
     * 
     *   Use the following numeric codes for the arrow 
     *   keys: 
     * 
     *   Up Arrow: 38 Down Arrow: 40 Left Arrow: 37 Right 
     *   Arrow: 39 
     * 
     *   More key codes can be found at websites such as 
     *   keycode.info.
     */

    /**
     *   A function that's called when the mouse moves. 
     *   Declaring the function mouseMoved() sets a code 
     *   block to run automatically when the user moves the 
     *   mouse without clicking any mouse buttons: 
     * 
     *   function mouseMoved() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when mouseMoved() is called by p5.js: 
     * 
     *   function mouseMoved() { if (mouseX < 50) { // Code 
     *   to run if the mouse is on the left. } if (mouseY > 
     *   50) { // Code to run if the mouse is near the 
     *   bottom. } }
     * 
     *   The parameter, event, is optional. mouseMoved() is 
     *   always passed a MouseEvent object with properties 
     *   that describe the mouse move event: 
     * 
     *   function mouseMoved(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function.
     *   @param [event] optional MouseEvent argument.
     */
    function mouseMoved(event?: MouseEvent): void

    /**
     *   A function that's called when the mouse moves 
     *   while a button is pressed. Declaring the function 
     *   mouseDragged() sets a code block to run 
     *   automatically when the user clicks and drags the 
     *   mouse: 
     * 
     *   function mouseDragged() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when mouseDragged() is called by p5.js: 
     * 
     *   function mouseDragged() { if (mouseX < 50) { // 
     *   Code to run if the mouse is on the left. } if 
     *   (mouseY > 50) { // Code to run if the mouse is 
     *   near the bottom. } }
     * 
     *   The parameter, event, is optional. mouseDragged() 
     *   is always passed a MouseEvent object with 
     *   properties that describe the mouse drag event: 
     * 
     *   function mouseDragged(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   On touchscreen devices, mouseDragged() will run 
     *   when a user moves a touch point. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function.
     *   @param [event] optional MouseEvent argument.
     */
    function mouseDragged(event?: MouseEvent): void

    /**
     *   A function that's called once when a mouse button 
     *   is pressed. Declaring the function mousePressed() 
     *   sets a code block to run automatically when the 
     *   user presses a mouse button: 
     * 
     *   function mousePressed() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when mousePressed() is called by p5.js: 
     * 
     *   function mousePressed() { if (mouseX < 50) { // 
     *   Code to run if the mouse is on the left. } if 
     *   (mouseY > 50) { // Code to run if the mouse is 
     *   near the bottom. } }
     * 
     *   The parameter, event, is optional. mousePressed() 
     *   is always passed a MouseEvent object with 
     *   properties that describe the mouse press event: 
     * 
     *   function mousePressed(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   On touchscreen devices, mousePressed() will run 
     *   when a user’s touch begins. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function. 
     * 
     *   Note: mousePressed(), mouseReleased(), and 
     *   mouseClicked() are all related. mousePressed() 
     *   runs as soon as the user clicks the mouse. 
     *   mouseReleased() runs as soon as the user releases 
     *   the mouse click. mouseClicked() runs immediately 
     *   after mouseReleased().
     *   @param [event] optional MouseEvent argument.
     */
    function mousePressed(event?: MouseEvent): void

    /**
     *   A function that's called once when a mouse button 
     *   is released. Declaring the function 
     *   mouseReleased() sets a code block to run 
     *   automatically when the user releases a mouse 
     *   button after having pressed it: 
     * 
     *   function mouseReleased() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when mouseReleased() is called by p5.js: 
     * 
     *   function mouseReleased() { if (mouseX < 50) { // 
     *   Code to run if the mouse is on the left. } if 
     *   (mouseY > 50) { // Code to run if the mouse is 
     *   near the bottom. } }
     * 
     *   The parameter, event, is optional. mouseReleased() 
     *   is always passed a MouseEvent object with 
     *   properties that describe the mouse release event: 
     * 
     *   function mouseReleased(event) { // Code to run 
     *   that uses the event. console.log(event); }
     * 
     *   On touchscreen devices, mouseReleased() will run 
     *   when a user’s touch ends. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function. 
     * 
     *   Note: mousePressed(), mouseReleased(), and 
     *   mouseClicked() are all related. mousePressed() 
     *   runs as soon as the user clicks the mouse. 
     *   mouseReleased() runs as soon as the user releases 
     *   the mouse click. mouseClicked() runs immediately 
     *   after mouseReleased().
     *   @param [event] optional MouseEvent argument.
     */
    function mouseReleased(event?: MouseEvent): void

    /**
     *   A function that's called once after a mouse button 
     *   is pressed and released. Declaring the function 
     *   mouseClicked() sets a code block to run 
     *   automatically when the user releases a mouse 
     *   button after having pressed it: 
     * 
     *   function mouseClicked() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when mouseClicked() is called by p5.js: 
     * 
     *   function mouseClicked() { if (mouseX < 50) { // 
     *   Code to run if the mouse is on the left. } if 
     *   (mouseY > 50) { // Code to run if the mouse is 
     *   near the bottom. } }
     * 
     *   The parameter, event, is optional. mouseClicked() 
     *   is always passed a MouseEvent object with 
     *   properties that describe the mouse click event: 
     * 
     *   function mouseClicked(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   On touchscreen devices, mouseClicked() will run 
     *   when a user’s touch ends. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function. 
     * 
     *   Note: mousePressed(), mouseReleased(), and 
     *   mouseClicked() are all related. mousePressed() 
     *   runs as soon as the user clicks the mouse. 
     *   mouseReleased() runs as soon as the user releases 
     *   the mouse click. mouseClicked() runs immediately 
     *   after mouseReleased().
     *   @param [event] optional MouseEvent argument.
     */
    function mouseClicked(event?: MouseEvent): void

    /**
     *   A function that's called once when a mouse button 
     *   is clicked twice quickly. Declaring the function 
     *   doubleClicked() sets a code block to run 
     *   automatically when the user presses and releases 
     *   the mouse button twice quickly: 
     * 
     *   function doubleClicked() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when doubleClicked() is called by p5.js: 
     * 
     *   function doubleClicked() { if (mouseX < 50) { // 
     *   Code to run if the mouse is on the left. } if 
     *   (mouseY > 50) { // Code to run if the mouse is 
     *   near the bottom. } }
     * 
     *   The parameter, event, is optional. doubleClicked() 
     *   is always passed a MouseEvent object with 
     *   properties that describe the double-click event: 
     * 
     *   function doubleClicked(event) { // Code to run 
     *   that uses the event. console.log(event); }
     * 
     *   On touchscreen devices, code placed in 
     *   doubleClicked() will run after two touches that 
     *   occur within a short time. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function.
     *   @param [event] optional MouseEvent argument.
     */
    function doubleClicked(event?: MouseEvent): void

    /**
     *   A function that's called once when the mouse wheel 
     *   moves. Declaring the function mouseWheel() sets a 
     *   code block to run automatically when the user 
     *   scrolls with the mouse wheel: 
     * 
     *   function mouseWheel() { // Code to run. }
     * 
     *   The mouse system variables, such as mouseX and 
     *   mouseY, will be updated with their most recent 
     *   value when mouseWheel() is called by p5.js: 
     * 
     *   function mouseWheel() { if (mouseX < 50) { // Code 
     *   to run if the mouse is on the left. } if (mouseY > 
     *   50) { // Code to run if the mouse is near the 
     *   bottom. } }
     * 
     *   The parameter, event, is optional. mouseWheel() is 
     *   always passed a MouseEvent object with properties 
     *   that describe the mouse scroll event: 
     * 
     *   function mouseWheel(event) { // Code to run that 
     *   uses the event. console.log(event); }
     * 
     *   The event object has many properties including 
     *   delta, a Number containing the distance that the 
     *   user scrolled. For example, event.delta might have 
     *   the value 5 when the user scrolls up. event.delta 
     *   is positive if the user scrolls up and negative if 
     *   they scroll down. The signs are opposite on macOS 
     *   with "natural" scrolling enabled. 
     * 
     *   Browsers may have default behaviors attached to 
     *   various mouse events. For example, some browsers 
     *   highlight text when the user moves the mouse while 
     *   pressing a mouse button. To prevent any default 
     *   behavior for this event, add return false; to the 
     *   end of the function. 
     * 
     *   Note: On Safari, mouseWheel() may only work as 
     *   expected if return false; is added at the end of 
     *   the function.
     *   @param [event] optional WheelEvent argument.
     */
    function mouseWheel(event?: WheelEvent): void

    /**
     *   Locks the mouse pointer to its current position 
     *   and makes it invisible. requestPointerLock() 
     *   allows the mouse to move forever without leaving 
     *   the screen. Calling requestPointerLock() locks the 
     *   values of mouseX, mouseY, pmouseX, and pmouseY. 
     *   movedX and movedY continue updating and can be 
     *   used to get the distance the mouse moved since the 
     *   last frame was drawn. Calling exitPointerLock() 
     *   resumes updating the mouse system variables. 
     * 
     *   Note: Most browsers require an input, such as a 
     *   click, before calling requestPointerLock(). It’s 
     *   recommended to call requestPointerLock() in an 
     *   event function such as doubleClicked().
     */
    function requestPointerLock(): void

    /**
     *   Exits a pointer lock started with 
     *   requestPointerLock. Calling requestPointerLock() 
     *   locks the values of mouseX, mouseY, pmouseX, and 
     *   pmouseY. Calling exitPointerLock() resumes 
     *   updating the mouse system variables. 
     * 
     *   Note: Most browsers require an input, such as a 
     *   click, before calling requestPointerLock(). It’s 
     *   recommended to call requestPointerLock() in an 
     *   event function such as doubleClicked().
     */
    function exitPointerLock(): void

    /**
     *   A Number system variable that tracks the mouse's 
     *   horizontal movement. movedX tracks how many pixels 
     *   the mouse moves left or right between frames. 
     *   movedX will have a negative value if the mouse 
     *   moves left between frames and a positive value if 
     *   it moves right. movedX can be calculated as mouseX 
     *   - pmouseX. 
     * 
     *   Note: movedX continues updating even when 
     *   requestPointerLock() is active.
     */

    /**
     *   A Number system variable that tracks the mouse's 
     *   vertical movement. movedY tracks how many pixels 
     *   the mouse moves up or down between frames. movedY 
     *   will have a negative value if the mouse moves up 
     *   between frames and a positive value if it moves 
     *   down. movedY can be calculated as mouseY - 
     *   pmouseY. 
     * 
     *   Note: movedY continues updating even when 
     *   requestPointerLock() is active.
     */

    /**
     *   A Number system variable that tracks the mouse's 
     *   horizontal position. mouseX keeps track of the 
     *   mouse's position relative to the top-left corner 
     *   of the canvas. For example, if the mouse is 50 
     *   pixels from the left edge of the canvas, then 
     *   mouseX will be 50. 
     * 
     *   If touch is used instead of the mouse, then mouseX 
     *   will hold the x-coordinate of the most recent 
     *   touch point.
     */

    /**
     *   A Number system variable that tracks the mouse's 
     *   vertical position. mouseY keeps track of the 
     *   mouse's position relative to the top-left corner 
     *   of the canvas. For example, if the mouse is 50 
     *   pixels from the top edge of the canvas, then 
     *   mouseY will be 50. 
     * 
     *   If touch is used instead of the mouse, then mouseY 
     *   will hold the y-coordinate of the most recent 
     *   touch point.
     */

    /**
     *   A Number system variable that tracks the mouse's 
     *   previous horizontal position. pmouseX keeps track 
     *   of the mouse's position relative to the top-left 
     *   corner of the canvas. Its value is mouseX from the 
     *   previous frame. For example, if the mouse was 50 
     *   pixels from the left edge of the canvas during the 
     *   last frame, then pmouseX will be 50. 
     * 
     *   If touch is used instead of the mouse, then 
     *   pmouseX will hold the x-coordinate of the last 
     *   touch point. 
     * 
     *   Note: pmouseX is reset to the current mouseX value 
     *   at the start of each touch event.
     */

    /**
     *   A Number system variable that tracks the mouse's 
     *   previous vertical position. pmouseY keeps track of 
     *   the mouse's position relative to the top-left 
     *   corner of the canvas. Its value is mouseY from the 
     *   previous frame. For example, if the mouse was 50 
     *   pixels from the top edge of the canvas during the 
     *   last frame, then pmouseY will be 50. 
     * 
     *   If touch is used instead of the mouse, then 
     *   pmouseY will hold the y-coordinate of the last 
     *   touch point. 
     * 
     *   Note: pmouseY is reset to the current mouseY value 
     *   at the start of each touch event.
     */

    /**
     *   A Number variable that tracks the mouse's 
     *   horizontal position within the browser. winMouseX 
     *   keeps track of the mouse's position relative to 
     *   the top-left corner of the browser window. For 
     *   example, if the mouse is 50 pixels from the left 
     *   edge of the browser, then winMouseX will be 50. 
     * 
     *   On a touchscreen device, winMouseX will hold the 
     *   x-coordinate of the most recent touch point. 
     * 
     *   Note: Use mouseX to track the mouse’s x-coordinate 
     *   within the canvas.
     */

    /**
     *   A Number variable that tracks the mouse's vertical 
     *   position within the browser. winMouseY keeps track 
     *   of the mouse's position relative to the top-left 
     *   corner of the browser window. For example, if the 
     *   mouse is 50 pixels from the top edge of the 
     *   browser, then winMouseY will be 50. 
     * 
     *   On a touchscreen device, winMouseY will hold the 
     *   y-coordinate of the most recent touch point. 
     * 
     *   Note: Use mouseY to track the mouse’s y-coordinate 
     *   within the canvas.
     */

    /**
     *   A Number variable that tracks the mouse's previous 
     *   horizontal position within the browser. pwinMouseX 
     *   keeps track of the mouse's position relative to 
     *   the top-left corner of the browser window. Its 
     *   value is winMouseX from the previous frame. For 
     *   example, if the mouse was 50 pixels from the left 
     *   edge of the browser during the last frame, then 
     *   pwinMouseX will be 50. 
     * 
     *   On a touchscreen device, pwinMouseX will hold the 
     *   x-coordinate of the most recent touch point. 
     *   pwinMouseX is reset to the current winMouseX value 
     *   at the start of each touch event. 
     * 
     *   Note: Use pmouseX to track the mouse’s previous 
     *   x-coordinate within the canvas.
     */

    /**
     *   A Number variable that tracks the mouse's previous 
     *   vertical position within the browser. pwinMouseY 
     *   keeps track of the mouse's position relative to 
     *   the top-left corner of the browser window. Its 
     *   value is winMouseY from the previous frame. For 
     *   example, if the mouse was 50 pixels from the top 
     *   edge of the browser during the last frame, then 
     *   pwinMouseY will be 50. 
     * 
     *   On a touchscreen device, pwinMouseY will hold the 
     *   y-coordinate of the most recent touch point. 
     *   pwinMouseY is reset to the current winMouseY value 
     *   at the start of each touch event. 
     * 
     *   Note: Use pmouseY to track the mouse’s previous 
     *   y-coordinate within the canvas.
     */

    /**
     *   An object that tracks the current state of mouse 
     *   buttons, showing which buttons are pressed at any 
     *   given moment. The mouseButton object has three 
     *   properties: 
     * 
     *   - left: A boolean indicating whether the left 
     *   mouse button is pressed.
     *   - right: A boolean indicating whether the right 
     *   mouse button is pressed.
     *   - center: A boolean indicating whether the middle 
     *   mouse button (scroll wheel button) is pressed.
     * 
     *   Note: Different browsers may track mouseButton 
     *   differently. See MDN for more information.
     */

    /**
     *   An Array of all the current touch points on a 
     *   touchscreen device. The touches array is empty by 
     *   default. When the user touches their screen, a new 
     *   touch point is tracked and added to the array. 
     *   Touch points are Objects with the following 
     *   properties: 
     * 
     *   // Iterate over the touches array. for (let touch 
     *   of touches) { // x-coordinate relative to the 
     *   top-left // corner of the canvas. 
     *   console.log(touch.x); // y-coordinate relative to 
     *   the top-left // corner of the canvas. 
     *   console.log(touch.y); // x-coordinate relative to 
     *   the top-left // corner of the browser. 
     *   console.log(touch.winX); // y-coordinate relative 
     *   to the top-left // corner of the browser. 
     *   console.log(touch.winY); // ID number 
     *   console.log(touch.id); }
     */

    /**
     *   A Boolean system variable that's true if the mouse 
     *   is pressed and false if not.
     */

    /**
     *   Declares a new variable. A variable is a container 
     *   for a value. For example, a variable might contain 
     *   a creature's x-coordinate as a Number or its name 
     *   as a String. Variables can change value by 
     *   reassigning them as follows: 
     * 
     *   // Declare the variable x and assign it the value 
     *   10. let x = 10; // Reassign x to 50. x = 50;
     * 
     *   Variables have block scope. When a variable is 
     *   declared between curly braces {}, it only exists 
     *   within the block defined by those braces. For 
     *   example, the following code would throw a 
     *   ReferenceError because x is declared within the 
     *   setup() function's block: 
     * 
     *   function setup() { createCanvas(100, 100); let x = 
     *   50; } function draw() { background(200); // x was 
     *   declared in setup(), so it can't be referenced 
     *   here. circle(x, 50, 20); }
     * 
     *   Variables declared outside of all curly braces {} 
     *   are in the global scope. A variable that's in the 
     *   global scope can be used and changed anywhere in a 
     *   sketch: 
     * 
     *   let x = 50; function setup() { createCanvas(100, 
     *   100); } function draw() { background(200); // 
     *   Change the value of x. x += 10; circle(x, 50, 20); 
     *   }
     */

    /**
     *   A way to choose whether to run a block of code. if 
     *   statements are helpful for running a block of code 
     *   based on a condition. For example, an if statement 
     *   makes it easy to express the idea "Draw a circle 
     *   if the mouse is pressed.": 
     * 
     *   if (mouseIsPressed === true) { circle(mouseX, 
     *   mouseY, 20); }
     * 
     *   The statement header begins with the keyword if. 
     *   The expression in parentheses mouseIsPressed === 
     *   true is a Boolean expression that's either true or 
     *   false. The code between the curly braces {} is the 
     *   if statement's body. The body only runs if the 
     *   Boolean expression is true. 
     * 
     *   The mouseIsPressed system variable is always true 
     *   or false, so the code snippet above could also be 
     *   written as follows: 
     * 
     *   if (mouseIsPressed) { circle(mouseX, mouseY, 20); 
     *   }
     * 
     *   An if-else statement adds a block of code that 
     *   runs if the Boolean expression is false. For 
     *   example, here's an if-else statement that 
     *   expresses the idea "Draw a circle if the mouse is 
     *   pressed. Otherwise, display a message.": 
     * 
     *   if (mouseIsPressed === true) { // When true. 
     *   circle(mouseX, mouseY, 20); } else { // When 
     *   false. text('Click me!', 50, 50); }
     * 
     *   There are two possible paths, or branches, in this 
     *   code snippet. The program must follow one branch 
     *   or the other. 
     * 
     *   An else-if statement makes it possible to add more 
     *   branches. else-if statements run different blocks 
     *   of code under different conditions. For example, 
     *   an else-if statement makes it easy to express the 
     *   idea "If the mouse is on the left, paint the 
     *   canvas white. If the mouse is in the middle, paint 
     *   the canvas gray. Otherwise, paint the canvas 
     *   black.": 
     * 
     *   if (mouseX < 33) { background(255); } else if 
     *   (mouseX < 67) { background(200); } else { 
     *   background(0); }
     * 
     *   if statements can add as many else-if statements 
     *   as needed. However, there can only be one else 
     *   statement and it must be last. 
     * 
     *   if statements can also check for multiple 
     *   conditions at once. For example, the Boolean 
     *   operator && (AND) checks whether two expressions 
     *   are both true: 
     * 
     *   if (keyIsPressed === true && key === 'p') { 
     *   text('You pressed the "p" key!', 50, 50); }
     * 
     *   If the user is pressing a key AND that key is 'p', 
     *   then a message will display. 
     * 
     *   The Boolean operator || (OR) checks whether at 
     *   least one of two expressions is true: 
     * 
     *   if (keyIsPressed === true || mouseIsPressed === 
     *   true) { text('You did something!', 50, 50); }
     * 
     *   If the user presses a key, or presses a mouse 
     *   button, or both, then a message will display. 
     * 
     *   The body of an if statement can contain another if 
     *   statement. This is called a "nested if statement." 
     *   For example, nested if statements make it easy to 
     *   express the idea "If a key is pressed, then check 
     *   if the key is 'r'. If it is, then set the fill to 
     *   red.": 
     * 
     *   if (keyIsPressed === true) { if (key === 'r') { 
     *   fill('red'); } }
     * 
     *   See Boolean and Number to learn more about these 
     *   data types and the operations they support.
     */

    /**
     *   A named group of statements. Functions help with 
     *   organizing and reusing code. For example, 
     *   functions make it easy to express the idea "Draw a 
     *   flower.": 
     * 
     *   function drawFlower() { // Style the text. 
     *   textAlign(CENTER, CENTER); textSize(20); // Draw a 
     *   flower emoji. text('🌸', 50, 50); }
     * 
     *   The function header begins with the keyword 
     *   function. The function's name, drawFlower, is 
     *   followed by parentheses () and curly braces {}. 
     *   The code between the curly braces is called the 
     *   function's body. The function's body runs when the 
     *   function is called like so: 
     * 
     *   drawFlower();
     * 
     *   Functions can accept inputs by adding parameters 
     *   to their headers. Parameters are placeholders for 
     *   values that will be provided when the function is 
     *   called. For example, the drawFlower() function 
     *   could include a parameter for the flower's size: 
     * 
     *   function drawFlower(size) { // Style the text. 
     *   textAlign(CENTER, CENTER); // Use the size 
     *   parameter. textSize(size); // Draw a flower emoji. 
     *   text('🌸', 50, 50); }
     * 
     *   Parameters are part of the function's declaration. 
     *   Arguments are provided by the code that calls a 
     *   function. When a function is called, arguments are 
     *   assigned to parameters: 
     * 
     *   // The argument 20 is assigned to the parameter 
     *   size. drawFlower(20);
     * 
     *   Functions can have multiple parameters separated 
     *   by commas. Parameters can have any type. For 
     *   example, the drawFlower() function could accept 
     *   Number parameters for the flower's x- and 
     *   y-coordinates along with its size: 
     * 
     *   function drawFlower(x, y, size) { // Style the 
     *   text. textAlign(CENTER, CENTER); // Use the size 
     *   parameter. textSize(size); // Draw a flower emoji. 
     *   // Use the x and y parameters. text('🌸', x, y); }
     * 
     *   Functions can also produce outputs by adding a 
     *   return statement: 
     * 
     *   function double(x) { let answer = 2 * x; return 
     *   answer; }
     * 
     *   The expression following return can produce an 
     *   output that's used elsewhere. For example, the 
     *   output of the double() function can be assigned to 
     *   a variable: 
     * 
     *   let six = double(3); text(`3 x 2 = ${six}`, 50, 
     *   50);
     */

    /**
     *   A value that's either true or false. Boolean 
     *   values help to make decisions in code. They appear 
     *   any time a logical condition is checked. For 
     *   example, the condition "Is a mouse button being 
     *   pressed?" must be either true or false: 
     * 
     *   // If the user presses the mouse, draw a circle at 
     *   // the mouse's location. if (mouseIsPressed === 
     *   true) { circle(mouseX, mouseY, 20); }
     * 
     *   The if statement checks whether mouseIsPressed is 
     *   true and draws a circle if it is. Boolean 
     *   expressions such as mouseIsPressed === true 
     *   evaluate to one of the two possible Boolean 
     *   values: true or false. 
     * 
     *   The === operator (EQUAL) checks whether two values 
     *   are equal. If they are, the expression evaluates 
     *   to true. Otherwise, it evaluates to false. 
     * 
     *   Note: There's also a == operator with two = 
     *   instead of three. Don't use it. 
     * 
     *   The mouseIsPressed system variable is always true 
     *   or false, so the code snippet above could also be 
     *   written as follows: 
     * 
     *   if (mouseIsPressed) { circle(mouseX, mouseY, 20); 
     *   }
     * 
     *   The !== operator (NOT EQUAL) checks whether two 
     *   values are not equal, as in the following example: 
     * 
     *   if (2 + 2 !== 4) { text('War is peace.', 50, 50); 
     *   }
     * 
     *   Starting from the left, the arithmetic expression 
     *   2 + 2 produces the value 4. The Boolean expression 
     *   4 !== 4 evaluates to false because 4 is equal to 
     *   itself. As a result, the if statement's body is 
     *   skipped. 
     * 
     *   Note: There's also a != operator with one = 
     *   instead of two. Don't use it. 
     * 
     *   The Boolean operator && (AND) checks whether two 
     *   expressions are both true: 
     * 
     *   if (keyIsPressed === true && key === 'p') { 
     *   text('You pressed the "p" key!', 50, 50); }
     * 
     *   If the user is pressing a key AND that key is 'p', 
     *   then a message will display. 
     * 
     *   The Boolean operator || (OR) checks whether at 
     *   least one of two expressions is true: 
     * 
     *   if (keyIsPressed === true || mouseIsPressed === 
     *   true) { text('You did something!', 50, 50); }
     * 
     *   If the user presses a key, or presses a mouse 
     *   button, or both, then a message will display. 
     * 
     *   The following truth table summarizes a few common 
     *   scenarios with && and ||: 
     * 
     *   true && true // true true && false // false false 
     *   && false // false true || true // true true || 
     *   false // true false || false // false
     * 
     *   The relational operators >, <, >=, and <= also 
     *   produce Boolean values: 
     * 
     *   2 > 1 // true 2 < 1 // false 2 >= 2 // true 2 <= 2 
     *   // true
     * 
     *   See if for more information about if statements 
     *   and Number for more information about Numbers.
     */

    /**
     *   A sequence of text characters. The String data 
     *   type is helpful for working with text. For 
     *   example, a string could contain a welcome message: 
     * 
     *   // Use a string literal. text('Hello!', 10, 10);
     * 
     *   // Create a string variable. let message = 
     *   'Hello!'; // Use the string variable. 
     *   text(message, 10, 10);
     * 
     *   The most common way to create strings is to use 
     *   some form of quotations as follows: 
     * 
     *   text("hi", 50, 50);
     * 
     *   text('hi', 50, 50);
     * 
     *   text(`hi`, 50, 50);
     * 
     *   "hi", 'hi', and hi are all string literals. A 
     *   "literal" means a value was actually written, as 
     *   in text('hi', 50, 50). By contrast, text(message, 
     *   50, 50) uses the variable message, so it isn't a 
     *   string literal. 
     * 
     *   Single quotes '' and double quotes "" mean the 
     *   same thing. It's nice to have the option for cases 
     *   when a string contains one type of quote: 
     * 
     *   text("What's up?", 50, 50);
     * 
     *   text('Air quotes make you look "cool."', 50, 50);
     * 
     *   Backticks `` create template literals. Template 
     *   literals have many uses. For example, they can 
     *   contain both single and double quotes as needed: 
     * 
     *   text(`"Don't you forget about me"`, 10, 10);
     * 
     *   Template literals are helpful when strings are 
     *   created from variables like so: 
     * 
     *   let size = random(10, 20); circle(50, 50, size); 
     *   text(`The circle's diameter is ${size} pixels.`, 
     *   10, 10);
     * 
     *   The size variable's value will replace ${size} 
     *   when the string is created. ${} is a placeholder 
     *   for any value. That means an expression can be 
     *   used, as in ${round(PI, 3)}. All of the following 
     *   are valid template literals: 
     * 
     *   text(`π is about ${round(PI, 2)} pixels.`, 10, 
     *   10); text(`It's ${mouseX < width / 2} that I'm on 
     *   the left half of the canvas.`, 10, 30);
     * 
     *   Template literals can include several variables: 
     * 
     *   let x = random(0, 100); let y = random(0, 100); 
     *   let size = random(10, 20); circle(x, y, size); 
     *   text(`The circle at (${x}, ${y}) has a diameter of 
     *   ${size} pixels.`, 10, 10);
     * 
     *   Template literals are also helpful for creating 
     *   multi-line text like so: 
     * 
     *   let poem = `My sketch doesn't run; it waits for me 
     *   patiently while bugs point the way.`; text(poem, 
     *   10, 10);
     */

    /**
     *   A number that can be positive, negative, or zero. 
     *   The Number data type is useful for describing 
     *   values such as position, size, and color. A number 
     *   can be an integer such as 20 or a decimal number 
     *   such as 12.34. For example, a circle's position 
     *   and size can be described by three numbers: 
     * 
     *   circle(50, 50, 20);
     * 
     *   circle(50, 50, 12.34);
     * 
     *   Numbers support basic arithmetic and follow the 
     *   standard order of operations: Parentheses, 
     *   Exponents, Multiplication, Division, Addition, and 
     *   Subtraction (PEMDAS). For example, it's common to 
     *   use arithmetic operators with p5.js' system 
     *   variables that are numbers: 
     * 
     *   // Draw a circle at the center. circle(width / 2, 
     *   height / 2, 20);
     * 
     *   // Draw a circle that moves from left to right. 
     *   circle(frameCount * 0.01, 50, 20);
     * 
     *   Here's a quick overview of the arithmetic 
     *   operators: 
     * 
     *   1 + 2 // Add 1 - 2 // Subtract 1 * 2 // Multiply 1 
     *   / 2 // Divide 1 % 2 // Remainder 1 ** 2 // 
     *   Exponentiate
     * 
     *   It's common to update a number variable using 
     *   arithmetic. For example, an object's location can 
     *   be updated like so: 
     * 
     *   x = x + 1;
     * 
     *   The statement above adds 1 to a variable x using 
     *   the + operator. The addition assignment operator 
     *   += expresses the same idea: 
     * 
     *   x += 1;
     * 
     *   Here's a quick overview of the assignment 
     *   operators: 
     * 
     *   x += 2 // Addition assignment x -= 2 // 
     *   Subtraction assignment x *= 2 // Multiplication 
     *   assignment x /= 2 // Division assignment x %= 2 // 
     *   Remainder assignment
     * 
     *   Numbers can be compared using the relational 
     *   operators >, <, >=, <=, ===, and !==. For example, 
     *   a sketch's frameCount can be used as a timer: 
     * 
     *   if (frameCount > 1000) { text('Game over!', 50, 
     *   50); }
     * 
     *   An expression such as frameCount > 1000 evaluates 
     *   to a Boolean value that's either true or false. 
     *   The relational operators all produce Boolean 
     *   values: 
     * 
     *   2 > 1 // true 2 < 1 // false 2 >= 2 // true 2 <= 2 
     *   // true 2 === 2 // true 2 !== 2 // false
     * 
     *   See Boolean for more information about comparisons 
     *   and conditions. 
     * 
     *   Note: There are also == and != operators with one 
     *   fewer =. Don't use them. 
     * 
     *   Expressions with numbers can also produce special 
     *   values when something goes wrong: 
     * 
     *   sqrt(-1) // NaN 1 / 0 // Infinity
     * 
     *   The value NaN stands for Not-A-Number. NaN appears 
     *   when calculations or conversions don't work. 
     *   Infinity is a value that's larger than any number. 
     *   It appears during certain calculations.
     */

    /**
     *   A container for data that's stored as key-value 
     *   pairs. Objects help to organize related data of 
     *   any type, including other objects. A value stored 
     *   in an object can be accessed by name, called its 
     *   key. Each key-value pair is called a "property." 
     *   Objects are similar to dictionaries in Python and 
     *   maps in Java and Ruby. 
     * 
     *   For example, an object could contain the location, 
     *   size, and appearance of a dog: 
     * 
     *   // Declare the dog variable and assign it an 
     *   object. let dog = { x: 50, y: 50, size: 20, emoji: 
     *   '🐶' }; // Style the text. textAlign(CENTER, 
     *   CENTER); textSize(dog.size); // Draw the dog. 
     *   text(dog.emoji, dog.x, dog.y);
     * 
     *   The variable dog is assigned an object with four 
     *   properties. Objects are declared with curly braces 
     *   {}. Values can be accessed using the dot operator, 
     *   as in dog.size. In the example above, the key size 
     *   corresponds to the value 20. Objects can also be 
     *   empty to start: 
     * 
     *   // Declare a cat variable and assign it an empty 
     *   object. let cat = {}; // Add properties to the 
     *   object. cat.x = 50; cat.y = 50; cat.size = 20; 
     *   cat.emoji = '🐱'; // Style the text. 
     *   textAlign(CENTER, CENTER); textSize(cat.size); // 
     *   Draw the cat. text(cat.emoji, cat.x, cat.y);
     * 
     *   An object's data can be updated while a sketch 
     *   runs. For example, the cat could run away from the 
     *   dog by updating its location: 
     * 
     *   // Run to the right. cat.x += 5;
     * 
     *   If needed, an object's values can be accessed 
     *   using square brackets [] and strings instead of 
     *   dot notation: 
     * 
     *   // Run to the right. cat["x"] += 5;
     * 
     *   This syntax can be helpful when the key's name has 
     *   spaces, as in cat['height (m)'].
     */

    /**
     *   Asynchronous Asset Loading with Async/Await. The 
     *   keywords async and await let you write 
     *   asynchronous code in a more straightforward, 
     *   linear style. Instead of nesting callbacks or 
     *   juggling multiple promise chains, you can pause 
     *   execution at await while waiting for a promise to 
     *   resolve. This makes your code flow more naturally, 
     *   as if it were synchronous. 
     * 
     *   When you mark a function with the async 
     *   keyword—like async function setup() {...}—it 
     *   signals that the function contains asynchronous 
     *   operations and will return a promise. Any time you 
     *   use the await keyword inside this function, 
     *   JavaScript will pause the function’s execution 
     *   until the awaited promise settles. 
     * 
     *   In p5.js, you can use async/await to handle media 
     *   loading functions such as loadImage(), loadJSON(), 
     *   loadSound(), and so on. This allows you to: 
     * 
     *   - load files in a more readable, top-to-bottom 
     *   manner
     *   - decide when the assets are fully available 
     *   before proceeding
     * 
     *   Nested callbacks require managing additional 
     *   information and behavior. Lazy loading of assets 
     *   with async/await can simplify control flow, but it 
     *   also requires you to design your sketch around 
     *   waiting for each operation to complete. 
     * 
     *   Callbacks are still fully supported, so code that 
     *   passes success / error functions to loaders like 
     *   loadImage() or loadJSON() will behave exactly as 
     *   it always has. This compatibility means sketches 
     *   written with the older pattern don’t need any 
     *   changes, and you can freely mix callbacks and 
     *   async/await in the same project if that suits your 
     *   workflow. 
     * 
     *   In the example below, setup() is declared as an 
     *   async function. We await the completion of both 
     *   loadImage() and loadJSON() before calling 
     *   createCanvas(). Only then does the sketch proceed, 
     *   guaranteeing the assets are available for 
     *   immediate use. 
     * 
     *   let img, data; async function setup() { // Wait 
     *   until the image and JSON data have fully loaded. 
     *   img = await loadImage("./my-image.png"); data = 
     *   await loadJSON("./my-data.json"); // Once the 
     *   assets are loaded, create the canvas. 
     *   createCanvas(400, 400); }
     */

    /**
     *   A list that keeps several pieces of data in order. 
     *   Arrays are helpful for storing related data. They 
     *   can contain data of any type. For example, an 
     *   array could contain a list of someone's favorite 
     *   colors as strings. Arrays are created as follows: 
     * 
     *   let myArray = ['deeppink', 'darkorchid', 
     *   'magenta'];
     * 
     *   Each piece of data in an array is called an 
     *   element. Each element has an address, or index, 
     *   within its array. The variable myArray refers to 
     *   an array with three String elements, 'deeppink', 
     *   'darkorchid', and 'magenta'. Arrays are 
     *   zero-indexed, which means that 'deeppink' is at 
     *   index 0, 'darkorchid' is at index 1, and 'magenta' 
     *   is at index 2. Array elements can be accessed 
     *   using their indices as follows: 
     * 
     *   let zeroth = myArray[0]; // 'deeppink' let first = 
     *   myArray[1]; // 'darkorchid' let second = 
     *   myArray[2]; // 'magenta'
     * 
     *   Elements can be added to the end of an array by 
     *   calling the push() method as follows: 
     * 
     *   myArray.push('lavender'); let third = myArray[3]; 
     *   // 'lavender'
     * 
     *   See MDN for more information about arrays.
     */

    /**
     *   A template for creating objects of a particular 
     *   type. Classes can make it easier to program with 
     *   objects. For example, a Frog class could create 
     *   objects that behave like frogs. Each object 
     *   created using a class is called an instance of 
     *   that class. All instances of a class are the same 
     *   type. Here's an example of creating an instance of 
     *   a Frog class: 
     * 
     *   let fifi = new Frog(50, 50, 20);
     * 
     *   The variable fifi refers to an instance of the 
     *   Frog class. The keyword new is used to call the 
     *   Frog class' constructor in the statement new 
     *   Frog(). Altogether, a new Frog object was created 
     *   and assigned to the variable fifi. Classes are 
     *   templates, so they can be used to create more than 
     *   one instance: 
     * 
     *   // First Frog instance. let frog1 = new Frog(25, 
     *   50, 10); // Second Frog instance. let frog2 = new 
     *   Frog(75, 50, 10);
     * 
     *   A simple Frog class could be declared as follows: 
     * 
     *   class Frog { constructor(x, y, size) { // This 
     *   code runs once when an instance is created. this.x 
     *   = x; this.y = y; this.size = size; } show() { // 
     *   This code runs once when myFrog.show() is called. 
     *   textAlign(CENTER, CENTER); textSize(this.size); 
     *   text('🐸', this.x, this.y); } hop() { // This code 
     *   runs once when myFrog.hop() is called. this.x += 
     *   random(-10, 10); this.y += random(-10, 10); } }
     * 
     *   Class declarations begin with the keyword class 
     *   followed by the class name, such as Frog, and 
     *   curly braces {}. Class names should use PascalCase 
     *   and can't have spaces in their names. For example, 
     *   naming a class Kermit The Frog with spaces between 
     *   each word would throw a SyntaxError. The code 
     *   between the curly braces {} defines the class. 
     * 
     *   Functions that belong to a class are called 
     *   methods. constructor(), show(), and hop() are 
     *   methods in the Frog class. Methods define an 
     *   object's behavior. Methods can accept parameters 
     *   and return values, just like functions. Note that 
     *   methods don't use the function keyword. 
     * 
     *   constructor() is a special method that's called 
     *   once when an instance of the class is created. The 
     *   statement new Frog() calls the Frog class' 
     *   constructor() method. 
     * 
     *   A class definition is a template for instances. 
     *   The keyword this refers to an instance's data and 
     *   methods. For example, each Frog instance has 
     *   unique coordinates stored in this.x and this.y. 
     *   The show() method uses those coordinates to draw 
     *   the frog. The hop() method updates those 
     *   coordinates when called. Once a Frog instance is 
     *   created, its data and methods can be accessed 
     *   using the dot operator . as follows: 
     * 
     *   // Draw a lily pad. fill('green'); 
     *   stroke('green'); circle(fifi.x, fifi.y, 2 * 
     *   fifi.size); // Show the Frog. fifi.show(); // Hop. 
     *   fifi.hop();
     */

    /**
     *   A way to repeat a block of code when the number of 
     *   iterations is known. for loops are helpful for 
     *   repeating statements a certain number of times. 
     *   For example, a for loop makes it easy to express 
     *   the idea "draw five lines" like so: 
     * 
     *   for (let x = 10; x < 100; x += 20) { line(x, 25, 
     *   x, 75); }
     * 
     *   The loop's header begins with the keyword for. 
     *   Loops generally count up or count down as they 
     *   repeat, or iterate. The statements in parentheses 
     *   let x = 10; x < 100; x += 20 tell the loop how it 
     *   should repeat: 
     * 
     *   - let x = 10 tells the loop to start counting at 
     *   10 and keep track of iterations using the variable 
     *   x.
     *   - x < 100 tells the loop to count up to, but not 
     *   including, 100.
     *   - x += 20 tells the loop to count up by 20 at the 
     *   end of each iteration.
     * 
     *   The code between the curly braces {} is the loop's 
     *   body. Statements in the loop body are repeated 
     *   during each iteration of the loop. 
     * 
     *   It's common to create infinite loops accidentally. 
     *   When this happens, sketches may become 
     *   unresponsive and the web browser may display a 
     *   warning. For example, the following loop never 
     *   stops iterating because it doesn't count up: 
     * 
     *   for (let x = 10; x < 100; x = 20) { line(x, 25, x, 
     *   75); }
     * 
     *   The statement x = 20 keeps the variable x stuck at 
     *   20, which is always less than 100. 
     * 
     *   for loops can also count down: 
     * 
     *   for (let d = 100; d > 0; d -= 10) { circle(50, 50, 
     *   d); }
     * 
     *   for loops can also contain other loops. The 
     *   following nested loop draws a grid of points: 
     * 
     *   // Loop from left to right. for (let x = 10; x < 
     *   100; x += 10) { // Loop from top to bottom. for 
     *   (let y = 10; y < 100; y += 10) { point(x, y); } }
     * 
     *   for loops are also helpful for iterating through 
     *   the elements of an array. For example, it's common 
     *   to iterate through an array that contains 
     *   information about where or what to draw: 
     * 
     *   // Create an array of x-coordinates. let 
     *   xCoordinates = [20, 40, 60]; for (let i = 0; i < 
     *   xCoordinates.length; i += 1) { // Update the 
     *   element. xCoordinates[i] += random(-1, 1); // Draw 
     *   a circle. circle(xCoordinates[i], 50, 20); }
     * 
     *   If the array's values aren't modified, the 
     *   for...of statement can simplify the code. They're 
     *   similar to for loops in Python and for-each loops 
     *   in C++ and Java. The following loops have the same 
     *   effect: 
     * 
     *   // Draw circles with a for loop. let xCoordinates 
     *   = [20, 40, 60]; for (let i = 0; i < 
     *   xCoordinates.length; i += 1) { 
     *   circle(xCoordinates[i], 50, 20); }
     * 
     *   // Draw circles with a for...of statement. let 
     *   xCoordinates = [20, 40, 60]; for (let x of 
     *   xCoordinates) { circle(x, 50, 20); }
     * 
     *   In the code snippets above, the variables i and x 
     *   have different roles. 
     * 
     *   In the first snippet, i counts from 0 up to 2, 
     *   which is one less than xCoordinates.length. i is 
     *   used to access the element in xCoordinates at 
     *   index i. 
     * 
     *   In the second code snippet, x isn't keeping track 
     *   of the loop's progress or an index. During each 
     *   iteration, x contains the next element of 
     *   xCoordinates. x starts from the beginning of 
     *   xCoordinates (20) and updates its value to 40 and 
     *   then 60 during the next iterations.
     */

    /**
     *   A way to repeat a block of code. while loops are 
     *   helpful for repeating statements while a condition 
     *   is true. They're like if statements that repeat. 
     *   For example, a while loop makes it easy to express 
     *   the idea "draw several lines" like so: 
     * 
     *   // Declare a variable to keep track of iteration. 
     *   let x = 10; // Repeat as long as x < 100 while (x 
     *   < 100) { line(x, 25, x, 75); // Increment by 20. x 
     *   += 20; }
     * 
     *   The loop's header begins with the keyword while. 
     *   Loops generally count up or count down as they 
     *   repeat, or iterate. The statement in parentheses x 
     *   < 100 is a condition the loop checks each time it 
     *   iterates. If the condition is true, the loop runs 
     *   the code between the curly braces {}, The code 
     *   between the curly braces is called the loop's 
     *   body. If the condition is false, the body is 
     *   skipped and the loop is stopped. 
     * 
     *   It's common to create infinite loops accidentally. 
     *   For example, the following loop never stops 
     *   iterating because it doesn't count up: 
     * 
     *   // Declare a variable to keep track of iteration. 
     *   let x = 10; // Repeat as long as x < 100 while (x 
     *   < 100) { line(x, 25, x, 75); } // This should be 
     *   in the loop's body! x += 20;
     * 
     *   The statement x += 20 appears after the loop's 
     *   body. That means the variable x is stuck at 10, 
     *   which is always less than 100. 
     * 
     *   while loops are useful when the number of 
     *   iterations isn't known in advance. For example, 
     *   concentric circles could be drawn at random 
     *   increments: 
     * 
     *   let d = 100; let minSize = 5; while (d > minSize) 
     *   { circle(50, 50, d); d -= random(10); }
     */

    /**
     *   Prints a message to the web browser's console. The 
     *   console object is helpful for printing messages 
     *   while debugging. For example, it's common to add a 
     *   console.log() statement while studying how a 
     *   section of code works: 
     * 
     *   if (isPlaying === true) { // Add a console.log() 
     *   statement to make sure this block of code runs. 
     *   console.log('Got here!'); // Game logic. }
     * 
     *   console.error() is helpful for tracking errors 
     *   because it prints formatted messages. For example, 
     *   it's common to encounter errors when loading media 
     *   assets: 
     * 
     *   // Logs an error message with special formatting. 
     *   function handleFailure(error) { 
     *   console.error('Oops!', error); } // Try to load an 
     *   image and call handleError() if it fails. 
     *   loadImage('https://example.com/cat.jpg', 
     *   handleImage, handleError);
     */

    // TODO: Fix createCanvas() errors in src/scripts/parsers/in/p5.js/src/core/rendering.js, line undefined:
    //
    //    param "renderer" has invalid type: P2D|WEBGL|P2DHDR
    //    return has invalid type: p5.Renderer
    //
    // function createCanvas(width?: number, height?: number, renderer?: P2D|WEBGL|P2DHDR, canvas?: HTMLCanvasElement): 

    // TODO: Fix createCanvas() errors in src/scripts/parsers/in/p5.js/src/core/rendering.js, line undefined:
    //
    //    return has invalid type: p5.Renderer
    //
    // function createCanvas(width?: number, height?: number, canvas?: HTMLCanvasElement): 

    /**
     *   Resizes the canvas to a given width and height. 
     *   resizeCanvas() immediately clears the canvas and 
     *   calls redraw(). It's common to call resizeCanvas() 
     *   within the body of windowResized() like so: 
     * 
     *   function windowResized() { 
     *   resizeCanvas(windowWidth, windowHeight); }
     * 
     *   The first two parameters, width and height, set 
     *   the dimensions of the canvas. They also the values 
     *   of the width and height system variables. For 
     *   example, calling resizeCanvas(300, 500) resizes 
     *   the canvas to 300×500 pixels, then sets width to 
     *   300 and height 500. 
     * 
     *   The third parameter, noRedraw, is optional. If 
     *   true is passed, as in resizeCanvas(300, 500, 
     *   true), then the canvas will be canvas to 300×500 
     *   pixels but the redraw() function won't be called 
     *   immediately. By default, redraw() is called 
     *   immediately when resizeCanvas() finishes 
     *   executing.
     *   @param width width of the canvas.
     *   @param height height of the canvas.
     *   @param [noRedraw] whether to delay calling 
     *   redraw(). Defaults to false.
     */
    function resizeCanvas(width: number, height: number, noRedraw?: boolean): void

    /**
     *   Removes the default canvas. By default, a 100×100 
     *   pixels canvas is created without needing to call 
     *   createCanvas(). noCanvas() removes the default 
     *   canvas for sketches that don't need it.
     */
    function noCanvas(): void

    // TODO: Fix createGraphics() errors in src/scripts/parsers/in/p5.js/src/core/rendering.js, line undefined:
    //
    //    param "renderer" has invalid type: P2D|WEBGL
    //
    // function createGraphics(width: number, height: number, renderer?: P2D|WEBGL, canvas?: HTMLCanvasElement): p5.Graphics

    /**
     *   Creates a p5.Graphics object. createGraphics() 
     *   creates an offscreen drawing canvas (graphics 
     *   buffer) and returns it as a p5.Graphics object. 
     *   Drawing to a separate graphics buffer can be 
     *   helpful for performance and for organizing code. 
     * 
     *   The first two parameters, width and height, are 
     *   optional. They set the dimensions of the 
     *   p5.Graphics object. For example, calling 
     *   createGraphics(900, 500) creates a graphics buffer 
     *   that's 900×500 pixels. 
     * 
     *   The third parameter is also optional. If either of 
     *   the constants P2D or WEBGL is passed, as in 
     *   createGraphics(900, 500, WEBGL), then it will set 
     *   the p5.Graphics object's rendering mode. If an 
     *   existing HTMLCanvasElement is passed, as in 
     *   createGraphics(900, 500, myCanvas), then it will 
     *   be used by the graphics buffer. 
     * 
     *   The fourth parameter is also optional. If an 
     *   existing HTMLCanvasElement is passed, as in 
     *   createGraphics(900, 500, WEBGL, myCanvas), then it 
     *   will be used by the graphics buffer. 
     * 
     *   Note: In WebGL mode, the p5.Graphics object will 
     *   use a WebGL2 context if it's supported by the 
     *   browser. Check the webglVersion system variable to 
     *   check what version is being used, or call 
     *   setAttributes({ version: 1 }) to create a WebGL1 
     *   context.
     *   @param width width of the graphics buffer.
     *   @param height height of the graphics buffer.
     *   @param [canvas] existing canvas element that 
     *   should be used for the graphics buffer..
     */
    function createGraphics(width: number, height: number, canvas?: HTMLCanvasElement): p5.Graphics

    /**
     *   Creates and a new p5.Framebuffer object. 
     *   p5.Framebuffer objects are separate drawing 
     *   surfaces that can be used as textures in WebGL 
     *   mode. They're similar to p5.Graphics objects and 
     *   generally run much faster when used as textures. 
     * 
     *   The parameter, options, is optional. An object can 
     *   be passed to configure the p5.Framebuffer object. 
     *   The available properties are: 
     * 
     *   - format: data format of the texture, either 
     *   UNSIGNED_BYTE, FLOAT, or HALF_FLOAT. Default is 
     *   UNSIGNED_BYTE.
     *   - channels: whether to store RGB or RGBA color 
     *   channels. Default is to match the main canvas 
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
     *   Default is to always match the main canvas width.
     *   - height: height of the p5.Framebuffer object. 
     *   Default is to always match the main canvas height.
     *   - density: pixel density of the p5.Framebuffer 
     *   object. Default is to always match the main canvas 
     *   pixel density.
     *   - textureFiltering: how to read values from the 
     *   p5.Framebuffer object. Either LINEAR (nearby 
     *   pixels will be interpolated) or NEAREST (no 
     *   interpolation). Generally, use LINEAR when using 
     *   the texture as an image and NEAREST if reading the 
     *   texture as data. Default is LINEAR.
     * 
     *   If the width, height, or density attributes are 
     *   set, they won't automatically match the main 
     *   canvas and must be changed manually. 
     * 
     *   Note: createFramebuffer() can only be used in 
     *   WebGL mode.
     *   @param [options] configuration options.
     *   @return new framebuffer.
     */

    /**
     *   Clears the depth buffer in WebGL mode. 
     *   clearDepth() clears information about how far 
     *   objects are from the camera in 3D space. This 
     *   information is stored in an object called the 
     *   depth buffer. Clearing the depth buffer ensures 
     *   new objects aren't drawn behind old ones. Doing so 
     *   can be useful for feedback effects in which the 
     *   previous frame serves as the background for the 
     *   current frame. 
     * 
     *   The parameter, depth, is optional. If a number is 
     *   passed, as in clearDepth(0.5), it determines the 
     *   range of objects to clear from the depth buffer. 0 
     *   doesn't clear any depth information, 0.5 clears 
     *   depth information halfway between the near and far 
     *   clipping planes, and 1 clears depth information 
     *   all the way to the far clipping plane. By default, 
     *   depth is 1. 
     * 
     *   Note: clearDepth() can only be used in WebGL mode.
     *   @param [depth] amount of the depth buffer to clear 
     *   between 0 (none) and 1 (far clipping plane). 
     *   Defaults to 1.
     */
    function clearDepth(depth?: number): void

    /**
     *   A system variable that provides direct access to 
     *   the sketch's <canvas> element. The <canvas> 
     *   element provides many specialized features that 
     *   aren't included in the p5.js library. The 
     *   drawingContext system variable provides access to 
     *   these features by exposing the sketch's 
     *   CanvasRenderingContext2D object.
     */

    /**
     *   Helpers for create methods.
     */
    function addElement(): void

    /**
     *   Helpers for create methods.
     */
    function addElement(): void

    /**
     *   Creates a <video> element for simple audio/video 
     *   playback. createVideo() returns a new 
     *   p5.MediaElement object. Videos are shown by 
     *   default. They can be hidden by calling 
     *   video.hide() and drawn to the canvas using 
     *   image(). 
     * 
     *   The first parameter, src, is the path the video. 
     *   If a single string is passed, as in 
     *   'assets/topsecret.mp4', a single video is loaded. 
     *   An array of strings can be used to load the same 
     *   video in different formats. For example, 
     *   ['assets/topsecret.mp4', 'assets/topsecret.ogv', 
     *   'assets/topsecret.webm']. This is useful for 
     *   ensuring that the video can play across different 
     *   browsers with different capabilities. See MDN for 
     *   more information about supported formats. 
     * 
     *   The second parameter, callback, is optional. It's 
     *   a function to call once the video is ready to 
     *   play.
     *   @param [src] path to a video file, or an array of 
     *   paths for supporting different browsers.
     *   @param [callback] function to call once the video 
     *   is ready to play.
     *   @return new p5.MediaElement object.
     */
    function createVideo(src?: string|string[], callback?: (...args: any[]) => any): p5.MediaElement

    /**
     *   Creates a hidden <audio> element for simple audio 
     *   playback. createAudio() returns a new 
     *   p5.MediaElement object. 
     * 
     *   The first parameter, src, is the path the audio. 
     *   If a single string is passed, as in 
     *   'assets/audio.mp3', a single audio is loaded. An 
     *   array of strings can be used to load the same 
     *   audio in different formats. For example, 
     *   ['assets/audio.mp3', 'assets/video.wav']. This is 
     *   useful for ensuring that the audio can play across 
     *   different browsers with different capabilities. 
     *   See MDN for more information about supported 
     *   formats. 
     * 
     *   The second parameter, callback, is optional. It's 
     *   a function to call once the audio is ready to 
     *   play.
     *   @param [src] path to an audio file, or an array of 
     *   paths for supporting different browsers.
     *   @param [callback] function to call once the audio 
     *   is ready to play.
     *   @return new p5.MediaElement object.
     */
    function createAudio(src?: string|string[], callback?: (...args: any[]) => any): p5.MediaElement

    /**
     *   Creates a <video> element that "captures" the 
     *   audio/video stream from the webcam and microphone. 
     *   createCapture() returns a new p5.MediaElement 
     *   object. Videos are shown by default. They can be 
     *   hidden by calling capture.hide() and drawn to the 
     *   canvas using image(). 
     * 
     *   The first parameter, type, is optional. It sets 
     *   the type of capture to use. By default, 
     *   createCapture() captures both audio and video. If 
     *   VIDEO is passed, as in createCapture(VIDEO), only 
     *   video will be captured. If AUDIO is passed, as in 
     *   createCapture(AUDIO), only audio will be captured. 
     *   A constraints object can also be passed to 
     *   customize the stream. See the  W3C documentation 
     *   for possible properties. Different browsers 
     *   support different properties. 
     * 
     *   The 'flipped' property is an optional property 
     *   which can be set to {flipped:true} to mirror the 
     *   video output.If it is true then it means that 
     *   video will be mirrored or flipped and if nothing 
     *   is mentioned then by default it will be false. 
     * 
     *   The second parameter,callback, is optional. It's a 
     *   function to call once the capture is ready for 
     *   use. The callback function should have one 
     *   parameter, stream, that's a MediaStream object. 
     * 
     *   Note: createCapture() only works when running a 
     *   sketch locally or using HTTPS. Learn more here and 
     *   here.
     *   @param [type] type of capture, either AUDIO or 
     *   VIDEO, or a constraints object. Both video and 
     *   audio audio streams are captured by default.
     *   @param [flipped] flip the capturing video and 
     *   mirror the output with {flipped:true}. By default 
     *   it is false.
     *   @param [callback] function to call once the stream 
     *   has loaded.
     *   @return new p5.MediaElement object.
     */
    function createCapture(type?: object, flipped?: object, callback?: (...args: any[]) => any): p5.MediaElement


    // TODO: Fix blend() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
    //
    //    param "blendMode" has invalid type: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL
    //
    // function blend(srcImage: p5.Image, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, blendMode: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL): void

    // TODO: Fix blend() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
    //
    //    param "blendMode" has invalid type: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL
    //
    // function blend(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, blendMode: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL): void

    /**
     *   Copies pixels from a source image to a region of 
     *   the canvas. The first parameter, srcImage, is the 
     *   p5.Image object to blend. The source image can be 
     *   the canvas itself or a p5.Image object. copy() 
     *   will scale pixels from the source region if it 
     *   isn't the same size as the destination region. 
     * 
     *   The next four parameters, sx, sy, sw, and sh 
     *   determine the region to copy from the source 
     *   image. (sx, sy) is the top-left corner of the 
     *   region. sw and sh are the region's width and 
     *   height. 
     * 
     *   The next four parameters, dx, dy, dw, and dh 
     *   determine the region of the canvas to copy into. 
     *   (dx, dy) is the top-left corner of the region. dw 
     *   and dh are the region's width and height.
     *   @param srcImage source image.
     *   @param sx x-coordinate of the source's upper-left 
     *   corner.
     *   @param sy y-coordinate of the source's upper-left 
     *   corner.
     *   @param sw source image width.
     *   @param sh source image height.
     *   @param dx x-coordinate of the destination's 
     *   upper-left corner.
     *   @param dy y-coordinate of the destination's 
     *   upper-left corner.
     *   @param dw destination image width.
     *   @param dh destination image height.
     */
    function copy(srcImage: p5.Image|p5.Element, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

    /**
     *   Copies pixels from a source image to a region of 
     *   the canvas. The first parameter, srcImage, is the 
     *   p5.Image object to blend. The source image can be 
     *   the canvas itself or a p5.Image object. copy() 
     *   will scale pixels from the source region if it 
     *   isn't the same size as the destination region. 
     * 
     *   The next four parameters, sx, sy, sw, and sh 
     *   determine the region to copy from the source 
     *   image. (sx, sy) is the top-left corner of the 
     *   region. sw and sh are the region's width and 
     *   height. 
     * 
     *   The next four parameters, dx, dy, dw, and dh 
     *   determine the region of the canvas to copy into. 
     *   (dx, dy) is the top-left corner of the region. dw 
     *   and dh are the region's width and height.
     *   @param sx x-coordinate of the source's upper-left 
     *   corner.
     *   @param sy y-coordinate of the source's upper-left 
     *   corner.
     *   @param sw source image width.
     *   @param sh source image height.
     *   @param dx x-coordinate of the destination's 
     *   upper-left corner.
     *   @param dy y-coordinate of the destination's 
     *   upper-left corner.
     *   @param dw destination image width.
     *   @param dh destination image height.
     */
    function copy(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

    // TODO: Fix filter() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
    //
    //    param "filterType" has invalid type: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR
    //
    // function filter(filterType: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR, filterParam?: number, useWebGL?: boolean): void

    // TODO: Fix filter() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
    //
    //    param "filterType" has invalid type: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR
    //
    // function filter(filterType: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR, filterParam?: number, useWebGL?: boolean): void

    /**
     *   Applies an image filter to the canvas. The preset 
     *   options are: 
     * 
     *   INVERT Inverts the colors in the image. No 
     *   parameter is used. 
     * 
     *   GRAY Converts the image to grayscale. No parameter 
     *   is used. 
     * 
     *   THRESHOLD Converts the image to black and white. 
     *   Pixels with a grayscale value above a given 
     *   threshold are converted to white. The rest are 
     *   converted to black. The threshold must be between 
     *   0.0 (black) and 1.0 (white). If no value is 
     *   specified, 0.5 is used. 
     * 
     *   OPAQUE Sets the alpha channel to entirely opaque. 
     *   No parameter is used. 
     * 
     *   POSTERIZE Limits the number of colors in the 
     *   image. Each color channel is limited to the number 
     *   of colors specified. Values between 2 and 255 are 
     *   valid, but results are most noticeable with lower 
     *   values. The default value is 4. 
     * 
     *   BLUR Blurs the image. The level of blurring is 
     *   specified by a blur radius. Larger values increase 
     *   the blur. The default value is 4. A gaussian blur 
     *   is used in P2D mode. A box blur is used in WEBGL 
     *   mode. 
     * 
     *   ERODE Reduces the light areas. No parameter is 
     *   used. 
     * 
     *   DILATE Increases the light areas. No parameter is 
     *   used. 
     * 
     *   filter() uses WebGL in the background by default 
     *   because it's faster. This can be disabled in P2D 
     *   mode by adding a false argument, as in 
     *   filter(BLUR, false). This may be useful to keep 
     *   computation off the GPU or to work around a lack 
     *   of WebGL support. 
     * 
     *   In WebgL mode, filter() can also use custom 
     *   shaders. See createFilterShader() for more 
     *   information.
     *   @param shaderFilter shader that's been loaded, 
     *   with the frag shader using a tex0 uniform.
     */
    function filter(shaderFilter: p5.Shader): void

    /**
     *   Gets a pixel or a region of pixels from the 
     *   canvas. get() is easy to use but it's not as fast 
     *   as pixels. Use pixels to read many pixel values. 
     * 
     *   The version of get() with no parameters returns 
     *   the entire canvas. 
     * 
     *   The version of get() with two parameters 
     *   interprets them as coordinates. It returns an 
     *   array with the [R, G, B, A] values of the pixel at 
     *   the given point. 
     * 
     *   The version of get() with four parameters 
     *   interprets them as coordinates and dimensions. It 
     *   returns a subsection of the canvas as a p5.Image 
     *   object. The first two parameters are the 
     *   coordinates for the upper-left corner of the 
     *   subsection. The last two parameters are the width 
     *   and height of the subsection. 
     * 
     *   Use p5.Image.get() to work directly with p5.Image 
     *   objects.
     *   @param x x-coordinate of the pixel.
     *   @param y y-coordinate of the pixel.
     *   @param w width of the subsection to be returned.
     *   @param h height of the subsection to be returned.
     *   @return subsection as a p5.Image object.
     */
    function get(x: number, y: number, w: number, h: number): p5.Image

    /**
     *   Gets a pixel or a region of pixels from the 
     *   canvas. get() is easy to use but it's not as fast 
     *   as pixels. Use pixels to read many pixel values. 
     * 
     *   The version of get() with no parameters returns 
     *   the entire canvas. 
     * 
     *   The version of get() with two parameters 
     *   interprets them as coordinates. It returns an 
     *   array with the [R, G, B, A] values of the pixel at 
     *   the given point. 
     * 
     *   The version of get() with four parameters 
     *   interprets them as coordinates and dimensions. It 
     *   returns a subsection of the canvas as a p5.Image 
     *   object. The first two parameters are the 
     *   coordinates for the upper-left corner of the 
     *   subsection. The last two parameters are the width 
     *   and height of the subsection. 
     * 
     *   Use p5.Image.get() to work directly with p5.Image 
     *   objects.
     *   @return whole canvas as a p5.Image.
     */
    function get(): p5.Image

    /**
     *   Gets a pixel or a region of pixels from the 
     *   canvas. get() is easy to use but it's not as fast 
     *   as pixels. Use pixels to read many pixel values. 
     * 
     *   The version of get() with no parameters returns 
     *   the entire canvas. 
     * 
     *   The version of get() with two parameters 
     *   interprets them as coordinates. It returns an 
     *   array with the [R, G, B, A] values of the pixel at 
     *   the given point. 
     * 
     *   The version of get() with four parameters 
     *   interprets them as coordinates and dimensions. It 
     *   returns a subsection of the canvas as a p5.Image 
     *   object. The first two parameters are the 
     *   coordinates for the upper-left corner of the 
     *   subsection. The last two parameters are the width 
     *   and height of the subsection. 
     * 
     *   Use p5.Image.get() to work directly with p5.Image 
     *   objects.
     *   @param x x-coordinate of the pixel.
     *   @param y y-coordinate of the pixel.
     *   @return color of the pixel at (x, y) in array 
     *   format [R, G, B, A].
     */
    function get(x: number, y: number): number[]

    /**
     *   Loads the current value of each pixel on the 
     *   canvas into the pixels array. loadPixels() must be 
     *   called before reading from or writing to pixels.
     */
    function loadPixels(): void

    /**
     *   Sets the color of a pixel or draws an image to the 
     *   canvas. set() is easy to use but it's not as fast 
     *   as pixels. Use pixels to set many pixel values. 
     * 
     *   set() interprets the first two parameters as x- 
     *   and y-coordinates. It interprets the last 
     *   parameter as a grayscale value, a [R, G, B, A] 
     *   pixel array, a p5.Color object, or a p5.Image 
     *   object. If an image is passed, the first two 
     *   parameters set the coordinates for the image's 
     *   upper-left corner, regardless of the current 
     *   imageMode(). 
     * 
     *   updatePixels() must be called after using set() 
     *   for changes to appear.
     *   @param x x-coordinate of the pixel.
     *   @param y y-coordinate of the pixel.
     *   @param c grayscale value | pixel array | p5.Color 
     *   object | p5.Image to copy.
     */
    function set(x: number, y: number, c: number|number[]|object): void

    /**
     *   An array containing the color of each pixel on the 
     *   canvas. Colors are stored as numbers representing 
     *   red, green, blue, and alpha (RGBA) values. pixels 
     *   is a one-dimensional array for performance 
     *   reasons. 
     * 
     *   Each pixel occupies four elements in the pixels 
     *   array, one for each RGBA value. For example, the 
     *   pixel at coordinates (0, 0) stores its RGBA values 
     *   at pixels[0], pixels[1], pixels[2], and pixels[3], 
     *   respectively. The next pixel at coordinates (1, 0) 
     *   stores its RGBA values at pixels[4], pixels[5], 
     *   pixels[6], and pixels[7]. And so on. The pixels 
     *   array for a 100×100 canvas has 100 × 100 × 4 = 
     *   40,000 elements. 
     * 
     *   Some displays use several smaller pixels to set 
     *   the color at a single point. The pixelDensity() 
     *   function returns the pixel density of the canvas. 
     *   High density displays often have a pixelDensity() 
     *   of 2. On such a display, the pixels array for a 
     *   100×100 canvas has 200 × 200 × 4 = 160,000 
     *   elements. 
     * 
     *   Accessing the RGBA values for a point on the 
     *   canvas requires a little math as shown below. The 
     *   loadPixels() function must be called before 
     *   accessing the pixels array. The updatePixels() 
     *   function must be called after any changes are 
     *   made.
     */

    /**
     *   Calculates the arc cosine of a number. acos() is 
     *   the inverse of cos(). It expects arguments in the 
     *   range -1 to 1. By default, acos() returns values 
     *   in the range 0 to π (about 3.14). If the 
     *   angleMode() is DEGREES, then values are returned 
     *   in the range 0 to 180.
     *   @param value value whose arc cosine is to be 
     *   returned.
     *   @return arc cosine of the given value.
     */
    function acos(value: number): number

    /**
     *   Calculates the arc sine of a number. asin() is the 
     *   inverse of sin(). It expects input values in the 
     *   range of -1 to 1. By default, asin() returns 
     *   values in the range -π ÷ 2 (about -1.57) to π ÷ 2 
     *   (about 1.57). If the angleMode() is DEGREES then 
     *   values are returned in the range -90 to 90.
     *   @param value value whose arc sine is to be 
     *   returned.
     *   @return arc sine of the given value.
     */
    function asin(value: number): number

    /**
     *   Calculates the arc tangent of a number. atan() is 
     *   the inverse of tan(). It expects input values in 
     *   the range of -Infinity to Infinity. By default, 
     *   atan() returns values in the range -π ÷ 2 (about 
     *   -1.57) to π ÷ 2 (about 1.57). If the angleMode() 
     *   is DEGREES then values are returned in the range 
     *   -90 to 90.
     *   @param value value whose arc tangent is to be 
     *   returned.
     *   @return arc tangent of the given value.
     */
    function atan(value: number): number

    /**
     *   Calculates the angle formed by a point, the 
     *   origin, and the positive x-axis. atan2() is most 
     *   often used for orienting geometry to the mouse's 
     *   position, as in atan2(mouseY, mouseX). The first 
     *   parameter is the point's y-coordinate and the 
     *   second parameter is its x-coordinate. 
     * 
     *   By default, atan2() returns values in the range -π 
     *   (about -3.14) to π (3.14). If the angleMode() is 
     *   DEGREES, then values are returned in the range 
     *   -180 to 180.
     *   @param y y-coordinate of the point.
     *   @param x x-coordinate of the point.
     *   @return arc tangent of the given point.
     */
    function atan2(y: number, x: number): number

    /**
     *   Calculates the cosine of an angle. cos() is useful 
     *   for many geometric tasks in creative coding. The 
     *   values returned oscillate between -1 and 1 as the 
     *   input angle increases. cos() calculates the cosine 
     *   of an angle, using radians by default, or 
     *   according to if angleMode() setting (RADIANS or 
     *   DEGREES).
     *   @param angle the angle, in radians by default, or 
     *   according to if angleMode() setting (RADIANS or 
     *   DEGREES).
     *   @return cosine of the angle.
     */
    function cos(angle: number): number

    /**
     *   Calculates the sine of an angle. sin() is useful 
     *   for many geometric tasks in creative coding. The 
     *   values returned oscillate between -1 and 1 as the 
     *   input angle increases. sin() calculates the sine 
     *   of an angle, using radians by default, or 
     *   according to if angleMode() setting (RADIANS or 
     *   DEGREES).
     *   @param angle the angle, in radians by default, or 
     *   according to if angleMode() setting (RADIANS or 
     *   DEGREES).
     *   @return sine of the angle.
     */
    function sin(angle: number): number

    /**
     *   Calculates the tangent of an angle. tan() is 
     *   useful for many geometric tasks in creative 
     *   coding. The values returned range from -Infinity 
     *   to Infinity and repeat periodically as the input 
     *   angle increases. tan() calculates the tan of an 
     *   angle, using radians by default, or according to 
     *   if angleMode() setting (RADIANS or DEGREES).
     *   @param angle the angle, in radians by default, or 
     *   according to if angleMode() setting (RADIANS or 
     *   DEGREES).
     *   @return tangent of the angle.
     */
    function tan(angle: number): number

    /**
     *   Converts an angle measured in radians to its value 
     *   in degrees. Degrees and radians are both units for 
     *   measuring angles. There are 360˚ in one full 
     *   rotation. A full rotation is 2 × π (about 6.28) 
     *   radians. 
     * 
     *   The same angle can be expressed in with either 
     *   unit. For example, 90° is a quarter of a full 
     *   rotation. The same angle is 2 × π ÷ 4 (about 1.57) 
     *   radians.
     *   @param radians radians value to convert to 
     *   degrees.
     *   @return converted angle.
     */
    function degrees(radians: number): number

    /**
     *   Converts an angle measured in degrees to its value 
     *   in radians. Degrees and radians are both units for 
     *   measuring angles. There are 360˚ in one full 
     *   rotation. A full rotation is 2 × π (about 6.28) 
     *   radians. 
     * 
     *   The same angle can be expressed in with either 
     *   unit. For example, 90° is a quarter of a full 
     *   rotation. The same angle is 2 × π ÷ 4 (about 1.57) 
     *   radians.
     *   @param degrees degree value to convert to radians.
     *   @return converted angle.
     */
    function radians(degrees: number): number

    // TODO: Fix angleMode() errors in src/scripts/parsers/in/p5.js/src/math/trigonometry.js, line undefined:
    //
    //    param "mode" has invalid type: RADIANS|DEGREES
    //
    // function angleMode(mode: RADIANS|DEGREES): void

    // TODO: Fix angleMode() errors in src/scripts/parsers/in/p5.js/src/math/trigonometry.js, line undefined:
    //
    //    return has invalid type: RADIANS|DEGREES
    //
    // function angleMode(): 

    /**
     *   A String constant that's used to set the 
     *   angleMode(). By default, functions such as 
     *   rotate() and sin() expect angles measured in units 
     *   of radians. Calling angleMode(DEGREES) ensures 
     *   that angles are measured in units of degrees. 
     * 
     *   Note: TWO_PI radians equals 360˚.
     */

    /**
     *   A String constant that's used to set the 
     *   angleMode(). By default, functions such as 
     *   rotate() and sin() expect angles measured in units 
     *   of radians. Calling angleMode(RADIANS) ensures 
     *   that angles are measured in units of radians. 
     *   Doing so can be useful if the angleMode() has been 
     *   set to DEGREES. 
     * 
     *   Note: TWO_PI radians equals 360˚.
     */

    // TODO: Fix describe() errors in src/scripts/parsers/in/p5.js/src/accessibility/describe.js, line undefined:
    //
    //    param "display" has invalid type: FALLBACK|LABEL
    //
    // function describe(text: string, display?: FALLBACK|LABEL): void

    // TODO: Fix describeElement() errors in src/scripts/parsers/in/p5.js/src/accessibility/describe.js, line undefined:
    //
    //    param "display" has invalid type: FALLBACK|LABEL
    //
    // function describeElement(name: string, text: string, display?: FALLBACK|LABEL): void

    // TODO: Fix textOutput() errors in src/scripts/parsers/in/p5.js/src/accessibility/outputs.js, line undefined:
    //
    //    param "display" has invalid type: FALLBACK|LABEL
    //
    // function textOutput(display?: FALLBACK|LABEL): void

    // TODO: Fix gridOutput() errors in src/scripts/parsers/in/p5.js/src/accessibility/outputs.js, line undefined:
    //
    //    param "display" has invalid type: FALLBACK|LABEL
    //
    // function gridOutput(display?: FALLBACK|LABEL): void

    /**
     *   Creates a new sketch in "instance" mode. All p5.js 
     *   sketches are instances of the p5 class. Put 
     *   another way, all p5.js sketches are objects with 
     *   methods including pInst.setup(), pInst.draw(), 
     *   pInst.circle(), and pInst.fill(). By default, 
     *   sketches run in "global mode" to hide some of this 
     *   complexity. 
     * 
     *   In global mode, a default instance of the p5 class 
     *   is created automatically. The default p5 instance 
     *   searches the web page's source code for 
     *   declarations of system functions such as setup(), 
     *   draw(), and mousePressed(), then attaches those 
     *   functions to itself as methods. Calling a function 
     *   such as circle() in global mode actually calls the 
     *   default p5 object's pInst.circle() method. 
     * 
     *   It's often helpful to isolate the code within 
     *   sketches from the rest of the code on a web page. 
     *   Two common use cases are web pages that use other 
     *   JavaScript libraries and web pages with multiple 
     *   sketches. "Instance mode" makes it easy to support 
     *   both of these scenarios. 
     * 
     *   Instance mode sketches support the same API as 
     *   global mode sketches. They use a function to 
     *   bundle, or encapsulate, an entire sketch. The 
     *   function containing the sketch is then passed to 
     *   the p5() constructor. 
     * 
     *   The first parameter, sketch, is a function that 
     *   contains the sketch. For example, the statement 
     *   new p5(mySketch) would create a new instance mode 
     *   sketch from a function named mySketch. The 
     *   function should have one parameter, p, that's a p5 
     *   object. 
     * 
     *   The second parameter, node, is optional. If a 
     *   string is passed, as in new p5(mySketch, 
     *   'sketch-one') the new instance mode sketch will 
     *   become a child of the HTML element with the id 
     *   sketch-one. If an HTML element is passed, as in 
     *   new p5(mySketch, myElement), then the new instance 
     *   mode sketch will become a child of the Element 
     *   object called myElement.
     *   @param sketch function containing the sketch.
     *   @param node ID or reference to the HTML element 
     *   that will contain the sketch.
     */
    function p5(sketch: object, node: string|HTMLElement): void

    /**
     *   Stops the code in draw() from running repeatedly. 
     *   By default, draw() tries to run 60 times per 
     *   second. Calling noLoop() stops draw() from 
     *   repeating. The draw loop can be restarted by 
     *   calling loop(). draw() can be run once by calling 
     *   redraw(). 
     * 
     *   The isLooping() function can be used to check 
     *   whether a sketch is looping, as in isLooping() === 
     *   true.
     */
    function noLoop(): void

    /**
     *   Resumes the draw loop after noLoop() has been 
     *   called. By default, draw() tries to run 60 times 
     *   per second. Calling noLoop() stops draw() from 
     *   repeating. The draw loop can be restarted by 
     *   calling loop(). 
     * 
     *   The isLooping() function can be used to check 
     *   whether a sketch is looping, as in isLooping() === 
     *   true.
     */
    function loop(): void

    // TODO: Fix isLooping() errors in src/scripts/parsers/in/p5.js/src/core/structure.js, line undefined:
    //
    //    return has invalid type: boolean
    //
    // function isLooping(): 

    // TODO: Fix redraw() errors in src/scripts/parsers/in/p5.js/src/core/structure.js, line undefined:
    //
    //    return has invalid type: Promise<void>
    //
    // function redraw(n?: number): 

    /**
     *   Starts defining a shape that will mask any shapes 
     *   drawn afterward. Any shapes drawn between 
     *   beginClip() and endClip() will add to the mask 
     *   shape. The mask will apply to anything drawn after 
     *   endClip(). 
     * 
     *   The parameter, options, is optional. If an object 
     *   with an invert property is passed, as in 
     *   beginClip({ invert: true }), it will be used to 
     *   set the masking mode. { invert: true } inverts the 
     *   mask, creating holes in shapes that are masked. 
     *   invert is false by default. 
     * 
     *   Masks can be contained between the push() and 
     *   pop() functions. Doing so allows unmasked shapes 
     *   to be drawn after masked shapes. 
     * 
     *   Masks can also be defined in a callback function 
     *   that's passed to clip().
     *   @param [options] an object containing clip 
     *   settings.
     */
    function beginClip(options?: object): void

    /**
     *   Ends defining a mask that was started with 
     *   beginClip().
     */
    function endClip(): void

    /**
     *   Defines a shape that will mask any shapes drawn 
     *   afterward. The first parameter, callback, is a 
     *   function that defines the mask. Any shapes drawn 
     *   in callback will add to the mask shape. The mask 
     *   will apply to anything drawn after clip() is 
     *   called. 
     * 
     *   The second parameter, options, is optional. If an 
     *   object with an invert property is passed, as in 
     *   beginClip({ invert: true }), it will be used to 
     *   set the masking mode. { invert: true } inverts the 
     *   mask, creating holes in shapes that are masked. 
     *   invert is false by default. 
     * 
     *   Masks can be contained between the push() and 
     *   pop() functions. Doing so allows unmasked shapes 
     *   to be drawn after masked shapes. 
     * 
     *   Masks can also be defined with beginClip() and 
     *   endClip().
     *   @param callback a function that draws the mask 
     *   shape.
     *   @param [options] an object containing clip 
     *   settings.
     */
    function clip(callback: (...args: any[]) => any, options?: object): void

    /**
     *   Sets the color used for the background of the 
     *   canvas. By default, the background is transparent. 
     *   background() is typically used within draw() to 
     *   clear the display window at the beginning of each 
     *   frame. It can also be used inside setup() to set 
     *   the background on the first frame of animation. 
     * 
     *   The version of background() with one parameter 
     *   interprets the value one of four ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. RGB, RGBA, 
     *   HSL, HSLA, hex, and named color strings are 
     *   supported. If the parameter is a p5.Color object, 
     *   it will be used as the background color. If the 
     *   parameter is a p5.Image object, it will be used as 
     *   the background image. 
     * 
     *   The version of background() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of background() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). By default, 
     *   colors are specified in RGB values. Calling 
     *   background(255, 204, 0) sets the background a 
     *   bright yellow color. 
     * 
     *   The version of background() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param color any value created by the color() 
     *   function
     */
    function background(color: p5.Color): void

    /**
     *   Sets the color used for the background of the 
     *   canvas. By default, the background is transparent. 
     *   background() is typically used within draw() to 
     *   clear the display window at the beginning of each 
     *   frame. It can also be used inside setup() to set 
     *   the background on the first frame of animation. 
     * 
     *   The version of background() with one parameter 
     *   interprets the value one of four ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. RGB, RGBA, 
     *   HSL, HSLA, hex, and named color strings are 
     *   supported. If the parameter is a p5.Color object, 
     *   it will be used as the background color. If the 
     *   parameter is a p5.Image object, it will be used as 
     *   the background image. 
     * 
     *   The version of background() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of background() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). By default, 
     *   colors are specified in RGB values. Calling 
     *   background(255, 204, 0) sets the background a 
     *   bright yellow color. 
     * 
     *   The version of background() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param colorstring color string, possible formats 
     *   include: integer rgb() or rgba(), percentage rgb() 
     *   or rgba(), 3-digit hex, 6-digit hex.
     *   @param [a] opacity of the background relative to 
     *   current color range (default is 0-255).
     */
    function background(colorstring: string, a?: number): void

    /**
     *   Sets the color used for the background of the 
     *   canvas. By default, the background is transparent. 
     *   background() is typically used within draw() to 
     *   clear the display window at the beginning of each 
     *   frame. It can also be used inside setup() to set 
     *   the background on the first frame of animation. 
     * 
     *   The version of background() with one parameter 
     *   interprets the value one of four ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. RGB, RGBA, 
     *   HSL, HSLA, hex, and named color strings are 
     *   supported. If the parameter is a p5.Color object, 
     *   it will be used as the background color. If the 
     *   parameter is a p5.Image object, it will be used as 
     *   the background image. 
     * 
     *   The version of background() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of background() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). By default, 
     *   colors are specified in RGB values. Calling 
     *   background(255, 204, 0) sets the background a 
     *   bright yellow color. 
     * 
     *   The version of background() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param gray specifies a value between white and 
     *   black.
     *   @param [a] opacity of the background relative to 
     *   current color range (default is 0-255).
     */
    function background(gray: number, a?: number): void

    /**
     *   Sets the color used for the background of the 
     *   canvas. By default, the background is transparent. 
     *   background() is typically used within draw() to 
     *   clear the display window at the beginning of each 
     *   frame. It can also be used inside setup() to set 
     *   the background on the first frame of animation. 
     * 
     *   The version of background() with one parameter 
     *   interprets the value one of four ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. RGB, RGBA, 
     *   HSL, HSLA, hex, and named color strings are 
     *   supported. If the parameter is a p5.Color object, 
     *   it will be used as the background color. If the 
     *   parameter is a p5.Image object, it will be used as 
     *   the background image. 
     * 
     *   The version of background() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of background() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). By default, 
     *   colors are specified in RGB values. Calling 
     *   background(255, 204, 0) sets the background a 
     *   bright yellow color. 
     * 
     *   The version of background() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param v1 red value if color mode is RGB, or hue 
     *   value if color mode is HSB.
     *   @param v2 green value if color mode is RGB, or 
     *   saturation value if color mode is HSB.
     *   @param v3 blue value if color mode is RGB, or 
     *   brightness value if color mode is HSB.
     *   @param [a] opacity of the background relative to 
     *   current color range (default is 0-255).
     */
    function background(v1: number, v2: number, v3: number, a?: number): void

    /**
     *   Sets the color used for the background of the 
     *   canvas. By default, the background is transparent. 
     *   background() is typically used within draw() to 
     *   clear the display window at the beginning of each 
     *   frame. It can also be used inside setup() to set 
     *   the background on the first frame of animation. 
     * 
     *   The version of background() with one parameter 
     *   interprets the value one of four ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. RGB, RGBA, 
     *   HSL, HSLA, hex, and named color strings are 
     *   supported. If the parameter is a p5.Color object, 
     *   it will be used as the background color. If the 
     *   parameter is a p5.Image object, it will be used as 
     *   the background image. 
     * 
     *   The version of background() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of background() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). By default, 
     *   colors are specified in RGB values. Calling 
     *   background(255, 204, 0) sets the background a 
     *   bright yellow color. 
     * 
     *   The version of background() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param values an array containing the red, green, 
     *   blue and alpha components of the color.
     */
    function background(values: number[]): void

    /**
     *   Sets the color used for the background of the 
     *   canvas. By default, the background is transparent. 
     *   background() is typically used within draw() to 
     *   clear the display window at the beginning of each 
     *   frame. It can also be used inside setup() to set 
     *   the background on the first frame of animation. 
     * 
     *   The version of background() with one parameter 
     *   interprets the value one of four ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. RGB, RGBA, 
     *   HSL, HSLA, hex, and named color strings are 
     *   supported. If the parameter is a p5.Color object, 
     *   it will be used as the background color. If the 
     *   parameter is a p5.Image object, it will be used as 
     *   the background image. 
     * 
     *   The version of background() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of background() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). By default, 
     *   colors are specified in RGB values. Calling 
     *   background(255, 204, 0) sets the background a 
     *   bright yellow color. 
     * 
     *   The version of background() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param image image created with loadImage() or 
     *   createImage(), to set as background. (must be same 
     *   size as the sketch window).
     *   @param [a] opacity of the background relative to 
     *   current color range (default is 0-255).
     */
    function background(image: p5.Image, a?: number): void

    // TODO: Fix colorMode() errors in src/scripts/parsers/in/p5.js/src/color/setting.js, line undefined:
    //
    //    param "mode" has invalid type: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH
    //    return has invalid type: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH
    //
    // function colorMode(mode: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH, max?: number): 

    // TODO: Fix colorMode() errors in src/scripts/parsers/in/p5.js/src/color/setting.js, line undefined:
    //
    //    param "mode" has invalid type: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH
    //    return has invalid type: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH
    //
    // function colorMode(mode: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH, max1: number, max2: number, max3: number, maxA?: number): 

    // TODO: Fix colorMode() errors in src/scripts/parsers/in/p5.js/src/color/setting.js, line undefined:
    //
    //    return has invalid type: RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH
    //
    // function colorMode(): 

    /**
     *   Sets the color used to fill shapes. Calling 
     *   fill(255, 165, 0) or fill('orange') means all 
     *   shapes drawn after the fill command will be filled 
     *   with the color orange. 
     * 
     *   The version of fill() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the fill color. 
     * 
     *   The version of fill() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). The default 
     *   color space is RGB, with each value in the range 
     *   from 0 to 255. 
     * 
     *   The version of fill() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param v1 red value if color mode is RGB or hue 
     *   value if color mode is HSB.
     *   @param v2 green value if color mode is RGB or 
     *   saturation value if color mode is HSB.
     *   @param v3 blue value if color mode is RGB or 
     *   brightness value if color mode is HSB.
     *   @param [alpha] alpha value, controls transparency 
     *   (0 - transparent, 255 - opaque).
     */
    function fill(v1: number, v2: number, v3: number, alpha?: number): void

    /**
     *   Sets the color used to fill shapes. Calling 
     *   fill(255, 165, 0) or fill('orange') means all 
     *   shapes drawn after the fill command will be filled 
     *   with the color orange. 
     * 
     *   The version of fill() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the fill color. 
     * 
     *   The version of fill() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). The default 
     *   color space is RGB, with each value in the range 
     *   from 0 to 255. 
     * 
     *   The version of fill() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param value a color string.
     */
    function fill(value: string): void

    /**
     *   Sets the color used to fill shapes. Calling 
     *   fill(255, 165, 0) or fill('orange') means all 
     *   shapes drawn after the fill command will be filled 
     *   with the color orange. 
     * 
     *   The version of fill() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the fill color. 
     * 
     *   The version of fill() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). The default 
     *   color space is RGB, with each value in the range 
     *   from 0 to 255. 
     * 
     *   The version of fill() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param gray a grayscale value.
     *   @param [alpha] alpha value, controls transparency 
     *   (0 - transparent, 255 - opaque).
     */
    function fill(gray: number, alpha?: number): void

    /**
     *   Sets the color used to fill shapes. Calling 
     *   fill(255, 165, 0) or fill('orange') means all 
     *   shapes drawn after the fill command will be filled 
     *   with the color orange. 
     * 
     *   The version of fill() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the fill color. 
     * 
     *   The version of fill() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). The default 
     *   color space is RGB, with each value in the range 
     *   from 0 to 255. 
     * 
     *   The version of fill() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param values an array containing the red, green, 
     *   blue & and alpha components of the color.
     */
    function fill(values: number[]): void

    /**
     *   Sets the color used to fill shapes. Calling 
     *   fill(255, 165, 0) or fill('orange') means all 
     *   shapes drawn after the fill command will be filled 
     *   with the color orange. 
     * 
     *   The version of fill() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the fill color. 
     * 
     *   The version of fill() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). The default 
     *   color space is RGB, with each value in the range 
     *   from 0 to 255. 
     * 
     *   The version of fill() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param color the fill color.
     */
    function fill(color: p5.Color): void

    /**
     *   Disables setting the fill color for shapes. 
     *   Calling noFill() is the same as making the fill 
     *   completely transparent, as in fill(0, 0). If both 
     *   noStroke() and noFill() are called, nothing will 
     *   be drawn to the screen.
     */
    function noFill(): void

    /**
     *   Disables drawing points, lines, and the outlines 
     *   of shapes. Calling noStroke() is the same as 
     *   making the stroke completely transparent, as in 
     *   stroke(0, 0). If both noStroke() and noFill() are 
     *   called, nothing will be drawn to the screen.
     */
    function noStroke(): void

    /**
     *   Sets the color used to draw points, lines, and the 
     *   outlines of shapes. Calling stroke(255, 165, 0) or 
     *   stroke('orange') means all shapes drawn after 
     *   calling stroke() will be outlined with the color 
     *   orange. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of stroke() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the stroke 
     *   color. 
     * 
     *   The version of stroke() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of stroke() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of stroke() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param v1 red value if color mode is RGB or hue 
     *   value if color mode is HSB.
     *   @param v2 green value if color mode is RGB or 
     *   saturation value if color mode is HSB.
     *   @param v3 blue value if color mode is RGB or 
     *   brightness value if color mode is HSB.
     *   @param [alpha] alpha value, controls transparency 
     *   (0 - transparent, 255 - opaque).
     */
    function stroke(v1: number, v2: number, v3: number, alpha?: number): void

    /**
     *   Sets the color used to draw points, lines, and the 
     *   outlines of shapes. Calling stroke(255, 165, 0) or 
     *   stroke('orange') means all shapes drawn after 
     *   calling stroke() will be outlined with the color 
     *   orange. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of stroke() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the stroke 
     *   color. 
     * 
     *   The version of stroke() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of stroke() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of stroke() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param value a color string.
     */
    function stroke(value: string): void

    /**
     *   Sets the color used to draw points, lines, and the 
     *   outlines of shapes. Calling stroke(255, 165, 0) or 
     *   stroke('orange') means all shapes drawn after 
     *   calling stroke() will be outlined with the color 
     *   orange. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of stroke() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the stroke 
     *   color. 
     * 
     *   The version of stroke() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of stroke() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of stroke() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param gray a grayscale value.
     *   @param [alpha] alpha value, controls transparency 
     *   (0 - transparent, 255 - opaque).
     */
    function stroke(gray: number, alpha?: number): void

    /**
     *   Sets the color used to draw points, lines, and the 
     *   outlines of shapes. Calling stroke(255, 165, 0) or 
     *   stroke('orange') means all shapes drawn after 
     *   calling stroke() will be outlined with the color 
     *   orange. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of stroke() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the stroke 
     *   color. 
     * 
     *   The version of stroke() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of stroke() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of stroke() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param values an array containing the red, green, 
     *   blue, and alpha components of the color.
     */
    function stroke(values: number[]): void

    /**
     *   Sets the color used to draw points, lines, and the 
     *   outlines of shapes. Calling stroke(255, 165, 0) or 
     *   stroke('orange') means all shapes drawn after 
     *   calling stroke() will be outlined with the color 
     *   orange. The way these parameters are interpreted 
     *   may be changed with the colorMode() function. 
     * 
     *   The version of stroke() with one parameter 
     *   interprets the value one of three ways. If the 
     *   parameter is a Number, it's interpreted as a 
     *   grayscale value. If the parameter is a String, 
     *   it's interpreted as a CSS color string. A p5.Color 
     *   object can also be provided to set the stroke 
     *   color. 
     * 
     *   The version of stroke() with two parameters 
     *   interprets the first one as a grayscale value. The 
     *   second parameter sets the alpha (transparency) 
     *   value. 
     * 
     *   The version of stroke() with three parameters 
     *   interprets them as RGB, HSB, or HSL colors, 
     *   depending on the current colorMode(). 
     * 
     *   The version of stroke() with four parameters 
     *   interprets them as RGBA, HSBA, or HSLA colors, 
     *   depending on the current colorMode(). The last 
     *   parameter sets the alpha (transparency) value.
     *   @param color the stroke color.
     */
    function stroke(color: p5.Color): void

    /**
     *   Starts using shapes to erase parts of the canvas. 
     *   All drawing that follows erase() will subtract 
     *   from the canvas, revealing the web page 
     *   underneath. The erased areas will become 
     *   transparent, allowing the content behind the 
     *   canvas to show through. The fill(), stroke(), and 
     *   blendMode() have no effect once erase() is called. 
     * 
     *   The erase() function has two optional parameters. 
     *   The first parameter sets the strength of erasing 
     *   by the shape's interior. A value of 0 means that 
     *   no erasing will occur. A value of 255 means that 
     *   the shape's interior will fully erase the content 
     *   underneath. The default value is 255 (full 
     *   strength). 
     * 
     *   The second parameter sets the strength of erasing 
     *   by the shape's edge. A value of 0 means that no 
     *   erasing will occur. A value of 255 means that the 
     *   shape's edge will fully erase the content 
     *   underneath. The default value is 255 (full 
     *   strength). 
     * 
     *   To cancel the erasing effect, use the noErase() 
     *   function. 
     * 
     *   erase() has no effect on drawing done with the 
     *   image() and background() functions.
     *   @param [strengthFill] a number (0-255) for the 
     *   strength of erasing under a shape's interior. 
     *   Defaults to 255, which is full strength.
     *   @param [strengthStroke] a number (0-255) for the 
     *   strength of erasing under a shape's edge. Defaults 
     *   to 255, which is full strength.
     */
    function erase(strengthFill?: number, strengthStroke?: number): void

    /**
     *   Ends erasing that was started with erase(). The 
     *   fill(), stroke(), and blendMode() settings will 
     *   return to what they were prior to calling erase().
     */
    function noErase(): void

    // TODO: Fix blendMode() errors in src/scripts/parsers/in/p5.js/src/color/setting.js, line undefined:
    //
    //    param "mode" has invalid type: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT
    //
    // function blendMode(mode: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT): void

    /**
     *   Clears the pixels on the canvas. clear() makes 
     *   every pixel 100% transparent. Calling clear() 
     *   doesn't clear objects created by createX() 
     *   functions such as createGraphics(), createVideo(), 
     *   and createImg(). These objects will remain 
     *   unchanged after calling clear() and can be 
     *   redrawn. 
     * 
     *   In WebGL mode, this function can clear the screen 
     *   to a specific color. It interprets four numeric 
     *   parameters as normalized RGBA color values. It 
     *   also clears the depth buffer. If you are not using 
     *   the WebGL renderer, these parameters will have no 
     *   effect.
     *   @param [r] normalized red value.
     *   @param [g] normalized green value.
     *   @param [b] normalized blue value.
     *   @param [a] normalized alpha value.
     */
    function clear(r?: number, g?: number, b?: number, a?: number): void

    /**
     *   Clears the pixels on the canvas. clear() makes 
     *   every pixel 100% transparent. Calling clear() 
     *   doesn't clear objects created by createX() 
     *   functions such as createGraphics(), createVideo(), 
     *   and createImg(). These objects will remain 
     *   unchanged after calling clear() and can be 
     *   redrawn. 
     * 
     *   In WebGL mode, this function can clear the screen 
     *   to a specific color. It interprets four numeric 
     *   parameters as normalized RGBA color values. It 
     *   also clears the depth buffer. If you are not using 
     *   the WebGL renderer, these parameters will have no 
     *   effect.
     */
    function clear(): void

    /**
     *   Displays text in the web browser's console. 
     *   print() is helpful for printing values while 
     *   debugging. Each call to print() creates a new line 
     *   of text. 
     * 
     *   Note: Call print('\n') to print a blank line. 
     *   Calling print() without an argument opens the 
     *   browser's dialog for printing documents.
     *   @param contents content to print to the console.
     */
    function print(contents: any): void

    /**
     *   Displays text in the web browser's console. 
     *   print() is helpful for printing values while 
     *   debugging. Each call to print() creates a new line 
     *   of text. 
     * 
     *   Note: Call print('\n') to print a blank line. 
     *   Calling print() without an argument opens the 
     *   browser's dialog for printing documents.
     *   @param data data to be written as a string, 
     *   number, or array of strings and numbers.
     */
    function print(data: string|number|any[]): void

    // TODO: Fix loadJSON() errors in src/scripts/parsers/in/p5.js/src/io/files.js, line undefined:
    //
    //    return has invalid type: Promise<Object>
    //
    // function loadJSON(path: string, successCallback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): 

    // TODO: Fix loadStrings() errors in src/scripts/parsers/in/p5.js/src/io/files.js, line undefined:
    //
    //    return has invalid type: Promise<String[]>
    //
    // function loadStrings(path: string, successCallback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): 

    // TODO: Fix loadTable() errors in src/scripts/parsers/in/p5.js/src/io/files.js, line undefined:
    //
    //    return has invalid type: Promise<Object>
    //
    // function loadTable(filename: string, separator?: string, header?: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): 

    // TODO: Fix loadXML() errors in src/scripts/parsers/in/p5.js/src/io/files.js, line undefined:
    //
    //    return has invalid type: Promise<p5.XML>
    //
    // function loadXML(path: string, successCallback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): 

    // TODO: Fix loadBytes() errors in src/scripts/parsers/in/p5.js/src/io/files.js, line undefined:
    //
    //    return has invalid type: Promise<Uint8Array>
    //
    // function loadBytes(file: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): 

    // TODO: Fix loadBlob() errors in src/scripts/parsers/in/p5.js/src/io/files.js, line undefined:
    //
    //    return has invalid type: Promise<Blob>
    //
    // function loadBlob(path: string, successCallback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): 

    /**
     *   Method for executing an HTTP GET request. If data 
     *   type is not specified, it will default to 'text'. 
     *   This is equivalent to calling httpDo(path, 'GET'). 
     *   The 'binary' datatype will return a Blob object, 
     *   and the 'arrayBuffer' datatype will return an 
     *   ArrayBuffer which can be used to initialize typed 
     *   arrays (such as Uint8Array).
     *   @param path name of the file or url to load
     *   @param [datatype] "json", "jsonp", "binary", 
     *   "arrayBuffer", "xml", or "text"
     *   @param [callback] function to be executed after 
     *   httpGet() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     *   @return A promise that resolves with the data when 
     *   the operation completes successfully or rejects 
     *   with the error after one occurs.
     */
    function httpGet(path: string, datatype?: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Method for executing an HTTP GET request. If data 
     *   type is not specified, it will default to 'text'. 
     *   This is equivalent to calling httpDo(path, 'GET'). 
     *   The 'binary' datatype will return a Blob object, 
     *   and the 'arrayBuffer' datatype will return an 
     *   ArrayBuffer which can be used to initialize typed 
     *   arrays (such as Uint8Array).
     *   @param path name of the file or url to load
     *   @param callback function to be executed after 
     *   httpGet() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     */
    function httpGet(path: string, callback: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Method for executing an HTTP POST request. If data 
     *   type is not specified, it will default to 'text'. 
     *   This is equivalent to calling httpDo(path, 
     *   'POST').
     *   @param path name of the file or url to load
     *   @param [data] param data passed sent with request
     *   @param [datatype] "json", "jsonp", "xml", or 
     *   "text". If omitted, httpPost() will guess.
     *   @param [callback] function to be executed after 
     *   httpPost() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     *   @return A promise that resolves with the data when 
     *   the operation completes successfully or rejects 
     *   with the error after one occurs.
     */
    function httpPost(path: string, data?: object|boolean, datatype?: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Method for executing an HTTP POST request. If data 
     *   type is not specified, it will default to 'text'. 
     *   This is equivalent to calling httpDo(path, 
     *   'POST').
     *   @param path name of the file or url to load
     *   @param data param data passed sent with request
     *   @param [callback] function to be executed after 
     *   httpPost() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     */
    function httpPost(path: string, data: object|boolean, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Method for executing an HTTP POST request. If data 
     *   type is not specified, it will default to 'text'. 
     *   This is equivalent to calling httpDo(path, 
     *   'POST').
     *   @param path name of the file or url to load
     *   @param [callback] function to be executed after 
     *   httpPost() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     */
    function httpPost(path: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Method for executing an HTTP request. If data type 
     *   is not specified, it will default to 'text'. This 
     *   function is meant for more advanced usage of HTTP 
     *   requests in p5.js. It is best used when a Request 
     *   object is passed to the path parameter. 
     * 
     *   This method is suitable for fetching files up to 
     *   size of 64MB when "GET" is used.
     *   @param path name of the file or url to load
     *   @param [method] either "GET", "POST", "PUT", 
     *   "DELETE", or other HTTP request methods
     *   @param [datatype] "json", "jsonp", "xml", or 
     *   "text"
     *   @param [data] param data passed sent with request
     *   @param [callback] function to be executed after 
     *   httpGet() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     *   @return A promise that resolves with the data when 
     *   the operation completes successfully or rejects 
     *   with the error after one occurs.
     */
    function httpDo(path: string, method?: string, datatype?: string, data?: object, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Method for executing an HTTP request. If data type 
     *   is not specified, it will default to 'text'. This 
     *   function is meant for more advanced usage of HTTP 
     *   requests in p5.js. It is best used when a Request 
     *   object is passed to the path parameter. 
     * 
     *   This method is suitable for fetching files up to 
     *   size of 64MB when "GET" is used.
     *   @param path name of the file or url to load
     *   @param [callback] function to be executed after 
     *   httpGet() completes, data is passed in as first 
     *   argument
     *   @param [errorCallback] function to be executed if 
     *   there is an error, response is passed in as first 
     *   argument
     */
    function httpDo(path: string, callback?: (...args: any[]) => any, errorCallback?: (...args: any[]) => any): Promise<any>

    /**
     *   Creates a new p5.PrintWriter object. 
     *   p5.PrintWriter objects provide a way to save a 
     *   sequence of text data, called the print stream, to 
     *   the user's computer. They're low-level objects 
     *   that enable precise control of text output. 
     *   Functions such as saveStrings() and saveJSON() are 
     *   easier to use for simple file saving. 
     * 
     *   The first parameter, filename, is the name of the 
     *   file to be written. If a string is passed, as in 
     *   createWriter('words.txt'), a new p5.PrintWriter 
     *   object will be created that writes to a file named 
     *   words.txt. 
     * 
     *   The second parameter, extension, is optional. If a 
     *   string is passed, as in createWriter('words', 
     *   'csv'), the first parameter will be interpreted as 
     *   the file name and the second parameter as the 
     *   extension.
     *   @param name name of the file to create.
     *   @param [extension] format to use for the file.
     *   @return stream for writing data.
     */
    function createWriter(name: string, extension?: string): p5.PrintWriter

    /**
     *   Writes data to the print stream without adding new 
     *   lines. The parameter, data, is the data to write. 
     *   data can be a number or string, as in 
     *   myWriter.write('hi'), or an array of numbers and 
     *   strings, as in myWriter.write([1, 2, 3]). A comma 
     *   will be inserted between array array elements when 
     *   they're added to the print stream.
     *   @param data data to be written as a string, 
     *   number, or array of strings and numbers.
     */
    function write(data: string|number|any[]): void

    /**
     *   Saves the file and closes the print stream.
     */
    function close(): void

    /**
     *   Saves a given element(image, text, json, csv, wav, 
     *   or html) to the client's computer. The first 
     *   parameter can be a pointer to element we want to 
     *   save. The element can be one of p5.Element,an 
     *   Array of Strings, an Array of JSON, a JSON object, 
     *   a p5.Table , a p5.Image, or a p5.SoundFile 
     *   (requires p5.sound). The second parameter is a 
     *   filename (including extension).The third parameter 
     *   is for options specific to this type of object. 
     *   This method will save a file that fits the given 
     *   parameters. If it is called without specifying an 
     *   element, by default it will save the whole canvas 
     *   as an image file. You can optionally specify a 
     *   filename as the first parameter in such a case. 
     *   Note that it is not recommended to call this 
     *   method within draw, as it will open a new save 
     *   dialog on every render.
     *   @param [objectOrFilename] If filename is provided, 
     *   will save canvas as an image with either png or 
     *   jpg extension depending on the filename. If object 
     *   is provided, will save depending on the object and 
     *   filename (see examples above).
     *   @param [filename] If an object is provided as the 
     *   first parameter, then the second parameter 
     *   indicates the filename, and should include an 
     *   appropriate file extension (see examples above).
     *   @param [options] Additional options depend on 
     *   filetype. For example, when saving JSON, true 
     *   indicates that the output will be optimized for 
     *   filesize, rather than readability.
     */
    function save(objectOrFilename?: object|string, filename?: string, options?: boolean|string): void

    /**
     *   Saves an Object or Array to a JSON file. 
     *   JavaScript Object Notation (JSON) is a standard 
     *   format for sending data between applications. The 
     *   format is based on JavaScript objects which have 
     *   keys and values. JSON files store data in an 
     *   object with strings as keys. Values can be 
     *   strings, numbers, Booleans, arrays, null, or other 
     *   objects. 
     * 
     *   The first parameter, json, is the data to save. 
     *   The data can be an array, as in [1, 2, 3], or an 
     *   object, as in { x: 50, y: 50, color: 'deeppink' }. 
     * 
     *   The second parameter, filename, is a string that 
     *   sets the file's name. For example, calling 
     *   saveJSON([1, 2, 3], 'data.json') saves the array 
     *   [1, 2, 3] to a file called data.json on the user's 
     *   computer. 
     * 
     *   The third parameter, optimize, is optional. If 
     *   true is passed, as in saveJSON([1, 2, 3], 
     *   'data.json', true), then all unneeded whitespace 
     *   will be removed to reduce the file size. 
     * 
     *   Note: The browser will either save the file 
     *   immediately or prompt the user with a dialogue 
     *   window.
     *   @param json data to save.
     *   @param filename name of the file to be saved.
     *   @param [optimize] whether to trim unneeded 
     *   whitespace. Defaults to true.
     */
    function saveJSON(json: any[]|object, filename: string, optimize?: boolean): void

    /**
     *   Saves an Array of Strings to a file, one per line. 
     *   The first parameter, list, is an array with the 
     *   strings to save. 
     * 
     *   The second parameter, filename, is a string that 
     *   sets the file's name. For example, calling 
     *   saveStrings(['0', '01', '011'], 'data.txt') saves 
     *   the array ['0', '01', '011'] to a file called 
     *   data.txt on the user's computer. 
     * 
     *   The third parameter, extension, is optional. If a 
     *   string is passed, as in saveStrings(['0', '01', 
     *   '01'], 'data', 'txt')`, the second parameter will 
     *   be interpreted as the file name and the third 
     *   parameter as the extension. 
     * 
     *   The fourth parameter, isCRLF, is also optional, If 
     *   true is passed, as in saveStrings(['0', '01', 
     *   '011'], 'data', 'txt', true), then two characters, 
     *   \r\n , will be added to the end of each string to 
     *   create new lines in the saved file. \r is a 
     *   carriage return (CR) and \n is a line feed (LF). 
     *   By default, only \n (line feed) is added to each 
     *   string in order to create new lines. 
     * 
     *   Note: The browser will either save the file 
     *   immediately or prompt the user with a dialogue 
     *   window.
     *   @param list data to save.
     *   @param filename name of file to be saved.
     *   @param [extension] format to use for the file.
     *   @param [isCRLF] whether to add \r\n to the end of 
     *   each string. Defaults to false.
     */
    function saveStrings(list: string[], filename: string, extension?: string, isCRLF?: boolean): void

    /**
     *   Writes the contents of a Table object to a file. 
     *   Defaults to a text file with 
     *   comma-separated-values ('csv') but can also use 
     *   tab separation ('tsv'), or generate an HTML table 
     *   ('html'). The file saving process and location of 
     *   the saved file will vary between web browsers.
     *   @param Table the Table object to save to a file
     *   @param filename the filename to which the Table 
     *   should be saved
     *   @param [options] can be one of "tsv", "csv", or 
     *   "html"
     */
    function saveTable(Table: p5.Table, filename: string, options?: string): void

    /**
     *   Applies a transformation matrix to the coordinate 
     *   system. Transformations such as translate(), 
     *   rotate(), and scale() use matrix-vector 
     *   multiplication behind the scenes. A table of 
     *   numbers, called a matrix, encodes each 
     *   transformation. The values in the matrix then 
     *   multiply each point on the canvas, which is 
     *   represented by a vector. 
     * 
     *   applyMatrix() allows for many transformations to 
     *   be applied at once. See Wikipedia and MDN for more 
     *   details about transformations. 
     * 
     *   There are two ways to call applyMatrix() in two 
     *   and three dimensions. 
     * 
     *   In 2D mode, the parameters a, b, c, d, e, and f, 
     *   correspond to elements in the following 
     *   transformation matrix: 
     * 
     *   The numbers can be passed individually, as in 
     *   applyMatrix(2, 0, 0, 0, 2, 0). They can also be 
     *   passed in an array, as in applyMatrix([2, 0, 0, 0, 
     *   2, 0]). 
     * 
     *   In 3D mode, the parameters a, b, c, d, e, f, g, h, 
     *   i, j, k, l, m, n, o, and p correspond to elements 
     *   in the following transformation matrix: 
     * 
     *  
     * 
     *   The numbers can be passed individually, as in 
     *   applyMatrix(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 
     *   0, 0, 1). They can also be passed in an array, as 
     *   in applyMatrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 
     *   0, 0, 0, 0, 1]). 
     * 
     *   By default, transformations accumulate. The push() 
     *   and pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling applyMatrix() inside the 
     *   draw() function won't cause shapes to transform 
     *   continuously.
     *   @param arr an array containing the elements of the 
     *   transformation matrix. Its length should be either 
     *   6 (2D) or 16 (3D).
     */
    function applyMatrix(arr: number[]): void

    /**
     *   Applies a transformation matrix to the coordinate 
     *   system. Transformations such as translate(), 
     *   rotate(), and scale() use matrix-vector 
     *   multiplication behind the scenes. A table of 
     *   numbers, called a matrix, encodes each 
     *   transformation. The values in the matrix then 
     *   multiply each point on the canvas, which is 
     *   represented by a vector. 
     * 
     *   applyMatrix() allows for many transformations to 
     *   be applied at once. See Wikipedia and MDN for more 
     *   details about transformations. 
     * 
     *   There are two ways to call applyMatrix() in two 
     *   and three dimensions. 
     * 
     *   In 2D mode, the parameters a, b, c, d, e, and f, 
     *   correspond to elements in the following 
     *   transformation matrix: 
     * 
     *   The numbers can be passed individually, as in 
     *   applyMatrix(2, 0, 0, 0, 2, 0). They can also be 
     *   passed in an array, as in applyMatrix([2, 0, 0, 0, 
     *   2, 0]). 
     * 
     *   In 3D mode, the parameters a, b, c, d, e, f, g, h, 
     *   i, j, k, l, m, n, o, and p correspond to elements 
     *   in the following transformation matrix: 
     * 
     *  
     * 
     *   The numbers can be passed individually, as in 
     *   applyMatrix(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 
     *   0, 0, 1). They can also be passed in an array, as 
     *   in applyMatrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 
     *   0, 0, 0, 0, 1]). 
     * 
     *   By default, transformations accumulate. The push() 
     *   and pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling applyMatrix() inside the 
     *   draw() function won't cause shapes to transform 
     *   continuously.
     *   @param a an element of the transformation matrix.
     *   @param b an element of the transformation matrix.
     *   @param c an element of the transformation matrix.
     *   @param d an element of the transformation matrix.
     *   @param e an element of the transformation matrix.
     *   @param f an element of the transformation matrix.
     */
    function applyMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void

    /**
     *   Applies a transformation matrix to the coordinate 
     *   system. Transformations such as translate(), 
     *   rotate(), and scale() use matrix-vector 
     *   multiplication behind the scenes. A table of 
     *   numbers, called a matrix, encodes each 
     *   transformation. The values in the matrix then 
     *   multiply each point on the canvas, which is 
     *   represented by a vector. 
     * 
     *   applyMatrix() allows for many transformations to 
     *   be applied at once. See Wikipedia and MDN for more 
     *   details about transformations. 
     * 
     *   There are two ways to call applyMatrix() in two 
     *   and three dimensions. 
     * 
     *   In 2D mode, the parameters a, b, c, d, e, and f, 
     *   correspond to elements in the following 
     *   transformation matrix: 
     * 
     *   The numbers can be passed individually, as in 
     *   applyMatrix(2, 0, 0, 0, 2, 0). They can also be 
     *   passed in an array, as in applyMatrix([2, 0, 0, 0, 
     *   2, 0]). 
     * 
     *   In 3D mode, the parameters a, b, c, d, e, f, g, h, 
     *   i, j, k, l, m, n, o, and p correspond to elements 
     *   in the following transformation matrix: 
     * 
     *  
     * 
     *   The numbers can be passed individually, as in 
     *   applyMatrix(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 
     *   0, 0, 1). They can also be passed in an array, as 
     *   in applyMatrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 
     *   0, 0, 0, 0, 1]). 
     * 
     *   By default, transformations accumulate. The push() 
     *   and pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling applyMatrix() inside the 
     *   draw() function won't cause shapes to transform 
     *   continuously.
     *   @param a an element of the transformation matrix.
     *   @param b an element of the transformation matrix.
     *   @param c an element of the transformation matrix.
     *   @param d an element of the transformation matrix.
     *   @param e an element of the transformation matrix.
     *   @param f an element of the transformation matrix.
     *   @param g an element of the transformation matrix.
     *   @param h an element of the transformation matrix.
     *   @param i an element of the transformation matrix.
     *   @param j an element of the transformation matrix.
     *   @param k an element of the transformation matrix.
     *   @param l an element of the transformation matrix.
     *   @param m an element of the transformation matrix.
     *   @param n an element of the transformation matrix.
     *   @param o an element of the transformation matrix.
     *   @param p an element of the transformation matrix.
     */
    function applyMatrix(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number): void

    /**
     *   Clears all transformations applied to the 
     *   coordinate system.
     */
    function resetMatrix(): void

    /**
     *   Rotates the coordinate system. By default, the 
     *   positive x-axis points to the right and the 
     *   positive y-axis points downward. The rotate() 
     *   function changes this orientation by rotating the 
     *   coordinate system about the origin. Everything 
     *   drawn after rotate() is called will appear to be 
     *   rotated. 
     * 
     *   The first parameter, angle, is the amount to 
     *   rotate. For example, calling rotate(1) rotates the 
     *   coordinate system clockwise 1 radian which is 
     *   nearly 57˚. rotate() interprets angle values using 
     *   the current angleMode(). 
     * 
     *   The second parameter, axis, is optional. It's used 
     *   to orient 3D rotations in WebGL mode. If a 
     *   p5.Vector is passed, as in rotate(QUARTER_PI, 
     *   myVector), then the coordinate system will rotate 
     *   QUARTER_PI radians about myVector. If an array of 
     *   vector components is passed, as in 
     *   rotate(QUARTER_PI, [1, 0, 0]), then the coordinate 
     *   system will rotate QUARTER_PI radians about a 
     *   vector with the components [1, 0, 0]. 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling rotate(1) twice has the same 
     *   effect as calling rotate(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling rotate(1) inside the 
     *   draw() function won't cause shapes to spin.
     *   @param angle angle of rotation in the current 
     *   angleMode().
     *   @param [axis] axis to rotate about in 3D.
     */
    function rotate(angle: number, axis?: p5.Vector|number[]): void

    /**
     *   Rotates the coordinate system about the x-axis in 
     *   WebGL mode. The parameter, angle, is the amount to 
     *   rotate. For example, calling rotateX(1) rotates 
     *   the coordinate system about the x-axis by 1 
     *   radian. rotateX() interprets angle values using 
     *   the current angleMode(). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling rotateX(1) twice has the same 
     *   effect as calling rotateX(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling rotateX(1) inside the 
     *   draw() function won't cause shapes to spin.
     *   @param angle angle of rotation in the current 
     *   angleMode().
     */
    function rotateX(angle: number): void

    /**
     *   Rotates the coordinate system about the y-axis in 
     *   WebGL mode. The parameter, angle, is the amount to 
     *   rotate. For example, calling rotateY(1) rotates 
     *   the coordinate system about the y-axis by 1 
     *   radian. rotateY() interprets angle values using 
     *   the current angleMode(). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling rotateY(1) twice has the same 
     *   effect as calling rotateY(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling rotateY(1) inside the 
     *   draw() function won't cause shapes to spin.
     *   @param angle angle of rotation in the current 
     *   angleMode().
     */
    function rotateY(angle: number): void

    /**
     *   Rotates the coordinate system about the z-axis in 
     *   WebGL mode. The parameter, angle, is the amount to 
     *   rotate. For example, calling rotateZ(1) rotates 
     *   the coordinate system about the z-axis by 1 
     *   radian. rotateZ() interprets angle values using 
     *   the current angleMode(). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling rotateZ(1) twice has the same 
     *   effect as calling rotateZ(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling rotateZ(1) inside the 
     *   draw() function won't cause shapes to spin.
     *   @param angle angle of rotation in the current 
     *   angleMode().
     */
    function rotateZ(angle: number): void

    /**
     *   Scales the coordinate system. By default, shapes 
     *   are drawn at their original scale. A rectangle 
     *   that's 50 pixels wide appears to take up half the 
     *   width of a 100 pixel-wide canvas. The scale() 
     *   function can shrink or stretch the coordinate 
     *   system so that shapes appear at different sizes. 
     *   There are two ways to call scale() with parameters 
     *   that set the scale factor(s). 
     * 
     *   The first way to call scale() uses numbers to set 
     *   the amount of scaling. The first parameter, s, 
     *   sets the amount to scale each axis. For example, 
     *   calling scale(2) stretches the x-, y-, and z-axes 
     *   by a factor of 2. The next two parameters, y and 
     *   z, are optional. They set the amount to scale the 
     *   y- and z-axes. For example, calling scale(2, 0.5, 
     *   1) stretches the x-axis by a factor of 2, shrinks 
     *   the y-axis by a factor of 0.5, and leaves the 
     *   z-axis unchanged. 
     * 
     *   The second way to call scale() uses a p5.Vector 
     *   object to set the scale factors. For example, 
     *   calling scale(myVector) uses the x-, y-, and 
     *   z-components of myVector to set the amount of 
     *   scaling along the x-, y-, and z-axes. Doing so is 
     *   the same as calling scale(myVector.x, myVector.y, 
     *   myVector.z). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling scale(1) twice has the same 
     *   effect as calling scale(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling scale(2) inside the 
     *   draw() function won't cause shapes to grow 
     *   continuously.
     *   @param s amount to scale along the positive 
     *   x-axis.
     *   @param [y] amount to scale along the positive 
     *   y-axis. Defaults to s.
     *   @param [z] amount to scale along the positive 
     *   z-axis. Defaults to y.
     */
    function scale(s: number|p5.Vector|number[], y?: number, z?: number): void

    /**
     *   Scales the coordinate system. By default, shapes 
     *   are drawn at their original scale. A rectangle 
     *   that's 50 pixels wide appears to take up half the 
     *   width of a 100 pixel-wide canvas. The scale() 
     *   function can shrink or stretch the coordinate 
     *   system so that shapes appear at different sizes. 
     *   There are two ways to call scale() with parameters 
     *   that set the scale factor(s). 
     * 
     *   The first way to call scale() uses numbers to set 
     *   the amount of scaling. The first parameter, s, 
     *   sets the amount to scale each axis. For example, 
     *   calling scale(2) stretches the x-, y-, and z-axes 
     *   by a factor of 2. The next two parameters, y and 
     *   z, are optional. They set the amount to scale the 
     *   y- and z-axes. For example, calling scale(2, 0.5, 
     *   1) stretches the x-axis by a factor of 2, shrinks 
     *   the y-axis by a factor of 0.5, and leaves the 
     *   z-axis unchanged. 
     * 
     *   The second way to call scale() uses a p5.Vector 
     *   object to set the scale factors. For example, 
     *   calling scale(myVector) uses the x-, y-, and 
     *   z-components of myVector to set the amount of 
     *   scaling along the x-, y-, and z-axes. Doing so is 
     *   the same as calling scale(myVector.x, myVector.y, 
     *   myVector.z). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling scale(1) twice has the same 
     *   effect as calling scale(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling scale(2) inside the 
     *   draw() function won't cause shapes to grow 
     *   continuously.
     *   @param scales vector whose components should be 
     *   used to scale.
     */
    function scale(scales: p5.Vector|number[]): void

    /**
     *   Shears the x-axis so that shapes appear skewed. By 
     *   default, the x- and y-axes are perpendicular. The 
     *   shearX() function transforms the coordinate system 
     *   so that x-coordinates are translated while 
     *   y-coordinates are fixed. 
     * 
     *   The first parameter, angle, is the amount to 
     *   shear. For example, calling shearX(1) transforms 
     *   all x-coordinates using the formula x = x + y * 
     *   tan(angle). shearX() interprets angle values using 
     *   the current angleMode(). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling shearX(1) twice has the same 
     *   effect as calling shearX(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling shearX(1) inside the 
     *   draw() function won't cause shapes to shear 
     *   continuously.
     *   @param angle angle to shear by in the current 
     *   angleMode().
     */
    function shearX(angle: number): void

    /**
     *   Shears the y-axis so that shapes appear skewed. By 
     *   default, the x- and y-axes are perpendicular. The 
     *   shearY() function transforms the coordinate system 
     *   so that y-coordinates are translated while 
     *   x-coordinates are fixed. 
     * 
     *   The first parameter, angle, is the amount to 
     *   shear. For example, calling shearY(1) transforms 
     *   all y-coordinates using the formula y = y + x * 
     *   tan(angle). shearY() interprets angle values using 
     *   the current angleMode(). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling shearY(1) twice has the same 
     *   effect as calling shearY(2) once. The push() and 
     *   pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling shearY(1) inside the 
     *   draw() function won't cause shapes to shear 
     *   continuously.
     *   @param angle angle to shear by in the current 
     *   angleMode().
     */
    function shearY(angle: number): void

    /**
     *   Translates the coordinate system. By default, the 
     *   origin (0, 0) is at the sketch's top-left corner 
     *   in 2D mode and center in WebGL mode. The 
     *   translate() function shifts the origin to a 
     *   different position. Everything drawn after 
     *   translate() is called will appear to be shifted. 
     *   There are two ways to call translate() with 
     *   parameters that set the origin's position. 
     * 
     *   The first way to call translate() uses numbers to 
     *   set the amount of translation. The first two 
     *   parameters, x and y, set the amount to translate 
     *   along the positive x- and y-axes. For example, 
     *   calling translate(20, 30) translates the origin 20 
     *   pixels along the x-axis and 30 pixels along the 
     *   y-axis. The third parameter, z, is optional. It 
     *   sets the amount to translate along the positive 
     *   z-axis. For example, calling translate(20, 30, 40) 
     *   translates the origin 20 pixels along the x-axis, 
     *   30 pixels along the y-axis, and 40 pixels along 
     *   the z-axis. 
     * 
     *   The second way to call translate() uses a 
     *   p5.Vector object to set the amount of translation. 
     *   For example, calling translate(myVector) uses the 
     *   x-, y-, and z-components of myVector to set the 
     *   amount to translate along the x-, y-, and z-axes. 
     *   Doing so is the same as calling 
     *   translate(myVector.x, myVector.y, myVector.z). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling translate(10, 0) twice has the 
     *   same effect as calling translate(20, 0) once. The 
     *   push() and pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling translate(10, 0) inside 
     *   the draw() function won't cause shapes to move 
     *   continuously.
     *   @param x amount to translate along the positive 
     *   x-axis.
     *   @param y amount to translate along the positive 
     *   y-axis.
     *   @param [z] amount to translate along the positive 
     *   z-axis.
     */
    function translate(x: number, y: number, z?: number): void

    /**
     *   Translates the coordinate system. By default, the 
     *   origin (0, 0) is at the sketch's top-left corner 
     *   in 2D mode and center in WebGL mode. The 
     *   translate() function shifts the origin to a 
     *   different position. Everything drawn after 
     *   translate() is called will appear to be shifted. 
     *   There are two ways to call translate() with 
     *   parameters that set the origin's position. 
     * 
     *   The first way to call translate() uses numbers to 
     *   set the amount of translation. The first two 
     *   parameters, x and y, set the amount to translate 
     *   along the positive x- and y-axes. For example, 
     *   calling translate(20, 30) translates the origin 20 
     *   pixels along the x-axis and 30 pixels along the 
     *   y-axis. The third parameter, z, is optional. It 
     *   sets the amount to translate along the positive 
     *   z-axis. For example, calling translate(20, 30, 40) 
     *   translates the origin 20 pixels along the x-axis, 
     *   30 pixels along the y-axis, and 40 pixels along 
     *   the z-axis. 
     * 
     *   The second way to call translate() uses a 
     *   p5.Vector object to set the amount of translation. 
     *   For example, calling translate(myVector) uses the 
     *   x-, y-, and z-components of myVector to set the 
     *   amount to translate along the x-, y-, and z-axes. 
     *   Doing so is the same as calling 
     *   translate(myVector.x, myVector.y, myVector.z). 
     * 
     *   By default, transformations accumulate. For 
     *   example, calling translate(10, 0) twice has the 
     *   same effect as calling translate(20, 0) once. The 
     *   push() and pop() functions can be used to isolate 
     *   transformations within distinct drawing groups. 
     * 
     *   Note: Transformations are reset at the beginning 
     *   of the draw loop. Calling translate(10, 0) inside 
     *   the draw() function won't cause shapes to move 
     *   continuously.
     *   @param vector vector by which to translate.
     */
    function translate(vector: p5.Vector): void

    /**
     *   Begins a drawing group that contains its own 
     *   styles and transformations. By default, styles 
     *   such as fill() and transformations such as 
     *   rotate() are applied to all drawing that follows. 
     *   The push() and pop() functions can limit the 
     *   effect of styles and transformations to a specific 
     *   group of shapes, images, and text. For example, a 
     *   group of shapes could be translated to follow the 
     *   mouse without affecting the rest of the sketch: 
     * 
     *   // Begin the drawing group. push(); // Translate 
     *   the origin to the mouse's position. 
     *   translate(mouseX, mouseY); // Style the face. 
     *   noStroke(); fill('green'); // Draw the face. 
     *   circle(0, 0, 60); // Style the eyes. 
     *   fill('white'); // Draw the left eye. ellipse(-20, 
     *   -20, 30, 20); // Draw the right eye. ellipse(20, 
     *   -20, 30, 20); // End the drawing group. pop(); // 
     *   Draw a bug. let x = random(0, 100); let y = 
     *   random(0, 100); text('🦟', x, y);
     * 
     *   In the code snippet above, the bug's position 
     *   isn't affected by translate(mouseX, mouseY) 
     *   because that transformation is contained between 
     *   push() and pop(). The bug moves around the entire 
     *   canvas as expected. 
     * 
     *   Note: push() and pop() are always called as a 
     *   pair. Both functions are required to begin and end 
     *   a drawing group. 
     * 
     *   push() and pop() can also be nested to create 
     *   subgroups. For example, the code snippet above 
     *   could be changed to give more detail to the frog’s 
     *   eyes: 
     * 
     *   // Begin the drawing group. push(); // Translate 
     *   the origin to the mouse's position. 
     *   translate(mouseX, mouseY); // Style the face. 
     *   noStroke(); fill('green'); // Draw a face. 
     *   circle(0, 0, 60); // Style the eyes. 
     *   fill('white'); // Draw the left eye. push(); 
     *   translate(-20, -20); ellipse(0, 0, 30, 20); 
     *   fill('black'); circle(0, 0, 8); pop(); // Draw the 
     *   right eye. push(); translate(20, -20); ellipse(0, 
     *   0, 30, 20); fill('black'); circle(0, 0, 8); pop(); 
     *   // End the drawing group. pop(); // Draw a bug. 
     *   let x = random(0, 100); let y = random(0, 100); 
     *   text('🦟', x, y);
     * 
     *   In this version, the code to draw each eye is 
     *   contained between its own push() and pop() 
     *   functions. Doing so makes it easier to add details 
     *   in the correct part of a drawing. 
     * 
     *   push() and pop() contain the effects of the 
     *   following functions: 
     * 
     *   - fill()
     *   - noFill()
     *   - noStroke()
     *   - stroke()
     *   - tint()
     *   - noTint()
     *   - strokeWeight()
     *   - strokeCap()
     *   - strokeJoin()
     *   - imageMode()
     *   - rectMode()
     *   - ellipseMode()
     *   - colorMode()
     *   - textAlign()
     *   - textFont()
     *   - textSize()
     *   - textLeading()
     *   - applyMatrix()
     *   - resetMatrix()
     *   - rotate()
     *   - scale()
     *   - shearX()
     *   - shearY()
     *   - translate()
     * 
     *   In WebGL mode, push() and pop() contain the 
     *   effects of a few additional styles: 
     * 
     *   - setCamera()
     *   - ambientLight()
     *   - directionalLight()
     *   - pointLight() texture()
     *   - specularMaterial()
     *   - shininess()
     *   - normalMaterial()
     *   - shader()
     */
    function push(): void

    /**
     *   Ends a drawing group that contains its own styles 
     *   and transformations. By default, styles such as 
     *   fill() and transformations such as rotate() are 
     *   applied to all drawing that follows. The push() 
     *   and pop() functions can limit the effect of styles 
     *   and transformations to a specific group of shapes, 
     *   images, and text. For example, a group of shapes 
     *   could be translated to follow the mouse without 
     *   affecting the rest of the sketch: 
     * 
     *   // Begin the drawing group. push(); // Translate 
     *   the origin to the mouse's position. 
     *   translate(mouseX, mouseY); // Style the face. 
     *   noStroke(); fill('green'); // Draw the face. 
     *   circle(0, 0, 60); // Style the eyes. 
     *   fill('white'); // Draw the left eye. ellipse(-20, 
     *   -20, 30, 20); // Draw the right eye. ellipse(20, 
     *   -20, 30, 20); // End the drawing group. pop(); // 
     *   Draw a bug. let x = random(0, 100); let y = 
     *   random(0, 100); text('🦟', x, y);
     * 
     *   In the code snippet above, the bug's position 
     *   isn't affected by translate(mouseX, mouseY) 
     *   because that transformation is contained between 
     *   push() and pop(). The bug moves around the entire 
     *   canvas as expected. 
     * 
     *   Note: push() and pop() are always called as a 
     *   pair. Both functions are required to begin and end 
     *   a drawing group. 
     * 
     *   push() and pop() can also be nested to create 
     *   subgroups. For example, the code snippet above 
     *   could be changed to give more detail to the frog’s 
     *   eyes: 
     * 
     *   // Begin the drawing group. push(); // Translate 
     *   the origin to the mouse's position. 
     *   translate(mouseX, mouseY); // Style the face. 
     *   noStroke(); fill('green'); // Draw a face. 
     *   circle(0, 0, 60); // Style the eyes. 
     *   fill('white'); // Draw the left eye. push(); 
     *   translate(-20, -20); ellipse(0, 0, 30, 20); 
     *   fill('black'); circle(0, 0, 8); pop(); // Draw the 
     *   right eye. push(); translate(20, -20); ellipse(0, 
     *   0, 30, 20); fill('black'); circle(0, 0, 8); pop(); 
     *   // End the drawing group. pop(); // Draw a bug. 
     *   let x = random(0, 100); let y = random(0, 100); 
     *   text('🦟', x, y);
     * 
     *   In this version, the code to draw each eye is 
     *   contained between its own push() and pop() 
     *   functions. Doing so makes it easier to add details 
     *   in the correct part of a drawing. 
     * 
     *   push() and pop() contain the effects of the 
     *   following functions: 
     * 
     *   - fill()
     *   - noFill()
     *   - noStroke()
     *   - stroke()
     *   - tint()
     *   - noTint()
     *   - strokeWeight()
     *   - strokeCap()
     *   - strokeJoin()
     *   - imageMode()
     *   - rectMode()
     *   - ellipseMode()
     *   - colorMode()
     *   - textAlign()
     *   - textFont()
     *   - textSize()
     *   - textLeading()
     *   - applyMatrix()
     *   - resetMatrix()
     *   - rotate()
     *   - scale()
     *   - shearX()
     *   - shearY()
     *   - translate()
     * 
     *   In WebGL mode, push() and pop() contain the 
     *   effects of a few additional styles: 
     * 
     *   - setCamera()
     *   - ambientLight()
     *   - directionalLight()
     *   - pointLight() texture()
     *   - specularMaterial()
     *   - shininess()
     *   - normalMaterial()
     *   - shader()
     */
    function pop(): void

    /**
     *   Stores a value in the web browser's local storage. 
     *   Web browsers can save small amounts of data using 
     *   the built-in localStorage object. Data stored in 
     *   localStorage can be retrieved at any point, even 
     *   after refreshing a page or restarting the browser. 
     *   Data are stored as key-value pairs. 
     * 
     *   storeItem() makes it easy to store values in 
     *   localStorage and getItem() makes it easy to 
     *   retrieve them. 
     * 
     *   The first parameter, key, is the name of the value 
     *   to be stored as a string. 
     * 
     *   The second parameter, value, is the value to be 
     *   stored. Values can have any type. 
     * 
     *   Note: Sensitive data such as passwords or personal 
     *   information shouldn't be stored in localStorage.
     *   @param key name of the value.
     *   @param value value to be stored.
     */
    function storeItem(key: string, value: string|number|boolean|object|any[]): void

    /**
     *   Returns a value in the web browser's local 
     *   storage. Web browsers can save small amounts of 
     *   data using the built-in localStorage object. Data 
     *   stored in localStorage can be retrieved at any 
     *   point, even after refreshing a page or restarting 
     *   the browser. Data are stored as key-value pairs. 
     * 
     *   storeItem() makes it easy to store values in 
     *   localStorage and getItem() makes it easy to 
     *   retrieve them. 
     * 
     *   The first parameter, key, is the name of the value 
     *   to be stored as a string. 
     * 
     *   The second parameter, value, is the value to be 
     *   retrieved a string. For example, calling 
     *   getItem('size') retrieves the value with the key 
     *   size. 
     * 
     *   Note: Sensitive data such as passwords or personal 
     *   information shouldn't be stored in localStorage.
     *   @param key name of the value.
     *   @return stored item.
     */
    function getItem(key: string): string|number|boolean|object|any[]

    /**
     *   Removes all items in the web browser's local 
     *   storage. Web browsers can save small amounts of 
     *   data using the built-in localStorage object. Data 
     *   stored in localStorage can be retrieved at any 
     *   point, even after refreshing a page or restarting 
     *   the browser. Data are stored as key-value pairs. 
     *   Calling clearStorage() removes all data from 
     *   localStorage. 
     * 
     *   Note: Sensitive data such as passwords or personal 
     *   information shouldn't be stored in localStorage.
     */
    function clearStorage(): void

    /**
     *   Removes an item from the web browser's local 
     *   storage. Web browsers can save small amounts of 
     *   data using the built-in localStorage object. Data 
     *   stored in localStorage can be retrieved at any 
     *   point, even after refreshing a page or restarting 
     *   the browser. Data are stored as key-value pairs. 
     * 
     *   storeItem() makes it easy to store values in 
     *   localStorage and removeItem() makes it easy to 
     *   delete them. 
     * 
     *   The parameter, key, is the name of the value to 
     *   remove as a string. For example, calling 
     *   removeItem('size') removes the item with the key 
     *   size. 
     * 
     *   Note: Sensitive data such as passwords or personal 
     *   information shouldn't be stored in localStorage.
     *   @param key name of the value to remove.
     */
    function removeItem(key: string): void

    /**
     *   Searches the page for the first element that 
     *   matches the given CSS selector string. The 
     *   selector string can be an ID, class, tag name, or 
     *   a combination. select() returns a p5.Element 
     *   object if it finds a match and null if not. 
     * 
     *   The second parameter, container, is optional. It 
     *   specifies a container to search within. container 
     *   can be CSS selector string, a p5.Element object, 
     *   or an HTMLElement object.
     *   @param selectors CSS selector string of element to 
     *   search for.
     *   @param [container] CSS selector string, 
     *   p5.Element, or HTMLElement to search within.
     *   @return p5.Element containing the element.
     */
    function select(selectors: string, container?: string|p5.Element|HTMLElement): p5.Element

    /**
     *   Searches the page for all elements that matches 
     *   the given CSS selector string. The selector string 
     *   can be an ID, class, tag name, or a combination. 
     *   selectAll() returns an array of p5.Element objects 
     *   if it finds any matches and an empty array if none 
     *   are found. 
     * 
     *   The second parameter, container, is optional. It 
     *   specifies a container to search within. container 
     *   can be CSS selector string, a p5.Element object, 
     *   or an HTMLElement object.
     *   @param selectors CSS selector string of element to 
     *   search for.
     *   @param [container] CSS selector string, 
     *   p5.Element, or HTMLElement to search within.
     *   @return array of p5.Elements containing any 
     *   elements found.
     */
    function selectAll(selectors: string, container?: string|p5.Element|HTMLElement): p5.Element[]

    /**
     *   Creates a new p5.Element object. The first 
     *   parameter, tag, is a string an HTML tag such as 
     *   'h5'. 
     * 
     *   The second parameter, content, is optional. It's a 
     *   string that sets the HTML content to insert into 
     *   the new element. New elements have no content by 
     *   default.
     *   @param tag tag for the new element.
     *   @param [content] HTML content to insert into the 
     *   element.
     *   @return new p5.Element object.
     */
    function createElement(tag: string, content?: string): p5.Element

    /**
     *   Removes all elements created by p5.js, including 
     *   any event handlers. There are two exceptions: 
     *   canvas elements created by createCanvas() and 
     *   p5.Render objects created by createGraphics().
     */
    function removeElements(): void

    /**
     *   Creates a <div></div> element. <div></div> 
     *   elements are commonly used as containers for other 
     *   elements. 
     * 
     *   The parameter html is optional. It accepts a 
     *   string that sets the inner HTML of the new 
     *   <div></div>.
     *   @param [html] inner HTML for the new <div></div> 
     *   element.
     *   @return new p5.Element object.
     */
    function createDiv(html?: string): p5.Element

    /**
     *   Creates a paragraph element. <p></p> elements are 
     *   commonly used for paragraph-length text. 
     * 
     *   The parameter html is optional. It accepts a 
     *   string that sets the inner HTML of the new 
     *   <p></p>.
     *   @param [html] inner HTML for the new <p></p> 
     *   element.
     *   @return new p5.Element object.
     */
    function createP(html?: string): p5.Element

    /**
     *   Creates a <span></span> element. <span></span> 
     *   elements are commonly used as containers for 
     *   inline elements. For example, a <span></span> can 
     *   hold part of a sentence that's a different style. 
     * 
     *   The parameter html is optional. It accepts a 
     *   string that sets the inner HTML of the new 
     *   <span></span>.
     *   @param [html] inner HTML for the new <span></span> 
     *   element.
     *   @return new p5.Element object.
     */
    function createSpan(html?: string): p5.Element

    /**
     *   Creates an <img> element that can appear outside 
     *   of the canvas. The first parameter, src, is a 
     *   string with the path to the image file. src should 
     *   be a relative path, as in 'assets/image.png', or a 
     *   URL, as in 'https://example.com/image.png'. 
     * 
     *   The second parameter, alt, is a string with the 
     *   alternate text for the image. An empty string '' 
     *   can be used for images that aren't displayed. 
     * 
     *   The third parameter, crossOrigin, is optional. 
     *   It's a string that sets the crossOrigin property 
     *   of the image. Use 'anonymous' or 'use-credentials' 
     *   to fetch the image with cross-origin access. 
     * 
     *   The fourth parameter, callback, is also optional. 
     *   It sets a function to call after the image loads. 
     *   The new image is passed to the callback function 
     *   as a p5.Element object.
     *   @param src relative path or URL for the image.
     *   @param alt alternate text for the image.
     *   @return new p5.Element object.
     */
    function createImg(src: string, alt: string): p5.Element

    /**
     *   Creates an <img> element that can appear outside 
     *   of the canvas. The first parameter, src, is a 
     *   string with the path to the image file. src should 
     *   be a relative path, as in 'assets/image.png', or a 
     *   URL, as in 'https://example.com/image.png'. 
     * 
     *   The second parameter, alt, is a string with the 
     *   alternate text for the image. An empty string '' 
     *   can be used for images that aren't displayed. 
     * 
     *   The third parameter, crossOrigin, is optional. 
     *   It's a string that sets the crossOrigin property 
     *   of the image. Use 'anonymous' or 'use-credentials' 
     *   to fetch the image with cross-origin access. 
     * 
     *   The fourth parameter, callback, is also optional. 
     *   It sets a function to call after the image loads. 
     *   The new image is passed to the callback function 
     *   as a p5.Element object.
     *   @param src relative path or URL for the image.
     *   @param alt alternate text for the image.
     *   @param [crossOrigin] crossOrigin property to use 
     *   when fetching the image.
     *   @param [successCallback] function to call once the 
     *   image loads. The new image will be passed to the 
     *   function as a p5.Element object.
     *   @return new p5.Element object.
     */
    function createImg(src: string, alt: string, crossOrigin?: string, successCallback?: (...args: any[]) => any): p5.Element

    /**
     *   Creates an <a></a> element that links to another 
     *   web page. The first parmeter, href, is a string 
     *   that sets the URL of the linked page. 
     * 
     *   The second parameter, html, is a string that sets 
     *   the inner HTML of the link. It's common to use 
     *   text, images, or buttons as links. 
     * 
     *   The third parameter, target, is optional. It's a 
     *   string that tells the web browser where to open 
     *   the link. By default, links open in the current 
     *   browser tab. Passing '_blank' will cause the link 
     *   to open in a new browser tab. MDN describes a few 
     *   other options.
     *   @param href URL of linked page.
     *   @param html inner HTML of link element to display.
     *   @param [target] target where the new link should 
     *   open, either '_blank', '_self', '_parent', or 
     *   '_top'.
     *   @return new p5.Element object.
     */
    function createA(href: string, html: string, target?: string): p5.Element

    /**
     *   Creates a slider <input></input> element. Range 
     *   sliders are useful for quickly selecting numbers 
     *   from a given range. 
     * 
     *   The first two parameters, min and max, are numbers 
     *   that set the slider's minimum and maximum. 
     * 
     *   The third parameter, value, is optional. It's a 
     *   number that sets the slider's default value. 
     * 
     *   The fourth parameter, step, is also optional. It's 
     *   a number that sets the spacing between each value 
     *   in the slider's range. Setting step to 0 allows 
     *   the slider to move smoothly from min to max.
     *   @param min minimum value of the slider.
     *   @param max maximum value of the slider.
     *   @param [value] default value of the slider.
     *   @param [step] size for each step in the slider's 
     *   range.
     *   @return new p5.Element object.
     */
    function createSlider(min: number, max: number, value?: number, step?: number): p5.Element

    /**
     *   Creates a <button></button> element. The first 
     *   parameter, label, is a string that sets the label 
     *   displayed on the button. 
     * 
     *   The second parameter, value, is optional. It's a 
     *   string that sets the button's value. See MDN for 
     *   more details.
     *   @param label label displayed on the button.
     *   @param [value] value of the button.
     *   @return new p5.Element object.
     */
    function createButton(label: string, value?: string): p5.Element

    /**
     *   Creates a checkbox <input></input> element. 
     *   Checkboxes extend the p5.Element class with a 
     *   checked() method. Calling myBox.checked() returns 
     *   true if it the box is checked and false if not. 
     * 
     *   The first parameter, label, is optional. It's a 
     *   string that sets the label to display next to the 
     *   checkbox. 
     * 
     *   The second parameter, value, is also optional. 
     *   It's a boolean that sets the checkbox's value.
     *   @param [label] label displayed after the checkbox.
     *   @param [value] value of the checkbox. Checked is 
     *   true and unchecked is false.
     *   @return new p5.Element object.
     */
    function createCheckbox(label?: string, value?: boolean): p5.Element

    /**
     *   Creates a dropdown menu <select></select> element. 
     *   The parameter is optional. If true is passed, as 
     *   in let mySelect = createSelect(true), then the 
     *   dropdown will support multiple selections. If an 
     *   existing <select></select> element is passed, as 
     *   in let mySelect = createSelect(otherSelect), the 
     *   existing element will be wrapped in a new 
     *   p5.Element object. 
     * 
     *   Dropdowns extend the p5.Element class with a few 
     *   helpful methods for managing options: 
     * 
     *   - mySelect.option(name, [value]) adds an option to 
     *   the menu. The first paremeter, name, is a string 
     *   that sets the option's name and value. The second 
     *   parameter, value, is optional. If provided, it 
     *   sets the value that corresponds to the key name. 
     *   If an option with name already exists, its value 
     *   is changed to value.
     *   - mySelect.value() returns the currently-selected 
     *   option's value.
     *   - mySelect.selected() returns the 
     *   currently-selected option.
     *   - mySelect.selected(option) selects the given 
     *   option by default.
     *   - mySelect.disable() marks the whole dropdown 
     *   element as disabled.
     *   - mySelect.disable(option) marks a given option as 
     *   disabled.
     *   - mySelect.enable() marks the whole dropdown 
     *   element as enabled.
     *   - mySelect.enable(option) marks a given option as 
     *   enabled.
     *   @param [multiple] support multiple selections.
     *   @return new p5.Element object.
     */
    function createSelect(multiple?: boolean): p5.Element

    /**
     *   Creates a dropdown menu <select></select> element. 
     *   The parameter is optional. If true is passed, as 
     *   in let mySelect = createSelect(true), then the 
     *   dropdown will support multiple selections. If an 
     *   existing <select></select> element is passed, as 
     *   in let mySelect = createSelect(otherSelect), the 
     *   existing element will be wrapped in a new 
     *   p5.Element object. 
     * 
     *   Dropdowns extend the p5.Element class with a few 
     *   helpful methods for managing options: 
     * 
     *   - mySelect.option(name, [value]) adds an option to 
     *   the menu. The first paremeter, name, is a string 
     *   that sets the option's name and value. The second 
     *   parameter, value, is optional. If provided, it 
     *   sets the value that corresponds to the key name. 
     *   If an option with name already exists, its value 
     *   is changed to value.
     *   - mySelect.value() returns the currently-selected 
     *   option's value.
     *   - mySelect.selected() returns the 
     *   currently-selected option.
     *   - mySelect.selected(option) selects the given 
     *   option by default.
     *   - mySelect.disable() marks the whole dropdown 
     *   element as disabled.
     *   - mySelect.disable(option) marks a given option as 
     *   disabled.
     *   - mySelect.enable() marks the whole dropdown 
     *   element as enabled.
     *   - mySelect.enable(option) marks a given option as 
     *   enabled.
     *   @param existing select element to wrap, either as 
     *   a p5.Element or a HTMLSelectElement.
     */
    function createSelect(existing: object): p5.Element

    /**
     *   Creates a radio button element. The parameter is 
     *   optional. If a string is passed, as in let myRadio 
     *   = createSelect('food'), then each radio option 
     *   will have "food" as its name parameter: <input 
     *   name="food"></input>. If an existing <div></div> 
     *   or <span></span> element is passed, as in let 
     *   myRadio = createSelect(container), it will become 
     *   the radio button's parent element. 
     * 
     *   Radio buttons extend the p5.Element class with a 
     *   few helpful methods for managing options: 
     * 
     *   - myRadio.option(value, [label]) adds an option to 
     *   the menu. The first paremeter, value, is a string 
     *   that sets the option's value and label. The second 
     *   parameter, label, is optional. If provided, it 
     *   sets the label displayed for the value. If an 
     *   option with value already exists, its label is 
     *   changed and its value is returned.
     *   - myRadio.value() returns the currently-selected 
     *   option's value.
     *   - myRadio.selected() returns the 
     *   currently-selected option.
     *   - myRadio.selected(value) selects the given option 
     *   and returns it as an HTMLInputElement.
     *   - myRadio.disable(shouldDisable) enables the 
     *   entire radio button if true is passed and disables 
     *   it if false is passed.
     *   @param [containerElement] container HTML Element, 
     *   either a <div></div> or <span></span>.
     *   @return new p5.Element object.
     */
    function createRadio(containerElement?: object): p5.Element

    /**
     *   Creates a radio button element. The parameter is 
     *   optional. If a string is passed, as in let myRadio 
     *   = createSelect('food'), then each radio option 
     *   will have "food" as its name parameter: <input 
     *   name="food"></input>. If an existing <div></div> 
     *   or <span></span> element is passed, as in let 
     *   myRadio = createSelect(container), it will become 
     *   the radio button's parent element. 
     * 
     *   Radio buttons extend the p5.Element class with a 
     *   few helpful methods for managing options: 
     * 
     *   - myRadio.option(value, [label]) adds an option to 
     *   the menu. The first paremeter, value, is a string 
     *   that sets the option's value and label. The second 
     *   parameter, label, is optional. If provided, it 
     *   sets the label displayed for the value. If an 
     *   option with value already exists, its label is 
     *   changed and its value is returned.
     *   - myRadio.value() returns the currently-selected 
     *   option's value.
     *   - myRadio.selected() returns the 
     *   currently-selected option.
     *   - myRadio.selected(value) selects the given option 
     *   and returns it as an HTMLInputElement.
     *   - myRadio.disable(shouldDisable) enables the 
     *   entire radio button if true is passed and disables 
     *   it if false is passed.
     *   @param [name] name parameter assigned to each 
     *   option's <input></input> element.
     *   @return new p5.Element object.
     */
    function createRadio(name?: string): p5.Element

    /**
     *   Creates a radio button element. The parameter is 
     *   optional. If a string is passed, as in let myRadio 
     *   = createSelect('food'), then each radio option 
     *   will have "food" as its name parameter: <input 
     *   name="food"></input>. If an existing <div></div> 
     *   or <span></span> element is passed, as in let 
     *   myRadio = createSelect(container), it will become 
     *   the radio button's parent element. 
     * 
     *   Radio buttons extend the p5.Element class with a 
     *   few helpful methods for managing options: 
     * 
     *   - myRadio.option(value, [label]) adds an option to 
     *   the menu. The first paremeter, value, is a string 
     *   that sets the option's value and label. The second 
     *   parameter, label, is optional. If provided, it 
     *   sets the label displayed for the value. If an 
     *   option with value already exists, its label is 
     *   changed and its value is returned.
     *   - myRadio.value() returns the currently-selected 
     *   option's value.
     *   - myRadio.selected() returns the 
     *   currently-selected option.
     *   - myRadio.selected(value) selects the given option 
     *   and returns it as an HTMLInputElement.
     *   - myRadio.disable(shouldDisable) enables the 
     *   entire radio button if true is passed and disables 
     *   it if false is passed.
     *   @return new p5.Element object.
     */
    function createRadio(): p5.Element

    /**
     *   Creates a color picker element. The parameter, 
     *   value, is optional. If a color string or p5.Color 
     *   object is passed, it will set the default color. 
     * 
     *   Color pickers extend the p5.Element class with a 
     *   couple of helpful methods for managing colors: 
     * 
     *   - myPicker.value() returns the current color as a 
     *   hex string in the format '#rrggbb'.
     *   - myPicker.color() returns the current color as a 
     *   p5.Color object.
     *   @param [value] default color as a CSS color 
     *   string.
     *   @return new p5.Element object.
     */
    function createColorPicker(value?: string|p5.Color): p5.Element

    /**
     *   Creates a text <input></input> element. Call 
     *   myInput.size() to set the length of the text box. 
     * 
     *   The first parameter, value, is optional. It's a 
     *   string that sets the input's default value. The 
     *   input is blank by default. 
     * 
     *   The second parameter, type, is also optional. It's 
     *   a string that specifies the type of text being 
     *   input. See MDN for a full list of options. The 
     *   default is 'text'.
     *   @param [value] default value of the input box. 
     *   Defaults to an empty string ''.
     *   @param [type] type of input. Defaults to 'text'.
     *   @return new p5.Element object.
     */
    function createInput(value?: string, type?: string): p5.Element

    /**
     *   Creates a text <input></input> element. Call 
     *   myInput.size() to set the length of the text box. 
     * 
     *   The first parameter, value, is optional. It's a 
     *   string that sets the input's default value. The 
     *   input is blank by default. 
     * 
     *   The second parameter, type, is also optional. It's 
     *   a string that specifies the type of text being 
     *   input. See MDN for a full list of options. The 
     *   default is 'text'.
     *   @param [value] default value of the input box. 
     *   Defaults to an empty string ''.
     */
    function createInput(value?: string): p5.Element

    /**
     *   Creates an <input></input> element of type 'file'. 
     *   createFileInput() allows users to select local 
     *   files for use in a sketch. It returns a p5.File 
     *   object. 
     * 
     *   The first parameter, callback, is a function 
     *   that's called when the file loads. The callback 
     *   function should have one parameter, file, that's a 
     *   p5.File object. 
     * 
     *   The second parameter, multiple, is optional. It's 
     *   a boolean value that allows loading multiple files 
     *   if set to true. If true, callback will be called 
     *   once per file.
     *   @param callback function to call once the file 
     *   loads.
     *   @param [multiple] allow multiple files to be 
     *   selected.
     *   @return The new input element.
     */
    function createFileInput(callback: (...args: any[]) => any, multiple?: boolean): p5.Element

    /**
     *   Creates a new p5.Image object. createImage() uses 
     *   the width and height parameters to set the new 
     *   p5.Image object's dimensions in pixels. The new 
     *   p5.Image can be modified by updating its pixels 
     *   array or by calling its get() and set() methods. 
     *   The loadPixels() method must be called before 
     *   reading or modifying pixel values. The 
     *   updatePixels() method must be called for updates 
     *   to take effect. 
     * 
     *   Note: The new p5.Image object is transparent by 
     *   default.
     *   @param width width in pixels.
     *   @param height height in pixels.
     *   @return new p5.Image object.
     */
    function createImage(width: number, height: number): p5.Image

    /**
     *   Saves the current canvas as an image. By default, 
     *   saveCanvas() saves the canvas as a PNG image 
     *   called untitled.png. 
     * 
     *   The first parameter, filename, is optional. It's a 
     *   string that sets the file's name. If a file 
     *   extension is included, as in 
     *   saveCanvas('drawing.png'), then the image will be 
     *   saved using that format. 
     * 
     *   The second parameter, extension, is also optional. 
     *   It sets the files format. Either 'png', 'webp', or 
     *   'jpg' can be used. For example, 
     *   saveCanvas('drawing', 'jpg') saves the canvas to a 
     *   file called drawing.jpg. 
     * 
     *   Note: The browser will either save the file 
     *   immediately or prompt the user with a dialogue 
     *   window.
     *   @param selectedCanvas reference to a specific 
     *   HTML5 canvas element.
     *   @param [filename] file name. Defaults to 
     *   'untitled'.
     *   @param [extension] file extension, either 'png', 
     *   'webp', or 'jpg'. Defaults to 'png'.
     */

    /**
     *   Saves the current canvas as an image. By default, 
     *   saveCanvas() saves the canvas as a PNG image 
     *   called untitled.png. 
     * 
     *   The first parameter, filename, is optional. It's a 
     *   string that sets the file's name. If a file 
     *   extension is included, as in 
     *   saveCanvas('drawing.png'), then the image will be 
     *   saved using that format. 
     * 
     *   The second parameter, extension, is also optional. 
     *   It sets the files format. Either 'png', 'webp', or 
     *   'jpg' can be used. For example, 
     *   saveCanvas('drawing', 'jpg') saves the canvas to a 
     *   file called drawing.jpg. 
     * 
     *   Note: The browser will either save the file 
     *   immediately or prompt the user with a dialogue 
     *   window.
     *   @param [filename] file name. Defaults to 
     *   'untitled'.
     *   @param [extension] file extension, either 'png', 
     *   'webp', or 'jpg'. Defaults to 'png'.
     */
    function saveCanvas(filename?: string, extension?: string): void

    /**
     *   Captures a sequence of frames from the canvas that 
     *   can be saved as images. saveFrames() creates an 
     *   array of frame objects. Each frame is stored as an 
     *   object with its file type, file name, and image 
     *   data as a string. For example, the first saved 
     *   frame might have the following properties: 
     * 
     *   { ext: 'png', filenmame: 'frame0', imageData: 
     *   'data:image/octet-stream;base64, abc123' }. 
     * 
     *   The first parameter, filename, sets the prefix for 
     *   the file names. For example, setting the prefix to 
     *   'frame' would generate the image files frame0.png, 
     *   frame1.png, and so on. 
     * 
     *   The second parameter, extension, sets the file 
     *   type to either 'png' or 'jpg'. 
     * 
     *   The third parameter, duration, sets the duration 
     *   to record in seconds. The maximum duration is 15 
     *   seconds. 
     * 
     *   The fourth parameter, framerate, sets the number 
     *   of frames to record per second. The maximum frame 
     *   rate value is 22. Limits are placed on duration 
     *   and framerate to avoid using too much memory. 
     *   Recording large canvases can easily crash sketches 
     *   or even web browsers. 
     * 
     *   The fifth parameter, callback, is optional. If a 
     *   function is passed, image files won't be saved by 
     *   default. The callback function can be used to 
     *   process an array containing the data for each 
     *   captured frame. The array of image data contains a 
     *   sequence of objects with three properties for each 
     *   frame: imageData, filename, and extension. 
     * 
     *   Note: Frames are downloaded as individual image 
     *   files by default.
     *   @param filename prefix of file name.
     *   @param extension file extension, either 'jpg' or 
     *   'png'.
     *   @param duration duration in seconds to record. 
     *   This parameter will be constrained to be less or 
     *   equal to 15.
     *   @param framerate number of frames to save per 
     *   second. This parameter will be constrained to be 
     *   less or equal to 22.
     *   @param [callback] callback function that will be 
     *   executed to handle the image data. This function 
     *   should accept an array as argument. The array will 
     *   contain the specified number of frames of objects. 
     *   Each object has three properties: imageData, 
     *   filename, and extension.
     */
    function saveFrames(filename: string, extension: string, duration: number, framerate: number, callback?: (p1: any[]) => any): void

    // TODO: Fix loadImage() errors in src/scripts/parsers/in/p5.js/src/image/loading_displaying.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Image>
    //
    // function loadImage(path: string, successCallback?: (p1: p5.Image) => any, failureCallback?: (p1: Event) => any): 

    /**
     *   Generates a gif from a sketch and saves it to a 
     *   file. saveGif() may be called in setup() or at any 
     *   point while a sketch is running. 
     * 
     *   The first parameter, fileName, sets the gif's file 
     *   name. 
     * 
     *   The second parameter, duration, sets the gif's 
     *   duration in seconds. 
     * 
     *   The third parameter, options, is optional. If an 
     *   object is passed, saveGif() will use its 
     *   properties to customize the gif. saveGif() 
     *   recognizes the properties delay, units, silent, 
     *   notificationDuration, and notificationID.
     *   @param filename file name of gif.
     *   @param duration duration in seconds to capture 
     *   from the sketch.
     *   @param [options] an object that can contain five 
     *   more properties:
     */
    function saveGif(filename: string, duration: number, options?: object): void

    /**
     *   Draws an image to the canvas. The first parameter, 
     *   img, is the source image to be drawn. img can be 
     *   any of the following objects: 
     * 
     *   - p5.Image
     *   - p5.Element
     *   - p5.Texture
     *   - p5.Framebuffer
     *   - p5.FramebufferTexture
     * 
     *   The second and third parameters, dx and dy, set 
     *   the coordinates of the destination image's top 
     *   left corner. See imageMode() for other ways to 
     *   position images. 
     * 
     *   let img; async function setup() { // Load the 
     *   image. img = await 
     *   loadImage('assets/laDefense.jpg'); 
     *   createCanvas(100, 100); background(50); // Draw 
     *   the image. image(img, 0, 0); describe('An image of 
     *   the underside of a white umbrella with a gridded 
     *   ceiling above.'); }
     * 
     *   Here's a diagram that explains how optional 
     *   parameters work in image(): 
     * 
     *  
     * 
     *   The fourth and fifth parameters, dw and dh, are 
     *   optional. They set the the width and height to 
     *   draw the destination image. By default, image() 
     *   draws the full source image at its original size. 
     * 
     *   The sixth and seventh parameters, sx and sy, are 
     *   also optional. These coordinates define the top 
     *   left corner of a subsection to draw from the 
     *   source image. 
     * 
     *   The eighth and ninth parameters, sw and sh, are 
     *   also optional. They define the width and height of 
     *   a subsection to draw from the source image. By 
     *   default, image() draws the full subsection that 
     *   begins at (sx, sy) and extends to the edges of the 
     *   source image. 
     * 
     *   The ninth parameter, fit, is also optional. It 
     *   enables a subsection of the source image to be 
     *   drawn without affecting its aspect ratio. If 
     *   CONTAIN is passed, the full subsection will appear 
     *   within the destination rectangle. If COVER is 
     *   passed, the subsection will completely cover the 
     *   destination rectangle. This may have the effect of 
     *   zooming into the subsection. 
     * 
     *   The tenth and eleventh paremeters, xAlign and 
     *   yAlign, are also optional. They determine how to 
     *   align the fitted subsection. xAlign can be set to 
     *   either LEFT, RIGHT, or CENTER. yAlign can be set 
     *   to either TOP, BOTTOM, or CENTER. By default, both 
     *   xAlign and yAlign are set to CENTER.
     *   @param img image to display.
     *   @param x x-coordinate of the top-left corner of 
     *   the image.
     *   @param y y-coordinate of the top-left corner of 
     *   the image.
     *   @param [width] width to draw the image.
     *   @param [height] height to draw the image.
     */

    // TODO: Fix image() errors in src/scripts/parsers/in/p5.js/src/image/loading_displaying.js, line undefined:
    //
    //    param "fit" has invalid type: CONTAIN|COVER
    //    param "xAlign" has invalid type: LEFT|RIGHT|CENTER
    //    param "yAlign" has invalid type: TOP|BOTTOM|CENTER
    //
    // function image(img: p5.Image|p5.Element|p5.Framebuffer, dx: number, dy: number, dWidth: number, dHeight: number, sx: number, sy: number, sWidth?: number, sHeight?: number, fit?: CONTAIN|COVER, xAlign?: LEFT|RIGHT|CENTER, yAlign?: TOP|BOTTOM|CENTER): void

    /**
     *   Tints images using a color. The version of tint() 
     *   with one parameter interprets it one of four ways. 
     *   If the parameter is a number, it's interpreted as 
     *   a grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. An array 
     *   of [R, G, B, A] values or a p5.Color object can 
     *   also be used to set the tint color. 
     * 
     *   The version of tint() with two parameters uses the 
     *   first one as a grayscale value and the second as 
     *   an alpha value. For example, calling tint(255, 
     *   128) will make an image 50% transparent. 
     * 
     *   The version of tint() with three parameters 
     *   interprets them as RGB or HSB values, depending on 
     *   the current colorMode(). The optional fourth 
     *   parameter sets the alpha value. For example, 
     *   tint(255, 0, 0, 100) will give images a red tint 
     *   and make them transparent.
     *   @param v1 red or hue value.
     *   @param v2 green or saturation value.
     *   @param v3 blue or brightness.
     */
    function tint(v1: number, v2: number, v3: number, alpha?: number): void

    /**
     *   Tints images using a color. The version of tint() 
     *   with one parameter interprets it one of four ways. 
     *   If the parameter is a number, it's interpreted as 
     *   a grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. An array 
     *   of [R, G, B, A] values or a p5.Color object can 
     *   also be used to set the tint color. 
     * 
     *   The version of tint() with two parameters uses the 
     *   first one as a grayscale value and the second as 
     *   an alpha value. For example, calling tint(255, 
     *   128) will make an image 50% transparent. 
     * 
     *   The version of tint() with three parameters 
     *   interprets them as RGB or HSB values, depending on 
     *   the current colorMode(). The optional fourth 
     *   parameter sets the alpha value. For example, 
     *   tint(255, 0, 0, 100) will give images a red tint 
     *   and make them transparent.
     *   @param value CSS color string.
     */
    function tint(value: string): void

    /**
     *   Tints images using a color. The version of tint() 
     *   with one parameter interprets it one of four ways. 
     *   If the parameter is a number, it's interpreted as 
     *   a grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. An array 
     *   of [R, G, B, A] values or a p5.Color object can 
     *   also be used to set the tint color. 
     * 
     *   The version of tint() with two parameters uses the 
     *   first one as a grayscale value and the second as 
     *   an alpha value. For example, calling tint(255, 
     *   128) will make an image 50% transparent. 
     * 
     *   The version of tint() with three parameters 
     *   interprets them as RGB or HSB values, depending on 
     *   the current colorMode(). The optional fourth 
     *   parameter sets the alpha value. For example, 
     *   tint(255, 0, 0, 100) will give images a red tint 
     *   and make them transparent.
     *   @param gray grayscale value.
     */
    function tint(gray: number, alpha?: number): void

    /**
     *   Tints images using a color. The version of tint() 
     *   with one parameter interprets it one of four ways. 
     *   If the parameter is a number, it's interpreted as 
     *   a grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. An array 
     *   of [R, G, B, A] values or a p5.Color object can 
     *   also be used to set the tint color. 
     * 
     *   The version of tint() with two parameters uses the 
     *   first one as a grayscale value and the second as 
     *   an alpha value. For example, calling tint(255, 
     *   128) will make an image 50% transparent. 
     * 
     *   The version of tint() with three parameters 
     *   interprets them as RGB or HSB values, depending on 
     *   the current colorMode(). The optional fourth 
     *   parameter sets the alpha value. For example, 
     *   tint(255, 0, 0, 100) will give images a red tint 
     *   and make them transparent.
     *   @param values array containing the red, green, 
     *   blue & alpha components of the color.
     */
    function tint(values: number[]): void

    /**
     *   Tints images using a color. The version of tint() 
     *   with one parameter interprets it one of four ways. 
     *   If the parameter is a number, it's interpreted as 
     *   a grayscale value. If the parameter is a string, 
     *   it's interpreted as a CSS color string. An array 
     *   of [R, G, B, A] values or a p5.Color object can 
     *   also be used to set the tint color. 
     * 
     *   The version of tint() with two parameters uses the 
     *   first one as a grayscale value and the second as 
     *   an alpha value. For example, calling tint(255, 
     *   128) will make an image 50% transparent. 
     * 
     *   The version of tint() with three parameters 
     *   interprets them as RGB or HSB values, depending on 
     *   the current colorMode(). The optional fourth 
     *   parameter sets the alpha value. For example, 
     *   tint(255, 0, 0, 100) will give images a red tint 
     *   and make them transparent.
     *   @param color the tint color
     */
    function tint(color: p5.Color): void

    /**
     *   Removes the current tint set by tint(). noTint() 
     *   restores images to their original colors.
     */
    function noTint(): void

    // TODO: Fix imageMode() errors in src/scripts/parsers/in/p5.js/src/image/loading_displaying.js, line undefined:
    //
    //    param "mode" has invalid type: CORNER|CORNERS|CENTER
    //
    // function imageMode(mode: CORNER|CORNERS|CENTER): void

    /**
     *   Updates the canvas with the RGBA values in the 
     *   pixels array. updatePixels() only needs to be 
     *   called after changing values in the pixels array. 
     *   Such changes can be made directly after calling 
     *   loadPixels() or by calling set().
     *   @param [x] x-coordinate of the upper-left corner 
     *   of region to update.
     *   @param [y] y-coordinate of the upper-left corner 
     *   of region to update.
     *   @param [w] width of region to update.
     *   @param [h] height of region to update.
     */
    function updatePixels(x?: number, y?: number, w?: number, h?: number): void

    /**
     *   Updates the canvas with the RGBA values in the 
     *   pixels array. updatePixels() only needs to be 
     *   called after changing values in the pixels array. 
     *   Such changes can be made directly after calling 
     *   loadPixels() or by calling set().
     */
    function updatePixels(): void

    /**
     *   Sets the element's content. An element's content 
     *   is the text between its tags. For example, the 
     *   element <language>JavaScript</language> has the 
     *   content JavaScript. 
     * 
     *   The parameter, content, is a string with the 
     *   element's new content.
     *   @param content new content for the element.
     */
    function setContent(content: string): void

    /**
     *   Calculates the absolute value of a number. A 
     *   number's absolute value is its distance from zero 
     *   on the number line. -5 and 5 are both five units 
     *   away from zero, so calling abs(-5) and abs(5) both 
     *   return 5. The absolute value of a number is always 
     *   positive.
     *   @param n number to compute.
     *   @return absolute value of given number.
     */
    function abs(n: number): number

    /**
     *   Calculates the closest integer value that is 
     *   greater than or equal to a number. For example, 
     *   calling ceil(9.03) and ceil(9.97) both return the 
     *   value 10.
     *   @param n number to round up.
     *   @return rounded up number.
     */
    function ceil(n: number): number

    /**
     *   Constrains a number between a minimum and maximum 
     *   value.
     *   @param n number to constrain.
     *   @param low minimum limit.
     *   @param high maximum limit.
     *   @return constrained number.
     */
    function constrain(n: number, low: number, high: number): number

    /**
     *   Calculates the distance between two points. The 
     *   version of dist() with four parameters calculates 
     *   distance in two dimensions. 
     * 
     *   The version of dist() with six parameters 
     *   calculates distance in three dimensions. 
     * 
     *   Use p5.Vector.dist() to calculate the distance 
     *   between two p5.Vector objects.
     *   @param x1 x-coordinate of the first point.
     *   @param y1 y-coordinate of the first point.
     *   @param x2 x-coordinate of the second point.
     *   @param y2 y-coordinate of the second point.
     *   @return distance between the two points.
     */
    function dist(x1: number, y1: number, x2: number, y2: number): number

    /**
     *   Calculates the distance between two points. The 
     *   version of dist() with four parameters calculates 
     *   distance in two dimensions. 
     * 
     *   The version of dist() with six parameters 
     *   calculates distance in three dimensions. 
     * 
     *   Use p5.Vector.dist() to calculate the distance 
     *   between two p5.Vector objects.
     *   @param x1 x-coordinate of the first point.
     *   @param y1 y-coordinate of the first point.
     *   @param z1 z-coordinate of the first point.
     *   @param x2 x-coordinate of the second point.
     *   @param y2 y-coordinate of the second point.
     *   @param z2 z-coordinate of the second point.
     *   @return distance between the two points.
     */
    function dist(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number

    /**
     *   Calculates the value of Euler's number e 
     *   (2.71828...) raised to the power of a number.
     *   @param n exponent to raise.
     *   @return e^n
     */
    function exp(n: number): number

    /**
     *   Calculates the closest integer value that is less 
     *   than or equal to the value of a number.
     *   @param n number to round down.
     *   @return rounded down number.
     */
    function floor(n: number): number

    /**
     *   Calculates a number between two numbers at a 
     *   specific increment. The amt parameter is the 
     *   amount to interpolate between the two numbers. 0.0 
     *   is equal to the first number, 0.1 is very near the 
     *   first number, 0.5 is half-way in between, and 1.0 
     *   is equal to the second number. The lerp() function 
     *   is convenient for creating motion along a straight 
     *   path and for drawing dotted lines. 
     * 
     *   If the value of amt is less than 0 or more than 1, 
     *   lerp() will return a number outside of the 
     *   original interval. For example, calling lerp(0, 
     *   10, 1.5) will return 15.
     *   @param start first value.
     *   @param stop second value.
     *   @param amt number.
     *   @return lerped value.
     */
    function lerp(start: number, stop: number, amt: number): number

    /**
     *   Calculates the natural logarithm (the base-e 
     *   logarithm) of a number. log() expects the n 
     *   parameter to be a value greater than 0 because the 
     *   natural logarithm is defined that way.
     *   @param n number greater than 0.
     *   @return natural logarithm of n.
     */
    function log(n: number): number

    /**
     *   Calculates the magnitude, or length, of a vector. 
     *   A vector can be thought of in different ways. In 
     *   one view, a vector is a point in space. The 
     *   vector's components, x and y, are the point's 
     *   coordinates (x, y). A vector's magnitude is the 
     *   distance from the origin (0, 0) to (x, y). mag(x, 
     *   y) is a shortcut for calling dist(0, 0, x, y). 
     * 
     *   A vector can also be thought of as an arrow 
     *   pointing in space. This view is helpful for 
     *   programming motion. See p5.Vector for more 
     *   details. 
     * 
     *   Use p5.Vector.mag() to calculate the magnitude of 
     *   a p5.Vector object.
     *   @param x first component.
     *   @param y second component.
     *   @return magnitude of vector.
     */
    function mag(x: number, y: number): number

    /**
     *   Re-maps a number from one range to another. For 
     *   example, calling map(2, 0, 10, 0, 100) returns 20. 
     *   The first three arguments set the original value 
     *   to 2 and the original range from 0 to 10. The last 
     *   two arguments set the target range from 0 to 100. 
     *   20's position in the target range [0, 100] is 
     *   proportional to 2's position in the original range 
     *   [0, 10]. 
     * 
     *   The sixth parameter, withinBounds, is optional. By 
     *   default, map() can return values outside of the 
     *   target range. For example, map(11, 0, 10, 0, 100) 
     *   returns 110. Passing true as the sixth parameter 
     *   constrains the remapped value to the target range. 
     *   For example, map(11, 0, 10, 0, 100, true) returns 
     *   100.
     *   @param value the value to be remapped.
     *   @param start1 lower bound of the value's current 
     *   range.
     *   @param stop1 upper bound of the value's current 
     *   range.
     *   @param start2 lower bound of the value's target 
     *   range.
     *   @param stop2 upper bound of the value's target 
     *   range.
     *   @param [withinBounds] constrain the value to the 
     *   newly mapped range.
     *   @return remapped number.
     */
    function map(value: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds?: boolean): number

    /**
     *   Returns the largest value in a sequence of 
     *   numbers. The version of max() with one parameter 
     *   interprets it as an array of numbers and returns 
     *   the largest number. 
     * 
     *   The version of max() with two or more parameters 
     *   interprets them as individual numbers and returns 
     *   the largest number.
     *   @param n0 first number to compare.
     *   @param n1 second number to compare.
     *   @return maximum number.
     */
    function max(n0: number, n1: number): number

    /**
     *   Returns the largest value in a sequence of 
     *   numbers. The version of max() with one parameter 
     *   interprets it as an array of numbers and returns 
     *   the largest number. 
     * 
     *   The version of max() with two or more parameters 
     *   interprets them as individual numbers and returns 
     *   the largest number.
     *   @param nums numbers to compare.
     */
    function max(nums: number[]): number

    /**
     *   Returns the smallest value in a sequence of 
     *   numbers. The version of min() with one parameter 
     *   interprets it as an array of numbers and returns 
     *   the smallest number. 
     * 
     *   The version of min() with two or more parameters 
     *   interprets them as individual numbers and returns 
     *   the smallest number.
     *   @param n0 first number to compare.
     *   @param n1 second number to compare.
     *   @return minimum number.
     */
    function min(n0: number, n1: number): number

    /**
     *   Returns the smallest value in a sequence of 
     *   numbers. The version of min() with one parameter 
     *   interprets it as an array of numbers and returns 
     *   the smallest number. 
     * 
     *   The version of min() with two or more parameters 
     *   interprets them as individual numbers and returns 
     *   the smallest number.
     *   @param nums numbers to compare.
     */
    function min(nums: number[]): number

    /**
     *   Maps a number from one range to a value between 0 
     *   and 1. For example, norm(2, 0, 10) returns 0.2. 
     *   2's position in the original range [0, 10] is 
     *   proportional to 0.2's position in the range [0, 
     *   1]. This is the same as calling map(2, 0, 10, 0, 
     *   1). 
     * 
     *   Numbers outside of the original range are not 
     *   constrained between 0 and 1. Out-of-range values 
     *   are often intentional and useful.
     *   @param value incoming value to be normalized.
     *   @param start lower bound of the value's current 
     *   range.
     *   @param stop upper bound of the value's current 
     *   range.
     *   @return normalized number.
     */
    function norm(value: number, start: number, stop: number): number

    /**
     *   Calculates exponential expressions such as 23. For 
     *   example, pow(2, 3) evaluates the expression 2 × 2 
     *   × 2. pow(2, -3) evaluates 1 ÷ (2 × 2 × 2).
     *   @param n base of the exponential expression.
     *   @param e power by which to raise the base.
     *   @return n^e.
     */
    function pow(n: number, e: number): number

    /**
     *   Calculates the integer closest to a number. For 
     *   example, round(133.8) returns the value 134. 
     * 
     *   The second parameter, decimals, is optional. It 
     *   sets the number of decimal places to use when 
     *   rounding. For example, round(12.34, 1) returns 
     *   12.3. decimals is 0 by default.
     *   @param n number to round.
     *   @param [decimals] number of decimal places to 
     *   round to, default is 0.
     *   @return rounded number.
     */
    function round(n: number, decimals?: number): number

    /**
     *   Calculates the square of a number. Squaring a 
     *   number means multiplying the number by itself. For 
     *   example, sq(3) evaluates 3 × 3 which is 9. sq(-3) 
     *   evaluates -3 × -3 which is also 9. Multiplying two 
     *   negative numbers produces a positive number. The 
     *   value returned by sq() is always positive.
     *   @param n number to square.
     *   @return squared number.
     */
    function sq(n: number): number

    /**
     *   Calculates the square root of a number. A number's 
     *   square root can be multiplied by itself to produce 
     *   the original number. For example, sqrt(9) returns 
     *   3 because 3 × 3 = 9. sqrt() always returns a 
     *   positive value. sqrt() doesn't work with negative 
     *   arguments such as sqrt(-9).
     *   @param n non-negative number to square root.
     *   @return square root of number.
     */
    function sqrt(n: number): number

    /**
     *   Calculates the fractional part of a number. A 
     *   number's fractional part includes its decimal 
     *   values. For example, fract(12.34) returns 0.34.
     *   @param n number whose fractional part will be 
     *   found.
     *   @return fractional part of n.
     */
    function fract(n: number): number

    /**
     *   Creates a new p5.Vector object. A vector can be 
     *   thought of in different ways. In one view, a 
     *   vector is like an arrow pointing in space. Vectors 
     *   have both magnitude (length) and direction. This 
     *   view is helpful for programming motion. 
     * 
     *   A vector's components determine its magnitude and 
     *   direction. For example, calling createVector(3, 4) 
     *   creates a new p5.Vector object with an x-component 
     *   of 3 and a y-component of 4. From the origin, this 
     *   vector's tip is 3 units to the right and 4 units 
     *   down. 
     * 
     *   You can also pass N dimensions to the createVector 
     *   function. For example, calling createVector(1, 2, 
     *   3, 4) creates a vector with four components. This 
     *   allows for flexibility in representing vectors in 
     *   higher-dimensional spaces. 
     * 
     *   Calling createVector() with no arguments is 
     *   deprecated and will emit a friendly warning. Use 
     *   createVector(0), createVector(0, 0), or 
     *   createVector(0, 0, 0) instead. 
     * 
     *   p5.Vector objects are often used to program motion 
     *   because they simplify the math. For example, a 
     *   moving ball has a position and a velocity. 
     *   Position describes where the ball is in space. The 
     *   ball's position vector extends from the origin to 
     *   the ball's center. Velocity describes the ball's 
     *   speed and the direction it's moving. If the ball 
     *   is moving straight up, its velocity vector points 
     *   straight up. Adding the ball's velocity vector to 
     *   its position vector moves it, as in pos.add(vel). 
     *   Vector math relies on methods inside the p5.Vector 
     *   class.
     *   @param x Zero or more numbers, representing each 
     *   component of the vector.
     *   @return new p5.Vector object.
     */
    function createVector(x: number): p5.Vector

    /**
     *   Returns random numbers that can be tuned to feel 
     *   organic. Values returned by random() and 
     *   randomGaussian() can change by large amounts 
     *   between function calls. By contrast, values 
     *   returned by noise() can be made "smooth". Calls to 
     *   noise() with similar inputs will produce similar 
     *   outputs. noise() is used to create textures, 
     *   motion, shapes, terrains, and so on. Ken Perlin 
     *   invented noise() while animating the original Tron 
     *   film in the 1980s. 
     * 
     *   noise() always returns values between 0 and 1. It 
     *   returns the same value for a given input while a 
     *   sketch is running. noise() produces different 
     *   results each time a sketch runs. The noiseSeed() 
     *   function can be used to generate the same sequence 
     *   of Perlin noise values each time a sketch runs. 
     * 
     *   The character of the noise can be adjusted in two 
     *   ways. The first way is to scale the inputs. 
     *   noise() interprets inputs as coordinates. The 
     *   sequence of noise values will be smoother when the 
     *   input coordinates are closer. The second way is to 
     *   use the noiseDetail() function. 
     * 
     *   The version of noise() with one parameter computes 
     *   noise values in one dimension. This dimension can 
     *   be thought of as space, as in noise(x), or time, 
     *   as in noise(t). 
     * 
     *   The version of noise() with two parameters 
     *   computes noise values in two dimensions. These 
     *   dimensions can be thought of as space, as in 
     *   noise(x, y), or space and time, as in noise(x, t). 
     * 
     *   The version of noise() with three parameters 
     *   computes noise values in three dimensions. These 
     *   dimensions can be thought of as space, as in 
     *   noise(x, y, z), or space and time, as in noise(x, 
     *   y, t).
     *   @param x x-coordinate in noise space.
     *   @param [y] y-coordinate in noise space.
     *   @param [z] z-coordinate in noise space.
     *   @return Perlin noise value at specified 
     *   coordinates.
     */
    function noise(x: number, y?: number, z?: number): number

    /**
     *   Adjusts the character of the noise produced by the 
     *   noise() function. Perlin noise values are created 
     *   by adding layers of noise together. The noise 
     *   layers, called octaves, are similar to harmonics 
     *   in music. Lower octaves contribute more to the 
     *   output signal. They define the overall intensity 
     *   of the noise. Higher octaves create finer-grained 
     *   details. 
     * 
     *   By default, noise values are created by combining 
     *   four octaves. Each higher octave contributes half 
     *   as much (50% less) compared to its predecessor. 
     *   noiseDetail() changes the number of octaves and 
     *   the falloff amount. For example, calling 
     *   noiseDetail(6, 0.25) ensures that noise() will use 
     *   six octaves. Each higher octave will contribute 
     *   25% as much (75% less) compared to its 
     *   predecessor. Falloff values between 0 and 1 are 
     *   valid. However, falloff values greater than 0.5 
     *   might result in noise values greater than 1.
     *   @param lod number of octaves to be used by the 
     *   noise.
     *   @param falloff falloff factor for each octave.
     */
    function noiseDetail(lod: number, falloff: number): void

    /**
     *   Sets the seed value for the noise() function. By 
     *   default, noise() produces different results each 
     *   time a sketch is run. Calling noiseSeed() with a 
     *   constant argument, such as noiseSeed(99), makes 
     *   noise() produce the same results each time a 
     *   sketch is run.
     *   @param seed seed value.
     */
    function noiseSeed(seed: number): void

    /**
     *   Sets the seed value for the random() and 
     *   randomGaussian() functions. By default, random() 
     *   and randomGaussian() produce different results 
     *   each time a sketch is run. Calling randomSeed() 
     *   with a constant argument, such as randomSeed(99), 
     *   makes these functions produce the same results 
     *   each time a sketch is run.
     *   @param seed seed value.
     */
    function randomSeed(seed: number): void

    /**
     *   Returns a random number or a random element from 
     *   an array. random() follows uniform distribution, 
     *   which means that all outcomes are equally likely. 
     *   When random() is used to generate numbers, all 
     *   numbers in the output range are equally likely to 
     *   be returned. When random() is used to select 
     *   elements from an array, all elements are equally 
     *   likely to be chosen. 
     * 
     *   By default, random() produces different results 
     *   each time a sketch runs. The randomSeed() function 
     *   can be used to generate the same sequence of 
     *   numbers or choices each time a sketch runs. 
     * 
     *   The version of random() with no parameters returns 
     *   a random number from 0 up to but not including 1. 
     * 
     *   The version of random() with one parameter works 
     *   one of two ways. If the argument passed is a 
     *   number, random() returns a random number from 0 up 
     *   to but not including the number. For example, 
     *   calling random(5) returns values between 0 and 5. 
     *   If the argument passed is an array, random() 
     *   returns a random element from that array. For 
     *   example, calling random(['🦁', '🐯', '🐻']) 
     *   returns either a lion, tiger, or bear emoji. 
     * 
     *   The version of random() with two parameters 
     *   returns a random number from a given range. The 
     *   arguments passed set the range's lower and upper 
     *   bounds. For example, calling random(-5, 10.2) 
     *   returns values from -5 up to but not including 
     *   10.2.
     *   @param [min] lower bound (inclusive).
     *   @param [max] upper bound (exclusive).
     *   @return random number.
     */
    function random(min?: number, max?: number): number

    // TODO: Fix random() errors in src/scripts/parsers/in/p5.js/src/math/random.js, line undefined:
    //
    //    return has invalid type: undefined
    //
    // function random(choices: any[]): 

    /**
     *   Returns a random number fitting a Gaussian, or 
     *   normal, distribution. Normal distributions look 
     *   like bell curves when plotted. Values from a 
     *   normal distribution cluster around a central value 
     *   called the mean. The cluster's standard deviation 
     *   describes its spread. 
     * 
     *   By default, randomGaussian() produces different 
     *   results each time a sketch runs. The randomSeed() 
     *   function can be used to generate the same sequence 
     *   of numbers each time a sketch runs. 
     * 
     *   There's no minimum or maximum value that 
     *   randomGaussian() might return. Values far from the 
     *   mean are very unlikely and values near the mean 
     *   are very likely. 
     * 
     *   The version of randomGaussian() with no parameters 
     *   returns values with a mean of 0 and standard 
     *   deviation of 1. 
     * 
     *   The version of randomGaussian() with one parameter 
     *   interprets the argument passed as the mean. The 
     *   standard deviation is 1. 
     * 
     *   The version of randomGaussian() with two 
     *   parameters interprets the first argument passed as 
     *   the mean and the second as the standard deviation.
     *   @param [mean] mean.
     *   @param [sd] standard deviation.
     *   @return random number.
     */
    function randomGaussian(mean?: number, sd?: number): number

    // TODO: Fix arc() errors in src/scripts/parsers/in/p5.js/src/shape/2d_primitives.js, line undefined:
    //
    //    param "mode" has invalid type: CHORD|PIE|OPEN
    //
    // function arc(x: number, y: number, w: number, h: number, start: number, stop: number, mode?: CHORD|PIE|OPEN, detail?: number): void

    /**
     *   Draws an ellipse (oval). An ellipse is a round 
     *   shape defined by the x, y, w, and h parameters. x 
     *   and y set the location of its center. w and h set 
     *   its width and height. See ellipseMode() for other 
     *   ways to set its position. 
     * 
     *   If no height is set, the value of width is used 
     *   for both the width and height. If a negative 
     *   height or width is specified, the absolute value 
     *   is taken. 
     * 
     *   The fifth parameter, detail, is also optional. It 
     *   determines how many vertices are used to draw the 
     *   ellipse in WebGL mode. The default value is 25.
     *   @param x x-coordinate of the center of the 
     *   ellipse.
     *   @param y y-coordinate of the center of the 
     *   ellipse.
     *   @param w width of the ellipse.
     *   @param [h] height of the ellipse.
     */
    function ellipse(x: number, y: number, w: number, h?: number): void

    /**
     *   Draws an ellipse (oval). An ellipse is a round 
     *   shape defined by the x, y, w, and h parameters. x 
     *   and y set the location of its center. w and h set 
     *   its width and height. See ellipseMode() for other 
     *   ways to set its position. 
     * 
     *   If no height is set, the value of width is used 
     *   for both the width and height. If a negative 
     *   height or width is specified, the absolute value 
     *   is taken. 
     * 
     *   The fifth parameter, detail, is also optional. It 
     *   determines how many vertices are used to draw the 
     *   ellipse in WebGL mode. The default value is 25.
     *   @param x x-coordinate of the center of the 
     *   ellipse.
     *   @param y y-coordinate of the center of the 
     *   ellipse.
     *   @param w width of the ellipse.
     *   @param h height of the ellipse.
     *   @param [detail] optional parameter for WebGL mode 
     *   only. This is to specify the number of vertices 
     *   that makes up the perimeter of the ellipse. 
     *   Default value is 25. Won't draw a stroke for a 
     *   detail of more than 50.
     */
    function ellipse(x: number, y: number, w: number, h: number, detail?: number): void

    /**
     *   Draws a circle. A circle is a round shape defined 
     *   by the x, y, and d parameters. x and y set the 
     *   location of its center. d sets its width and 
     *   height (diameter). Every point on the circle's 
     *   edge is the same distance, 0.5 * d, from its 
     *   center. 0.5 * d (half the diameter) is the 
     *   circle's radius. See ellipseMode() for other ways 
     *   to set its position.
     *   @param x x-coordinate of the center of the circle.
     *   @param y y-coordinate of the center of the circle.
     *   @param d diameter of the circle.
     */
    function circle(x: number, y: number, d: number): void

    /**
     *   Draws a straight line between two points. A line's 
     *   default width is one pixel. The version of line() 
     *   with four parameters draws the line in 2D. To 
     *   color a line, use the stroke() function. To change 
     *   its width, use the strokeWeight() function. A line 
     *   can't be filled, so the fill() function won't 
     *   affect the line's color. 
     * 
     *   The version of line() with six parameters allows 
     *   the line to be drawn in 3D space. Doing so 
     *   requires adding the WEBGL argument to 
     *   createCanvas().
     *   @param x1 the x-coordinate of the first point.
     *   @param y1 the y-coordinate of the first point.
     *   @param x2 the x-coordinate of the second point.
     *   @param y2 the y-coordinate of the second point.
     */
    function line(x1: number, y1: number, x2: number, y2: number): void

    /**
     *   Draws a straight line between two points. A line's 
     *   default width is one pixel. The version of line() 
     *   with four parameters draws the line in 2D. To 
     *   color a line, use the stroke() function. To change 
     *   its width, use the strokeWeight() function. A line 
     *   can't be filled, so the fill() function won't 
     *   affect the line's color. 
     * 
     *   The version of line() with six parameters allows 
     *   the line to be drawn in 3D space. Doing so 
     *   requires adding the WEBGL argument to 
     *   createCanvas().
     *   @param x1 the x-coordinate of the first point.
     *   @param y1 the y-coordinate of the first point.
     *   @param z1 the z-coordinate of the first point.
     *   @param x2 the x-coordinate of the second point.
     *   @param y2 the y-coordinate of the second point.
     *   @param z2 the z-coordinate of the second point.
     */
    function line(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void

    /**
     *   Draws a single point in space. A point's default 
     *   width is one pixel. To color a point, use the 
     *   stroke() function. To change its width, use the 
     *   strokeWeight() function. A point can't be filled, 
     *   so the fill() function won't affect the point's 
     *   color. 
     * 
     *   The version of point() with two parameters allows 
     *   the point's location to be set with its x- and 
     *   y-coordinates, as in point(10, 20). 
     * 
     *   The version of point() with three parameters 
     *   allows the point to be drawn in 3D space with x-, 
     *   y-, and z-coordinates, as in point(10, 20, 30). 
     *   Doing so requires adding the WEBGL argument to 
     *   createCanvas(). 
     * 
     *   The version of point() with one parameter allows 
     *   the point's location to be set with a p5.Vector 
     *   object.
     *   @param x the x-coordinate.
     *   @param y the y-coordinate.
     *   @param [z] the z-coordinate (for WebGL mode).
     */
    function point(x: number, y: number, z?: number): void

    /**
     *   Draws a single point in space. A point's default 
     *   width is one pixel. To color a point, use the 
     *   stroke() function. To change its width, use the 
     *   strokeWeight() function. A point can't be filled, 
     *   so the fill() function won't affect the point's 
     *   color. 
     * 
     *   The version of point() with two parameters allows 
     *   the point's location to be set with its x- and 
     *   y-coordinates, as in point(10, 20). 
     * 
     *   The version of point() with three parameters 
     *   allows the point to be drawn in 3D space with x-, 
     *   y-, and z-coordinates, as in point(10, 20, 30). 
     *   Doing so requires adding the WEBGL argument to 
     *   createCanvas(). 
     * 
     *   The version of point() with one parameter allows 
     *   the point's location to be set with a p5.Vector 
     *   object.
     *   @param coordinateVector the coordinate vector.
     */
    function point(coordinateVector: p5.Vector): void

    /**
     *   Draws a quadrilateral (four-sided shape). 
     *   Quadrilaterals include rectangles, squares, 
     *   rhombuses, and trapezoids. The first pair of 
     *   parameters (x1, y1) sets the quad's first point. 
     *   The next three pairs of parameters set the 
     *   coordinates for its next three points (x2, y2), 
     *   (x3, y3), and (x4, y4). Points should be added in 
     *   either clockwise or counter-clockwise order. 
     * 
     *   The version of quad() with twelve parameters 
     *   allows the quad to be drawn in 3D space. Doing so 
     *   requires adding the WEBGL argument to 
     *   createCanvas(). 
     * 
     *   The thirteenth and fourteenth parameters are 
     *   optional. In WebGL mode, they set the number of 
     *   segments used to draw the quadrilateral in the x- 
     *   and y-directions. They're both 2 by default.
     *   @param x1 the x-coordinate of the first point.
     *   @param y1 the y-coordinate of the first point.
     *   @param x2 the x-coordinate of the second point.
     *   @param y2 the y-coordinate of the second point.
     *   @param x3 the x-coordinate of the third point.
     *   @param y3 the y-coordinate of the third point.
     *   @param x4 the x-coordinate of the fourth point.
     *   @param y4 the y-coordinate of the fourth point.
     *   @param [detailX] number of segments in the 
     *   x-direction.
     *   @param [detailY] number of segments in the 
     *   y-direction.
     */
    function quad(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a quadrilateral (four-sided shape). 
     *   Quadrilaterals include rectangles, squares, 
     *   rhombuses, and trapezoids. The first pair of 
     *   parameters (x1, y1) sets the quad's first point. 
     *   The next three pairs of parameters set the 
     *   coordinates for its next three points (x2, y2), 
     *   (x3, y3), and (x4, y4). Points should be added in 
     *   either clockwise or counter-clockwise order. 
     * 
     *   The version of quad() with twelve parameters 
     *   allows the quad to be drawn in 3D space. Doing so 
     *   requires adding the WEBGL argument to 
     *   createCanvas(). 
     * 
     *   The thirteenth and fourteenth parameters are 
     *   optional. In WebGL mode, they set the number of 
     *   segments used to draw the quadrilateral in the x- 
     *   and y-directions. They're both 2 by default.
     *   @param x1 the x-coordinate of the first point.
     *   @param y1 the y-coordinate of the first point.
     *   @param z1 the z-coordinate of the first point.
     *   @param x2 the x-coordinate of the second point.
     *   @param y2 the y-coordinate of the second point.
     *   @param z2 the z-coordinate of the second point.
     *   @param x3 the x-coordinate of the third point.
     *   @param y3 the y-coordinate of the third point.
     *   @param z3 the z-coordinate of the third point.
     *   @param x4 the x-coordinate of the fourth point.
     *   @param y4 the y-coordinate of the fourth point.
     *   @param z4 the z-coordinate of the fourth point.
     *   @param [detailX] number of segments in the 
     *   x-direction.
     *   @param [detailY] number of segments in the 
     *   y-direction.
     */
    function quad(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a rectangle. A rectangle is a four-sided 
     *   shape defined by the x, y, w, and h parameters. x 
     *   and y set the location of its top-left corner. w 
     *   sets its width and h sets its height. Every angle 
     *   in the rectangle measures 90˚. See rectMode() for 
     *   other ways to define rectangles. 
     * 
     *   The version of rect() with five parameters creates 
     *   a rounded rectangle. The fifth parameter sets the 
     *   radius for all four corners. 
     * 
     *   The version of rect() with eight parameters also 
     *   creates a rounded rectangle. Each of the last four 
     *   parameters set the radius of a corner. The radii 
     *   start with the top-left corner and move clockwise 
     *   around the rectangle. If any of these parameters 
     *   are omitted, they are set to the value of the last 
     *   radius that was set.
     *   @param x x-coordinate of the rectangle.
     *   @param y y-coordinate of the rectangle.
     *   @param w width of the rectangle.
     *   @param [h] height of the rectangle.
     *   @param [tl] optional radius of top-left corner.
     *   @param [tr] optional radius of top-right corner.
     *   @param [br] optional radius of bottom-right 
     *   corner.
     *   @param [bl] optional radius of bottom-left corner.
     */
    function rect(x: number, y: number, w: number, h?: number, tl?: number, tr?: number, br?: number, bl?: number): void

    /**
     *   Draws a rectangle. A rectangle is a four-sided 
     *   shape defined by the x, y, w, and h parameters. x 
     *   and y set the location of its top-left corner. w 
     *   sets its width and h sets its height. Every angle 
     *   in the rectangle measures 90˚. See rectMode() for 
     *   other ways to define rectangles. 
     * 
     *   The version of rect() with five parameters creates 
     *   a rounded rectangle. The fifth parameter sets the 
     *   radius for all four corners. 
     * 
     *   The version of rect() with eight parameters also 
     *   creates a rounded rectangle. Each of the last four 
     *   parameters set the radius of a corner. The radii 
     *   start with the top-left corner and move clockwise 
     *   around the rectangle. If any of these parameters 
     *   are omitted, they are set to the value of the last 
     *   radius that was set.
     *   @param x x-coordinate of the rectangle.
     *   @param y y-coordinate of the rectangle.
     *   @param w width of the rectangle.
     *   @param h height of the rectangle.
     *   @param [detailX] number of segments in the 
     *   x-direction (for WebGL mode).
     *   @param [detailY] number of segments in the 
     *   y-direction (for WebGL mode).
     */
    function rect(x: number, y: number, w: number, h: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a square. A square is a four-sided shape 
     *   defined by the x, y, and s parameters. x and y set 
     *   the location of its top-left corner. s sets its 
     *   width and height. Every angle in the square 
     *   measures 90˚ and all its sides are the same 
     *   length. See rectMode() for other ways to define 
     *   squares. 
     * 
     *   The version of square() with four parameters 
     *   creates a rounded square. The fourth parameter 
     *   sets the radius for all four corners. 
     * 
     *   The version of square() with seven parameters also 
     *   creates a rounded square. Each of the last four 
     *   parameters set the radius of a corner. The radii 
     *   start with the top-left corner and move clockwise 
     *   around the square. If any of these parameters are 
     *   omitted, they are set to the value of the last 
     *   radius that was set.
     *   @param x x-coordinate of the square.
     *   @param y y-coordinate of the square.
     *   @param s side size of the square.
     *   @param [tl] optional radius of top-left corner.
     *   @param [tr] optional radius of top-right corner.
     *   @param [br] optional radius of bottom-right 
     *   corner.
     *   @param [bl] optional radius of bottom-left corner.
     */
    function square(x: number, y: number, s: number, tl?: number, tr?: number, br?: number, bl?: number): void

    /**
     *   Draws a triangle. A triangle is a three-sided 
     *   shape defined by three points. The first two 
     *   parameters specify the triangle's first point (x1, 
     *   y1). The middle two parameters specify its second 
     *   point (x2, y2). And the last two parameters 
     *   specify its third point (x3, y3).
     *   @param x1 x-coordinate of the first point.
     *   @param y1 y-coordinate of the first point.
     *   @param x2 x-coordinate of the second point.
     *   @param y2 y-coordinate of the second point.
     *   @param x3 x-coordinate of the third point.
     *   @param y3 y-coordinate of the third point.
     */
    function triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void

    // TODO: Fix ellipseMode() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
    //
    //    param "mode" has invalid type: CENTER|RADIUS|CORNER|CORNERS
    //
    // function ellipseMode(mode: CENTER|RADIUS|CORNER|CORNERS): void

    /**
     *   Draws certain features with jagged (aliased) 
     *   edges. smooth() is active by default. In 2D mode, 
     *   noSmooth() is helpful for scaling up images 
     *   without blurring. The functions don't affect 
     *   shapes or fonts. 
     * 
     *   In WebGL mode, noSmooth() causes all shapes to be 
     *   drawn with jagged (aliased) edges. The functions 
     *   don't affect images or fonts.
     */
    function noSmooth(): void

    // TODO: Fix rectMode() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
    //
    //    param "mode" has invalid type: CENTER|RADIUS|CORNER|CORNERS
    //
    // function rectMode(mode: CENTER|RADIUS|CORNER|CORNERS): void

    /**
     *   Draws certain features with smooth (antialiased) 
     *   edges. smooth() is active by default. In 2D mode, 
     *   noSmooth() is helpful for scaling up images 
     *   without blurring. The functions don't affect 
     *   shapes or fonts. 
     * 
     *   In WebGL mode, noSmooth() causes all shapes to be 
     *   drawn with jagged (aliased) edges. The functions 
     *   don't affect images or fonts.
     */
    function smooth(): void

    // TODO: Fix strokeCap() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
    //
    //    param "cap" has invalid type: ROUND|SQUARE|PROJECT
    //
    // function strokeCap(cap: ROUND|SQUARE|PROJECT): void

    // TODO: Fix strokeJoin() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
    //
    //    param "join" has invalid type: MITER|BEVEL|ROUND
    //
    // function strokeJoin(join: MITER|BEVEL|ROUND): void

    /**
     *   Sets the width of the stroke used for points, 
     *   lines, and the outlines of shapes. Note: 
     *   strokeWeight() is affected by transformations, 
     *   especially calls to scale().
     *   @param weight the weight of the stroke (in 
     *   pixels).
     */
    function strokeWeight(weight: number): void

    /**
     *   Draws a Bézier curve. Bézier curves can form 
     *   shapes and curves that slope gently. They're 
     *   defined by two anchor points and two control 
     *   points. Bézier curves provide more control than 
     *   the spline curves created with the spline() 
     *   function. 
     * 
     *   The first two parameters, x1 and y1, set the first 
     *   anchor point. The first anchor point is where the 
     *   curve starts. 
     * 
     *   The next four parameters, x2, y2, x3, and y3, set 
     *   the two control points. The control points "pull" 
     *   the curve towards them. 
     * 
     *   The seventh and eighth parameters, x4 and y4, set 
     *   the last anchor point. The last anchor point is 
     *   where the curve ends. 
     * 
     *   Bézier curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of bezier() has twelve 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates.
     *   @param x1 x-coordinate of the first anchor point.
     *   @param y1 y-coordinate of the first anchor point.
     *   @param x2 x-coordinate of the first control point.
     *   @param y2 y-coordinate of the first control point.
     *   @param x3 x-coordinate of the second control 
     *   point.
     *   @param y3 y-coordinate of the second control 
     *   point.
     *   @param x4 x-coordinate of the second anchor point.
     *   @param y4 y-coordinate of the second anchor point.
     */
    function bezier(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): void

    /**
     *   Draws a Bézier curve. Bézier curves can form 
     *   shapes and curves that slope gently. They're 
     *   defined by two anchor points and two control 
     *   points. Bézier curves provide more control than 
     *   the spline curves created with the spline() 
     *   function. 
     * 
     *   The first two parameters, x1 and y1, set the first 
     *   anchor point. The first anchor point is where the 
     *   curve starts. 
     * 
     *   The next four parameters, x2, y2, x3, and y3, set 
     *   the two control points. The control points "pull" 
     *   the curve towards them. 
     * 
     *   The seventh and eighth parameters, x4 and y4, set 
     *   the last anchor point. The last anchor point is 
     *   where the curve ends. 
     * 
     *   Bézier curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of bezier() has twelve 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates.
     *   @param x1 x-coordinate of the first anchor point.
     *   @param y1 y-coordinate of the first anchor point.
     *   @param z1 z-coordinate of the first anchor point.
     *   @param x2 x-coordinate of the first control point.
     *   @param y2 y-coordinate of the first control point.
     *   @param z2 z-coordinate of the first control point.
     *   @param x3 x-coordinate of the second control 
     *   point.
     *   @param y3 y-coordinate of the second control 
     *   point.
     *   @param z3 z-coordinate of the second control 
     *   point.
     *   @param x4 x-coordinate of the second anchor point.
     *   @param y4 y-coordinate of the second anchor point.
     *   @param z4 z-coordinate of the second anchor point.
     */
    function bezier(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number): void

    /**
     *   Calculates coordinates along a Bézier curve using 
     *   interpolation. bezierPoint() calculates 
     *   coordinates along a Bézier curve using the anchor 
     *   and control points. It expects points in the same 
     *   order as the bezier() function. bezierPoint() 
     *   works one axis at a time. Passing the anchor and 
     *   control points' x-coordinates will calculate the 
     *   x-coordinate of a point on the curve. Passing the 
     *   anchor and control points' y-coordinates will 
     *   calculate the y-coordinate of a point on the 
     *   curve. 
     * 
     *   The first parameter, a, is the coordinate of the 
     *   first anchor point. 
     * 
     *   The second and third parameters, b and c, are the 
     *   coordinates of the control points. 
     * 
     *   The fourth parameter, d, is the coordinate of the 
     *   last anchor point. 
     * 
     *   The fifth parameter, t, is the amount to 
     *   interpolate along the curve. 0 is the first anchor 
     *   point, 1 is the second anchor point, and 0.5 is 
     *   halfway between them.
     *   @param a coordinate of first anchor point.
     *   @param b coordinate of first control point.
     *   @param c coordinate of second control point.
     *   @param d coordinate of second anchor point.
     *   @param t amount to interpolate between 0 and 1.
     *   @return coordinate of the point on the curve.
     */
    function bezierPoint(a: number, b: number, c: number, d: number, t: number): number

    /**
     *   Calculates coordinates along a line that's tangent 
     *   to a Bézier curve. Tangent lines skim the surface 
     *   of a curve. A tangent line's slope equals the 
     *   curve's slope at the point where it intersects. 
     * 
     *   bezierTangent() calculates coordinates along a 
     *   tangent line using the Bézier curve's anchor and 
     *   control points. It expects points in the same 
     *   order as the bezier() function. bezierTangent() 
     *   works one axis at a time. Passing the anchor and 
     *   control points' x-coordinates will calculate the 
     *   x-coordinate of a point on the tangent line. 
     *   Passing the anchor and control points' 
     *   y-coordinates will calculate the y-coordinate of a 
     *   point on the tangent line. 
     * 
     *   The first parameter, a, is the coordinate of the 
     *   first anchor point. 
     * 
     *   The second and third parameters, b and c, are the 
     *   coordinates of the control points. 
     * 
     *   The fourth parameter, d, is the coordinate of the 
     *   last anchor point. 
     * 
     *   The fifth parameter, t, is the amount to 
     *   interpolate along the curve. 0 is the first anchor 
     *   point, 1 is the second anchor point, and 0.5 is 
     *   halfway between them.
     *   @param a coordinate of first anchor point.
     *   @param b coordinate of first control point.
     *   @param c coordinate of second control point.
     *   @param d coordinate of second anchor point.
     *   @param t amount to interpolate between 0 and 1.
     *   @return coordinate of a point on the tangent line.
     */
    function bezierTangent(a: number, b: number, c: number, d: number, t: number): number

    /**
     *   Draws a curve using a Catmull-Rom spline. Spline 
     *   curves can form shapes and curves that slope 
     *   gently. They’re like cables that are attached to a 
     *   set of points. By default (ends: INCLUDE), the 
     *   curve passes through all four points you provide, 
     *   in order p0(x1,y1) -> p1(x2,y2) -> p2(x3,y3) -> 
     *   p3(x4,y4). Think of them as points on a curve. If 
     *   you switch to ends: EXCLUDE, p0 and p3 act like 
     *   control points and only the middle span p1->p2 is 
     *   drawn. 
     * 
     *   Spline curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of spline() has twelve 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates.
     *   @param x1 x-coordinate of point p0.
     *   @param y1 y-coordinate of point p0.
     *   @param x2 x-coordinate of point p1.
     *   @param y2 y-coordinate of point p1.
     *   @param x3 x-coordinate of point p2.
     *   @param y3 y-coordinate of point p2.
     *   @param x4 x-coordinate of point p3.
     *   @param y4 y-coordinate of point p3.
     */
    function spline(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): void

    /**
     *   Draws a curve using a Catmull-Rom spline. Spline 
     *   curves can form shapes and curves that slope 
     *   gently. They’re like cables that are attached to a 
     *   set of points. By default (ends: INCLUDE), the 
     *   curve passes through all four points you provide, 
     *   in order p0(x1,y1) -> p1(x2,y2) -> p2(x3,y3) -> 
     *   p3(x4,y4). Think of them as points on a curve. If 
     *   you switch to ends: EXCLUDE, p0 and p3 act like 
     *   control points and only the middle span p1->p2 is 
     *   drawn. 
     * 
     *   Spline curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of spline() has twelve 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates.
     *   @param x1 x-coordinate of point p0.
     *   @param y1 y-coordinate of point p0.
     *   @param z1 z-coordinate of point p0.
     *   @param x2 x-coordinate of point p1.
     *   @param y2 y-coordinate of point p1.
     *   @param z2 z-coordinate of point p1.
     *   @param x3 x-coordinate of point p2.
     *   @param y3 y-coordinate of point p2.
     *   @param z3 z-coordinate of point p2.
     *   @param x4 x-coordinate of point p3.
     *   @param y4 y-coordinate of point p3.
     *   @param z4 z-coordinate of point p3.
     */
    function spline(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number): void

    /**
     *   Calculates coordinates along a spline curve using 
     *   interpolation. splinePoint() calculates 
     *   coordinates along a spline curve using four points 
     *   p0, p1, p2, p3. It expects points in the same 
     *   order as the spline() function. splinePoint() 
     *   works one axis at a time. Passing the points' 
     *   x-coordinates will calculate the x-coordinate of a 
     *   point on the curve. Passing the points' 
     *   y-coordinates will calculate the y-coordinate of a 
     *   point on the curve. 
     * 
     *   The first parameter, a, is the coordinate of point 
     *   p0. 
     * 
     *   The second and third parameters, b and c, are the 
     *   coordinates of points p1 and p2. 
     * 
     *   The fourth parameter, d, is the coordinate of 
     *   point p3. 
     * 
     *   The fifth parameter, t, is the amount to 
     *   interpolate along the span from p1 to p2. t = 0 is 
     *   p1, t = 1 is p2, and t = 0.5 is halfway between 
     *   them.
     *   @param a coordinate of point p0.
     *   @param b coordinate of point p1.
     *   @param c coordinate of point p2.
     *   @param d coordinate of point p3.
     *   @param t amount to interpolate between 0 and 1.
     *   @return coordinate of a point on the curve.
     */
    function splinePoint(a: number, b: number, c: number, d: number, t: number): number

    /**
     *   Calculates coordinates along a line that's tangent 
     *   to a spline curve. Tangent lines skim the surface 
     *   of a curve. A tangent line's slope equals the 
     *   curve's slope at the point where it intersects. 
     * 
     *   splineTangent() calculates coordinates along a 
     *   tangent line using four points p0, p1, p2, p3. It 
     *   expects points in the same order as the spline() 
     *   function. splineTangent() works one axis at a 
     *   time. Passing the points' x-coordinates returns 
     *   the x-component of the tangent vector; passing the 
     *   points' y-coordinates returns the y-component. The 
     *   first parameter, a, is the coordinate of point p0. 
     * 
     *   The second and third parameters, b and c, are the 
     *   coordinates of points p1 and p2. 
     * 
     *   The fourth parameter, d, is the coordinate of 
     *   point p3. 
     * 
     *   The fifth parameter, t, is the amount to 
     *   interpolate along the span from p1 to p2. t = 0 is 
     *   p1, t = 1 is p2, and t = 0.5 is halfway between 
     *   them.
     *   @param a coordinate of point p0.
     *   @param b coordinate of point p1.
     *   @param c coordinate of point p2.
     *   @param d coordinate of point p3.
     *   @param t amount to interpolate between 0 and 1.
     *   @return coordinate of a point on the tangent line.
     */
    function splineTangent(a: number, b: number, c: number, d: number, t: number): number

    /**
     *   Influences the shape of the Bézier curve segment 
     *   in a custom shape. By default, this is 3; the 
     *   other possible parameter is 2. This results in 
     *   quadratic Bézier curves. bezierVertex() adds a 
     *   curved segment to custom shapes. The Bézier curves 
     *   it creates are defined like those made by the 
     *   bezier() function. bezierVertex() must be called 
     *   between the beginShape() and endShape() functions. 
     *   There must be at least one call to bezierVertex(), 
     *   before a number of bezierVertex() calls that is a 
     *   multiple of the parameter set by bezierOrder(...) 
     *   (default 3). 
     * 
     *   Each curve of order 3 requires three calls to 
     *   bezierVertex, so 2 curves would need 7 calls to 
     *   bezierVertex(): (1 one initial anchor point, two 
     *   sets of 3 curves describing the curves) With 
     *   bezierOrder(2), two curves would need 5 calls: 1 + 
     *   2 + 2. 
     * 
     *   Bézier curves can also be drawn in 3D using WebGL 
     *   mode. 
     * 
     *   Note: bezierVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param order The new order to set. Can be either 2 
     *   or 3, by default 3
     */
    function bezierOrder(order: number): void

    /**
     *   Influences the shape of the Bézier curve segment 
     *   in a custom shape. By default, this is 3; the 
     *   other possible parameter is 2. This results in 
     *   quadratic Bézier curves. bezierVertex() adds a 
     *   curved segment to custom shapes. The Bézier curves 
     *   it creates are defined like those made by the 
     *   bezier() function. bezierVertex() must be called 
     *   between the beginShape() and endShape() functions. 
     *   There must be at least one call to bezierVertex(), 
     *   before a number of bezierVertex() calls that is a 
     *   multiple of the parameter set by bezierOrder(...) 
     *   (default 3). 
     * 
     *   Each curve of order 3 requires three calls to 
     *   bezierVertex, so 2 curves would need 7 calls to 
     *   bezierVertex(): (1 one initial anchor point, two 
     *   sets of 3 curves describing the curves) With 
     *   bezierOrder(2), two curves would need 5 calls: 1 + 
     *   2 + 2. 
     * 
     *   Bézier curves can also be drawn in 3D using WebGL 
     *   mode. 
     * 
     *   Note: bezierVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @return The current Bézier order.
     */
    function bezierOrder(): number

    /**
     *   Connects points with a smooth curve (a spline). 
     *   splineVertex() adds a curved segment to custom 
     *   shapes. The curve it creates follows the same 
     *   rules as the ones made with the spline() function. 
     *   splineVertex() must be called between the 
     *   beginShape() and endShape() functions. 
     * 
     *   Spline curves can form shapes and curves that 
     *   slope gently. They’re like cables that are 
     *   attached to a set of points. splineVertex() draws 
     *   a smooth curve through the points you give it. 
     *   beginShape() and endShape() in order to draw a 
     *   curve: 
     * 
     *   If you provide three points, the spline will pass 
     *   through them. It works the same way with any 
     *   number of points. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the last point. 
     *   splineVertex(85, 60); endShape();
     * 
     *  
     * 
     *   Passing in CLOSE to endShape() closes the spline 
     *   smoothly. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the second point. 
     *   splineVertex(85, 60); endShape(CLOSE);
     * 
     *  
     * 
     *   By default (ends: INCLUDE), the curve passes 
     *   through all the points you add with 
     *   splineVertex(), similar to the spline() function. 
     *   To draw only the middle span p1->p2 (skipping 
     *   p0->p1 and p2->p3), set splineProperty('ends', 
     *   EXCLUDE). You don’t need to duplicate vertices to 
     *   draw those spans. 
     * 
     *   Spline curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of splineVertex() has three 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates. By default, the vertex’s 
     *   z-coordinate is set to 0. 
     * 
     *   Note: splineVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param x x-coordinate of the vertex
     *   @param y y-coordinate of the vertex
     */
    function splineVertex(x: number, y: number): void

    /**
     *   Connects points with a smooth curve (a spline). 
     *   splineVertex() adds a curved segment to custom 
     *   shapes. The curve it creates follows the same 
     *   rules as the ones made with the spline() function. 
     *   splineVertex() must be called between the 
     *   beginShape() and endShape() functions. 
     * 
     *   Spline curves can form shapes and curves that 
     *   slope gently. They’re like cables that are 
     *   attached to a set of points. splineVertex() draws 
     *   a smooth curve through the points you give it. 
     *   beginShape() and endShape() in order to draw a 
     *   curve: 
     * 
     *   If you provide three points, the spline will pass 
     *   through them. It works the same way with any 
     *   number of points. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the last point. 
     *   splineVertex(85, 60); endShape();
     * 
     *  
     * 
     *   Passing in CLOSE to endShape() closes the spline 
     *   smoothly. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the second point. 
     *   splineVertex(85, 60); endShape(CLOSE);
     * 
     *  
     * 
     *   By default (ends: INCLUDE), the curve passes 
     *   through all the points you add with 
     *   splineVertex(), similar to the spline() function. 
     *   To draw only the middle span p1->p2 (skipping 
     *   p0->p1 and p2->p3), set splineProperty('ends', 
     *   EXCLUDE). You don’t need to duplicate vertices to 
     *   draw those spans. 
     * 
     *   Spline curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of splineVertex() has three 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates. By default, the vertex’s 
     *   z-coordinate is set to 0. 
     * 
     *   Note: splineVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param x x-coordinate of the vertex
     *   @param y y-coordinate of the vertex
     *   @param [z] z-coordinate of the vertex.
     */
    function splineVertex(x: number, y: number, z?: number): void

    /**
     *   Connects points with a smooth curve (a spline). 
     *   splineVertex() adds a curved segment to custom 
     *   shapes. The curve it creates follows the same 
     *   rules as the ones made with the spline() function. 
     *   splineVertex() must be called between the 
     *   beginShape() and endShape() functions. 
     * 
     *   Spline curves can form shapes and curves that 
     *   slope gently. They’re like cables that are 
     *   attached to a set of points. splineVertex() draws 
     *   a smooth curve through the points you give it. 
     *   beginShape() and endShape() in order to draw a 
     *   curve: 
     * 
     *   If you provide three points, the spline will pass 
     *   through them. It works the same way with any 
     *   number of points. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the last point. 
     *   splineVertex(85, 60); endShape();
     * 
     *  
     * 
     *   Passing in CLOSE to endShape() closes the spline 
     *   smoothly. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the second point. 
     *   splineVertex(85, 60); endShape(CLOSE);
     * 
     *  
     * 
     *   By default (ends: INCLUDE), the curve passes 
     *   through all the points you add with 
     *   splineVertex(), similar to the spline() function. 
     *   To draw only the middle span p1->p2 (skipping 
     *   p0->p1 and p2->p3), set splineProperty('ends', 
     *   EXCLUDE). You don’t need to duplicate vertices to 
     *   draw those spans. 
     * 
     *   Spline curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of splineVertex() has three 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates. By default, the vertex’s 
     *   z-coordinate is set to 0. 
     * 
     *   Note: splineVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param x x-coordinate of the vertex
     *   @param y y-coordinate of the vertex
     */
    function splineVertex(x: number, y: number, u?: number, v?: number): void

    /**
     *   Connects points with a smooth curve (a spline). 
     *   splineVertex() adds a curved segment to custom 
     *   shapes. The curve it creates follows the same 
     *   rules as the ones made with the spline() function. 
     *   splineVertex() must be called between the 
     *   beginShape() and endShape() functions. 
     * 
     *   Spline curves can form shapes and curves that 
     *   slope gently. They’re like cables that are 
     *   attached to a set of points. splineVertex() draws 
     *   a smooth curve through the points you give it. 
     *   beginShape() and endShape() in order to draw a 
     *   curve: 
     * 
     *   If you provide three points, the spline will pass 
     *   through them. It works the same way with any 
     *   number of points. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the last point. 
     *   splineVertex(85, 60); endShape();
     * 
     *  
     * 
     *   Passing in CLOSE to endShape() closes the spline 
     *   smoothly. 
     * 
     *   beginShape(); // Add the first point. 
     *   splineVertex(25, 80); // Add the second point. 
     *   splineVertex(20, 30); // Add the second point. 
     *   splineVertex(85, 60); endShape(CLOSE);
     * 
     *  
     * 
     *   By default (ends: INCLUDE), the curve passes 
     *   through all the points you add with 
     *   splineVertex(), similar to the spline() function. 
     *   To draw only the middle span p1->p2 (skipping 
     *   p0->p1 and p2->p3), set splineProperty('ends', 
     *   EXCLUDE). You don’t need to duplicate vertices to 
     *   draw those spans. 
     * 
     *   Spline curves can also be drawn in 3D using WebGL 
     *   mode. The 3D version of splineVertex() has three 
     *   arguments because each point has x-, y-, and 
     *   z-coordinates. By default, the vertex’s 
     *   z-coordinate is set to 0. 
     * 
     *   Note: splineVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param x x-coordinate of the vertex
     *   @param y y-coordinate of the vertex
     *   @param z z-coordinate of the vertex.
     */
    function splineVertex(x: number, y: number, z: number, u?: number, v?: number): void

    // TODO: Fix splineProperty() errors in src/scripts/parsers/in/p5.js/src/shape/custom_shapes.js, line undefined:
    //
    //    param "value" has invalid type: undefined
    //
    // function splineProperty(property: string, value: ): void

    // TODO: Fix splineProperty() errors in src/scripts/parsers/in/p5.js/src/shape/custom_shapes.js, line undefined:
    //
    //    return has invalid type: undefined
    //
    // function splineProperty(property: string): 

    /**
     *   Get or set multiple spline properties at once. 
     *   Similar to splineProperty(): 
     *   splineProperty('tightness', t) is the same as 
     *   splineProperties({'tightness': t})
     *   @param properties An object containing key-value 
     *   pairs to set.
     */
    function splineProperties(properties: object): void

    /**
     *   Get or set multiple spline properties at once. 
     *   Similar to splineProperty(): 
     *   splineProperty('tightness', t) is the same as 
     *   splineProperties({'tightness': t})
     *   @return The current spline properties.
     */
    function splineProperties(): object

    /**
     *   Adds a vertex to a custom shape. vertex() sets the 
     *   coordinates of vertices drawn between the 
     *   beginShape() and endShape() functions. 
     * 
     *   The first two parameters, x and y, set the x- and 
     *   y-coordinates of the vertex. 
     * 
     *   The third parameter, z, is optional. It sets the 
     *   z-coordinate of the vertex in WebGL mode. By 
     *   default, z is 0. 
     * 
     *   The fourth and fifth parameters, u and v, are also 
     *   optional. They set the u- and v-coordinates for 
     *   the vertex’s texture when used with endShape(). By 
     *   default, u and v are both 0.
     *   @param x x-coordinate of the vertex.
     *   @param y y-coordinate of the vertex.
     */
    function vertex(x: number, y: number): void

    /**
     *   Adds a vertex to a custom shape. vertex() sets the 
     *   coordinates of vertices drawn between the 
     *   beginShape() and endShape() functions. 
     * 
     *   The first two parameters, x and y, set the x- and 
     *   y-coordinates of the vertex. 
     * 
     *   The third parameter, z, is optional. It sets the 
     *   z-coordinate of the vertex in WebGL mode. By 
     *   default, z is 0. 
     * 
     *   The fourth and fifth parameters, u and v, are also 
     *   optional. They set the u- and v-coordinates for 
     *   the vertex’s texture when used with endShape(). By 
     *   default, u and v are both 0.
     *   @param x x-coordinate of the vertex.
     *   @param y y-coordinate of the vertex.
     *   @param [u] u-coordinate of the vertex's texture.
     *   @param [v] v-coordinate of the vertex's texture.
     */
    function vertex(x: number, y: number, u?: number, v?: number): void

    /**
     *   Adds a vertex to a custom shape. vertex() sets the 
     *   coordinates of vertices drawn between the 
     *   beginShape() and endShape() functions. 
     * 
     *   The first two parameters, x and y, set the x- and 
     *   y-coordinates of the vertex. 
     * 
     *   The third parameter, z, is optional. It sets the 
     *   z-coordinate of the vertex in WebGL mode. By 
     *   default, z is 0. 
     * 
     *   The fourth and fifth parameters, u and v, are also 
     *   optional. They set the u- and v-coordinates for 
     *   the vertex’s texture when used with endShape(). By 
     *   default, u and v are both 0.
     *   @param x x-coordinate of the vertex.
     *   @param y y-coordinate of the vertex.
     *   @param [u] u-coordinate of the vertex's texture.
     *   @param [v] v-coordinate of the vertex's texture.
     */
    function vertex(x: number, y: number, z: number, u?: number, v?: number): void

    /**
     *   Begins creating a hole within a flat shape. The 
     *   beginContour() and endContour() functions allow 
     *   for creating negative space within custom shapes 
     *   that are flat. beginContour() begins adding 
     *   vertices to a negative space and endContour() 
     *   stops adding them. beginContour() and endContour() 
     *   must be called between beginShape() and 
     *   endShape(). 
     * 
     *   Transformations such as translate(), rotate(), and 
     *   scale() don't work between beginContour() and 
     *   endContour(). It's also not possible to use other 
     *   shapes, such as ellipse() or rect(), between 
     *   beginContour() and endContour(). 
     * 
     *   Note: The vertices that define a negative space 
     *   must "wind" in the opposite direction from the 
     *   outer shape. First, draw vertices for the outer 
     *   shape clockwise order. Then, draw vertices for the 
     *   negative space in counter-clockwise order.
     */
    function beginContour(): void

    // TODO: Fix endContour() errors in src/scripts/parsers/in/p5.js/src/shape/custom_shapes.js, line undefined:
    //
    //    param "mode" has invalid type: OPEN|CLOSE
    //
    // function endContour(mode?: OPEN|CLOSE): void

    // TODO: Fix beginShape() errors in src/scripts/parsers/in/p5.js/src/shape/vertex.js, line undefined:
    //
    //    param "kind" has invalid type: POINTS|LINES|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|PATH
    //
    // function beginShape(kind?: POINTS|LINES|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|PATH): void

    /**
     *   Adds a Bézier curve segment to a custom shape. 
     *   bezierVertex() adds a curved segment to custom 
     *   shapes. The Bézier curves it creates are defined 
     *   like those made by the bezier() function. 
     *   bezierVertex() must be called between the 
     *   beginShape() and endShape() functions. Bézier need 
     *   a starting point. Building a shape only with 
     *   Bézier curves needs one initial call to 
     *   bezierVertex(), before a number of bezierVertex() 
     *   calls that is a multiple of the parameter set by 
     *   bezierOrder(...) (default 3). But shapes can mix 
     *   different types of vertices, so if there are some 
     *   previous vertices, then the initial anchor is not 
     *   needed, only the multiples of 3 (or the Bézier 
     *   order) calls to bezierVertex for each curve. 
     * 
     *   Each curve of order 3 requires three calls to 
     *   bezierVertex, so 2 curves would need 7 calls to 
     *   bezierVertex(): (1 one initial anchor point, two 
     *   sets of 3 curves describing the curves) With 
     *   bezierOrder(2), two curves would need 5 calls: 1 + 
     *   2 + 2. 
     * 
     *   Bézier curves can also be drawn in 3D using WebGL 
     *   mode. 
     * 
     *   Note: bezierVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param x x-coordinate of the first control point.
     *   @param y y-coordinate of the first control point.
     */
    function bezierVertex(x: number, y: number, u?: number, v?: number): void

    /**
     *   Adds a Bézier curve segment to a custom shape. 
     *   bezierVertex() adds a curved segment to custom 
     *   shapes. The Bézier curves it creates are defined 
     *   like those made by the bezier() function. 
     *   bezierVertex() must be called between the 
     *   beginShape() and endShape() functions. Bézier need 
     *   a starting point. Building a shape only with 
     *   Bézier curves needs one initial call to 
     *   bezierVertex(), before a number of bezierVertex() 
     *   calls that is a multiple of the parameter set by 
     *   bezierOrder(...) (default 3). But shapes can mix 
     *   different types of vertices, so if there are some 
     *   previous vertices, then the initial anchor is not 
     *   needed, only the multiples of 3 (or the Bézier 
     *   order) calls to bezierVertex for each curve. 
     * 
     *   Each curve of order 3 requires three calls to 
     *   bezierVertex, so 2 curves would need 7 calls to 
     *   bezierVertex(): (1 one initial anchor point, two 
     *   sets of 3 curves describing the curves) With 
     *   bezierOrder(2), two curves would need 5 calls: 1 + 
     *   2 + 2. 
     * 
     *   Bézier curves can also be drawn in 3D using WebGL 
     *   mode. 
     * 
     *   Note: bezierVertex() won’t work when an argument 
     *   is passed to beginShape().
     *   @param x x-coordinate of the first control point.
     *   @param y y-coordinate of the first control point.
     */
    function bezierVertex(x: number, y: number, z: number, u?: number, v?: number): void

    // TODO: Fix endShape() errors in src/scripts/parsers/in/p5.js/src/shape/vertex.js, line undefined:
    //
    //    param "mode" has invalid type: CLOSE
    //
    // function endShape(mode?: CLOSE, count?: number): void

    /**
     *   Sets the normal vector for vertices in a custom 3D 
     *   shape. 3D shapes created with beginShape() and 
     *   endShape() are made by connecting sets of points 
     *   called vertices. Each vertex added with vertex() 
     *   has a normal vector that points away from it. The 
     *   normal vector controls how light reflects off the 
     *   shape. 
     * 
     *   normal() can be called two ways with different 
     *   parameters to define the normal vector's 
     *   components. 
     * 
     *   The first way to call normal() has three 
     *   parameters, x, y, and z. If Numbers are passed, as 
     *   in normal(1, 2, 3), they set the x-, y-, and 
     *   z-components of the normal vector. 
     * 
     *   The second way to call normal() has one parameter, 
     *   vector. If a p5.Vector object is passed, as in 
     *   normal(myVector), its components will be used to 
     *   set the normal vector. 
     * 
     *   normal() changes the normal vector of vertices 
     *   added to a custom shape with vertex(). normal() 
     *   must be called between the beginShape() and 
     *   endShape() functions, just like vertex(). The 
     *   normal vector set by calling normal() will affect 
     *   all following vertices until normal() is called 
     *   again: 
     * 
     *   beginShape(); // Set the vertex normal. 
     *   normal(-0.4, -0.4, 0.8); // Add a vertex. 
     *   vertex(-30, -30, 0); // Set the vertex normal. 
     *   normal(0, 0, 1); // Add vertices. vertex(30, -30, 
     *   0); vertex(30, 30, 0); // Set the vertex normal. 
     *   normal(0.4, -0.4, 0.8); // Add a vertex. 
     *   vertex(-30, 30, 0); endShape();
     *   @param vector vertex normal as a p5.Vector object.
     */
    function normal(vector: p5.Vector): void

    /**
     *   Sets the normal vector for vertices in a custom 3D 
     *   shape. 3D shapes created with beginShape() and 
     *   endShape() are made by connecting sets of points 
     *   called vertices. Each vertex added with vertex() 
     *   has a normal vector that points away from it. The 
     *   normal vector controls how light reflects off the 
     *   shape. 
     * 
     *   normal() can be called two ways with different 
     *   parameters to define the normal vector's 
     *   components. 
     * 
     *   The first way to call normal() has three 
     *   parameters, x, y, and z. If Numbers are passed, as 
     *   in normal(1, 2, 3), they set the x-, y-, and 
     *   z-components of the normal vector. 
     * 
     *   The second way to call normal() has one parameter, 
     *   vector. If a p5.Vector object is passed, as in 
     *   normal(myVector), its components will be used to 
     *   set the normal vector. 
     * 
     *   normal() changes the normal vector of vertices 
     *   added to a custom shape with vertex(). normal() 
     *   must be called between the beginShape() and 
     *   endShape() functions, just like vertex(). The 
     *   normal vector set by calling normal() will affect 
     *   all following vertices until normal() is called 
     *   again: 
     * 
     *   beginShape(); // Set the vertex normal. 
     *   normal(-0.4, -0.4, 0.8); // Add a vertex. 
     *   vertex(-30, -30, 0); // Set the vertex normal. 
     *   normal(0, 0, 1); // Add vertices. vertex(30, -30, 
     *   0); vertex(30, 30, 0); // Set the vertex normal. 
     *   normal(0.4, -0.4, 0.8); // Add a vertex. 
     *   vertex(-30, 30, 0); endShape();
     *   @param x x-component of the vertex normal.
     *   @param y y-component of the vertex normal.
     *   @param z z-component of the vertex normal.
     */
    function normal(x: number, y: number, z: number): void

    /**
     *   Sets the shader's vertex property or attribute 
     *   variables. A vertex property, or vertex attribute, 
     *   is a variable belonging to a vertex in a shader. 
     *   p5.js provides some default properties, such as 
     *   aPosition, aNormal, aVertexColor, etc. These are 
     *   set using vertex(), normal() and fill() 
     *   respectively. Custom properties can also be 
     *   defined within beginShape() and endShape(). 
     * 
     *   The first parameter, propertyName, is a string 
     *   with the property's name. This is the same 
     *   variable name which should be declared in the 
     *   shader, such as in vec3 aProperty, similar to 
     *   .setUniform(). 
     * 
     *   The second parameter, data, is the value assigned 
     *   to the shader variable. This value will be applied 
     *   to subsequent vertices created with vertex(). It 
     *   can be a Number or an array of numbers, and in the 
     *   shader program the type can be declared according 
     *   to the WebGL specification. Common types include 
     *   float, vec2, vec3, vec4 or matrices. 
     * 
     *   See also the vertexProperty() method on Geometry 
     *   objects.
     *   @param attributeName the name of the vertex 
     *   attribute.
     *   @param data the data tied to the vertex attribute.
     */
    function vertexProperty(attributeName: string, data: number|number[]): void

    /**
     *   Registers a callback to modify the world-space 
     *   properties of each vertex in a shader. This hook 
     *   can be used inside baseColorShader().modify() and 
     *   similar shader modify() calls to customize vertex 
     *   positions, normals, texture coordinates, and 
     *   colors before rendering. "World space" refers to 
     *   the coordinate system of the 3D scene, before any 
     *   camera or projection transformations are applied. 
     *   The callback receives a vertex object with the 
     *   following properties: 
     * 
     *   - position: a three-component vector representing 
     *   the original position of the vertex.
     *   - normal: a three-component vector representing 
     *   the direction the surface is facing.
     *   - texCoord: a two-component vector representing 
     *   the texture coordinates.
     *   - color: a four-component vector representing the 
     *   color of the vertex (red, green, blue, alpha).
     * 
     *   This hook is available in: 
     * 
     *   - baseMaterialShader()
     *   - baseNormalShader()
     *   - baseColorShader()
     *   - baseStrokeShader()
     *   @param callback A callback function which receives 
     *   a vertex object containing position (vec3), normal 
     *   (vec3), texCoord (vec2), and color (vec4) 
     *   properties. The function should return the 
     *   modified vertex object.
     */
    function getWorldInputs(callback: (...args: any[]) => any): void

    /**
     *   Registers a callback to customize how color 
     *   components are combined in the fragment shader. 
     *   This hook can be used inside 
     *   baseMaterialShader().modify() and similar shader 
     *   modify() calls to control the final color output 
     *   of a material. The callback receives an object 
     *   with the following properties: - baseColor: a 
     *   three-component vector representing the base color 
     *   (red, green, blue).
     *   - diffuse: a single number representing the 
     *   diffuse reflection.
     *   - ambientColor: a three-component vector 
     *   representing the ambient color.
     *   - ambient: a single number representing the 
     *   ambient reflection.
     *   - specularColor: a three-component vector 
     *   representing the specular color.
     *   - specular: a single number representing the 
     *   specular reflection.
     *   - emissive: a three-component vector representing 
     *   the emissive color.
     *   - opacity: a single number representing the 
     *   opacity.
     * 
     *   The callback should return a vector with four 
     *   components (red, green, blue, alpha) for the final 
     *   color. 
     * 
     *   This hook is available in: 
     * 
     *   - baseMaterialShader()
     *   @param callback A callback function which receives 
     *   the object described above and returns a vector 
     *   with four components for the final color.
     */
    function combineColors(callback: (...args: any[]) => any): void

    /**
     *   Registers a callback to modify the properties of 
     *   each fragment (pixel) before the final color is 
     *   calculated in the fragment shader. This hook can 
     *   be used inside baseMaterialShader().modify() and 
     *   similar shader modify() calls to adjust per-pixel 
     *   data before lighting/mixing. The callback receives 
     *   an Inputs object. Available fields depend on the 
     *   shader: 
     * 
     *   - In baseMaterialShader(): normal: a 
     *   three-component vector representing the surface 
     *   normal.texCoord: a two-component vector 
     *   representing the texture coordinates (u, 
     *   v).ambientLight: a three-component vector 
     *   representing the ambient light 
     *   color.ambientMaterial: a three-component vector 
     *   representing the material's ambient 
     *   color.specularMaterial: a three-component vector 
     *   representing the material's specular 
     *   color.emissiveMaterial: a three-component vector 
     *   representing the material's emissive color.color: 
     *   a four-component vector representing the base 
     *   color (red, green, blue, alpha).shininess: a 
     *   number controlling specular highlights.metalness: 
     *   a number controlling the metalness factor.
     *   - normal: a three-component vector representing 
     *   the surface normal.
     *   - texCoord: a two-component vector representing 
     *   the texture coordinates (u, v).
     *   - ambientLight: a three-component vector 
     *   representing the ambient light color.
     *   - ambientMaterial: a three-component vector 
     *   representing the material's ambient color.
     *   - specularMaterial: a three-component vector 
     *   representing the material's specular color.
     *   - emissiveMaterial: a three-component vector 
     *   representing the material's emissive color.
     *   - color: a four-component vector representing the 
     *   base color (red, green, blue, alpha).
     *   - shininess: a number controlling specular 
     *   highlights.
     *   - metalness: a number controlling the metalness 
     *   factor.
     *   - In baseStrokeShader(): color: a four-component 
     *   vector representing the stroke color (red, green, 
     *   blue, alpha).tangent: a two-component vector 
     *   representing the stroke tangent.center: a 
     *   two-component vector representing the cap/join 
     *   center.position: a two-component vector 
     *   representing the current fragment 
     *   position.strokeWeight: a number representing the 
     *   stroke weight in pixels.
     *   - color: a four-component vector representing the 
     *   stroke color (red, green, blue, alpha).
     *   - tangent: a two-component vector representing the 
     *   stroke tangent.
     *   - center: a two-component vector representing the 
     *   cap/join center.
     *   - position: a two-component vector representing 
     *   the current fragment position.
     *   - strokeWeight: a number representing the stroke 
     *   weight in pixels.
     * 
     *   Return the modified object to update the fragment. 
     * 
     *   This hook is available in: 
     * 
     *   - baseMaterialShader()
     *   - baseStrokeShader()
     *   @param callback A callback function which receives 
     *   the fragment inputs object and should return it 
     *   after making any changes.
     */
    function getPixelInputs(callback: (...args: any[]) => any): void

    /**
     *   Registers a callback to change the final color of 
     *   each pixel after all lighting and mixing is done 
     *   in the fragment shader. This hook can be used 
     *   inside baseColorShader().modify() and similar 
     *   shader modify() calls to adjust the color before 
     *   it appears on the screen. The callback receives a 
     *   four component vector representing red, green, 
     *   blue, and alpha. Return a new color array to 
     *   change the output color. 
     * 
     *   This hook is available in: 
     * 
     *   - baseColorShader()
     *   - baseMaterialShader()
     *   - baseNormalShader()
     *   - baseStrokeShader()
     *   @param callback A callback function which receives 
     *   the color array and should return a color array.
     */
    function getFinalColor(callback: (...args: any[]) => any): void

    /**
     *   Registers a callback to set the final color for 
     *   each pixel in a filter shader. This hook can be 
     *   used inside baseFilterShader().modify() and 
     *   similar shader modify() calls to control the 
     *   output color for each pixel. The callback receives 
     *   the following arguments: - inputs: an object with 
     *   the following properties: texCoord: a 
     *   two-component vector representing the texture 
     *   coordinates (u, v).canvasSize: a two-component 
     *   vector representing the canvas size in pixels 
     *   (width, height).texelSize: a two-component vector 
     *   representing the size of a single texel in texture 
     *   space.
     *   - texCoord: a two-component vector representing 
     *   the texture coordinates (u, v).
     *   - canvasSize: a two-component vector representing 
     *   the canvas size in pixels (width, height).
     *   - texelSize: a two-component vector representing 
     *   the size of a single texel in texture space.
     *   - canvasContent: a texture containing the sketch's 
     *   contents before the filter is applied.
     * 
     *   Return a four-component vector [r, g, b, a] for 
     *   the pixel. 
     * 
     *   This hook is available in: 
     * 
     *   - baseFilterShader()
     *   @param callback A callback function which receives 
     *   the inputs object and canvasContent, and should 
     *   return a color array.
     */
    function getColor(callback: (...args: any[]) => any): void

    /**
     *   Registers a callback to modify the properties of 
     *   each vertex before any transformations are applied 
     *   in the vertex shader. This hook can be used inside 
     *   baseColorShader().modify() and similar shader 
     *   modify() calls to move, color, or otherwise modify 
     *   the raw model data. The callback receives an 
     *   object with the following properties: - position: 
     *   a three-component vector representing the original 
     *   position of the vertex.
     *   - normal: a three-component vector representing 
     *   the direction the surface is facing.
     *   - texCoord: a two-component vector representing 
     *   the texture coordinates.
     *   - color: a four-component vector representing the 
     *   color of the vertex (red, green, blue, alpha).
     * 
     *   Return the modified object to update the vertex. 
     * 
     *   This hook is available in: 
     * 
     *   - baseColorShader()
     *   - baseMaterialShader()
     *   - baseNormalShader()
     *   - baseStrokeShader()
     *   @param callback A callback function which receives 
     *   the vertex object and should return it after 
     *   making any changes.
     */
    function getObjectInputs(callback: (...args: any[]) => any): void

    /**
     *   Registers a callback to adjust vertex properties 
     *   after the model has been transformed by the 
     *   camera, but before projection, in the vertex 
     *   shader. This hook can be used inside 
     *   baseColorShader().modify() and similar shader 
     *   modify() calls to create effects that depend on 
     *   the camera's view. The callback receives an object 
     *   with the following properties: - position: a 
     *   three-component vector representing the position 
     *   after camera transformation.
     *   - normal: a three-component vector representing 
     *   the normal after camera transformation.
     *   - texCoord: a two-component vector representing 
     *   the texture coordinates.
     *   - color: a four-component vector representing the 
     *   color of the vertex (red, green, blue, alpha).
     * 
     *   Return the modified object to update the vertex. 
     * 
     *   This hook is available in: 
     * 
     *   - baseColorShader()
     *   - baseMaterialShader()
     *   - baseNormalShader()
     *   - baseStrokeShader()
     *   @param callback A callback function which receives 
     *   the vertex object and should return it after 
     *   making any changes.
     */
    function getCameraInputs(callback: (...args: any[]) => any): void

    // TODO: Fix loadFont() errors in src/scripts/parsers/in/p5.js/src/type/p5.Font.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Font>
    //
    // function loadFont(path: string, name?: string, options?: object, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): 

    // TODO: Fix loadFont() errors in src/scripts/parsers/in/p5.js/src/type/p5.Font.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Font>
    //
    // function loadFont(path: string, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): 

    /**
     *   Draws text to the canvas. The first parameter, 
     *   str, is the text to be drawn. The second and third 
     *   parameters, x and y, set the coordinates of the 
     *   text's bottom-left corner. See textAlign() for 
     *   other ways to align text. 
     * 
     *   The fourth and fifth parameters, maxWidth and 
     *   maxHeight, are optional. They set the dimensions 
     *   of the invisible rectangle containing the text. By 
     *   default, they set its maximum width and height. 
     *   See rectMode() for other ways to define the 
     *   rectangular text box. Text will wrap to fit within 
     *   the text box. Text outside of the box won't be 
     *   drawn. 
     * 
     *   Text can be styled a few ways. Call the fill() 
     *   function to set the text's fill color. Call 
     *   stroke() and strokeWeight() to set the text's 
     *   outline. Call textSize() and textFont() to set the 
     *   text's size and font, respectively. 
     * 
     *   Note: WEBGL mode only supports fonts loaded with 
     *   loadFont(). Calling stroke() has no effect in 
     *   WEBGL mode.
     *   @param str text to be displayed.
     *   @param x x-coordinate of the text box.
     *   @param y y-coordinate of the text box.
     *   @param [maxWidth] maximum width of the text box. 
     *   See rectMode() for other options.
     *   @param [maxHeight] maximum height of the text box. 
     *   See rectMode() for other options.
     */
    function text(str: string|object|any[]|number|boolean, x: number, y: number, maxWidth?: number, maxHeight?: number): void

    // TODO: Fix textAlign() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    param "horizAlign" has invalid type: LEFT|CENTER|RIGHT
    //    param "vertAlign" has invalid type: TOP|BOTTOM|CENTER|BASELINE
    //
    // function textAlign(horizAlign?: LEFT|CENTER|RIGHT, vertAlign?: TOP|BOTTOM|CENTER|BASELINE): object

    /**
     *   Returns the ascent of the text. The textAscent() 
     *   function calculates the distance from the baseline 
     *   to the highest point of the current font. This 
     *   value represents the ascent, which is essential 
     *   for determining the overall height of the text 
     *   along with textDescent(). If a text string is 
     *   provided as an argument, the ascent is calculated 
     *   based on that specific string; otherwise, the 
     *   ascent of the current font is returned.
     *   @param [txt] (Optional) The text string for which 
     *   to calculate the ascent. If omitted, the function 
     *   returns the ascent for the current font.
     *   @return The ascent value in pixels.
     */
    function textAscent(txt?: string): number

    /**
     *   Returns the descent of the text. The textDescent() 
     *   function calculates the distance from the baseline 
     *   to the lowest point of the current font. This 
     *   value represents the descent, which, when combined 
     *   with the ascent (from textAscent()), determines 
     *   the overall vertical span of the text. If a text 
     *   string is provided as an argument, the descent is 
     *   calculated based on that specific string; 
     *   otherwise, the descent of the current font is 
     *   returned.
     *   @param [txt] (Optional) The text string for which 
     *   to calculate the descent. If omitted, the function 
     *   returns the descent for the current font.
     *   @return The descent value in pixels.
     */
    function textDescent(txt?: string): number

    /**
     *   Sets the spacing between lines of text when text() 
     *   is called. Note: Spacing is measured in pixels. 
     * 
     *   Calling textLeading() without an argument returns 
     *   the current spacing.
     *   @param [leading] The new text leading to apply, in 
     *   pixels
     *   @return If no arguments are provided, the current 
     *   text leading
     */
    function textLeading(leading?: number): number

    /**
     *   Sets the font used by the text() function. The 
     *   first parameter, font, sets the font. textFont() 
     *   recognizes either a p5.Font object or a string 
     *   with the name of a system font. For example, 
     *   'Courier New'. 
     * 
     *   The second parameter, size, is optional. It sets 
     *   the font size in pixels. This has the same effect 
     *   as calling textSize(). 
     * 
     *   Calling textFont() without arguments returns the 
     *   current font. 
     * 
     *   Note: WEBGL mode only supports fonts loaded with 
     *   loadFont().
     *   @param [font] The font to apply
     *   @param [size] An optional text size to apply.
     *   @return If no arguments are provided, returns the 
     *   current font
     */
    function textFont(font?: p5.Font|string|object, size?: number): string|p5.Font

    /**
     *   Sets or gets the current text size. The textSize() 
     *   function is used to specify the size of the text 
     *   that will be rendered on the canvas. When called 
     *   with an argument, it sets the text size to the 
     *   specified value (which can be a number 
     *   representing pixels or a CSS-style string, e.g., 
     *   '32px', '2em'). When called without an argument, 
     *   it returns the current text size in pixels.
     *   @param size The size to set for the text.
     *   @return If no arguments are provided, the current 
     *   text size in pixels.
     */
    function textSize(size: number): number

    /**
     *   Sets or gets the current text size. The textSize() 
     *   function is used to specify the size of the text 
     *   that will be rendered on the canvas. When called 
     *   with an argument, it sets the text size to the 
     *   specified value (which can be a number 
     *   representing pixels or a CSS-style string, e.g., 
     *   '32px', '2em'). When called without an argument, 
     *   it returns the current text size in pixels.
     *   @return The current text size in pixels.
     */
    function textSize(): number

    // TODO: Fix textStyle() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    param "style" has invalid type: NORMAL|ITALIC|BOLD|BOLDITALIC
    //    return has invalid type: NORMAL|ITALIC|BOLD|BOLDITALIC
    //
    // function textStyle(style: NORMAL|ITALIC|BOLD|BOLDITALIC): 

    // TODO: Fix textStyle() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    return has invalid type: NORMAL|BOLD|ITALIC|BOLDITALIC
    //
    // function textStyle(): 

    /**
     *   Calculates the width of the given text string in 
     *   pixels. The textWidth() function processes the 
     *   provided text string to determine its tight 
     *   bounding box based on the current text properties 
     *   such as font, textSize, and textStyle. Internally, 
     *   it splits the text into individual lines (if line 
     *   breaks are present) and computes the bounding box 
     *   for each line using the renderer’s measurement 
     *   functions. The final width is determined as the 
     *   maximum width among all these lines. 
     * 
     *   For example, if the text contains multiple lines 
     *   due to wrapping or explicit line breaks, 
     *   textWidth() will return the width of the longest 
     *   line. 
     * 
     *   Note: In p5.js 2.0+, leading and trailing spaces 
     *   are ignored. textWidth(" Hello ") returns the same 
     *   width as textWidth("Hello").
     *   @param text The text to measure
     *   @return The width of the text
     */
    function textWidth(text: string): number

    // TODO: Fix textWrap() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    param "style" has invalid type: WORD|CHAR
    //    return has invalid type: CHAR|WORD
    //
    // function textWrap(style: WORD|CHAR): 

    // TODO: Fix textWrap() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    return has invalid type: CHAR|WORD
    //
    // function textWrap(): 

    /**
     *   Computes the tight bounding box for a block of 
     *   text. The textBounds() function calculates the 
     *   precise pixel boundaries that enclose the rendered 
     *   text based on the current text properties (such as 
     *   font, textSize, textStyle, and alignment). If the 
     *   text spans multiple lines (due to line breaks or 
     *   wrapping), the function measures each line 
     *   individually and then aggregates these 
     *   measurements into a single bounding box. The 
     *   resulting object contains the x and y coordinates 
     *   along with the width (w) and height (h) of the 
     *   text block.
     *   @param str The text string to measure.
     *   @param x The x-coordinate where the text is drawn.
     *   @param y The y-coordinate where the text is drawn.
     *   @param [width] (Optional) The maximum width 
     *   available for the text block. When specified, the 
     *   text may be wrapped to fit within this width.
     *   @param [height] (Optional) The maximum height 
     *   available for the text block. Any lines exceeding 
     *   this height will be truncated.
     *   @return An object with properties x, y, w, and h 
     *   that represent the tight bounding box of the 
     *   rendered text.
     */
    function textBounds(str: string, x: number, y: number, width?: number, height?: number): object

    /**
     *   Sets or gets the text drawing direction. The 
     *   textDirection() function allows you to specify the 
     *   direction in which text is rendered on the canvas. 
     *   When provided with a direction parameter (such as 
     *   "ltr" for left-to-right, "rtl" for right-to-left, 
     *   or "inherit"), it updates the renderer's state 
     *   with that value and applies the new setting. When 
     *   called without any arguments, it returns the 
     *   current text direction. This function is 
     *   particularly useful for rendering text in 
     *   languages with different writing directions.
     *   @param direction The text direction to set ("ltr", 
     *   "rtl", or "inherit").
     *   @return If no arguments are provided, the current 
     *   text direction, either "ltr", "rtl", or "inherit"
     */
    function textDirection(direction: string): string

    /**
     *   Sets or gets the text drawing direction. The 
     *   textDirection() function allows you to specify the 
     *   direction in which text is rendered on the canvas. 
     *   When provided with a direction parameter (such as 
     *   "ltr" for left-to-right, "rtl" for right-to-left, 
     *   or "inherit"), it updates the renderer's state 
     *   with that value and applies the new setting. When 
     *   called without any arguments, it returns the 
     *   current text direction. This function is 
     *   particularly useful for rendering text in 
     *   languages with different writing directions.
     *   @return The current text direction, either "ltr", 
     *   "rtl", or "inherit"
     */
    function textDirection(): string

    // TODO: Fix textProperty() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    param "value" has invalid type: undefined
    //    return has invalid type: undefined
    //
    // function textProperty(prop: string, value: ): 

    // TODO: Fix textProperty() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
    //
    //    return has invalid type: undefined
    //
    // function textProperty(prop: string): 

    /**
     *   Gets or sets text properties in batch, similar to 
     *   calling textProperty() multiple times. If an 
     *   object is passed in, textProperty(key, value) will 
     *   be called for you on every key/value pair in the 
     *   object. 
     * 
     *   If no arguments are passed in, an object will be 
     *   returned with all the current properties.
     *   @param properties An object whose keys are 
     *   properties to set, and whose values are what they 
     *   should be set to.
     */
    function textProperties(properties: object): void

    /**
     *   Gets or sets text properties in batch, similar to 
     *   calling textProperty() multiple times. If an 
     *   object is passed in, textProperty(key, value) will 
     *   be called for you on every key/value pair in the 
     *   object. 
     * 
     *   If no arguments are passed in, an object will be 
     *   returned with all the current properties.
     *   @return An object with all the possible properties 
     *   and their current values.
     */
    function textProperties(): object

    /**
     *   Computes a generic (non-tight) bounding box for a 
     *   block of text. The fontBounds() function 
     *   calculates the bounding box for the text based on 
     *   the font's intrinsic metrics (such as 
     *   fontBoundingBoxAscent and fontBoundingBoxDescent). 
     *   Unlike textBounds(), which measures the exact 
     *   pixel boundaries of the rendered text, 
     *   fontBounds() provides a looser measurement derived 
     *   from the font’s default spacing. This measurement 
     *   is useful for layout purposes where a consistent 
     *   approximation of the text's dimensions is desired.
     *   @param str The text string to measure.
     *   @param x The x-coordinate where the text is drawn.
     *   @param y The y-coordinate where the text is drawn.
     *   @param [width] (Optional) The maximum width 
     *   available for the text block. When specified, the 
     *   text may be wrapped to fit within this width.
     *   @param [height] (Optional) The maximum height 
     *   available for the text block. Any lines exceeding 
     *   this height will be truncated.
     *   @return An object with properties x, y, w, and h 
     *   representing the loose bounding box of the text 
     *   based on the font's intrinsic metrics.
     */
    function fontBounds(str: string, x: number, y: number, width?: number, height?: number): object

    /**
     *   Returns the loose width of a text string based on 
     *   the current font. The fontWidth() function 
     *   measures the width of the provided text string 
     *   using the font's default measurement (i.e., the 
     *   width property from the text metrics returned by 
     *   the browser). Unlike textWidth(), which calculates 
     *   the tight pixel boundaries of the text glyphs, 
     *   fontWidth() uses the font's intrinsic spacing, 
     *   which may include additional space for character 
     *   spacing and kerning. This makes it useful for 
     *   scenarios where an approximate width is sufficient 
     *   for layout and positioning.
     *   @param theText The text string to measure.
     *   @return The loose width of the text in pixels.
     */
    function fontWidth(theText: string): number

    /**
     *   Returns the loose ascent of the text based on the 
     *   font's intrinsic metrics. The fontAscent() 
     *   function calculates the ascent of the text using 
     *   the font's intrinsic metrics (e.g., 
     *   fontBoundingBoxAscent). This value represents the 
     *   space above the baseline that the font inherently 
     *   occupies, and is useful for layout purposes when 
     *   an approximate vertical measurement is required.
     *   @return The loose ascent value in pixels.
     */
    function fontAscent(): number

    /**
     *   Returns the loose descent of the text based on the 
     *   font's intrinsic metrics. The fontDescent() 
     *   function calculates the descent of the text using 
     *   the font's intrinsic metrics (e.g., 
     *   fontBoundingBoxDescent). This value represents the 
     *   space below the baseline that the font inherently 
     *   occupies, and is useful for layout purposes when 
     *   an approximate vertical measurement is required.
     *   @return The loose descent value in pixels.
     */
    function fontDescent(): number

    /**
     *   Sets or gets the current font weight. The 
     *   textWeight() function is used to specify the 
     *   weight (thickness) of the text. When a numeric 
     *   value is provided, it sets the font weight to that 
     *   value and updates the rendering properties 
     *   accordingly (including the 
     *   "font-variation-settings" on the canvas style). 
     *   When called without an argument, it returns the 
     *   current font weight setting.
     *   @param weight The numeric weight value to set for 
     *   the text.
     *   @return If no arguments are provided, the current 
     *   font weight
     */
    function textWeight(weight: number): number

    /**
     *   Sets or gets the current font weight. The 
     *   textWeight() function is used to specify the 
     *   weight (thickness) of the text. When a numeric 
     *   value is provided, it sets the font weight to that 
     *   value and updates the rendering properties 
     *   accordingly (including the 
     *   "font-variation-settings" on the canvas style). 
     *   When called without an argument, it returns the 
     *   current font weight setting.
     *   @return The current font weight
     */
    function textWeight(): number

    /**
     *   Converts a String to a floating point (decimal) 
     *   Number. float() converts strings that resemble 
     *   numbers, such as '12.34', into numbers. 
     * 
     *   The parameter, str, is the string value to 
     *   convert. For example, calling float('12.34') 
     *   returns the number 12.34. If an array of strings 
     *   is passed, as in float(['12.34', '56.78']), then 
     *   an array of numbers will be returned. 
     * 
     *   Note: If a string can't be converted to a number, 
     *   as in float('giraffe'), then the value NaN (not a 
     *   number) will be returned.
     *   @param str string to convert.
     *   @return converted number.
     */
    function float(str: string): number

    /**
     *   Converts a String to a floating point (decimal) 
     *   Number. float() converts strings that resemble 
     *   numbers, such as '12.34', into numbers. 
     * 
     *   The parameter, str, is the string value to 
     *   convert. For example, calling float('12.34') 
     *   returns the number 12.34. If an array of strings 
     *   is passed, as in float(['12.34', '56.78']), then 
     *   an array of numbers will be returned. 
     * 
     *   Note: If a string can't be converted to a number, 
     *   as in float('giraffe'), then the value NaN (not a 
     *   number) will be returned.
     *   @param ns array of strings to convert.
     *   @return converted numbers.
     */
    function float(ns: string[]): number[]

    /**
     *   Converts a Boolean, String, or decimal Number to 
     *   an integer. int() converts values to integers. 
     *   Integers are positive or negative numbers without 
     *   decimals. If the original value has decimals, as 
     *   in -34.56, they're removed to produce an integer 
     *   such as -34. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a Boolean, as in int(false) or int(true), then the 
     *   number 0 (false) or 1 (true) will be returned. If 
     *   n is a string or number, as in int('45') or 
     *   int(67.89), then an integer will be returned. If 
     *   an array is passed, as in int([12.34, 56.78]), 
     *   then an array of integers will be returned. 
     * 
     *   Note: If a value can't be converted to a number, 
     *   as in int('giraffe'), then the value NaN (not a 
     *   number) will be returned.
     *   @param n value to convert.
     *   @return converted number.
     */
    function int(n: string|boolean|number): number

    /**
     *   Converts a Boolean, String, or decimal Number to 
     *   an integer. int() converts values to integers. 
     *   Integers are positive or negative numbers without 
     *   decimals. If the original value has decimals, as 
     *   in -34.56, they're removed to produce an integer 
     *   such as -34. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a Boolean, as in int(false) or int(true), then the 
     *   number 0 (false) or 1 (true) will be returned. If 
     *   n is a string or number, as in int('45') or 
     *   int(67.89), then an integer will be returned. If 
     *   an array is passed, as in int([12.34, 56.78]), 
     *   then an array of integers will be returned. 
     * 
     *   Note: If a value can't be converted to a number, 
     *   as in int('giraffe'), then the value NaN (not a 
     *   number) will be returned.
     *   @param ns values to convert.
     *   @return converted numbers.
     */
    function int(ns: any[]): number[]

    /**
     *   Converts a Boolean or Number to String. str() 
     *   converts values to strings. See the String 
     *   reference page for guidance on using template 
     *   literals instead. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a Boolean, as in str(false) or str(true), then the 
     *   value will be returned as a string, as in 'false' 
     *   or 'true'. If n is a number, as in str(123), then 
     *   its value will be returned as a string, as in 
     *   '123'. If an array is passed, as in str([12.34, 
     *   56.78]), then an array of strings will be 
     *   returned.
     *   @param n value to convert.
     *   @return converted string.
     */
    function str(n: string|boolean|number): string

    /**
     *   Converts a String or Number to a Boolean. 
     *   boolean() converts values to true or false. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a string, then boolean('true') will return true 
     *   and every other string value will return false. If 
     *   n is a number, then boolean(0) will return false 
     *   and every other numeric value will return true. If 
     *   an array is passed, as in boolean([0, 1, 'true', 
     *   'blue']), then an array of Boolean values will be 
     *   returned.
     *   @param n value to convert.
     *   @return converted Boolean value.
     */
    function boolean(n: string|boolean|number): boolean

    /**
     *   Converts a String or Number to a Boolean. 
     *   boolean() converts values to true or false. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a string, then boolean('true') will return true 
     *   and every other string value will return false. If 
     *   n is a number, then boolean(0) will return false 
     *   and every other numeric value will return true. If 
     *   an array is passed, as in boolean([0, 1, 'true', 
     *   'blue']), then an array of Boolean values will be 
     *   returned.
     *   @param ns values to convert.
     *   @return converted Boolean values.
     */
    function boolean(ns: any[]): boolean[]

    /**
     *   Converts a Boolean, String, or Number to its byte 
     *   value. byte() converts a value to an integer 
     *   (whole number) between -128 and 127. Values 
     *   greater than 127 wrap around while negative values 
     *   are unchanged. For example, 128 becomes -128 and 
     *   -129 remains the same. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a Boolean, as in byte(false) or byte(true), the 
     *   number 0 (false) or 1 (true) will be returned. If 
     *   n is a string or number, as in byte('256') or 
     *   byte(256), then the byte value will be returned. 
     *   Decimal values are ignored. If an array is passed, 
     *   as in byte([true, 123, '456']), then an array of 
     *   byte values will be returned. 
     * 
     *   Note: If a value can't be converted to a number, 
     *   as in byte('giraffe'), then the value NaN (not a 
     *   number) will be returned.
     *   @param n value to convert.
     *   @return converted byte value.
     */
    function byte(n: string|boolean|number): number

    /**
     *   Converts a Boolean, String, or Number to its byte 
     *   value. byte() converts a value to an integer 
     *   (whole number) between -128 and 127. Values 
     *   greater than 127 wrap around while negative values 
     *   are unchanged. For example, 128 becomes -128 and 
     *   -129 remains the same. 
     * 
     *   The parameter, n, is the value to convert. If n is 
     *   a Boolean, as in byte(false) or byte(true), the 
     *   number 0 (false) or 1 (true) will be returned. If 
     *   n is a string or number, as in byte('256') or 
     *   byte(256), then the byte value will be returned. 
     *   Decimal values are ignored. If an array is passed, 
     *   as in byte([true, 123, '456']), then an array of 
     *   byte values will be returned. 
     * 
     *   Note: If a value can't be converted to a number, 
     *   as in byte('giraffe'), then the value NaN (not a 
     *   number) will be returned.
     *   @param ns values to convert.
     *   @return converted byte values.
     */
    function byte(ns: any[]): number[]

    /**
     *   Converts a Number or String to a single-character 
     *   String. char() converts numbers to their 
     *   single-character string representations. 
     * 
     *   The parameter, n, is the value to convert. If a 
     *   number is passed, as in char(65), the 
     *   corresponding single-character string is returned. 
     *   If a string is passed, as in char('65'), the 
     *   string is converted to an integer (whole number) 
     *   and the corresponding single-character string is 
     *   returned. If an array is passed, as in char([65, 
     *   66, 67]), an array of single-character strings is 
     *   returned. 
     * 
     *   See MDN for more information about conversions.
     *   @param n value to convert.
     *   @return converted single-character string.
     */
    function char(n: string|number): string

    /**
     *   Converts a Number or String to a single-character 
     *   String. char() converts numbers to their 
     *   single-character string representations. 
     * 
     *   The parameter, n, is the value to convert. If a 
     *   number is passed, as in char(65), the 
     *   corresponding single-character string is returned. 
     *   If a string is passed, as in char('65'), the 
     *   string is converted to an integer (whole number) 
     *   and the corresponding single-character string is 
     *   returned. If an array is passed, as in char([65, 
     *   66, 67]), an array of single-character strings is 
     *   returned. 
     * 
     *   See MDN for more information about conversions.
     *   @param ns values to convert.
     *   @return converted single-character strings.
     */
    function char(ns: any[]): string[]

    /**
     *   Converts a single-character String to a Number. 
     *   unchar() converts single-character strings to 
     *   their corresponding integer (whole number). 
     * 
     *   The parameter, n, is the character to convert. For 
     *   example, unchar('A'), returns the number 65. If an 
     *   array is passed, as in unchar(['A', 'B', 'C']), an 
     *   array of integers is returned.
     *   @param n value to convert.
     *   @return converted number.
     */
    function unchar(n: string): number

    /**
     *   Converts a single-character String to a Number. 
     *   unchar() converts single-character strings to 
     *   their corresponding integer (whole number). 
     * 
     *   The parameter, n, is the character to convert. For 
     *   example, unchar('A'), returns the number 65. If an 
     *   array is passed, as in unchar(['A', 'B', 'C']), an 
     *   array of integers is returned.
     *   @param ns values to convert.
     *   @return converted numbers.
     */
    function unchar(ns: string[]): number[]

    /**
     *   Converts a Number to a String with its hexadecimal 
     *   value. hex() converts a number to a string with 
     *   its hexadecimal number value. Hexadecimal (hex) 
     *   numbers are base-16, which means there are 16 
     *   unique digits. Hex extends the numbers 0–9 with 
     *   the letters A–F. For example, the number 11 
     *   (eleven) in base-10 is written as the letter B in 
     *   hex. 
     * 
     *   The first parameter, n, is the number to convert. 
     *   For example, hex(20), returns the string 
     *   '00000014'. If an array is passed, as in hex([1, 
     *   10, 100]), an array of hexadecimal strings is 
     *   returned. 
     * 
     *   The second parameter, digits, is optional. If a 
     *   number is passed, as in hex(20, 2), it sets the 
     *   number of hexadecimal digits to display. For 
     *   example, calling hex(20, 2) returns the string 
     *   '14'.
     *   @param n value to convert.
     *   @param [digits] number of digits to include.
     *   @return converted hexadecimal value.
     */
    function hex(n: number, digits?: number): string

    /**
     *   Converts a Number to a String with its hexadecimal 
     *   value. hex() converts a number to a string with 
     *   its hexadecimal number value. Hexadecimal (hex) 
     *   numbers are base-16, which means there are 16 
     *   unique digits. Hex extends the numbers 0–9 with 
     *   the letters A–F. For example, the number 11 
     *   (eleven) in base-10 is written as the letter B in 
     *   hex. 
     * 
     *   The first parameter, n, is the number to convert. 
     *   For example, hex(20), returns the string 
     *   '00000014'. If an array is passed, as in hex([1, 
     *   10, 100]), an array of hexadecimal strings is 
     *   returned. 
     * 
     *   The second parameter, digits, is optional. If a 
     *   number is passed, as in hex(20, 2), it sets the 
     *   number of hexadecimal digits to display. For 
     *   example, calling hex(20, 2) returns the string 
     *   '14'.
     *   @param ns values to convert.
     *   @param [digits] number of digits to include.
     *   @return converted hexadecimal values.
     */
    function hex(ns: number[], digits?: number): string[]

    /**
     *   Converts a String with a hexadecimal value to a 
     *   Number. unhex() converts a string with its 
     *   hexadecimal number value to a number. Hexadecimal 
     *   (hex) numbers are base-16, which means there are 
     *   16 unique digits. Hex extends the numbers 0–9 with 
     *   the letters A–F. For example, the number 11 
     *   (eleven) in base-10 is written as the letter B in 
     *   hex. 
     * 
     *   The first parameter, n, is the hex string to 
     *   convert. For example, unhex('FF'), returns the 
     *   number 255. If an array is passed, as in 
     *   unhex(['00', '80', 'FF']), an array of numbers is 
     *   returned.
     *   @param n value to convert.
     *   @return converted number.
     */
    function unhex(n: string): number

    /**
     *   Converts a String with a hexadecimal value to a 
     *   Number. unhex() converts a string with its 
     *   hexadecimal number value to a number. Hexadecimal 
     *   (hex) numbers are base-16, which means there are 
     *   16 unique digits. Hex extends the numbers 0–9 with 
     *   the letters A–F. For example, the number 11 
     *   (eleven) in base-10 is written as the letter B in 
     *   hex. 
     * 
     *   The first parameter, n, is the hex string to 
     *   convert. For example, unhex('FF'), returns the 
     *   number 255. If an array is passed, as in 
     *   unhex(['00', '80', 'FF']), an array of numbers is 
     *   returned.
     *   @param ns values to convert.
     *   @return converted numbers.
     */
    function unhex(ns: string[]): number[]

    /**
     *   Returns the current day as a number from 1–31.
     *   @return current day between 1 and 31.
     */
    function day(): number

    /**
     *   Returns the current hour as a number from 0–23.
     *   @return current hour between 0 and 23.
     */
    function hour(): number

    /**
     *   Returns the current minute as a number from 0–59.
     *   @return current minute between 0 and 59.
     */
    function minute(): number

    /**
     *   Returns the number of milliseconds since a sketch 
     *   started running. millis() keeps track of how long 
     *   a sketch has been running in milliseconds 
     *   (thousandths of a second). This information is 
     *   often helpful for timing events and animations. 
     * 
     *   If a sketch has a setup() function, then millis() 
     *   begins tracking time before the code in setup() 
     *   runs. If a sketch includes asynchronous loading 
     *   using async/await, then millis() begins tracking 
     *   time as soon as the asynchronous code starts 
     *   running.
     *   @return number of milliseconds since starting the 
     *   sketch.
     */
    function millis(): number

    /**
     *   Returns the current month as a number from 1–12.
     *   @return current month between 1 and 12.
     */
    function month(): number

    /**
     *   Returns the current second as a number from 0–59.
     *   @return current second between 0 and 59.
     */
    function second(): number

    /**
     *   Returns the current year as a number such as 1999.
     *   @return current year.
     */
    function year(): number

    /**
     *   Converts a Number into a String with a given 
     *   number of digits. nf() converts numbers such as 
     *   123.45 into strings formatted with a set number of 
     *   digits, as in '123.4500'. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nf(123.45) 
     *   returns the string '123.45'. If an array of 
     *   numbers is passed, as in nf([123.45, 67.89]), an 
     *   array of formatted strings will be returned. 
     * 
     *   The second parameter, left, is optional. If a 
     *   number is passed, as in nf(123.45, 4), it sets the 
     *   minimum number of digits to include to the left of 
     *   the decimal place. If left is larger than the 
     *   number of digits in num, then unused digits will 
     *   be set to 0. For example, calling nf(123.45, 4) 
     *   returns the string '0123.45'. 
     * 
     *   The third parameter, right, is also optional. If a 
     *   number is passed, as in nf(123.45, 4, 1), it sets 
     *   the minimum number of digits to include to the 
     *   right of the decimal place. If right is smaller 
     *   than the number of decimal places in num, then num 
     *   will be rounded to the given number of decimal 
     *   places. For example, calling nf(123.45, 4, 1) 
     *   returns the string '0123.5'. If right is larger 
     *   than the number of decimal places in num, then 
     *   unused decimal places will be set to 0. For 
     *   example, calling nf(123.45, 4, 3) returns the 
     *   string '0123.450'. 
     * 
     *   When the number is negative, for example, calling 
     *   nf(-123.45, 5, 2) returns the string '-00123.45'.
     *   @param num number to format.
     *   @param [left] number of digits to include to the 
     *   left of the decimal point.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted string.
     */
    function nf(num: number|string, left?: number|string, right?: number|string): string

    /**
     *   Converts a Number into a String with a given 
     *   number of digits. nf() converts numbers such as 
     *   123.45 into strings formatted with a set number of 
     *   digits, as in '123.4500'. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nf(123.45) 
     *   returns the string '123.45'. If an array of 
     *   numbers is passed, as in nf([123.45, 67.89]), an 
     *   array of formatted strings will be returned. 
     * 
     *   The second parameter, left, is optional. If a 
     *   number is passed, as in nf(123.45, 4), it sets the 
     *   minimum number of digits to include to the left of 
     *   the decimal place. If left is larger than the 
     *   number of digits in num, then unused digits will 
     *   be set to 0. For example, calling nf(123.45, 4) 
     *   returns the string '0123.45'. 
     * 
     *   The third parameter, right, is also optional. If a 
     *   number is passed, as in nf(123.45, 4, 1), it sets 
     *   the minimum number of digits to include to the 
     *   right of the decimal place. If right is smaller 
     *   than the number of decimal places in num, then num 
     *   will be rounded to the given number of decimal 
     *   places. For example, calling nf(123.45, 4, 1) 
     *   returns the string '0123.5'. If right is larger 
     *   than the number of decimal places in num, then 
     *   unused decimal places will be set to 0. For 
     *   example, calling nf(123.45, 4, 3) returns the 
     *   string '0123.450'. 
     * 
     *   When the number is negative, for example, calling 
     *   nf(-123.45, 5, 2) returns the string '-00123.45'.
     *   @param nums numbers to format.
     *   @param [left] number of digits to include to the 
     *   left of the decimal point.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted strings.
     */
    function nf(nums: number[], left?: number|string, right?: number|string): string[]

    /**
     *   Converts a Number into a String with commas to 
     *   mark units of 1,000. nfc() converts numbers such 
     *   as 12345 into strings formatted with commas to 
     *   mark the thousands place, as in '12,345'. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nfc(12345) 
     *   returns the string '12,345'. 
     * 
     *   The second parameter, right, is optional. If a 
     *   number is passed, as in nfc(12345, 1), it sets the 
     *   minimum number of digits to include to the right 
     *   of the decimal place. If right is smaller than the 
     *   number of decimal places in num, then num will be 
     *   rounded to the given number of decimal places. For 
     *   example, calling nfc(12345.67, 1) returns the 
     *   string '12,345.7'. If right is larger than the 
     *   number of decimal places in num, then unused 
     *   decimal places will be set to 0. For example, 
     *   calling nfc(12345.67, 3) returns the string 
     *   '12,345.670'.
     *   @param num number to format.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted string.
     */
    function nfc(num: number|string, right?: number|string): string

    /**
     *   Converts a Number into a String with commas to 
     *   mark units of 1,000. nfc() converts numbers such 
     *   as 12345 into strings formatted with commas to 
     *   mark the thousands place, as in '12,345'. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nfc(12345) 
     *   returns the string '12,345'. 
     * 
     *   The second parameter, right, is optional. If a 
     *   number is passed, as in nfc(12345, 1), it sets the 
     *   minimum number of digits to include to the right 
     *   of the decimal place. If right is smaller than the 
     *   number of decimal places in num, then num will be 
     *   rounded to the given number of decimal places. For 
     *   example, calling nfc(12345.67, 1) returns the 
     *   string '12,345.7'. If right is larger than the 
     *   number of decimal places in num, then unused 
     *   decimal places will be set to 0. For example, 
     *   calling nfc(12345.67, 3) returns the string 
     *   '12,345.670'.
     *   @param nums numbers to format.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted strings.
     */
    function nfc(nums: number[], right?: number|string): string[]

    /**
     *   Converts a Number into a String with a plus or 
     *   minus sign. nfp() converts numbers such as 123 
     *   into strings formatted with a + or - symbol to 
     *   mark whether they're positive or negative, as in 
     *   '+123'. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nfp(123.45) 
     *   returns the string '+123.45'. If an array of 
     *   numbers is passed, as in nfp([123.45, -6.78]), an 
     *   array of formatted strings will be returned. 
     * 
     *   The second parameter, left, is optional. If a 
     *   number is passed, as in nfp(123.45, 4), it sets 
     *   the minimum number of digits to include to the 
     *   left of the decimal place. If left is larger than 
     *   the number of digits in num, then unused digits 
     *   will be set to 0. For example, calling nfp(123.45, 
     *   4) returns the string '+0123.45'. 
     * 
     *   The third parameter, right, is also optional. If a 
     *   number is passed, as in nfp(123.45, 4, 1), it sets 
     *   the minimum number of digits to include to the 
     *   right of the decimal place. If right is smaller 
     *   than the number of decimal places in num, then num 
     *   will be rounded to the given number of decimal 
     *   places. For example, calling nfp(123.45, 4, 1) 
     *   returns the string '+0123.5'. If right is larger 
     *   than the number of decimal places in num, then 
     *   unused decimal places will be set to 0. For 
     *   example, calling nfp(123.45, 4, 3) returns the 
     *   string '+0123.450'.
     *   @param num number to format.
     *   @param [left] number of digits to include to the 
     *   left of the decimal point.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted string.
     */
    function nfp(num: number, left?: number, right?: number): string

    /**
     *   Converts a Number into a String with a plus or 
     *   minus sign. nfp() converts numbers such as 123 
     *   into strings formatted with a + or - symbol to 
     *   mark whether they're positive or negative, as in 
     *   '+123'. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nfp(123.45) 
     *   returns the string '+123.45'. If an array of 
     *   numbers is passed, as in nfp([123.45, -6.78]), an 
     *   array of formatted strings will be returned. 
     * 
     *   The second parameter, left, is optional. If a 
     *   number is passed, as in nfp(123.45, 4), it sets 
     *   the minimum number of digits to include to the 
     *   left of the decimal place. If left is larger than 
     *   the number of digits in num, then unused digits 
     *   will be set to 0. For example, calling nfp(123.45, 
     *   4) returns the string '+0123.45'. 
     * 
     *   The third parameter, right, is also optional. If a 
     *   number is passed, as in nfp(123.45, 4, 1), it sets 
     *   the minimum number of digits to include to the 
     *   right of the decimal place. If right is smaller 
     *   than the number of decimal places in num, then num 
     *   will be rounded to the given number of decimal 
     *   places. For example, calling nfp(123.45, 4, 1) 
     *   returns the string '+0123.5'. If right is larger 
     *   than the number of decimal places in num, then 
     *   unused decimal places will be set to 0. For 
     *   example, calling nfp(123.45, 4, 3) returns the 
     *   string '+0123.450'.
     *   @param nums numbers to format.
     *   @param [left] number of digits to include to the 
     *   left of the decimal point.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted strings.
     */
    function nfp(nums: number[], left?: number, right?: number): string[]

    /**
     *   Converts a positive Number into a String with an 
     *   extra space in front. nfs() converts positive 
     *   numbers such as 123.45 into strings formatted with 
     *   an extra space in front, as in ' 123.45'. Doing so 
     *   can be helpful for aligning positive and negative 
     *   numbers. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nfs(123.45) 
     *   returns the string ' 123.45'. 
     * 
     *   The second parameter, left, is optional. If a 
     *   number is passed, as in nfs(123.45, 4), it sets 
     *   the minimum number of digits to include to the 
     *   left of the decimal place. If left is larger than 
     *   the number of digits in num, then unused digits 
     *   will be set to 0. For example, calling nfs(123.45, 
     *   4) returns the string ' 0123.45'. 
     * 
     *   The third parameter, right, is also optional. If a 
     *   number is passed, as in nfs(123.45, 4, 1), it sets 
     *   the minimum number of digits to include to the 
     *   right of the decimal place. If right is smaller 
     *   than the number of decimal places in num, then num 
     *   will be rounded to the given number of decimal 
     *   places. For example, calling nfs(123.45, 4, 1) 
     *   returns the string ' 0123.5'. If right is larger 
     *   than the number of decimal places in num, then 
     *   unused decimal places will be set to 0. For 
     *   example, calling nfs(123.45, 4, 3) returns the 
     *   string ' 0123.450'.
     *   @param num number to format.
     *   @param [left] number of digits to include to the 
     *   left of the decimal point.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted string.
     */
    function nfs(num: number, left?: number, right?: number): string

    /**
     *   Converts a positive Number into a String with an 
     *   extra space in front. nfs() converts positive 
     *   numbers such as 123.45 into strings formatted with 
     *   an extra space in front, as in ' 123.45'. Doing so 
     *   can be helpful for aligning positive and negative 
     *   numbers. 
     * 
     *   The first parameter, num, is the number to convert 
     *   to a string. For example, calling nfs(123.45) 
     *   returns the string ' 123.45'. 
     * 
     *   The second parameter, left, is optional. If a 
     *   number is passed, as in nfs(123.45, 4), it sets 
     *   the minimum number of digits to include to the 
     *   left of the decimal place. If left is larger than 
     *   the number of digits in num, then unused digits 
     *   will be set to 0. For example, calling nfs(123.45, 
     *   4) returns the string ' 0123.45'. 
     * 
     *   The third parameter, right, is also optional. If a 
     *   number is passed, as in nfs(123.45, 4, 1), it sets 
     *   the minimum number of digits to include to the 
     *   right of the decimal place. If right is smaller 
     *   than the number of decimal places in num, then num 
     *   will be rounded to the given number of decimal 
     *   places. For example, calling nfs(123.45, 4, 1) 
     *   returns the string ' 0123.5'. If right is larger 
     *   than the number of decimal places in num, then 
     *   unused decimal places will be set to 0. For 
     *   example, calling nfs(123.45, 4, 3) returns the 
     *   string ' 0123.450'.
     *   @param nums numbers to format.
     *   @param [left] number of digits to include to the 
     *   left of the decimal point.
     *   @param [right] number of digits to include to the 
     *   right of the decimal point.
     *   @return formatted strings.
     */
    function nfs(nums: any[], left?: number, right?: number): string[]

    /**
     *   Splits a String into pieces and returns an array 
     *   containing the pieces. splitTokens() is an 
     *   enhanced version of split(). It can split a string 
     *   when any characters from a list are detected. 
     * 
     *   The first parameter, value, is the string to 
     *   split. 
     * 
     *   The second parameter, delim, is optional. It sets 
     *   the character(s) that should be used to split the 
     *   string. delim can be a single string, as in 
     *   splitTokens('rock...paper...scissors...shoot', 
     *   '...'), or an array of strings, as in 
     *   splitTokens('rock;paper,scissors...shoot, [';', 
     *   ',', '...']). By default, if no delim characters 
     *   are specified, then any whitespace character is 
     *   used to split. Whitespace characters include tab 
     *   (\t), line feed (\n), carriage return (\r), form 
     *   feed (\f), and space.
     *   @param value string to split.
     *   @param [delim] character(s) to use for splitting 
     *   the string.
     *   @return separated strings.
     */
    function splitTokens(value: string, delim?: string): string[]

    /**
     *   Shuffles the elements of an array. The first 
     *   parameter, array, is the array to be shuffled. For 
     *   example, calling shuffle(myArray) will shuffle the 
     *   elements of myArray. By default, the original 
     *   array won’t be modified. Instead, a copy will be 
     *   created, shuffled, and returned. 
     * 
     *   The second parameter, modify, is optional. If true 
     *   is passed, as in shuffle(myArray, true), then the 
     *   array will be shuffled in place without making a 
     *   copy.
     *   @param array array to shuffle.
     *   @param [bool] if true, shuffle the original array 
     *   in place. Defaults to false.
     *   @return shuffled array.
     */
    function shuffle(array: any[], bool?: boolean): any[]

    /**
     *   Sets the stroke rendering mode to balance 
     *   performance and visual features when drawing 
     *   lines. strokeMode() offers two modes: 
     * 
     *   - SIMPLE: Optimizes for speed by disabling caps, 
     *   joins, and stroke color features. Use this mode 
     *   for faster line rendering when these visual 
     *   details are unnecessary.
     *   - FULL: Enables caps, joins, and stroke color for 
     *   lines. This mode provides enhanced visuals but may 
     *   reduce performance due to additional processing.
     * 
     *   Choose the mode that best suits your application's 
     *   needs to either improve rendering speed or enhance 
     *   visual quality.
     *   @param mode The stroke mode to set. Possible 
     *   values are: 
     * 
     *   - 'SIMPLE': Fast rendering without caps, joins, or 
     *   stroke color.
     *   - 'FULL': Detailed rendering with caps, joins, and 
     *   stroke color.
     */
    function strokeMode(mode: string): void

    /**
     *   Creates a custom p5.Geometry object from simpler 
     *   3D shapes. buildGeometry() helps with creating 
     *   complex 3D shapes from simpler ones such as 
     *   sphere(). It can help to make sketches more 
     *   performant. For example, if a complex 3D shape 
     *   doesn’t change while a sketch runs, then it can be 
     *   created with buildGeometry(). Creating a 
     *   p5.Geometry object once and then drawing it will 
     *   run faster than repeatedly drawing the individual 
     *   pieces. 
     * 
     *   The parameter, callback, is a function with the 
     *   drawing instructions for the new p5.Geometry 
     *   object. It will be called once to create the new 
     *   3D shape. 
     * 
     *   See beginGeometry() and endGeometry() for another 
     *   way to build 3D shapes. 
     * 
     *   Note: buildGeometry() can only be used in WebGL 
     *   mode.
     *   @param callback function that draws the shape.
     *   @return new 3D shape.
     */
    function buildGeometry(callback: (...args: any[]) => any): p5.Geometry

    /**
     *   Clears a p5.Geometry object from the graphics 
     *   processing unit (GPU) memory. p5.Geometry objects 
     *   can contain lots of data about their vertices, 
     *   surface normals, colors, and so on. Complex 3D 
     *   shapes can use lots of memory which is a limited 
     *   resource in many GPUs. Calling freeGeometry() can 
     *   improve performance by freeing a p5.Geometry 
     *   object’s resources from GPU memory. freeGeometry() 
     *   works with p5.Geometry objects created with 
     *   beginGeometry() and endGeometry(), 
     *   buildGeometry(), and loadModel(). 
     * 
     *   The parameter, geometry, is the p5.Geometry object 
     *   to be freed. 
     * 
     *   Note: A p5.Geometry object can still be drawn 
     *   after its resources are cleared from GPU memory. 
     *   It may take longer to draw the first time it’s 
     *   redrawn. 
     * 
     *   Note: freeGeometry() can only be used in WebGL 
     *   mode.
     *   @param geometry 3D shape whose resources should be 
     *   freed.
     */
    function freeGeometry(geometry: p5.Geometry): void

    /**
     *   Draws a plane. A plane is a four-sided, flat shape 
     *   with every angle measuring 90˚. It’s similar to a 
     *   rectangle and offers advanced drawing features in 
     *   WebGL mode. 
     * 
     *   The first parameter, width, is optional. If a 
     *   Number is passed, as in plane(20), it sets the 
     *   plane’s width and height. By default, width is 50. 
     * 
     *   The second parameter, height, is also optional. If 
     *   a Number is passed, as in plane(20, 30), it sets 
     *   the plane’s height. By default, height is set to 
     *   the plane’s width. 
     * 
     *   The third parameter, detailX, is also optional. If 
     *   a Number is passed, as in plane(20, 30, 5) it sets 
     *   the number of triangle subdivisions to use along 
     *   the x-axis. All 3D shapes are made by connecting 
     *   triangles to form their surfaces. By default, 
     *   detailX is 1. 
     * 
     *   The fourth parameter, detailY, is also optional. 
     *   If a Number is passed, as in plane(20, 30, 5, 7) 
     *   it sets the number of triangle subdivisions to use 
     *   along the y-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailY is 1. 
     * 
     *   Note: plane() can only be used in WebGL mode.
     *   @param [width] width of the plane.
     *   @param [height] height of the plane.
     *   @param [detailX] number of triangle subdivisions 
     *   along the x-axis.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis.
     */
    function plane(width?: number, height?: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a box (rectangular prism). A box is a 3D 
     *   shape with six faces. Each face makes a 90˚ with 
     *   four neighboring faces. 
     * 
     *   The first parameter, width, is optional. If a 
     *   Number is passed, as in box(20), it sets the box’s 
     *   width and height. By default, width is 50. 
     * 
     *   The second parameter, height, is also optional. If 
     *   a Number is passed, as in box(20, 30), it sets the 
     *   box’s height. By default, height is set to the 
     *   box’s width. 
     * 
     *   The third parameter, depth, is also optional. If a 
     *   Number is passed, as in box(20, 30, 40), it sets 
     *   the box’s depth. By default, depth is set to the 
     *   box’s height. 
     * 
     *   The fourth parameter, detailX, is also optional. 
     *   If a Number is passed, as in box(20, 30, 40, 5), 
     *   it sets the number of triangle subdivisions to use 
     *   along the x-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailX is 1. 
     * 
     *   The fifth parameter, detailY, is also optional. If 
     *   a number is passed, as in box(20, 30, 40, 5, 7), 
     *   it sets the number of triangle subdivisions to use 
     *   along the y-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailY is 1. 
     * 
     *   Note: box() can only be used in WebGL mode.
     *   @param [width] width of the box.
     *   @param [height] height of the box.
     *   @param [depth] depth of the box.
     *   @param [detailX] number of triangle subdivisions 
     *   along the x-axis.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis.
     */
    function box(width?: number, height?: number, depth?: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a sphere. A sphere is a 3D shape with 
     *   triangular faces that connect to form a round 
     *   surface. Spheres with few faces look like 
     *   crystals. Spheres with many faces have smooth 
     *   surfaces and look like balls. 
     * 
     *   The first parameter, radius, is optional. If a 
     *   Number is passed, as in sphere(20), it sets the 
     *   radius of the sphere. By default, radius is 50. 
     * 
     *   The second parameter, detailX, is also optional. 
     *   If a Number is passed, as in sphere(20, 5), it 
     *   sets the number of triangle subdivisions to use 
     *   along the x-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailX is 24. 
     * 
     *   The third parameter, detailY, is also optional. If 
     *   a Number is passed, as in sphere(20, 5, 2), it 
     *   sets the number of triangle subdivisions to use 
     *   along the y-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailY is 16. 
     * 
     *   Note: sphere() can only be used in WebGL mode.
     *   @param [radius] radius of the sphere. Defaults to 
     *   50.
     *   @param [detailX] number of triangle subdivisions 
     *   along the x-axis. Defaults to 24.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis. Defaults to 16.
     */
    function sphere(radius?: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a cylinder. A cylinder is a 3D shape with 
     *   triangular faces that connect a flat bottom to a 
     *   flat top. Cylinders with few faces look like 
     *   boxes. Cylinders with many faces have smooth 
     *   surfaces. 
     * 
     *   The first parameter, radius, is optional. If a 
     *   Number is passed, as in cylinder(20), it sets the 
     *   radius of the cylinder’s base. By default, radius 
     *   is 50. 
     * 
     *   The second parameter, height, is also optional. If 
     *   a Number is passed, as in cylinder(20, 30), it 
     *   sets the cylinder’s height. By default, height is 
     *   set to the cylinder’s radius. 
     * 
     *   The third parameter, detailX, is also optional. If 
     *   a Number is passed, as in cylinder(20, 30, 5), it 
     *   sets the number of edges used to form the 
     *   cylinder's top and bottom. Using more edges makes 
     *   the top and bottom look more like circles. By 
     *   default, detailX is 24. 
     * 
     *   The fourth parameter, detailY, is also optional. 
     *   If a Number is passed, as in cylinder(20, 30, 5, 
     *   2), it sets the number of triangle subdivisions to 
     *   use along the y-axis, between cylinder's the top 
     *   and bottom. All 3D shapes are made by connecting 
     *   triangles to form their surfaces. By default, 
     *   detailY is 1. 
     * 
     *   The fifth parameter, bottomCap, is also optional. 
     *   If a false is passed, as in cylinder(20, 30, 5, 2, 
     *   false) the cylinder’s bottom won’t be drawn. By 
     *   default, bottomCap is true. 
     * 
     *   The sixth parameter, topCap, is also optional. If 
     *   a false is passed, as in cylinder(20, 30, 5, 2, 
     *   false, false) the cylinder’s top won’t be drawn. 
     *   By default, topCap is true. 
     * 
     *   Note: cylinder() can only be used in WebGL mode.
     *   @param [radius] radius of the cylinder. Defaults 
     *   to 50.
     *   @param [height] height of the cylinder. Defaults 
     *   to the value of radius.
     *   @param [detailX] number of edges along the top and 
     *   bottom. Defaults to 24.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis. Defaults to 1.
     *   @param [bottomCap] whether to draw the cylinder's 
     *   bottom. Defaults to true.
     *   @param [topCap] whether to draw the cylinder's 
     *   top. Defaults to true.
     */
    function cylinder(radius?: number, height?: number, detailX?: number, detailY?: number, bottomCap?: boolean, topCap?: boolean): void

    /**
     *   Draws a cone. A cone is a 3D shape with triangular 
     *   faces that connect a flat bottom to a single 
     *   point. Cones with few faces look like pyramids. 
     *   Cones with many faces have smooth surfaces. 
     * 
     *   The first parameter, radius, is optional. If a 
     *   Number is passed, as in cone(20), it sets the 
     *   radius of the cone’s base. By default, radius is 
     *   50. 
     * 
     *   The second parameter, height, is also optional. If 
     *   a Number is passed, as in cone(20, 30), it sets 
     *   the cone’s height. By default, height is set to 
     *   the cone’s radius. 
     * 
     *   The third parameter, detailX, is also optional. If 
     *   a Number is passed, as in cone(20, 30, 5), it sets 
     *   the number of edges used to form the cone's base. 
     *   Using more edges makes the base look more like a 
     *   circle. By default, detailX is 24. 
     * 
     *   The fourth parameter, detailY, is also optional. 
     *   If a Number is passed, as in cone(20, 30, 5, 7), 
     *   it sets the number of triangle subdivisions to use 
     *   along the y-axis connecting the base to the tip. 
     *   All 3D shapes are made by connecting triangles to 
     *   form their surfaces. By default, detailY is 1. 
     * 
     *   The fifth parameter, cap, is also optional. If a 
     *   false is passed, as in cone(20, 30, 5, 7, false) 
     *   the cone’s base won’t be drawn. By default, cap is 
     *   true. 
     * 
     *   Note: cone() can only be used in WebGL mode.
     *   @param [radius] radius of the cone's base. 
     *   Defaults to 50.
     *   @param [height] height of the cone. Defaults to 
     *   the value of radius.
     *   @param [detailX] number of edges used to draw the 
     *   base. Defaults to 24.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis. Defaults to 1.
     *   @param [cap] whether to draw the cone's base. 
     *   Defaults to true.
     */
    function cone(radius?: number, height?: number, detailX?: number, detailY?: number, cap?: boolean): void

    /**
     *   Draws an ellipsoid. An ellipsoid is a 3D shape 
     *   with triangular faces that connect to form a round 
     *   surface. Ellipsoids with few faces look like 
     *   crystals. Ellipsoids with many faces have smooth 
     *   surfaces and look like eggs. ellipsoid() defines a 
     *   shape by its radii. This is different from 
     *   ellipse() which uses diameters (width and height). 
     * 
     *   The first parameter, radiusX, is optional. If a 
     *   Number is passed, as in ellipsoid(20), it sets the 
     *   radius of the ellipsoid along the x-axis. By 
     *   default, radiusX is 50. 
     * 
     *   The second parameter, radiusY, is also optional. 
     *   If a Number is passed, as in ellipsoid(20, 30), it 
     *   sets the ellipsoid’s radius along the y-axis. By 
     *   default, radiusY is set to the ellipsoid’s 
     *   radiusX. 
     * 
     *   The third parameter, radiusZ, is also optional. If 
     *   a Number is passed, as in ellipsoid(20, 30, 40), 
     *   it sets the ellipsoid’s radius along the z-axis. 
     *   By default, radiusZ is set to the ellipsoid’s 
     *   radiusY. 
     * 
     *   The fourth parameter, detailX, is also optional. 
     *   If a Number is passed, as in ellipsoid(20, 30, 40, 
     *   5), it sets the number of triangle subdivisions to 
     *   use along the x-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailX is 24. 
     * 
     *   The fifth parameter, detailY, is also optional. If 
     *   a Number is passed, as in ellipsoid(20, 30, 40, 5, 
     *   7), it sets the number of triangle subdivisions to 
     *   use along the y-axis. All 3D shapes are made by 
     *   connecting triangles to form their surfaces. By 
     *   default, detailY is 16. 
     * 
     *   Note: ellipsoid() can only be used in WebGL mode.
     *   @param [radiusX] radius of the ellipsoid along the 
     *   x-axis. Defaults to 50.
     *   @param [radiusY] radius of the ellipsoid along the 
     *   y-axis. Defaults to radiusX.
     *   @param [radiusZ] radius of the ellipsoid along the 
     *   z-axis. Defaults to radiusY.
     *   @param [detailX] number of triangle subdivisions 
     *   along the x-axis. Defaults to 24.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis. Defaults to 16.
     */
    function ellipsoid(radiusX?: number, radiusY?: number, radiusZ?: number, detailX?: number, detailY?: number): void

    /**
     *   Draws a torus. A torus is a 3D shape with 
     *   triangular faces that connect to form a ring. 
     *   Toruses with few faces look flattened. Toruses 
     *   with many faces have smooth surfaces. 
     * 
     *   The first parameter, radius, is optional. If a 
     *   Number is passed, as in torus(30), it sets the 
     *   radius of the ring. By default, radius is 50. 
     * 
     *   The second parameter, tubeRadius, is also 
     *   optional. If a Number is passed, as in torus(30, 
     *   15), it sets the radius of the tube. By default, 
     *   tubeRadius is 10. 
     * 
     *   The third parameter, detailX, is also optional. If 
     *   a Number is passed, as in torus(30, 15, 5), it 
     *   sets the number of edges used to draw the hole of 
     *   the torus. Using more edges makes the hole look 
     *   more like a circle. By default, detailX is 24. 
     * 
     *   The fourth parameter, detailY, is also optional. 
     *   If a Number is passed, as in torus(30, 15, 5, 7), 
     *   it sets the number of triangle subdivisions to use 
     *   while filling in the torus’ height. By default, 
     *   detailY is 16. 
     * 
     *   Note: torus() can only be used in WebGL mode.
     *   @param [radius] radius of the torus. Defaults to 
     *   50.
     *   @param [tubeRadius] radius of the tube. Defaults 
     *   to 10.
     *   @param [detailX] number of edges that form the 
     *   hole. Defaults to 24.
     *   @param [detailY] number of triangle subdivisions 
     *   along the y-axis. Defaults to 16.
     */
    function torus(radius?: number, tubeRadius?: number, detailX?: number, detailY?: number): void

    /**
     *   Sets the number of segments used to draw spline 
     *   curves in WebGL mode. In WebGL mode, smooth shapes 
     *   are drawn using many flat segments. Adding more 
     *   flat segments makes shapes appear smoother. 
     * 
     *   The parameter, detail, is the density of segments 
     *   to use while drawing a spline curve. 
     * 
     *   Note: curveDetail() has no effect in 2D mode.
     *   @param resolution number of segments to use. 
     *   Default is 1/4
     */
    function curveDetail(resolution: number): void

    /**
     *   Allows the user to orbit around a 3D sketch using 
     *   a mouse, trackpad, or touchscreen. 3D sketches are 
     *   viewed through an imaginary camera. Calling 
     *   orbitControl() within the draw() function allows 
     *   the user to change the camera’s position: 
     * 
     *   function draw() { background(200); // Enable 
     *   orbiting with the mouse. orbitControl(); // Rest 
     *   of sketch. }
     * 
     *   Left-clicking and dragging or swipe motion will 
     *   rotate the camera position about the center of the 
     *   sketch. Right-clicking and dragging or multi-swipe 
     *   will pan the camera position without rotation. 
     *   Using the mouse wheel (scrolling) or pinch in/out 
     *   will move the camera further or closer from the 
     *   center of the sketch. 
     * 
     *   The first three parameters, sensitivityX, 
     *   sensitivityY, and sensitivityZ, are optional. 
     *   They’re numbers that set the sketch’s sensitivity 
     *   to movement along each axis. For example, calling 
     *   orbitControl(1, 2, -1) keeps movement along the 
     *   x-axis at its default value, makes the sketch 
     *   twice as sensitive to movement along the y-axis, 
     *   and reverses motion along the z-axis. By default, 
     *   all sensitivity values are 1. 
     * 
     *   The fourth parameter, options, is also optional. 
     *   It’s an object that changes the behavior of 
     *   orbiting. For example, calling orbitControl(1, 1, 
     *   1, options) keeps the default sensitivity values 
     *   while changing the behaviors set with options. The 
     *   object can have the following properties: 
     * 
     *   let options = { // Setting this to false makes 
     *   mobile interactions smoother by // preventing 
     *   accidental interactions with the page while 
     *   orbiting. // By default, it's true. 
     *   disableTouchActions: true, // Setting this to true 
     *   makes the camera always rotate in the // direction 
     *   the mouse/touch is moving. // By default, it's 
     *   false. freeRotation: false }; orbitControl(1, 1, 
     *   1, options);
     *   @param [sensitivityX] sensitivity to movement 
     *   along the x-axis. Defaults to 1.
     *   @param [sensitivityY] sensitivity to movement 
     *   along the y-axis. Defaults to 1.
     *   @param [sensitivityZ] sensitivity to movement 
     *   along the z-axis. Defaults to 1.
     *   @param [options] Settings for orbitControl:
     */
    function orbitControl(sensitivityX?: number, sensitivityY?: number, sensitivityZ?: number, options?: object): void

    /**
     *   Adds a grid and an axes icon to clarify 
     *   orientation in 3D sketches. debugMode() adds a 
     *   grid that shows where the “ground” is in a sketch. 
     *   By default, the grid will run through the origin 
     *   (0, 0, 0) of the sketch along the XZ plane. 
     *   debugMode() also adds an axes icon that points 
     *   along the positive x-, y-, and z-axes. Calling 
     *   debugMode() displays the grid and axes icon with 
     *   their default size and position. 
     * 
     *   There are four ways to call debugMode() with 
     *   optional parameters to customize the debugging 
     *   environment. 
     * 
     *   The first way to call debugMode() has one 
     *   parameter, mode. If the system constant GRID is 
     *   passed, as in debugMode(GRID), then the grid will 
     *   be displayed and the axes icon will be hidden. If 
     *   the constant AXES is passed, as in 
     *   debugMode(AXES), then the axes icon will be 
     *   displayed and the grid will be hidden. 
     * 
     *   The second way to call debugMode() has six 
     *   parameters. The first parameter, mode, selects 
     *   either GRID or AXES to be displayed. The next five 
     *   parameters, gridSize, gridDivisions, xOff, yOff, 
     *   and zOff are optional. They’re numbers that set 
     *   the appearance of the grid (gridSize and 
     *   gridDivisions) and the placement of the axes icon 
     *   (xOff, yOff, and zOff). For example, calling 
     *   debugMode(20, 5, 10, 10, 10) sets the gridSize to 
     *   20 pixels, the number of gridDivisions to 5, and 
     *   offsets the axes icon by 10 pixels along the x-, 
     *   y-, and z-axes. 
     * 
     *   The third way to call debugMode() has five 
     *   parameters. The first parameter, mode, selects 
     *   either GRID or AXES to be displayed. The next four 
     *   parameters, axesSize, xOff, yOff, and zOff are 
     *   optional. They’re numbers that set the appearance 
     *   of the size of the axes icon (axesSize) and its 
     *   placement (xOff, yOff, and zOff). 
     * 
     *   The fourth way to call debugMode() has nine 
     *   optional parameters. The first five parameters, 
     *   gridSize, gridDivisions, gridXOff, gridYOff, and 
     *   gridZOff are numbers that set the appearance of 
     *   the grid. For example, calling debugMode(100, 5, 
     *   0, 0, 0) sets the gridSize to 100, the number of 
     *   gridDivisions to 5, and sets all the offsets to 0 
     *   so that the grid is centered at the origin. The 
     *   next four parameters, axesSize, xOff, yOff, and 
     *   zOff are numbers that set the appearance of the 
     *   size of the axes icon (axesSize) and its placement 
     *   (axesXOff, axesYOff, and axesZOff). For example, 
     *   calling debugMode(100, 5, 0, 0, 0, 50, 10, 10, 10) 
     *   sets the gridSize to 100, the number of 
     *   gridDivisions to 5, and sets all the offsets to 0 
     *   so that the grid is centered at the origin. It 
     *   then sets the axesSize to 50 and offsets the icon 
     *   10 pixels along each axis.
     */
    function debugMode(): void

    // TODO: Fix debugMode() errors in src/scripts/parsers/in/p5.js/src/webgl/interaction.js, line undefined:
    //
    //    param "mode" has invalid type: GRID|AXES
    //
    // function debugMode(mode: GRID|AXES): void

    // TODO: Fix debugMode() errors in src/scripts/parsers/in/p5.js/src/webgl/interaction.js, line undefined:
    //
    //    param "mode" has invalid type: GRID|AXES
    //
    // function debugMode(mode: GRID|AXES, gridSize?: number, gridDivisions?: number, xOff?: number, yOff?: number, zOff?: number): void

    // TODO: Fix debugMode() errors in src/scripts/parsers/in/p5.js/src/webgl/interaction.js, line undefined:
    //
    //    param "mode" has invalid type: GRID|AXES
    //
    // function debugMode(mode: GRID|AXES, axesSize?: number, xOff?: number, yOff?: number, zOff?: number): void

    /**
     *   Adds a grid and an axes icon to clarify 
     *   orientation in 3D sketches. debugMode() adds a 
     *   grid that shows where the “ground” is in a sketch. 
     *   By default, the grid will run through the origin 
     *   (0, 0, 0) of the sketch along the XZ plane. 
     *   debugMode() also adds an axes icon that points 
     *   along the positive x-, y-, and z-axes. Calling 
     *   debugMode() displays the grid and axes icon with 
     *   their default size and position. 
     * 
     *   There are four ways to call debugMode() with 
     *   optional parameters to customize the debugging 
     *   environment. 
     * 
     *   The first way to call debugMode() has one 
     *   parameter, mode. If the system constant GRID is 
     *   passed, as in debugMode(GRID), then the grid will 
     *   be displayed and the axes icon will be hidden. If 
     *   the constant AXES is passed, as in 
     *   debugMode(AXES), then the axes icon will be 
     *   displayed and the grid will be hidden. 
     * 
     *   The second way to call debugMode() has six 
     *   parameters. The first parameter, mode, selects 
     *   either GRID or AXES to be displayed. The next five 
     *   parameters, gridSize, gridDivisions, xOff, yOff, 
     *   and zOff are optional. They’re numbers that set 
     *   the appearance of the grid (gridSize and 
     *   gridDivisions) and the placement of the axes icon 
     *   (xOff, yOff, and zOff). For example, calling 
     *   debugMode(20, 5, 10, 10, 10) sets the gridSize to 
     *   20 pixels, the number of gridDivisions to 5, and 
     *   offsets the axes icon by 10 pixels along the x-, 
     *   y-, and z-axes. 
     * 
     *   The third way to call debugMode() has five 
     *   parameters. The first parameter, mode, selects 
     *   either GRID or AXES to be displayed. The next four 
     *   parameters, axesSize, xOff, yOff, and zOff are 
     *   optional. They’re numbers that set the appearance 
     *   of the size of the axes icon (axesSize) and its 
     *   placement (xOff, yOff, and zOff). 
     * 
     *   The fourth way to call debugMode() has nine 
     *   optional parameters. The first five parameters, 
     *   gridSize, gridDivisions, gridXOff, gridYOff, and 
     *   gridZOff are numbers that set the appearance of 
     *   the grid. For example, calling debugMode(100, 5, 
     *   0, 0, 0) sets the gridSize to 100, the number of 
     *   gridDivisions to 5, and sets all the offsets to 0 
     *   so that the grid is centered at the origin. The 
     *   next four parameters, axesSize, xOff, yOff, and 
     *   zOff are numbers that set the appearance of the 
     *   size of the axes icon (axesSize) and its placement 
     *   (axesXOff, axesYOff, and axesZOff). For example, 
     *   calling debugMode(100, 5, 0, 0, 0, 50, 10, 10, 10) 
     *   sets the gridSize to 100, the number of 
     *   gridDivisions to 5, and sets all the offsets to 0 
     *   so that the grid is centered at the origin. It 
     *   then sets the axesSize to 50 and offsets the icon 
     *   10 pixels along each axis.
     *   @param [gridSize] side length of the grid.
     *   @param [gridDivisions] number of divisions in the 
     *   grid.
     *   @param [gridXOff] grid offset from the origin 
     *   along the x-axis.
     *   @param [gridYOff] grid offset from the origin 
     *   along the y-axis.
     *   @param [gridZOff] grid offset from the origin 
     *   along the z-axis.
     *   @param [axesSize] length of axes icon markers.
     *   @param [axesXOff] axes icon offset from the origin 
     *   along the x-axis.
     *   @param [axesYOff] axes icon offset from the origin 
     *   along the y-axis.
     *   @param [axesZOff] axes icon offset from the origin 
     *   along the z-axis.
     */
    function debugMode(gridSize?: number, gridDivisions?: number, gridXOff?: number, gridYOff?: number, gridZOff?: number, axesSize?: number, axesXOff?: number, axesYOff?: number, axesZOff?: number): void

    /**
     *   Turns off debugMode() in a 3D sketch.
     */
    function noDebugMode(): void

    /**
     *   Creates a light that shines from all directions. 
     *   Ambient light does not come from one direction. 
     *   Instead, 3D shapes are lit evenly from all sides. 
     *   Ambient lights are almost always used in 
     *   combination with other types of lights. 
     * 
     *   There are three ways to call ambientLight() with 
     *   optional parameters to set the light’s color. 
     * 
     *   The first way to call ambientLight() has two 
     *   parameters, gray and alpha. alpha is optional. 
     *   Grayscale and alpha values between 0 and 255 can 
     *   be passed to set the ambient light’s color, as in 
     *   ambientLight(50) or ambientLight(50, 30). 
     * 
     *   The second way to call ambientLight() has one 
     *   parameter, color. A p5.Color object, an array of 
     *   color values, or a CSS color string, as in 
     *   ambientLight('magenta'), can be passed to set the 
     *   ambient light’s color. 
     * 
     *   The third way to call ambientLight() has four 
     *   parameters, v1, v2, v3, and alpha. alpha is 
     *   optional. RGBA, HSBA, or HSLA values can be passed 
     *   to set the ambient light’s colors, as in 
     *   ambientLight(255, 0, 0) or ambientLight(255, 0, 0, 
     *   30). Color values will be interpreted using the 
     *   current colorMode().
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param [alpha] alpha (transparency) value in the 
     *   current colorMode().
     */
    function ambientLight(v1: number, v2: number, v3: number, alpha?: number): void

    /**
     *   Creates a light that shines from all directions. 
     *   Ambient light does not come from one direction. 
     *   Instead, 3D shapes are lit evenly from all sides. 
     *   Ambient lights are almost always used in 
     *   combination with other types of lights. 
     * 
     *   There are three ways to call ambientLight() with 
     *   optional parameters to set the light’s color. 
     * 
     *   The first way to call ambientLight() has two 
     *   parameters, gray and alpha. alpha is optional. 
     *   Grayscale and alpha values between 0 and 255 can 
     *   be passed to set the ambient light’s color, as in 
     *   ambientLight(50) or ambientLight(50, 30). 
     * 
     *   The second way to call ambientLight() has one 
     *   parameter, color. A p5.Color object, an array of 
     *   color values, or a CSS color string, as in 
     *   ambientLight('magenta'), can be passed to set the 
     *   ambient light’s color. 
     * 
     *   The third way to call ambientLight() has four 
     *   parameters, v1, v2, v3, and alpha. alpha is 
     *   optional. RGBA, HSBA, or HSLA values can be passed 
     *   to set the ambient light’s colors, as in 
     *   ambientLight(255, 0, 0) or ambientLight(255, 0, 0, 
     *   30). Color values will be interpreted using the 
     *   current colorMode().
     *   @param gray grayscale value between 0 and 255.
     *   @param [alpha] alpha (transparency) value in the 
     *   current colorMode().
     */
    function ambientLight(gray: number, alpha?: number): void

    /**
     *   Creates a light that shines from all directions. 
     *   Ambient light does not come from one direction. 
     *   Instead, 3D shapes are lit evenly from all sides. 
     *   Ambient lights are almost always used in 
     *   combination with other types of lights. 
     * 
     *   There are three ways to call ambientLight() with 
     *   optional parameters to set the light’s color. 
     * 
     *   The first way to call ambientLight() has two 
     *   parameters, gray and alpha. alpha is optional. 
     *   Grayscale and alpha values between 0 and 255 can 
     *   be passed to set the ambient light’s color, as in 
     *   ambientLight(50) or ambientLight(50, 30). 
     * 
     *   The second way to call ambientLight() has one 
     *   parameter, color. A p5.Color object, an array of 
     *   color values, or a CSS color string, as in 
     *   ambientLight('magenta'), can be passed to set the 
     *   ambient light’s color. 
     * 
     *   The third way to call ambientLight() has four 
     *   parameters, v1, v2, v3, and alpha. alpha is 
     *   optional. RGBA, HSBA, or HSLA values can be passed 
     *   to set the ambient light’s colors, as in 
     *   ambientLight(255, 0, 0) or ambientLight(255, 0, 0, 
     *   30). Color values will be interpreted using the 
     *   current colorMode().
     *   @param value color as a CSS string.
     */
    function ambientLight(value: string): void

    /**
     *   Creates a light that shines from all directions. 
     *   Ambient light does not come from one direction. 
     *   Instead, 3D shapes are lit evenly from all sides. 
     *   Ambient lights are almost always used in 
     *   combination with other types of lights. 
     * 
     *   There are three ways to call ambientLight() with 
     *   optional parameters to set the light’s color. 
     * 
     *   The first way to call ambientLight() has two 
     *   parameters, gray and alpha. alpha is optional. 
     *   Grayscale and alpha values between 0 and 255 can 
     *   be passed to set the ambient light’s color, as in 
     *   ambientLight(50) or ambientLight(50, 30). 
     * 
     *   The second way to call ambientLight() has one 
     *   parameter, color. A p5.Color object, an array of 
     *   color values, or a CSS color string, as in 
     *   ambientLight('magenta'), can be passed to set the 
     *   ambient light’s color. 
     * 
     *   The third way to call ambientLight() has four 
     *   parameters, v1, v2, v3, and alpha. alpha is 
     *   optional. RGBA, HSBA, or HSLA values can be passed 
     *   to set the ambient light’s colors, as in 
     *   ambientLight(255, 0, 0) or ambientLight(255, 0, 0, 
     *   30). Color values will be interpreted using the 
     *   current colorMode().
     *   @param values color as an array of RGBA, HSBA, or 
     *   HSLA values.
     */
    function ambientLight(values: number[]): void

    /**
     *   Creates a light that shines from all directions. 
     *   Ambient light does not come from one direction. 
     *   Instead, 3D shapes are lit evenly from all sides. 
     *   Ambient lights are almost always used in 
     *   combination with other types of lights. 
     * 
     *   There are three ways to call ambientLight() with 
     *   optional parameters to set the light’s color. 
     * 
     *   The first way to call ambientLight() has two 
     *   parameters, gray and alpha. alpha is optional. 
     *   Grayscale and alpha values between 0 and 255 can 
     *   be passed to set the ambient light’s color, as in 
     *   ambientLight(50) or ambientLight(50, 30). 
     * 
     *   The second way to call ambientLight() has one 
     *   parameter, color. A p5.Color object, an array of 
     *   color values, or a CSS color string, as in 
     *   ambientLight('magenta'), can be passed to set the 
     *   ambient light’s color. 
     * 
     *   The third way to call ambientLight() has four 
     *   parameters, v1, v2, v3, and alpha. alpha is 
     *   optional. RGBA, HSBA, or HSLA values can be passed 
     *   to set the ambient light’s colors, as in 
     *   ambientLight(255, 0, 0) or ambientLight(255, 0, 0, 
     *   30). Color values will be interpreted using the 
     *   current colorMode().
     *   @param color color as a p5.Color object.
     */
    function ambientLight(color: p5.Color): void

    /**
     *   Sets the specular color for lights. 
     *   specularColor() affects lights that bounce off a 
     *   surface in a preferred direction. These lights 
     *   include directionalLight(), pointLight(), and 
     *   spotLight(). The function helps to create 
     *   highlights on p5.Geometry objects that are styled 
     *   with specularMaterial(). If a geometry does not 
     *   use specularMaterial(), then specularColor() will 
     *   have no effect. 
     * 
     *   Note: specularColor() doesn’t affect lights that 
     *   bounce in all directions, including ambientLight() 
     *   and imageLight(). 
     * 
     *   There are three ways to call specularColor() with 
     *   optional parameters to set the specular highlight 
     *   color. 
     * 
     *   The first way to call specularColor() has two 
     *   optional parameters, gray and alpha. Grayscale and 
     *   alpha values between 0 and 255, as in 
     *   specularColor(50) or specularColor(50, 80), can be 
     *   passed to set the specular highlight color. 
     * 
     *   The second way to call specularColor() has one 
     *   optional parameter, color. A p5.Color object, an 
     *   array of color values, or a CSS color string can 
     *   be passed to set the specular highlight color. 
     * 
     *   The third way to call specularColor() has four 
     *   optional parameters, v1, v2, v3, and alpha. RGBA, 
     *   HSBA, or HSLA values, as in specularColor(255, 0, 
     *   0, 80), can be passed to set the specular 
     *   highlight color. Color values will be interpreted 
     *   using the current colorMode().
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     */
    function specularColor(v1: number, v2: number, v3: number): void

    /**
     *   Sets the specular color for lights. 
     *   specularColor() affects lights that bounce off a 
     *   surface in a preferred direction. These lights 
     *   include directionalLight(), pointLight(), and 
     *   spotLight(). The function helps to create 
     *   highlights on p5.Geometry objects that are styled 
     *   with specularMaterial(). If a geometry does not 
     *   use specularMaterial(), then specularColor() will 
     *   have no effect. 
     * 
     *   Note: specularColor() doesn’t affect lights that 
     *   bounce in all directions, including ambientLight() 
     *   and imageLight(). 
     * 
     *   There are three ways to call specularColor() with 
     *   optional parameters to set the specular highlight 
     *   color. 
     * 
     *   The first way to call specularColor() has two 
     *   optional parameters, gray and alpha. Grayscale and 
     *   alpha values between 0 and 255, as in 
     *   specularColor(50) or specularColor(50, 80), can be 
     *   passed to set the specular highlight color. 
     * 
     *   The second way to call specularColor() has one 
     *   optional parameter, color. A p5.Color object, an 
     *   array of color values, or a CSS color string can 
     *   be passed to set the specular highlight color. 
     * 
     *   The third way to call specularColor() has four 
     *   optional parameters, v1, v2, v3, and alpha. RGBA, 
     *   HSBA, or HSLA values, as in specularColor(255, 0, 
     *   0, 80), can be passed to set the specular 
     *   highlight color. Color values will be interpreted 
     *   using the current colorMode().
     *   @param gray grayscale value between 0 and 255.
     */
    function specularColor(gray: number): void

    /**
     *   Sets the specular color for lights. 
     *   specularColor() affects lights that bounce off a 
     *   surface in a preferred direction. These lights 
     *   include directionalLight(), pointLight(), and 
     *   spotLight(). The function helps to create 
     *   highlights on p5.Geometry objects that are styled 
     *   with specularMaterial(). If a geometry does not 
     *   use specularMaterial(), then specularColor() will 
     *   have no effect. 
     * 
     *   Note: specularColor() doesn’t affect lights that 
     *   bounce in all directions, including ambientLight() 
     *   and imageLight(). 
     * 
     *   There are three ways to call specularColor() with 
     *   optional parameters to set the specular highlight 
     *   color. 
     * 
     *   The first way to call specularColor() has two 
     *   optional parameters, gray and alpha. Grayscale and 
     *   alpha values between 0 and 255, as in 
     *   specularColor(50) or specularColor(50, 80), can be 
     *   passed to set the specular highlight color. 
     * 
     *   The second way to call specularColor() has one 
     *   optional parameter, color. A p5.Color object, an 
     *   array of color values, or a CSS color string can 
     *   be passed to set the specular highlight color. 
     * 
     *   The third way to call specularColor() has four 
     *   optional parameters, v1, v2, v3, and alpha. RGBA, 
     *   HSBA, or HSLA values, as in specularColor(255, 0, 
     *   0, 80), can be passed to set the specular 
     *   highlight color. Color values will be interpreted 
     *   using the current colorMode().
     *   @param value color as a CSS string.
     */
    function specularColor(value: string): void

    /**
     *   Sets the specular color for lights. 
     *   specularColor() affects lights that bounce off a 
     *   surface in a preferred direction. These lights 
     *   include directionalLight(), pointLight(), and 
     *   spotLight(). The function helps to create 
     *   highlights on p5.Geometry objects that are styled 
     *   with specularMaterial(). If a geometry does not 
     *   use specularMaterial(), then specularColor() will 
     *   have no effect. 
     * 
     *   Note: specularColor() doesn’t affect lights that 
     *   bounce in all directions, including ambientLight() 
     *   and imageLight(). 
     * 
     *   There are three ways to call specularColor() with 
     *   optional parameters to set the specular highlight 
     *   color. 
     * 
     *   The first way to call specularColor() has two 
     *   optional parameters, gray and alpha. Grayscale and 
     *   alpha values between 0 and 255, as in 
     *   specularColor(50) or specularColor(50, 80), can be 
     *   passed to set the specular highlight color. 
     * 
     *   The second way to call specularColor() has one 
     *   optional parameter, color. A p5.Color object, an 
     *   array of color values, or a CSS color string can 
     *   be passed to set the specular highlight color. 
     * 
     *   The third way to call specularColor() has four 
     *   optional parameters, v1, v2, v3, and alpha. RGBA, 
     *   HSBA, or HSLA values, as in specularColor(255, 0, 
     *   0, 80), can be passed to set the specular 
     *   highlight color. Color values will be interpreted 
     *   using the current colorMode().
     *   @param values color as an array of RGBA, HSBA, or 
     *   HSLA values.
     */
    function specularColor(values: number[]): void

    /**
     *   Sets the specular color for lights. 
     *   specularColor() affects lights that bounce off a 
     *   surface in a preferred direction. These lights 
     *   include directionalLight(), pointLight(), and 
     *   spotLight(). The function helps to create 
     *   highlights on p5.Geometry objects that are styled 
     *   with specularMaterial(). If a geometry does not 
     *   use specularMaterial(), then specularColor() will 
     *   have no effect. 
     * 
     *   Note: specularColor() doesn’t affect lights that 
     *   bounce in all directions, including ambientLight() 
     *   and imageLight(). 
     * 
     *   There are three ways to call specularColor() with 
     *   optional parameters to set the specular highlight 
     *   color. 
     * 
     *   The first way to call specularColor() has two 
     *   optional parameters, gray and alpha. Grayscale and 
     *   alpha values between 0 and 255, as in 
     *   specularColor(50) or specularColor(50, 80), can be 
     *   passed to set the specular highlight color. 
     * 
     *   The second way to call specularColor() has one 
     *   optional parameter, color. A p5.Color object, an 
     *   array of color values, or a CSS color string can 
     *   be passed to set the specular highlight color. 
     * 
     *   The third way to call specularColor() has four 
     *   optional parameters, v1, v2, v3, and alpha. RGBA, 
     *   HSBA, or HSLA values, as in specularColor(255, 0, 
     *   0, 80), can be passed to set the specular 
     *   highlight color. Color values will be interpreted 
     *   using the current colorMode().
     *   @param color color as a p5.Color object.
     */
    function specularColor(color: p5.Color): void

    /**
     *   Creates a light that shines in one direction. 
     *   Directional lights don’t shine from a specific 
     *   point. They’re like a sun that shines from 
     *   somewhere offscreen. The light’s direction is set 
     *   using three (x, y, z) values between -1 and 1. For 
     *   example, setting a light’s direction as (1, 0, 0) 
     *   will light p5.Geometry objects from the left since 
     *   the light faces directly to the right. A maximum 
     *   of 5 directional lights can be active at once. 
     * 
     *   There are four ways to call directionalLight() 
     *   with parameters to set the light’s color and 
     *   direction. 
     * 
     *   The first way to call directionalLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s direction. For example, 
     *   directionalLight(255, 0, 0, 1, 0, 0) creates a red 
     *   (255, 0, 0) light that shines to the right (1, 0, 
     *   0). 
     * 
     *   The second way to call directionalLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, direction sets 
     *   the light’s direction using a p5.Vector object. 
     *   For example, directionalLight(255, 0, 0, lightDir) 
     *   creates a red (255, 0, 0) light that shines in the 
     *   direction the lightDir vector points. 
     * 
     *   The third way to call directionalLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s direction. For example, 
     *   directionalLight(myColor, 1, 0, 0) creates a light 
     *   that shines to the right (1, 0, 0) with the color 
     *   value of myColor. 
     * 
     *   The fourth way to call directionalLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, direction, 
     *   sets the light’s direction using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightDir) creates a light that shines in the 
     *   direction the lightDir vector points with the 
     *   color value of myColor.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param x x-component of the light's direction 
     *   between -1 and 1.
     *   @param y y-component of the light's direction 
     *   between -1 and 1.
     *   @param z z-component of the light's direction 
     *   between -1 and 1.
     */
    function directionalLight(v1: number, v2: number, v3: number, x: number, y: number, z: number): void

    /**
     *   Creates a light that shines in one direction. 
     *   Directional lights don’t shine from a specific 
     *   point. They’re like a sun that shines from 
     *   somewhere offscreen. The light’s direction is set 
     *   using three (x, y, z) values between -1 and 1. For 
     *   example, setting a light’s direction as (1, 0, 0) 
     *   will light p5.Geometry objects from the left since 
     *   the light faces directly to the right. A maximum 
     *   of 5 directional lights can be active at once. 
     * 
     *   There are four ways to call directionalLight() 
     *   with parameters to set the light’s color and 
     *   direction. 
     * 
     *   The first way to call directionalLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s direction. For example, 
     *   directionalLight(255, 0, 0, 1, 0, 0) creates a red 
     *   (255, 0, 0) light that shines to the right (1, 0, 
     *   0). 
     * 
     *   The second way to call directionalLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, direction sets 
     *   the light’s direction using a p5.Vector object. 
     *   For example, directionalLight(255, 0, 0, lightDir) 
     *   creates a red (255, 0, 0) light that shines in the 
     *   direction the lightDir vector points. 
     * 
     *   The third way to call directionalLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s direction. For example, 
     *   directionalLight(myColor, 1, 0, 0) creates a light 
     *   that shines to the right (1, 0, 0) with the color 
     *   value of myColor. 
     * 
     *   The fourth way to call directionalLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, direction, 
     *   sets the light’s direction using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightDir) creates a light that shines in the 
     *   direction the lightDir vector points with the 
     *   color value of myColor.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param direction direction of the light as a 
     *   p5.Vector object.
     */
    function directionalLight(v1: number, v2: number, v3: number, direction: p5.Vector): void

    /**
     *   Creates a light that shines in one direction. 
     *   Directional lights don’t shine from a specific 
     *   point. They’re like a sun that shines from 
     *   somewhere offscreen. The light’s direction is set 
     *   using three (x, y, z) values between -1 and 1. For 
     *   example, setting a light’s direction as (1, 0, 0) 
     *   will light p5.Geometry objects from the left since 
     *   the light faces directly to the right. A maximum 
     *   of 5 directional lights can be active at once. 
     * 
     *   There are four ways to call directionalLight() 
     *   with parameters to set the light’s color and 
     *   direction. 
     * 
     *   The first way to call directionalLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s direction. For example, 
     *   directionalLight(255, 0, 0, 1, 0, 0) creates a red 
     *   (255, 0, 0) light that shines to the right (1, 0, 
     *   0). 
     * 
     *   The second way to call directionalLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, direction sets 
     *   the light’s direction using a p5.Vector object. 
     *   For example, directionalLight(255, 0, 0, lightDir) 
     *   creates a red (255, 0, 0) light that shines in the 
     *   direction the lightDir vector points. 
     * 
     *   The third way to call directionalLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s direction. For example, 
     *   directionalLight(myColor, 1, 0, 0) creates a light 
     *   that shines to the right (1, 0, 0) with the color 
     *   value of myColor. 
     * 
     *   The fourth way to call directionalLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, direction, 
     *   sets the light’s direction using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightDir) creates a light that shines in the 
     *   direction the lightDir vector points with the 
     *   color value of myColor.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or as a CSS string.
     *   @param x x-component of the light's direction 
     *   between -1 and 1.
     *   @param y y-component of the light's direction 
     *   between -1 and 1.
     *   @param z z-component of the light's direction 
     *   between -1 and 1.
     */
    function directionalLight(color: p5.Color|number[]|string, x: number, y: number, z: number): void

    /**
     *   Creates a light that shines in one direction. 
     *   Directional lights don’t shine from a specific 
     *   point. They’re like a sun that shines from 
     *   somewhere offscreen. The light’s direction is set 
     *   using three (x, y, z) values between -1 and 1. For 
     *   example, setting a light’s direction as (1, 0, 0) 
     *   will light p5.Geometry objects from the left since 
     *   the light faces directly to the right. A maximum 
     *   of 5 directional lights can be active at once. 
     * 
     *   There are four ways to call directionalLight() 
     *   with parameters to set the light’s color and 
     *   direction. 
     * 
     *   The first way to call directionalLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s direction. For example, 
     *   directionalLight(255, 0, 0, 1, 0, 0) creates a red 
     *   (255, 0, 0) light that shines to the right (1, 0, 
     *   0). 
     * 
     *   The second way to call directionalLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, direction sets 
     *   the light’s direction using a p5.Vector object. 
     *   For example, directionalLight(255, 0, 0, lightDir) 
     *   creates a red (255, 0, 0) light that shines in the 
     *   direction the lightDir vector points. 
     * 
     *   The third way to call directionalLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s direction. For example, 
     *   directionalLight(myColor, 1, 0, 0) creates a light 
     *   that shines to the right (1, 0, 0) with the color 
     *   value of myColor. 
     * 
     *   The fourth way to call directionalLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, direction, 
     *   sets the light’s direction using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightDir) creates a light that shines in the 
     *   direction the lightDir vector points with the 
     *   color value of myColor.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or as a CSS string.
     *   @param direction direction of the light as a 
     *   p5.Vector object.
     */
    function directionalLight(color: p5.Color|number[]|string, direction: p5.Vector): void

    /**
     *   Creates a light that shines from a point in all 
     *   directions. Point lights are like light bulbs that 
     *   shine in all directions. They can be placed at 
     *   different positions to achieve different lighting 
     *   effects. A maximum of 5 point lights can be active 
     *   at once. 
     * 
     *   There are four ways to call pointLight() with 
     *   parameters to set the light’s color and position. 
     * 
     *   The first way to call pointLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s position. For example, 
     *   pointLight(255, 0, 0, 50, 0, 0) creates a red 
     *   (255, 0, 0) light that shines from the coordinates 
     *   (50, 0, 0). 
     * 
     *   The second way to call pointLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, position sets the 
     *   light’s position using a p5.Vector object. For 
     *   example, pointLight(255, 0, 0, lightPos) creates a 
     *   red (255, 0, 0) light that shines from the 
     *   position set by the lightPos vector. 
     * 
     *   The third way to call pointLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s position. For example, 
     *   directionalLight(myColor, 50, 0, 0) creates a 
     *   light that shines from the coordinates (50, 0, 0) 
     *   with the color value of myColor. 
     * 
     *   The fourth way to call pointLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, position, 
     *   sets the light’s position using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightPos) creates a light that shines from the 
     *   position set by the lightPos vector with the color 
     *   value of myColor.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param x x-coordinate of the light.
     *   @param y y-coordinate of the light.
     *   @param z z-coordinate of the light.
     */
    function pointLight(v1: number, v2: number, v3: number, x: number, y: number, z: number): void

    /**
     *   Creates a light that shines from a point in all 
     *   directions. Point lights are like light bulbs that 
     *   shine in all directions. They can be placed at 
     *   different positions to achieve different lighting 
     *   effects. A maximum of 5 point lights can be active 
     *   at once. 
     * 
     *   There are four ways to call pointLight() with 
     *   parameters to set the light’s color and position. 
     * 
     *   The first way to call pointLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s position. For example, 
     *   pointLight(255, 0, 0, 50, 0, 0) creates a red 
     *   (255, 0, 0) light that shines from the coordinates 
     *   (50, 0, 0). 
     * 
     *   The second way to call pointLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, position sets the 
     *   light’s position using a p5.Vector object. For 
     *   example, pointLight(255, 0, 0, lightPos) creates a 
     *   red (255, 0, 0) light that shines from the 
     *   position set by the lightPos vector. 
     * 
     *   The third way to call pointLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s position. For example, 
     *   directionalLight(myColor, 50, 0, 0) creates a 
     *   light that shines from the coordinates (50, 0, 0) 
     *   with the color value of myColor. 
     * 
     *   The fourth way to call pointLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, position, 
     *   sets the light’s position using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightPos) creates a light that shines from the 
     *   position set by the lightPos vector with the color 
     *   value of myColor.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param position position of the light as a 
     *   p5.Vector object.
     */
    function pointLight(v1: number, v2: number, v3: number, position: p5.Vector): void

    /**
     *   Creates a light that shines from a point in all 
     *   directions. Point lights are like light bulbs that 
     *   shine in all directions. They can be placed at 
     *   different positions to achieve different lighting 
     *   effects. A maximum of 5 point lights can be active 
     *   at once. 
     * 
     *   There are four ways to call pointLight() with 
     *   parameters to set the light’s color and position. 
     * 
     *   The first way to call pointLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s position. For example, 
     *   pointLight(255, 0, 0, 50, 0, 0) creates a red 
     *   (255, 0, 0) light that shines from the coordinates 
     *   (50, 0, 0). 
     * 
     *   The second way to call pointLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, position sets the 
     *   light’s position using a p5.Vector object. For 
     *   example, pointLight(255, 0, 0, lightPos) creates a 
     *   red (255, 0, 0) light that shines from the 
     *   position set by the lightPos vector. 
     * 
     *   The third way to call pointLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s position. For example, 
     *   directionalLight(myColor, 50, 0, 0) creates a 
     *   light that shines from the coordinates (50, 0, 0) 
     *   with the color value of myColor. 
     * 
     *   The fourth way to call pointLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, position, 
     *   sets the light’s position using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightPos) creates a light that shines from the 
     *   position set by the lightPos vector with the color 
     *   value of myColor.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or a CSS string.
     *   @param x x-coordinate of the light.
     *   @param y y-coordinate of the light.
     *   @param z z-coordinate of the light.
     */
    function pointLight(color: p5.Color|number[]|string, x: number, y: number, z: number): void

    /**
     *   Creates a light that shines from a point in all 
     *   directions. Point lights are like light bulbs that 
     *   shine in all directions. They can be placed at 
     *   different positions to achieve different lighting 
     *   effects. A maximum of 5 point lights can be active 
     *   at once. 
     * 
     *   There are four ways to call pointLight() with 
     *   parameters to set the light’s color and position. 
     * 
     *   The first way to call pointLight() has six 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last three parameters, x, y, and 
     *   z, set the light’s position. For example, 
     *   pointLight(255, 0, 0, 50, 0, 0) creates a red 
     *   (255, 0, 0) light that shines from the coordinates 
     *   (50, 0, 0). 
     * 
     *   The second way to call pointLight() has four 
     *   parameters. The first three parameters, v1, v2, 
     *   and v3, set the light’s color using the current 
     *   colorMode(). The last parameter, position sets the 
     *   light’s position using a p5.Vector object. For 
     *   example, pointLight(255, 0, 0, lightPos) creates a 
     *   red (255, 0, 0) light that shines from the 
     *   position set by the lightPos vector. 
     * 
     *   The third way to call pointLight() has four 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The last three parameters, x, y, 
     *   and z, set the light’s position. For example, 
     *   directionalLight(myColor, 50, 0, 0) creates a 
     *   light that shines from the coordinates (50, 0, 0) 
     *   with the color value of myColor. 
     * 
     *   The fourth way to call pointLight() has two 
     *   parameters. The first parameter, color, sets the 
     *   light’s color using a p5.Color object or an array 
     *   of color values. The second parameter, position, 
     *   sets the light’s position using a p5.Vector 
     *   object. For example, directionalLight(myColor, 
     *   lightPos) creates a light that shines from the 
     *   position set by the lightPos vector with the color 
     *   value of myColor.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or a CSS string.
     *   @param position position of the light as a 
     *   p5.Vector object.
     */
    function pointLight(color: p5.Color|number[]|string, position: p5.Vector): void

    /**
     *   Creates an ambient light from an image. 
     *   imageLight() simulates a light shining from all 
     *   directions. The effect is like placing the sketch 
     *   at the center of a giant sphere that uses the 
     *   image as its texture. The image's diffuse light 
     *   will be affected by fill() and the specular 
     *   reflections will be affected by specularMaterial() 
     *   and shininess(). 
     * 
     *   The parameter, img, is the p5.Image object to use 
     *   as the light source.
     *   @param img image to use as the light source.
     */
    function imageLight(img: p5.Image): void

    /**
     *   Creates an immersive 3D background. panorama() 
     *   transforms images containing 360˚ content, such as 
     *   maps or HDRIs, into immersive 3D backgrounds that 
     *   surround a sketch. Exploring the space requires 
     *   changing the camera's perspective with functions 
     *   such as orbitControl() or camera().
     *   @param img 360˚ image to use as the background.
     */
    function panorama(img: p5.Image): void

    /**
     *   Places an ambient and directional light in the 
     *   scene. The lights are set to ambientLight(128, 
     *   128, 128) and directionalLight(128, 128, 128, 0, 
     *   0, -1). Note: lights need to be called (whether 
     *   directly or indirectly) within draw() to remain 
     *   persistent in a looping program. Placing them in 
     *   setup() will cause them to only have an effect the 
     *   first time through the loop.
     */
    function lights(): void

    /**
     *   Sets the falloff rate for pointLight() and 
     *   spotLight(). A light’s falloff describes the 
     *   intensity of its beam at a distance. For example, 
     *   a lantern has a slow falloff, a flashlight has a 
     *   medium falloff, and a laser pointer has a sharp 
     *   falloff. 
     * 
     *   lightFalloff() has three parameters, constant, 
     *   linear, and quadratic. They’re numbers used to 
     *   calculate falloff at a distance, d, as follows: 
     * 
     *   falloff = 1 / (constant + d * linear + (d * d) * 
     *   quadratic) 
     * 
     *   Note: constant, linear, and quadratic should 
     *   always be set to values greater than 0.
     *   @param constant constant value for calculating 
     *   falloff.
     *   @param linear linear value for calculating 
     *   falloff.
     *   @param quadratic quadratic value for calculating 
     *   falloff.
     */
    function lightFalloff(constant: number, linear: number, quadratic: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param x x-coordinate of the light.
     *   @param y y-coordinate of the light.
     *   @param z z-coordinate of the light.
     *   @param rx x-component of light direction between 
     *   -1 and 1.
     *   @param ry y-component of light direction between 
     *   -1 and 1.
     *   @param rz z-component of light direction between 
     *   -1 and 1.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(v1: number, v2: number, v3: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or a CSS string.
     *   @param position position of the light as a 
     *   p5.Vector object.
     *   @param direction direction of light as a p5.Vector 
     *   object.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(color: p5.Color|number[]|string, position: p5.Vector, direction: p5.Vector, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param position position of the light as a 
     *   p5.Vector object.
     *   @param direction direction of light as a p5.Vector 
     *   object.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(v1: number, v2: number, v3: number, position: p5.Vector, direction: p5.Vector, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or a CSS string.
     *   @param x x-coordinate of the light.
     *   @param y y-coordinate of the light.
     *   @param z z-coordinate of the light.
     *   @param direction direction of light as a p5.Vector 
     *   object.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(color: p5.Color|number[]|string, x: number, y: number, z: number, direction: p5.Vector, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or a CSS string.
     *   @param position position of the light as a 
     *   p5.Vector object.
     *   @param rx x-component of light direction between 
     *   -1 and 1.
     *   @param ry y-component of light direction between 
     *   -1 and 1.
     *   @param rz z-component of light direction between 
     *   -1 and 1.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(color: p5.Color|number[]|string, position: p5.Vector, rx: number, ry: number, rz: number, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param x x-coordinate of the light.
     *   @param y y-coordinate of the light.
     *   @param z z-coordinate of the light.
     *   @param direction direction of light as a p5.Vector 
     *   object.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(v1: number, v2: number, v3: number, x: number, y: number, z: number, direction: p5.Vector, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param v1 red or hue value in the current 
     *   colorMode().
     *   @param v2 green or saturation value in the current 
     *   colorMode().
     *   @param v3 blue, brightness, or lightness value in 
     *   the current colorMode().
     *   @param position position of the light as a 
     *   p5.Vector object.
     *   @param rx x-component of light direction between 
     *   -1 and 1.
     *   @param ry y-component of light direction between 
     *   -1 and 1.
     *   @param rz z-component of light direction between 
     *   -1 and 1.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(v1: number, v2: number, v3: number, position: p5.Vector, rx: number, ry: number, rz: number, angle?: number, concentration?: number): void

    /**
     *   Creates a light that shines from a point in one 
     *   direction. Spot lights are like flashlights that 
     *   shine in one direction creating a cone of light. 
     *   The shape of the cone can be controlled using the 
     *   angle and concentration parameters. A maximum of 5 
     *   spot lights can be active at once. 
     * 
     *   There are eight ways to call spotLight() with 
     *   parameters to set the light’s color, position, 
     *   direction. For example, spotLight(255, 0, 0, 0, 0, 
     *   0, 1, 0, 0) creates a red (255, 0, 0) light at the 
     *   origin (0, 0, 0) that points to the right (1, 0, 
     *   0). 
     * 
     *   The angle parameter is optional. It sets the 
     *   radius of the light cone. For example, 
     *   spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16) 
     *   creates a red (255, 0, 0) light at the origin (0, 
     *   0, 0) that points to the right (1, 0, 0) with an 
     *   angle of PI / 16 radians. By default, angle is PI 
     *   / 3 radians. 
     * 
     *   The concentration parameter is also optional. It 
     *   focuses the light towards the center of the light 
     *   cone. For example, spotLight(255, 0, 0, 0, 0, 0, 
     *   1, 0, 0, PI / 16, 50) creates a red (255, 0, 0) 
     *   light at the origin (0, 0, 0) that points to the 
     *   right (1, 0, 0) with an angle of PI / 16 radians 
     *   at concentration of 50. By default, concentration 
     *   is 100.
     *   @param color color as a p5.Color object, an array 
     *   of color values, or a CSS string.
     *   @param x x-coordinate of the light.
     *   @param y y-coordinate of the light.
     *   @param z z-coordinate of the light.
     *   @param rx x-component of light direction between 
     *   -1 and 1.
     *   @param ry y-component of light direction between 
     *   -1 and 1.
     *   @param rz z-component of light direction between 
     *   -1 and 1.
     *   @param [angle] angle of the light cone. Defaults 
     *   to PI / 3.
     *   @param [concentration] concentration of the light. 
     *   Defaults to 100.
     */
    function spotLight(color: p5.Color|number[]|string, x: number, y: number, z: number, rx: number, ry: number, rz: number, angle?: number, concentration?: number): void

    /**
     *   Removes all lights from the sketch. Calling 
     *   noLights() removes any lights created with 
     *   lights(), ambientLight(), directionalLight(), 
     *   pointLight(), or spotLight(). These functions may 
     *   be called after noLights() to create a new 
     *   lighting scheme.
     */
    function noLights(): void

    // TODO: Fix loadModel() errors in src/scripts/parsers/in/p5.js/src/webgl/loading.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Geometry>
    //
    // function loadModel(path: string, fileType?: string, normalize?: boolean, successCallback?: (p1: p5.Geometry) => any, failureCallback?: (p1: Event) => any): 

    // TODO: Fix loadModel() errors in src/scripts/parsers/in/p5.js/src/webgl/loading.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Geometry>
    //
    // function loadModel(path: string, fileType?: string, successCallback?: (p1: p5.Geometry) => any, failureCallback?: (p1: Event) => any): 

    // TODO: Fix loadModel() errors in src/scripts/parsers/in/p5.js/src/webgl/loading.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Geometry>
    //
    // function loadModel(path: string, options?: object): 

    /**
     *   Draws a p5.Geometry object to the canvas. The 
     *   parameter, model, is the p5.Geometry object to 
     *   draw. p5.Geometry objects can be built with 
     *   buildGeometry(), or beginGeometry() and 
     *   endGeometry(). They can also be loaded from a file 
     *   with loadGeometry(). 
     * 
     *   Note: model() can only be used in WebGL mode.
     *   @param model 3D shape to be drawn.
     *   @param [count] number of instances to draw.
     */
    function model(model: p5.Geometry, count?: number): void

    /**
     *   Load a 3d model from an OBJ or STL string. OBJ and 
     *   STL files lack a built-in sense of scale, causing 
     *   models exported from different programs to vary in 
     *   size. If your model doesn't display correctly, 
     *   consider using loadModel() with normalize set to 
     *   true to standardize its size. Further adjustments 
     *   can be made using the scale() function. 
     * 
     *   Also, the support for colored STL files is not 
     *   present. STL files with color will be rendered 
     *   without color properties. 
     * 
     *   - Options can include:
     * 
     *   - modelString: Specifies the plain text string of 
     *   either an stl or obj file to be loaded.
     *   - fileType: Defines the file extension of the 
     *   model.
     *   - normalize: Enables standardized size scaling 
     *   during loading if set to true.
     *   - successCallback: Callback for post-loading 
     *   actions with the 3D model object.
     *   - failureCallback: Handles errors if model loading 
     *   fails, receiving an event error.
     *   - flipU: Flips the U texture coordinates of the 
     *   model.
     *   - flipV: Flips the V texture coordinates of the 
     *   model.
     *   @param modelString String of the object to be 
     *   loaded
     *   @param [fileType] The file extension of the model 
     *   (.stl, .obj).
     *   @param [normalize] If true, scale the model to a 
     *   standardized size when loading
     *   @param [successCallback] Function to be called 
     *   once the model is loaded. Will be passed the 3D 
     *   model object.
     *   @param [failureCallback] called with event error 
     *   if the model fails to load.
     *   @return the p5.Geometry object
     */
    function createModel(modelString: string, fileType?: string, normalize?: boolean, successCallback?: (p1: p5.Geometry) => any, failureCallback?: (p1: Event) => any): p5.Geometry

    /**
     *   Load a 3d model from an OBJ or STL string. OBJ and 
     *   STL files lack a built-in sense of scale, causing 
     *   models exported from different programs to vary in 
     *   size. If your model doesn't display correctly, 
     *   consider using loadModel() with normalize set to 
     *   true to standardize its size. Further adjustments 
     *   can be made using the scale() function. 
     * 
     *   Also, the support for colored STL files is not 
     *   present. STL files with color will be rendered 
     *   without color properties. 
     * 
     *   - Options can include:
     * 
     *   - modelString: Specifies the plain text string of 
     *   either an stl or obj file to be loaded.
     *   - fileType: Defines the file extension of the 
     *   model.
     *   - normalize: Enables standardized size scaling 
     *   during loading if set to true.
     *   - successCallback: Callback for post-loading 
     *   actions with the 3D model object.
     *   - failureCallback: Handles errors if model loading 
     *   fails, receiving an event error.
     *   - flipU: Flips the U texture coordinates of the 
     *   model.
     *   - flipV: Flips the V texture coordinates of the 
     *   model.
     *   @param modelString String of the object to be 
     *   loaded
     *   @param [fileType] The file extension of the model 
     *   (.stl, .obj).
     *   @param [successCallback] Function to be called 
     *   once the model is loaded. Will be passed the 3D 
     *   model object.
     *   @param [failureCallback] called with event error 
     *   if the model fails to load.
     *   @return the p5.Geometry object
     */
    function createModel(modelString: string, fileType?: string, successCallback?: (p1: p5.Geometry) => any, failureCallback?: (p1: Event) => any): p5.Geometry

    /**
     *   Load a 3d model from an OBJ or STL string. OBJ and 
     *   STL files lack a built-in sense of scale, causing 
     *   models exported from different programs to vary in 
     *   size. If your model doesn't display correctly, 
     *   consider using loadModel() with normalize set to 
     *   true to standardize its size. Further adjustments 
     *   can be made using the scale() function. 
     * 
     *   Also, the support for colored STL files is not 
     *   present. STL files with color will be rendered 
     *   without color properties. 
     * 
     *   - Options can include:
     * 
     *   - modelString: Specifies the plain text string of 
     *   either an stl or obj file to be loaded.
     *   - fileType: Defines the file extension of the 
     *   model.
     *   - normalize: Enables standardized size scaling 
     *   during loading if set to true.
     *   - successCallback: Callback for post-loading 
     *   actions with the 3D model object.
     *   - failureCallback: Handles errors if model loading 
     *   fails, receiving an event error.
     *   - flipU: Flips the U texture coordinates of the 
     *   model.
     *   - flipV: Flips the V texture coordinates of the 
     *   model.
     *   @param modelString String of the object to be 
     *   loaded
     *   @param [fileType] The file extension of the model 
     *   (.stl, .obj).
     *   @return the p5.Geometry object
     */
    function createModel(modelString: string, fileType?: string, options?: object): p5.Geometry

    // TODO: Fix loadShader() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Shader>
    //
    // function loadShader(vertFilename: string, fragFilename: string, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): 

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
    function createShader(vertSrc: string, fragSrc: string, options?: object): p5.Shader

    // TODO: Fix loadFilterShader() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
    //
    //    return has invalid type: Promise<p5.Shader>
    //
    // function loadFilterShader(fragFilename: string, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): 

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
    function createFilterShader(fragSrc: string): p5.Shader

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
    function shader(s: p5.Shader): void

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
    function strokeShader(s: p5.Shader): void

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
    function imageShader(s: p5.Shader): void

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
    function baseMaterialShader(): p5.Shader

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
    function baseFilterShader(): p5.Shader

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
    function baseNormalShader(): p5.Shader

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
    function baseColorShader(): p5.Shader

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
    function baseStrokeShader(): p5.Shader

    /**
     *   Restores the default shaders. resetShader() 
     *   deactivates any shaders previously applied by 
     *   shader(), strokeShader(), or imageShader(). 
     * 
     *   Note: Shaders can only be used in WebGL mode.
     */
    function resetShader(): void

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

    // TODO: Fix textureMode() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
    //
    //    param "mode" has invalid type: IMAGE|NORMAL
    //
    // function textureMode(mode: IMAGE|NORMAL): void

    // TODO: Fix textureWrap() errors in src/scripts/parsers/in/p5.js/src/webgl/material.js, line undefined:
    //
    //    param "wrapX" has invalid type: CLAMP|REPEAT|MIRROR
    //    param "wrapY" has invalid type: CLAMP|REPEAT|MIRROR
    //
    // function textureWrap(wrapX: CLAMP|REPEAT|MIRROR, wrapY?: CLAMP|REPEAT|MIRROR): void

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
    function normalMaterial(): void

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
    function ambientMaterial(v1: number, v2: number, v3: number): void

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
    function ambientMaterial(gray: number): void

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
    function ambientMaterial(color: p5.Color|number[]|string): void

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
    function emissiveMaterial(v1: number, v2: number, v3: number, alpha?: number): void

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
    function emissiveMaterial(gray: number): void

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
    function emissiveMaterial(color: p5.Color|number[]|string): void

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
    function specularMaterial(gray: number, alpha?: number): void

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
    function specularMaterial(v1: number, v2: number, v3: number, alpha?: number): void

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
    function specularMaterial(color: p5.Color|number[]|string): void

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
    function shininess(shine: number): void

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
    function metalness(metallic: number): void

    /**
     *   Rotates the camera in a 
     *   clockwise/counter-clockwise direction. Rolling 
     *   rotates the camera without changing its 
     *   orientation. The rotation happens in the camera’s 
     *   "local" space. 
     * 
     *   The parameter, angle, is the angle the camera 
     *   should rotate. Passing a positive angle, as in 
     *   myCamera.roll(0.001), rotates the camera in 
     *   counter-clockwise direction. Passing a negative 
     *   angle, as in myCamera.roll(-0.001), rotates the 
     *   camera in clockwise direction. 
     * 
     *   Note: Angles are interpreted based on the current 
     *   angleMode().
     *   @param angle amount to rotate camera in current 
     *   angleMode units.
     */
    function roll(angle: number): void

    /**
     *   Sets the position and orientation of the current 
     *   camera in a 3D sketch. camera() allows objects to 
     *   be viewed from different angles. It has nine 
     *   parameters that are all optional. 
     * 
     *   The first three parameters, x, y, and z, are the 
     *   coordinates of the camera’s position. For example, 
     *   calling camera(0, 0, 0) places the camera at the 
     *   origin (0, 0, 0). By default, the camera is placed 
     *   at (0, 0, 800). 
     * 
     *   The next three parameters, centerX, centerY, and 
     *   centerZ are the coordinates of the point where the 
     *   camera faces. For example, calling camera(0, 0, 0, 
     *   10, 20, 30) places the camera at the origin (0, 0, 
     *   0) and points it at (10, 20, 30). By default, the 
     *   camera points at the origin (0, 0, 0). 
     * 
     *   The last three parameters, upX, upY, and upZ are 
     *   the components of the "up" vector. The "up" vector 
     *   orients the camera’s y-axis. For example, calling 
     *   camera(0, 0, 0, 10, 20, 30, 0, -1, 0) places the 
     *   camera at the origin (0, 0, 0), points it at (10, 
     *   20, 30), and sets the "up" vector to (0, -1, 0) 
     *   which is like holding it upside-down. By default, 
     *   the "up" vector is (0, 1, 0). 
     * 
     *   Note: camera() can only be used in WebGL mode.
     *   @param [x] x-coordinate of the camera. Defaults to 
     *   0.
     *   @param [y] y-coordinate of the camera. Defaults to 
     *   0.
     *   @param [z] z-coordinate of the camera. Defaults to 
     *   800.
     *   @param [centerX] x-coordinate of the point the 
     *   camera faces. Defaults to 0.
     *   @param [centerY] y-coordinate of the point the 
     *   camera faces. Defaults to 0.
     *   @param [centerZ] z-coordinate of the point the 
     *   camera faces. Defaults to 0.
     *   @param [upX] x-component of the camera’s "up" 
     *   vector. Defaults to 0.
     *   @param [upY] y-component of the camera’s "up" 
     *   vector. Defaults to 1.
     *   @param [upZ] z-component of the camera’s "up" 
     *   vector. Defaults to 0.
     */
    function camera(x?: number, y?: number, z?: number, centerX?: number, centerY?: number, centerZ?: number, upX?: number, upY?: number, upZ?: number): void

    /**
     *   Sets a perspective projection for the current 
     *   camera in a 3D sketch. In a perspective 
     *   projection, shapes that are further from the 
     *   camera appear smaller than shapes that are near 
     *   the camera. This technique, called foreshortening, 
     *   creates realistic 3D scenes. It’s applied by 
     *   default in WebGL mode. 
     * 
     *   perspective() changes the camera’s perspective by 
     *   changing its viewing frustum. The frustum is the 
     *   volume of space that’s visible to the camera. Its 
     *   shape is a pyramid with its top cut off. The 
     *   camera is placed where the top of the pyramid 
     *   should be and views everything between the 
     *   frustum’s top (near) plane and its bottom (far) 
     *   plane. 
     * 
     *   The first parameter, fovy, is the camera’s 
     *   vertical field of view. It’s an angle that 
     *   describes how tall or narrow a view the camera 
     *   has. For example, calling perspective(0.5) sets 
     *   the camera’s vertical field of view to 0.5 
     *   radians. By default, fovy is calculated based on 
     *   the sketch’s height and the camera’s default 
     *   z-coordinate, which is 800. The formula for the 
     *   default fovy is 2 * atan(height / 2 / 800). 
     * 
     *   The second parameter, aspect, is the camera’s 
     *   aspect ratio. It’s a number that describes the 
     *   ratio of the top plane’s width to its height. For 
     *   example, calling perspective(0.5, 1.5) sets the 
     *   camera’s field of view to 0.5 radians and aspect 
     *   ratio to 1.5, which would make shapes appear 
     *   thinner on a square canvas. By default, aspect is 
     *   set to width / height. 
     * 
     *   The third parameter, near, is the distance from 
     *   the camera to the near plane. For example, calling 
     *   perspective(0.5, 1.5, 100) sets the camera’s field 
     *   of view to 0.5 radians, its aspect ratio to 1.5, 
     *   and places the near plane 100 pixels from the 
     *   camera. Any shapes drawn less than 100 pixels from 
     *   the camera won’t be visible. By default, near is 
     *   set to 0.1 * 800, which is 1/10th the default 
     *   distance between the camera and the origin. 
     * 
     *   The fourth parameter, far, is the distance from 
     *   the camera to the far plane. For example, calling 
     *   perspective(0.5, 1.5, 100, 10000) sets the 
     *   camera’s field of view to 0.5 radians, its aspect 
     *   ratio to 1.5, places the near plane 100 pixels 
     *   from the camera, and places the far plane 10,000 
     *   pixels from the camera. Any shapes drawn more than 
     *   10,000 pixels from the camera won’t be visible. By 
     *   default, far is set to 10 * 800, which is 10 times 
     *   the default distance between the camera and the 
     *   origin. 
     * 
     *   Note: perspective() can only be used in WebGL 
     *   mode.
     *   @param [fovy] camera frustum vertical field of 
     *   view. Defaults to 2 * atan(height / 2 / 800).
     *   @param [aspect] camera frustum aspect ratio. 
     *   Defaults to width / height.
     *   @param [near] distance from the camera to the near 
     *   clipping plane. Defaults to 0.1 * 800.
     *   @param [far] distance from the camera to the far 
     *   clipping plane. Defaults to 10 * 800.
     */
    function perspective(fovy?: number, aspect?: number, near?: number, far?: number): void

    /**
     *   Enables or disables perspective for lines in 3D 
     *   sketches. In WebGL mode, lines can be drawn with a 
     *   thinner stroke when they’re further from the 
     *   camera. Doing so gives them a more realistic 
     *   appearance. 
     * 
     *   By default, lines are drawn differently based on 
     *   the type of perspective being used: 
     * 
     *   - perspective() and frustum() simulate a realistic 
     *   perspective. In these modes, stroke weight is 
     *   affected by the line’s distance from the camera. 
     *   Doing so results in a more natural appearance. 
     *   perspective() is the default mode for 3D sketches.
     *   - ortho() doesn’t simulate a realistic 
     *   perspective. In this mode, stroke weights are 
     *   consistent regardless of the line’s distance from 
     *   the camera. Doing so results in a more predictable 
     *   and consistent appearance.
     * 
     *   linePerspective() can override the default line 
     *   drawing mode. 
     * 
     *   The parameter, enable, is optional. It’s a Boolean 
     *   value that sets the way lines are drawn. If true 
     *   is passed, as in linePerspective(true), then lines 
     *   will appear thinner when they are further from the 
     *   camera. If false is passed, as in 
     *   linePerspective(false), then lines will have 
     *   consistent stroke weights regardless of their 
     *   distance from the camera. By default, 
     *   linePerspective() is enabled. 
     * 
     *   Calling linePerspective() without passing an 
     *   argument returns true if it's enabled and false if 
     *   not. 
     * 
     *   Note: linePerspective() can only be used in WebGL 
     *   mode.
     *   @param enable whether to enable line perspective.
     */
    function linePerspective(enable: boolean): void

    // TODO: Fix linePerspective() errors in src/scripts/parsers/in/p5.js/src/webgl/p5.Camera.js, line undefined:
    //
    //    return has invalid type: boolean
    //
    // function linePerspective(): 

    /**
     *   Sets an orthographic projection for the current 
     *   camera in a 3D sketch. In an orthographic 
     *   projection, shapes with the same size always 
     *   appear the same size, regardless of whether they 
     *   are near or far from the camera. 
     * 
     *   ortho() changes the camera’s perspective by 
     *   changing its viewing frustum from a truncated 
     *   pyramid to a rectangular prism. The camera is 
     *   placed in front of the frustum and views 
     *   everything between the frustum’s near plane and 
     *   its far plane. ortho() has six optional parameters 
     *   to define the frustum. 
     * 
     *   The first four parameters, left, right, bottom, 
     *   and top, set the coordinates of the frustum’s 
     *   sides, bottom, and top. For example, calling 
     *   ortho(-100, 100, 200, -200) creates a frustum 
     *   that’s 200 pixels wide and 400 pixels tall. By 
     *   default, these coordinates are set based on the 
     *   sketch’s width and height, as in ortho(-width / 2, 
     *   width / 2, -height / 2, height / 2). 
     * 
     *   The last two parameters, near and far, set the 
     *   distance of the frustum’s near and far plane from 
     *   the camera. For example, calling ortho(-100, 100, 
     *   200, 200, 50, 1000) creates a frustum that’s 200 
     *   pixels wide, 400 pixels tall, starts 50 pixels 
     *   from the camera, and ends 1,000 pixels from the 
     *   camera. By default, near and far are set to 0 and 
     *   max(width, height) + 800, respectively. 
     * 
     *   Note: ortho() can only be used in WebGL mode.
     *   @param [left] x-coordinate of the frustum’s left 
     *   plane. Defaults to -width / 2.
     *   @param [right] x-coordinate of the frustum’s right 
     *   plane. Defaults to width / 2.
     *   @param [bottom] y-coordinate of the frustum’s 
     *   bottom plane. Defaults to height / 2.
     *   @param [top] y-coordinate of the frustum’s top 
     *   plane. Defaults to -height / 2.
     *   @param [near] z-coordinate of the frustum’s near 
     *   plane. Defaults to 0.
     *   @param [far] z-coordinate of the frustum’s far 
     *   plane. Defaults to max(width, height) + 800.
     */
    function ortho(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): void

    /**
     *   Sets the frustum of the current camera in a 3D 
     *   sketch. In a frustum projection, shapes that are 
     *   further from the camera appear smaller than shapes 
     *   that are near the camera. This technique, called 
     *   foreshortening, creates realistic 3D scenes. 
     * 
     *   frustum() changes the default camera’s perspective 
     *   by changing its viewing frustum. The frustum is 
     *   the volume of space that’s visible to the camera. 
     *   The frustum’s shape is a pyramid with its top cut 
     *   off. The camera is placed where the top of the 
     *   pyramid should be and points towards the base of 
     *   the pyramid. It views everything within the 
     *   frustum. 
     * 
     *   The first four parameters, left, right, bottom, 
     *   and top, set the coordinates of the frustum’s 
     *   sides, bottom, and top. For example, calling 
     *   frustum(-100, 100, 200, -200) creates a frustum 
     *   that’s 200 pixels wide and 400 pixels tall. By 
     *   default, these coordinates are set based on the 
     *   sketch’s width and height, as in ortho(-width / 
     *   20, width / 20, height / 20, -height / 20). 
     * 
     *   The last two parameters, near and far, set the 
     *   distance of the frustum’s near and far plane from 
     *   the camera. For example, calling ortho(-100, 100, 
     *   200, -200, 50, 1000) creates a frustum that’s 200 
     *   pixels wide, 400 pixels tall, starts 50 pixels 
     *   from the camera, and ends 1,000 pixels from the 
     *   camera. By default, near is set to 0.1 * 800, 
     *   which is 1/10th the default distance between the 
     *   camera and the origin. far is set to 10 * 800, 
     *   which is 10 times the default distance between the 
     *   camera and the origin. 
     * 
     *   Note: frustum() can only be used in WebGL mode.
     *   @param [left] x-coordinate of the frustum’s left 
     *   plane. Defaults to -width / 20.
     *   @param [right] x-coordinate of the frustum’s right 
     *   plane. Defaults to width / 20.
     *   @param [bottom] y-coordinate of the frustum’s 
     *   bottom plane. Defaults to height / 20.
     *   @param [top] y-coordinate of the frustum’s top 
     *   plane. Defaults to -height / 20.
     *   @param [near] z-coordinate of the frustum’s near 
     *   plane. Defaults to 0.1 * 800.
     *   @param [far] z-coordinate of the frustum’s far 
     *   plane. Defaults to 10 * 800.
     */
    function frustum(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): void

    /**
     *   Creates a new p5.Camera object. The new camera is 
     *   initialized with a default position (0, 0, 800) 
     *   and a default perspective projection. Its 
     *   properties can be controlled with p5.Camera 
     *   methods such as myCamera.lookAt(0, 0, 0). 
     * 
     *   Note: Every 3D sketch starts with a default camera 
     *   initialized. This camera can be controlled with 
     *   the functions camera(), perspective(), ortho(), 
     *   and frustum() if it's the only camera in the 
     *   scene. 
     * 
     *   Note: createCamera() can only be used in WebGL 
     *   mode.
     *   @return the new camera.
     */
    function createCamera(): p5.Camera

    /**
     *   Sets the current (active) camera of a 3D sketch. 
     *   setCamera() allows for switching between multiple 
     *   cameras created with createCamera(). 
     * 
     *   Note: setCamera() can only be used in WebGL mode.
     *   @param cam camera that should be made active.
     */
    function setCamera(cam: p5.Camera): void

    /**
     *   The saveObj() function exports p5.Geometry objects 
     *   as 3D models in the Wavefront .obj file format. 
     *   This way, you can use the 3D shapes you create in 
     *   p5.js in other software for rendering, animation, 
     *   3D printing, or more. The exported .obj file will 
     *   include the faces and vertices of the p5.Geometry, 
     *   as well as its texture coordinates and normals, if 
     *   it has them.
     *   @param [fileName] The name of the file to save the 
     *   model as. If not specified, the default file name 
     *   will be 'model.obj'.
     */
    function saveObj(fileName?: string): void

    /**
     *   The saveStl() function exports p5.Geometry objects 
     *   as 3D models in the STL stereolithography file 
     *   format. This way, you can use the 3D shapes you 
     *   create in p5.js in other software for rendering, 
     *   animation, 3D printing, or more. The exported .stl 
     *   file will include the faces, vertices, and normals 
     *   of the p5.Geometry. 
     * 
     *   By default, this method saves a text-based .stl 
     *   file. Alternatively, you can save a more compact 
     *   but less human-readable binary .stl file by 
     *   passing { binary: true } as a second parameter.
     *   @param [fileName] The name of the file to save the 
     *   model as. If not specified, the default file name 
     *   will be 'model.stl'.
     *   @param [options] Optional settings.
     */
    function saveStl(fileName?: string, options?: object): void

    /**
     *   Returns a Quaternion for the axis angle 
     *   representation of the rotation
     *   @param [angle] Angle with which the points needs 
     *   to be rotated
     *   @param [x] x component of the axis vector
     *   @param [y] y component of the axis vector
     *   @param [z] z component of the axis vector
     */
    function fromAxisAngle(angle?: number, x?: number, y?: number, z?: number): void

    // TODO: Fix mult() errors in src/scripts/parsers/in/p5.js/src/webgl/p5.Quat.js, line undefined:
    //
    //    param "quat" has invalid type: p5.Quat
    //
    // function mult(quat?: p5.Quat): void

    // TODO: Fix rotateBy() errors in src/scripts/parsers/in/p5.js/src/webgl/p5.Quat.js, line undefined:
    //
    //    param "axesQuat" has invalid type: p5.Quat
    //
    // function rotateBy(axesQuat?: p5.Quat): void

    /**
     *   Set attributes for the WebGL Drawing context. This 
     *   is a way of adjusting how the WebGL renderer works 
     *   to fine-tune the display and performance. Note 
     *   that this will reinitialize the drawing context if 
     *   called after the WebGL canvas is made. 
     * 
     *   If an object is passed as the parameter, all 
     *   attributes not declared in the object will be set 
     *   to defaults. 
     * 
     *   The available attributes are: 
     *  
     *   alpha - indicates if the canvas contains an alpha 
     *   buffer default is true 
     * 
     *   depth - indicates whether the drawing buffer has a 
     *   depth buffer of at least 16 bits - default is true 
     * 
     *   stencil - indicates whether the drawing buffer has 
     *   a stencil buffer of at least 8 bits 
     * 
     *   antialias - indicates whether or not to perform 
     *   anti-aliasing default is false (true in Safari) 
     * 
     *   premultipliedAlpha - indicates that the page 
     *   compositor will assume the drawing buffer contains 
     *   colors with pre-multiplied alpha default is true 
     * 
     *   preserveDrawingBuffer - if true the buffers will 
     *   not be cleared and and will preserve their values 
     *   until cleared or overwritten by author (note that 
     *   p5 clears automatically on draw loop) default is 
     *   true 
     * 
     *   perPixelLighting - if true, per-pixel lighting 
     *   will be used in the lighting shader otherwise 
     *   per-vertex lighting is used. default is true. 
     * 
     *   version - either 1 or 2, to specify which WebGL 
     *   version to ask for. By default, WebGL 2 will be 
     *   requested. If WebGL2 is not available, it will 
     *   fall back to WebGL 1. You can check what version 
     *   is used with by looking at the global webglVersion 
     *   property.
     *   @param key Name of attribute
     *   @param value New value of named attribute
     */
    function setAttributes(key: string, value: boolean): void

    /**
     *   Set attributes for the WebGL Drawing context. This 
     *   is a way of adjusting how the WebGL renderer works 
     *   to fine-tune the display and performance. Note 
     *   that this will reinitialize the drawing context if 
     *   called after the WebGL canvas is made. 
     * 
     *   If an object is passed as the parameter, all 
     *   attributes not declared in the object will be set 
     *   to defaults. 
     * 
     *   The available attributes are: 
     *  
     *   alpha - indicates if the canvas contains an alpha 
     *   buffer default is true 
     * 
     *   depth - indicates whether the drawing buffer has a 
     *   depth buffer of at least 16 bits - default is true 
     * 
     *   stencil - indicates whether the drawing buffer has 
     *   a stencil buffer of at least 8 bits 
     * 
     *   antialias - indicates whether or not to perform 
     *   anti-aliasing default is false (true in Safari) 
     * 
     *   premultipliedAlpha - indicates that the page 
     *   compositor will assume the drawing buffer contains 
     *   colors with pre-multiplied alpha default is true 
     * 
     *   preserveDrawingBuffer - if true the buffers will 
     *   not be cleared and and will preserve their values 
     *   until cleared or overwritten by author (note that 
     *   p5 clears automatically on draw loop) default is 
     *   true 
     * 
     *   perPixelLighting - if true, per-pixel lighting 
     *   will be used in the lighting shader otherwise 
     *   per-vertex lighting is used. default is true. 
     * 
     *   version - either 1 or 2, to specify which WebGL 
     *   version to ask for. By default, WebGL 2 will be 
     *   requested. If WebGL2 is not available, it will 
     *   fall back to WebGL 1. You can check what version 
     *   is used with by looking at the global webglVersion 
     *   property.
     *   @param obj object with key-value pairs
     */
    function setAttributes(obj: object): void
}
