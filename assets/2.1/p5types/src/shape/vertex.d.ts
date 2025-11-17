// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        // TODO: Fix beginShape() errors in src/scripts/parsers/in/p5.js/src/shape/vertex.js, line undefined:
        //
        //    param "kind" has invalid type: POINTS|LINES|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|PATH
        //
        // beginShape(kind?: POINTS|LINES|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|PATH): void

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
        bezierVertex(x: number, y: number, u?: number, v?: number): void

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
        bezierVertex(x: number, y: number, z: number, u?: number, v?: number): void

        // TODO: Fix endShape() errors in src/scripts/parsers/in/p5.js/src/shape/vertex.js, line undefined:
        //
        //    param "mode" has invalid type: CLOSE
        //
        // endShape(mode?: CLOSE, count?: number): void

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
        normal(vector: Vector): void

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
        normal(x: number, y: number, z: number): void

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
        vertexProperty(attributeName: string, data: number|number[]): void
    }
}
