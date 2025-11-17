// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        // TODO: Fix blend() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
        //
        //    param "blendMode" has invalid type: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL
        //
        // blend(srcImage: Image, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, blendMode: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL): void

        // TODO: Fix blend() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
        //
        //    param "blendMode" has invalid type: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL
        //
        // blend(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, blendMode: BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL): void

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
        copy(srcImage: Image|Element, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

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
        copy(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

        // TODO: Fix filter() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
        //
        //    param "filterType" has invalid type: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR
        //
        // filter(filterType: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR, filterParam?: number, useWebGL?: boolean): void

        // TODO: Fix filter() errors in src/scripts/parsers/in/p5.js/src/image/pixels.js, line undefined:
        //
        //    param "filterType" has invalid type: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR
        //
        // filter(filterType: THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR, filterParam?: number, useWebGL?: boolean): void

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
        filter(shaderFilter: Shader): void

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
        get(x: number, y: number, w: number, h: number): Image

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
        get(): Image

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
        get(x: number, y: number): number[]

        /**
         *   Loads the current value of each pixel on the 
         *   canvas into the pixels array. loadPixels() must be 
         *   called before reading from or writing to pixels.
         */
        loadPixels(): void

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
        set(x: number, y: number, c: number|number[]|object): void

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
        pixels: number[]
    }
}
