// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class Font {
        constructor();

        /**
         *   Returns a flat array of path commands that 
         *   describe the outlines of a string of text. Each 
         *   command is represented as an array of the form 
         *   [type, ...coords], where: 
         * 
         *   - type is one of 'M', 'L', 'Q', 'C', or 'Z',
         *   - coords are the numeric values needed for that 
         *   command.
         * 
         *   'M' indicates a "move to" (starting a new 
         *   contour), 'L' a line segment, 'Q' a quadratic 
         *   bezier, 'C' a cubic bezier, and 'Z' closes the 
         *   current path. 
         * 
         *   The first two parameters, x and y, specify the 
         *   baseline origin for the text. Optionally, you can 
         *   provide a width and height for text wrapping; if 
         *   you don't need wrapping, you can omit them and 
         *   directly pass options as the fourth parameter.
         *   @param str The text to convert into path commands.
         *   @param x x‐coordinate of the text baseline.
         *   @param y y‐coordinate of the text baseline.
         *   @param [width] Optional width for text wrapping.
         *   @param [height] Optional height for text wrapping.
         *   @return A flat array of path commands.
         */
        textToPaths(str: string, x: number, y: number, width?: number, height?: number): any[][]

        /**
         *   Returns an array of points outlining a string of 
         *   text written using the font. Each point object in 
         *   the array has three properties that describe the 
         *   point's location and orientation, called its path 
         *   angle. For example, { x: 10, y: 20, alpha: 450 }. 
         * 
         *   The first parameter, str, is a string of text. The 
         *   second and third parameters, x and y, are the 
         *   text's position. By default, they set the 
         *   coordinates of the bounding box's bottom-left 
         *   corner. See textAlign() for more ways to align 
         *   text. 
         * 
         *   The fourth parameter, options, is also optional. 
         *   font.textToPoints() expects an object with the 
         *   following properties: 
         * 
         *   sampleFactor is the ratio of the text's path 
         *   length to the number of samples. It defaults to 
         *   0.1. Higher values produce more points along the 
         *   path and are more precise. 
         * 
         *   simplifyThreshold removes collinear points if it's 
         *   set to a number other than 0. The value represents 
         *   the threshold angle in radians to use when 
         *   determining whether two edges are collinear.
         *   @param str string of text.
         *   @param x x-coordinate of the text.
         *   @param y y-coordinate of the text.
         *   @param [options] Configuration:
         *   @return array of point objects, each with x, y, 
         *   and alpha (path angle) properties.
         */
        textToPoints(str: string, x: number, y: number, options?: object): object[]

        /**
         *   Returns an array of arrays of points outlining a 
         *   string of text written using the font. Each array 
         *   represents a contour, so the letter O will have 
         *   two outer arrays: one for the outer edge of the 
         *   shape, and one for the inner edge of the hole. 
         *   Each point object in a contour array has three 
         *   properties that describe the point's location and 
         *   orientation, called its path angle. For example, { 
         *   x: 10, y: 20, alpha: 450 }. 
         * 
         *   The first parameter, str, is a string of text. The 
         *   second and third parameters, x and y, are the 
         *   text's position. By default, they set the 
         *   coordinates of the bounding box's bottom-left 
         *   corner. See textAlign() for more ways to align 
         *   text. 
         * 
         *   The fourth parameter, options, is also optional. 
         *   font.textToPoints() expects an object with the 
         *   following properties: 
         * 
         *   sampleFactor is the ratio of the text's path 
         *   length to the number of samples. It defaults to 
         *   0.1. Higher values produce more points along the 
         *   path and are more precise. 
         * 
         *   simplifyThreshold removes collinear points if it's 
         *   set to a number other than 0. The value represents 
         *   the threshold angle in radians to use when 
         *   determining whether two edges are collinear.
         *   @param str string of text.
         *   @param x x-coordinate of the text.
         *   @param y y-coordinate of the text.
         *   @param [options] Configuration options:
         *   @return array of point objects, each with x, y, 
         *   and alpha (path angle) properties.
         */
        textToContours(str: string, x: number, y: number, options?: object): object[][]

        /**
         *   Converts text into a 3D model that can be rendered 
         *   in WebGL mode. This method transforms flat text 
         *   into extruded 3D geometry, allowing for dynamic 
         *   effects like depth, warping, and custom shading. 
         * 
         *   It works by taking the outlines (contours) of each 
         *   character in the provided text string and 
         *   constructing a 3D shape from them. 
         * 
         *   Once your 3D text is ready, you can rotate it in 
         *   3D space using orbitControl() — just click and 
         *   drag with your mouse to see it from all angles! 
         * 
         *   Use the extrude slider to give your letters depth: 
         *   slide it up, and your flat text turns into a 
         *   solid, multi-dimensional object. 
         * 
         *   You can also choose from various fonts such as 
         *   "Anton", "Montserrat", or "Source Serif", much 
         *   like selecting fancy fonts in a word processor, 
         * 
         *   The generated model (a Geometry object) can be 
         *   manipulated further—rotated, scaled, or styled 
         *   with shaders—to create engaging, interactive 
         *   visual art.
         *   @param str The text string to convert into a 3D 
         *   model.
         *   @param x The x-coordinate for the starting 
         *   position of the text.
         *   @param y The y-coordinate for the starting 
         *   position of the text.
         *   @param width Maximum width of the text block 
         *   (wraps text if exceeded).
         *   @param height Maximum height of the text block.
         *   @param [options] Configuration options for the 3D 
         *   text:
         *   @return A geometry object representing the 3D 
         *   model of the text.
         */
        textToModel(str: string, x: number, y: number, width: number, height: number, options?: object): Geometry
    }
    interface p5InstanceExtensions {
        // TODO: Fix loadFont() errors in src/scripts/parsers/in/p5.js/src/type/p5.Font.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Font>
        //
        // loadFont(path: string, name?: string, options?: object, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): undefined

        // TODO: Fix loadFont() errors in src/scripts/parsers/in/p5.js/src/type/p5.Font.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Font>
        //
        // loadFont(path: string, successCallback?: (...args: any[]) => any, failureCallback?: (...args: any[]) => any): undefined

    }
}
