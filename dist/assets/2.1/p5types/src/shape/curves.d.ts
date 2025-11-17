// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
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
        bezier(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): void

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
        bezier(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number): void

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
        bezierPoint(a: number, b: number, c: number, d: number, t: number): number

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
        bezierTangent(a: number, b: number, c: number, d: number, t: number): number

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
        spline(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): void

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
        spline(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number): void

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
        splinePoint(a: number, b: number, c: number, d: number, t: number): number

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
        splineTangent(a: number, b: number, c: number, d: number, t: number): number
    }
}
