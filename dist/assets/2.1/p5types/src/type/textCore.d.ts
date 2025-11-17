// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
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
        text(str: string|object|any[]|number|boolean, x: number, y: number, maxWidth?: number, maxHeight?: number): void

        // TODO: Fix textAlign() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    param "horizAlign" has invalid type: LEFT|CENTER|RIGHT
        //    param "vertAlign" has invalid type: TOP|BOTTOM|CENTER|BASELINE
        //
        // textAlign(horizAlign?: LEFT|CENTER|RIGHT, vertAlign?: TOP|BOTTOM|CENTER|BASELINE): object

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
        textAscent(txt?: string): number

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
        textDescent(txt?: string): number

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
        textLeading(leading?: number): number

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
        textFont(font?: Font|string|object, size?: number): string|Font

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
        textSize(size: number): number

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
        textSize(): number

        // TODO: Fix textStyle() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    param "style" has invalid type: NORMAL|ITALIC|BOLD|BOLDITALIC
        //    return has invalid type: NORMAL|ITALIC|BOLD|BOLDITALIC
        //
        // textStyle(style: NORMAL|ITALIC|BOLD|BOLDITALIC): undefined

        // TODO: Fix textStyle() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    return has invalid type: NORMAL|BOLD|ITALIC|BOLDITALIC
        //
        // textStyle(): undefined

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
        textWidth(text: string): number

        // TODO: Fix textWrap() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    param "style" has invalid type: WORD|CHAR
        //    return has invalid type: CHAR|WORD
        //
        // textWrap(style: WORD|CHAR): undefined

        // TODO: Fix textWrap() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    return has invalid type: CHAR|WORD
        //
        // textWrap(): undefined

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
        textBounds(str: string, x: number, y: number, width?: number, height?: number): object

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
        textDirection(direction: string): string

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
        textDirection(): string

        // TODO: Fix textProperty() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    param "value" has invalid type: undefined
        //    return has invalid type: undefined
        //
        // textProperty(prop: string, value: ): undefined

        // TODO: Fix textProperty() errors in src/scripts/parsers/in/p5.js/src/type/textCore.js, line undefined:
        //
        //    return has invalid type: undefined
        //
        // textProperty(prop: string): undefined

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
        textProperties(properties: object): void

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
        textProperties(): object

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
        fontBounds(str: string, x: number, y: number, width?: number, height?: number): object

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
        fontWidth(theText: string): number

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
        fontAscent(): number

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
        fontDescent(): number

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
        textWeight(weight: number): number

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
        textWeight(): number
    }
}
