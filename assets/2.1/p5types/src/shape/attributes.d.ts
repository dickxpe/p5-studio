// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        // TODO: Fix ellipseMode() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
        //
        //    param "mode" has invalid type: CENTER|RADIUS|CORNER|CORNERS
        //
        // ellipseMode(mode: CENTER|RADIUS|CORNER|CORNERS): void

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
        noSmooth(): void

        // TODO: Fix rectMode() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
        //
        //    param "mode" has invalid type: CENTER|RADIUS|CORNER|CORNERS
        //
        // rectMode(mode: CENTER|RADIUS|CORNER|CORNERS): void

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
        smooth(): void

        // TODO: Fix strokeCap() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
        //
        //    param "cap" has invalid type: ROUND|SQUARE|PROJECT
        //
        // strokeCap(cap: ROUND|SQUARE|PROJECT): void

        // TODO: Fix strokeJoin() errors in src/scripts/parsers/in/p5.js/src/shape/attributes.js, line undefined:
        //
        //    param "join" has invalid type: MITER|BEVEL|ROUND
        //
        // strokeJoin(join: MITER|BEVEL|ROUND): void

        /**
         *   Sets the width of the stroke used for points, 
         *   lines, and the outlines of shapes. Note: 
         *   strokeWeight() is affected by transformations, 
         *   especially calls to scale().
         *   @param weight the weight of the stroke (in 
         *   pixels).
         */
        strokeWeight(weight: number): void
    }
}
