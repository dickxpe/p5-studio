// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   Version of this p5.js.
         */
        VERSION: string

        /**
         *   The default, two-dimensional renderer in p5.js. 
         *   Use this when calling  (for example, 
         *   createCanvas(400, 400, P2D)) to specify a 2D 
         *   context.
         */
        P2D: any

        /**
         *   A high-dynamic-range (HDR) variant of the default, 
         *   two-dimensional renderer. When available, this 
         *   mode can allow for extended color ranges and more 
         *   dynamic color representation. Use it similarly to 
         *   P2D: createCanvas(400, 400, P2DHDR).
         */
        P2DHDR: any

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
        WEBGL: any

        /**
         *   One of the two possible values of a WebGL canvas 
         *   (either WEBGL or WEBGL2), which can be used to 
         *   determine what capabilities the rendering 
         *   environment has.
         */
        WEBGL2: any
        ARROW: any
        SIMPLE: string
        FULL: string
        CROSS: any
        HAND: any
        MOVE: any
        TEXT: any
        WAIT: any

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
        HALF_PI: number

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
        PI: number

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
        QUARTER_PI: number

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
        TAU: number

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
        TWO_PI: number
        DEG_TO_RAD: number
        RAD_TO_DEG: number
        CORNER: any
        CORNERS: any
        RADIUS: any
        RIGHT: any
        LEFT: any
        CENTER: any
        TOP: any
        BOTTOM: any
        BASELINE: any
        POINTS: any
        LINES: any
        LINE_STRIP: any
        LINE_LOOP: any
        TRIANGLES: any
        TRIANGLE_FAN: any
        TRIANGLE_STRIP: any
        QUADS: any
        QUAD_STRIP: any
        TESS: any
        EMPTY_PATH: any
        PATH: any
        CLOSE: any
        OPEN: any
        CHORD: any
        PIE: any
        PROJECT: any
        SQUARE: any
        ROUND: any
        BEVEL: any
        MITER: any

        /**
         *   AUTO allows us to automatically set the width or 
         *   height of an element (but not both), based on the 
         *   current height and width of the element. Only one 
         *   parameter can be passed to the size function as 
         *   AUTO, at a time.
         */
        AUTO: any
        ALT: any
        BACKSPACE: any
        CONTROL: any
        DELETE: any
        DOWN_ARROW: any
        ENTER: any
        ESCAPE: any
        LEFT_ARROW: any
        OPTION: any
        RETURN: any
        RIGHT_ARROW: any
        SHIFT: any
        TAB: any
        UP_ARROW: any
        BLEND: any
        REMOVE: any
        ADD: any
        DARKEST: any
        LIGHTEST: any
        DIFFERENCE: any
        SUBTRACT: any
        EXCLUSION: any
        MULTIPLY: any
        SCREEN: any
        REPLACE: any
        OVERLAY: any
        HARD_LIGHT: any
        SOFT_LIGHT: any
        DODGE: any
        BURN: any
        THRESHOLD: any
        GRAY: any
        OPAQUE: any
        INVERT: any
        POSTERIZE: any
        DILATE: any
        ERODE: any
        BLUR: any
        NORMAL: any
        ITALIC: any
        BOLD: any
        BOLDITALIC: any
        CHAR: any
        WORD: any
        LINEAR: any
        QUADRATIC: any
        BEZIER: any
        CURVE: any
        STROKE: any
        FILL: any
        TEXTURE: any
        IMMEDIATE: any
        IMAGE: any
        NEAREST: any
        REPEAT: any
        CLAMP: any
        MIRROR: any
        FLAT: any
        SMOOTH: any
        LANDSCAPE: any
        PORTRAIT: any
        GRID: any
        AXES: any
        LABEL: any
        FALLBACK: any
        CONTAIN: any
        COVER: any
        UNSIGNED_BYTE: any
        UNSIGNED_INT: any
        FLOAT: any
        HALF_FLOAT: any

        /**
         *   The splineProperty('ends') mode where splines 
         *   curve through their first and last points.
         */
        INCLUDE: any

        /**
         *   The splineProperty('ends') mode where the first 
         *   and last points in a spline affect the direction 
         *   of the curve, but are not rendered.
         */
        EXCLUDE: any
    }
}
