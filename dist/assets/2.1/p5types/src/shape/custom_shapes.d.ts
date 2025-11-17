// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
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
        bezierOrder(order: number): void

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
        bezierOrder(): number

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
        splineVertex(x: number, y: number): void

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
        splineVertex(x: number, y: number, z?: number): void

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
        splineVertex(x: number, y: number, u?: number, v?: number): void

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
        splineVertex(x: number, y: number, z: number, u?: number, v?: number): void

        // TODO: Fix splineProperty() errors in src/scripts/parsers/in/p5.js/src/shape/custom_shapes.js, line undefined:
        //
        //    param "value" has invalid type: undefined
        //
        // splineProperty(property: string, value: ): void

        // TODO: Fix splineProperty() errors in src/scripts/parsers/in/p5.js/src/shape/custom_shapes.js, line undefined:
        //
        //    return has invalid type: undefined
        //
        // splineProperty(property: string): undefined

        /**
         *   Get or set multiple spline properties at once. 
         *   Similar to splineProperty(): 
         *   splineProperty('tightness', t) is the same as 
         *   splineProperties({'tightness': t})
         *   @param properties An object containing key-value 
         *   pairs to set.
         */
        splineProperties(properties: object): void

        /**
         *   Get or set multiple spline properties at once. 
         *   Similar to splineProperty(): 
         *   splineProperty('tightness', t) is the same as 
         *   splineProperties({'tightness': t})
         *   @return The current spline properties.
         */
        splineProperties(): object

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
        vertex(x: number, y: number): void

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
        vertex(x: number, y: number, u?: number, v?: number): void

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
        vertex(x: number, y: number, z: number, u?: number, v?: number): void

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
        beginContour(): void

        // TODO: Fix endContour() errors in src/scripts/parsers/in/p5.js/src/shape/custom_shapes.js, line undefined:
        //
        //    param "mode" has invalid type: OPEN|CLOSE
        //
        // endContour(mode?: OPEN|CLOSE): void

    }
}
