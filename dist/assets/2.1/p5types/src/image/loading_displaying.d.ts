// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        // TODO: Fix loadImage() errors in src/scripts/parsers/in/p5.js/src/image/loading_displaying.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Image>
        //
        // loadImage(path: string, successCallback?: (p1: Image) => any, failureCallback?: (p1: Event) => any): undefined

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
        saveGif(filename: string, duration: number, options?: object): void

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
        image(img: Image|Element|Framebuffer|Graphics, x: number, y: number, width?: number, height?: number): void

        // TODO: Fix image() errors in src/scripts/parsers/in/p5.js/src/image/loading_displaying.js, line undefined:
        //
        //    param "fit" has invalid type: CONTAIN|COVER
        //    param "xAlign" has invalid type: LEFT|RIGHT|CENTER
        //    param "yAlign" has invalid type: TOP|BOTTOM|CENTER
        //
        // image(img: Image|Element|Framebuffer, dx: number, dy: number, dWidth: number, dHeight: number, sx: number, sy: number, sWidth?: number, sHeight?: number, fit?: CONTAIN|COVER, xAlign?: LEFT|RIGHT|CENTER, yAlign?: TOP|BOTTOM|CENTER): void

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
        tint(v1: number, v2: number, v3: number, alpha?: number): void

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
        tint(value: string): void

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
        tint(gray: number, alpha?: number): void

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
        tint(values: number[]): void

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
        tint(color: Color): void

        /**
         *   Removes the current tint set by tint(). noTint() 
         *   restores images to their original colors.
         */
        noTint(): void

        // TODO: Fix imageMode() errors in src/scripts/parsers/in/p5.js/src/image/loading_displaying.js, line undefined:
        //
        //    param "mode" has invalid type: CORNER|CORNERS|CENTER
        //
        // imageMode(mode: CORNER|CORNERS|CENTER): void

    }
}
