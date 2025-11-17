// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class Vector {
        constructor(x?: number, y?: number, z?: number);

        /**
         *   Retrieves the value at the specified index from 
         *   the vector. This method allows you to get the 
         *   value of a specific component of the vector by 
         *   providing its index. Think of the vector as a list 
         *   of numbers, where each number represents a 
         *   different direction (like x, y, or z). The index 
         *   is just the position of the number in that list. 
         * 
         *   For example, if you have a vector with values 10, 
         *   20, 30 the index 0 would give you the first value 
         *   10, index 1 would give you the second value 20, 
         *   and so on.
         *   @param index The position of the value you want to 
         *   get from the vector.
         *   @return The value at the specified position in the 
         *   vector.
         */
        getValue(index: number): number

        /**
         *   Sets the value at the specified index of the 
         *   vector. This method allows you to change a 
         *   specific component of the vector by providing its 
         *   index and the new value you want to set. Think of 
         *   the vector as a list of numbers, where each number 
         *   represents a different direction (like x, y, or 
         *   z). The index is just the position of the number 
         *   in that list. 
         * 
         *   For example, if you have a vector with values [0, 
         *   20, 30], and you want to change the second value 
         *   (20) to 50, you would use this method with index 1 
         *   (since indexes start at 0) and value 50.
         *   @param index The position in the vector where you 
         *   want to set the new value.
         *   @param value The new value you want to set at the 
         *   specified position.
         */
        setValue(index: number, value: number): void

        /**
         *   Returns a string representation of a vector. 
         *   Calling toString() is useful for printing vectors 
         *   to the console while debugging.
         *   @return string representation of the vector.
         */
        toString(): string

        /**
         *   Sets the vector's x, y, and z components. set() 
         *   can use separate numbers, as in v.set(1, 2, 3), a 
         *   p5.Vector object, as in v.set(v2), or an array of 
         *   numbers, as in v.set([1, 2, 3]). 
         * 
         *   If a value isn't provided for a component, it will 
         *   be set to 0. For example, v.set(4, 5) sets v.x to 
         *   4, v.y to 5, and v.z to 0. Calling set() with no 
         *   arguments, as in v.set(), sets all the vector's 
         *   components to 0.
         *   @param [x] x component of the vector.
         *   @param [y] y component of the vector.
         *   @param [z] z component of the vector.
         */
        set(x?: number, y?: number, z?: number): void

        /**
         *   Sets the vector's x, y, and z components. set() 
         *   can use separate numbers, as in v.set(1, 2, 3), a 
         *   p5.Vector object, as in v.set(v2), or an array of 
         *   numbers, as in v.set([1, 2, 3]). 
         * 
         *   If a value isn't provided for a component, it will 
         *   be set to 0. For example, v.set(4, 5) sets v.x to 
         *   4, v.y to 5, and v.z to 0. Calling set() with no 
         *   arguments, as in v.set(), sets all the vector's 
         *   components to 0.
         *   @param value vector to set.
         */
        set(value: Vector|number[]): void

        /**
         *   Returns a copy of the p5.Vector object.
         *   @return copy of the p5.Vector object.
         */
        copy(): Vector

        /**
         *   Adds to a vector's components. add() can use 
         *   separate numbers, as in v.add(1, 2, 3), another 
         *   p5.Vector object, as in v.add(v2), or an array of 
         *   numbers, as in v.add([1, 2, 3]). 
         * 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.add(4, 5) adds 4 to 
         *   v.x, 5 to v.y, and 0 to v.z. Calling add() with no 
         *   arguments, as in v.add(), has no effect. 
         * 
         *   This method supports N-dimensional vectors. 
         * 
         *   The static version of add(), as in 
         *   p5.Vector.add(v2, v1), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param x x component of the vector to be added or 
         *   an array of components.
         *   @param [y] y component of the vector to be added.
         *   @param [z] z component of the vector to be added.
         */
        add(x: number|any[], y?: number, z?: number): void

        /**
         *   Adds to a vector's components. add() can use 
         *   separate numbers, as in v.add(1, 2, 3), another 
         *   p5.Vector object, as in v.add(v2), or an array of 
         *   numbers, as in v.add([1, 2, 3]). 
         * 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.add(4, 5) adds 4 to 
         *   v.x, 5 to v.y, and 0 to v.z. Calling add() with no 
         *   arguments, as in v.add(), has no effect. 
         * 
         *   This method supports N-dimensional vectors. 
         * 
         *   The static version of add(), as in 
         *   p5.Vector.add(v2, v1), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param value The vector to add
         */
        add(value: Vector|number[]): void

        /**
         *   Performs modulo (remainder) division with a 
         *   vector's x, y, and z components. rem() can use 
         *   separate numbers, as in v.rem(1, 2, 3), another 
         *   p5.Vector object, as in v.rem(v2), or an array of 
         *   numbers, as in v.rem([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.rem(2), 
         *   then all the components will be set to their 
         *   values modulo 2. If two values are provided, as in 
         *   v.rem(2, 3), then v.z won't change. Calling rem() 
         *   with no arguments, as in v.rem(), has no effect. 
         * 
         *   The static version of rem(), as in 
         *   p5.Vector.rem(v2, v1), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param x x component of divisor vector.
         *   @param y y component of divisor vector.
         *   @param z z component of divisor vector.
         */
        rem(x: number, y: number, z: number): void

        /**
         *   Performs modulo (remainder) division with a 
         *   vector's x, y, and z components. rem() can use 
         *   separate numbers, as in v.rem(1, 2, 3), another 
         *   p5.Vector object, as in v.rem(v2), or an array of 
         *   numbers, as in v.rem([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.rem(2), 
         *   then all the components will be set to their 
         *   values modulo 2. If two values are provided, as in 
         *   v.rem(2, 3), then v.z won't change. Calling rem() 
         *   with no arguments, as in v.rem(), has no effect. 
         * 
         *   The static version of rem(), as in 
         *   p5.Vector.rem(v2, v1), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param value divisor vector.
         */
        rem(value: Vector|number[]): void

        /**
         *   Subtracts from a vector's x, y, and z components. 
         *   sub() can use separate numbers, as in v.sub(1, 2, 
         *   3), another p5.Vector object, as in v.sub(v2), or 
         *   an array of numbers, as in v.sub([1, 2, 3]). 
         * 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.sub(4, 5) subtracts 4 
         *   from v.x, 5 from v.y, and 0 from v.z. Calling 
         *   sub() with no arguments, as in v.sub(), has no 
         *   effect. 
         * 
         *   The static version of sub(), as in 
         *   p5.Vector.sub(v2, v1), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param x x component of the vector to subtract.
         *   @param [y] y component of the vector to subtract.
         *   @param [z] z component of the vector to subtract.
         */
        sub(x: number, y?: number, z?: number): void

        /**
         *   Subtracts from a vector's x, y, and z components. 
         *   sub() can use separate numbers, as in v.sub(1, 2, 
         *   3), another p5.Vector object, as in v.sub(v2), or 
         *   an array of numbers, as in v.sub([1, 2, 3]). 
         * 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.sub(4, 5) subtracts 4 
         *   from v.x, 5 from v.y, and 0 from v.z. Calling 
         *   sub() with no arguments, as in v.sub(), has no 
         *   effect. 
         * 
         *   The static version of sub(), as in 
         *   p5.Vector.sub(v2, v1), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param value the vector to subtract
         */
        sub(value: Vector|number[]): void

        /**
         *   Multiplies a vector's x, y, and z components. 
         *   mult() can use separate numbers, as in v.mult(1, 
         *   2, 3), another p5.Vector object, as in v.mult(v2), 
         *   or an array of numbers, as in v.mult([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.mult(2), 
         *   then all the components will be multiplied by 2. 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.mult(4, 5) multiplies 
         *   v.x by, v.y by 5, and v.z by 1. Calling mult() 
         *   with no arguments, as in v.mult(), has no effect. 
         * 
         *   The static version of mult(), as in 
         *   p5.Vector.mult(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param n The number to multiply with the vector
         */
        mult(n: number): void

        /**
         *   Multiplies a vector's x, y, and z components. 
         *   mult() can use separate numbers, as in v.mult(1, 
         *   2, 3), another p5.Vector object, as in v.mult(v2), 
         *   or an array of numbers, as in v.mult([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.mult(2), 
         *   then all the components will be multiplied by 2. 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.mult(4, 5) multiplies 
         *   v.x by, v.y by 5, and v.z by 1. Calling mult() 
         *   with no arguments, as in v.mult(), has no effect. 
         * 
         *   The static version of mult(), as in 
         *   p5.Vector.mult(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param x number to multiply with the x component 
         *   of the vector.
         *   @param y number to multiply with the y component 
         *   of the vector.
         *   @param [z] number to multiply with the z component 
         *   of the vector.
         */
        mult(x: number, y: number, z?: number): void

        /**
         *   Multiplies a vector's x, y, and z components. 
         *   mult() can use separate numbers, as in v.mult(1, 
         *   2, 3), another p5.Vector object, as in v.mult(v2), 
         *   or an array of numbers, as in v.mult([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.mult(2), 
         *   then all the components will be multiplied by 2. 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.mult(4, 5) multiplies 
         *   v.x by, v.y by 5, and v.z by 1. Calling mult() 
         *   with no arguments, as in v.mult(), has no effect. 
         * 
         *   The static version of mult(), as in 
         *   p5.Vector.mult(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param arr array to multiply with the components 
         *   of the vector.
         */
        mult(arr: number[]): void

        /**
         *   Multiplies a vector's x, y, and z components. 
         *   mult() can use separate numbers, as in v.mult(1, 
         *   2, 3), another p5.Vector object, as in v.mult(v2), 
         *   or an array of numbers, as in v.mult([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.mult(2), 
         *   then all the components will be multiplied by 2. 
         *   If a value isn't provided for a component, it 
         *   won't change. For example, v.mult(4, 5) multiplies 
         *   v.x by, v.y by 5, and v.z by 1. Calling mult() 
         *   with no arguments, as in v.mult(), has no effect. 
         * 
         *   The static version of mult(), as in 
         *   p5.Vector.mult(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param v vector to multiply with the components of 
         *   the original vector.
         */
        mult(v: Vector): void

        /**
         *   Divides a vector's x, y, and z components. div() 
         *   can use separate numbers, as in v.div(1, 2, 3), 
         *   another p5.Vector object, as in v.div(v2), or an 
         *   array of numbers, as in v.div([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.div(2), 
         *   then all the components will be divided by 2. If a 
         *   value isn't provided for a component, it won't 
         *   change. For example, v.div(4, 5) divides v.x by, 
         *   v.y by 5, and v.z by 1. Calling div() with no 
         *   arguments, as in v.div(), has no effect. 
         * 
         *   The static version of div(), as in 
         *   p5.Vector.div(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param n The number to divide the vector by
         */
        div(n: number): void

        /**
         *   Divides a vector's x, y, and z components. div() 
         *   can use separate numbers, as in v.div(1, 2, 3), 
         *   another p5.Vector object, as in v.div(v2), or an 
         *   array of numbers, as in v.div([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.div(2), 
         *   then all the components will be divided by 2. If a 
         *   value isn't provided for a component, it won't 
         *   change. For example, v.div(4, 5) divides v.x by, 
         *   v.y by 5, and v.z by 1. Calling div() with no 
         *   arguments, as in v.div(), has no effect. 
         * 
         *   The static version of div(), as in 
         *   p5.Vector.div(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param x number to divide with the x component of 
         *   the vector.
         *   @param y number to divide with the y component of 
         *   the vector.
         *   @param [z] number to divide with the z component 
         *   of the vector.
         */
        div(x: number, y: number, z?: number): void

        /**
         *   Divides a vector's x, y, and z components. div() 
         *   can use separate numbers, as in v.div(1, 2, 3), 
         *   another p5.Vector object, as in v.div(v2), or an 
         *   array of numbers, as in v.div([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.div(2), 
         *   then all the components will be divided by 2. If a 
         *   value isn't provided for a component, it won't 
         *   change. For example, v.div(4, 5) divides v.x by, 
         *   v.y by 5, and v.z by 1. Calling div() with no 
         *   arguments, as in v.div(), has no effect. 
         * 
         *   The static version of div(), as in 
         *   p5.Vector.div(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param arr array to divide the components of the 
         *   vector by.
         */
        div(arr: number[]): void

        /**
         *   Divides a vector's x, y, and z components. div() 
         *   can use separate numbers, as in v.div(1, 2, 3), 
         *   another p5.Vector object, as in v.div(v2), or an 
         *   array of numbers, as in v.div([1, 2, 3]). 
         * 
         *   If only one value is provided, as in v.div(2), 
         *   then all the components will be divided by 2. If a 
         *   value isn't provided for a component, it won't 
         *   change. For example, v.div(4, 5) divides v.x by, 
         *   v.y by 5, and v.z by 1. Calling div() with no 
         *   arguments, as in v.div(), has no effect. 
         * 
         *   The static version of div(), as in 
         *   p5.Vector.div(v, 2), returns a new p5.Vector 
         *   object and doesn't change the originals.
         *   @param v vector to divide the components of the 
         *   original vector by.
         */
        div(v: Vector): void

        /**
         *   Calculates the magnitude (length) of the vector. 
         *   Use mag() to calculate the magnitude of a 2D 
         *   vector using components as in mag(x, y).
         *   @return magnitude of the vector.
         */
        mag(): number

        /**
         *   Calculates the magnitude (length) of the vector 
         *   squared.
         *   @return squared magnitude of the vector.
         */
        magSq(): number

        /**
         *   Calculates the dot product of two vectors. The dot 
         *   product is a number that describes the overlap 
         *   between two vectors. Visually, the dot product can 
         *   be thought of as the "shadow" one vector casts on 
         *   another. The dot product's magnitude is largest 
         *   when two vectors point in the same or opposite 
         *   directions. Its magnitude is 0 when two vectors 
         *   form a right angle. 
         * 
         *   The version of dot() with one parameter interprets 
         *   it as another p5.Vector object. 
         * 
         *   The version of dot() with multiple parameters 
         *   interprets them as the x, y, and z components of 
         *   another vector. 
         * 
         *   The static version of dot(), as in 
         *   p5.Vector.dot(v1, v2), is the same as calling 
         *   v1.dot(v2).
         *   @param x x component of the vector.
         *   @param [y] y component of the vector.
         *   @param [z] z component of the vector.
         *   @return dot product.
         */
        dot(x: number, y?: number, z?: number): number

        /**
         *   Calculates the dot product of two vectors. The dot 
         *   product is a number that describes the overlap 
         *   between two vectors. Visually, the dot product can 
         *   be thought of as the "shadow" one vector casts on 
         *   another. The dot product's magnitude is largest 
         *   when two vectors point in the same or opposite 
         *   directions. Its magnitude is 0 when two vectors 
         *   form a right angle. 
         * 
         *   The version of dot() with one parameter interprets 
         *   it as another p5.Vector object. 
         * 
         *   The version of dot() with multiple parameters 
         *   interprets them as the x, y, and z components of 
         *   another vector. 
         * 
         *   The static version of dot(), as in 
         *   p5.Vector.dot(v1, v2), is the same as calling 
         *   v1.dot(v2).
         *   @param v p5.Vector to be dotted.
         */
        dot(v: Vector): number

        /**
         *   Calculates the cross product of two vectors. The 
         *   cross product is a vector that points straight out 
         *   of the plane created by two vectors. The cross 
         *   product's magnitude is the area of the 
         *   parallelogram formed by the original two vectors. 
         * 
         *   The static version of cross(), as in 
         *   p5.Vector.cross(v1, v2), is the same as calling 
         *   v1.cross(v2).
         *   @param v p5.Vector to be crossed.
         *   @return cross product as a p5.Vector.
         */
        cross(v: Vector): Vector

        /**
         *   Calculates the distance between two points 
         *   represented by vectors. A point's coordinates can 
         *   be represented by the components of a vector that 
         *   extends from the origin to the point. 
         * 
         *   The static version of dist(), as in 
         *   p5.Vector.dist(v1, v2), is the same as calling 
         *   v1.dist(v2). 
         * 
         *   Use dist() to calculate the distance between 
         *   points using coordinates as in dist(x1, y1, x2, 
         *   y2).
         *   @param v x, y, and z coordinates of a p5.Vector.
         *   @return distance.
         */
        dist(v: Vector): number

        /**
         *   Scales the components of a p5.Vector object so 
         *   that its magnitude is 1. The static version of 
         *   normalize(), as in p5.Vector.normalize(v), returns 
         *   a new p5.Vector object and doesn't change the 
         *   original.
         *   @return normalized p5.Vector.
         */
        normalize(): Vector

        /**
         *   Limits a vector's magnitude to a maximum value. 
         *   The static version of limit(), as in 
         *   p5.Vector.limit(v, 5), returns a new p5.Vector 
         *   object and doesn't change the original.
         *   @param max maximum magnitude for the vector.
         */
        limit(max: number): void

        /**
         *   Sets a vector's magnitude to a given value. The 
         *   static version of setMag(), as in 
         *   p5.Vector.setMag(v, 10), returns a new p5.Vector 
         *   object and doesn't change the original.
         *   @param len new length for this vector.
         */
        setMag(len: number): void

        /**
         *   Calculates the angle a 2D vector makes with the 
         *   positive x-axis. By convention, the positive 
         *   x-axis has an angle of 0. Angles increase in the 
         *   clockwise direction. 
         * 
         *   If the vector was created with createVector(), 
         *   heading() returns angles in the units of the 
         *   current angleMode(). 
         * 
         *   The static version of heading(), as in 
         *   p5.Vector.heading(v), works the same way.
         *   @return angle of rotation.
         */
        heading(): number

        /**
         *   Rotates a 2D vector to a specific angle without 
         *   changing its magnitude. By convention, the 
         *   positive x-axis has an angle of 0. Angles increase 
         *   in the clockwise direction. 
         * 
         *   If the vector was created with createVector(), 
         *   setHeading() uses the units of the current 
         *   angleMode().
         *   @param angle angle of rotation.
         */
        setHeading(angle: number): void

        /**
         *   Rotates a 2D vector by an angle without changing 
         *   its magnitude. By convention, the positive x-axis 
         *   has an angle of 0. Angles increase in the 
         *   clockwise direction. 
         * 
         *   If the vector was created with createVector(), 
         *   rotate() uses the units of the current 
         *   angleMode(). 
         * 
         *   The static version of rotate(), as in 
         *   p5.Vector.rotate(v, PI), returns a new p5.Vector 
         *   object and doesn't change the original.
         *   @param angle angle of rotation.
         */
        rotate(angle: number): void

        /**
         *   Calculates the angle between two vectors. The 
         *   angles returned are signed, which means that 
         *   v1.angleBetween(v2) === -v2.angleBetween(v1). 
         * 
         *   If the vector was created with createVector(), 
         *   angleBetween() returns angles in the units of the 
         *   current angleMode().
         *   @param value x, y, and z components of a 
         *   p5.Vector.
         *   @return angle between the vectors.
         */
        angleBetween(value: Vector): number

        /**
         *   Calculates new x, y, and z components that are 
         *   proportionally the same distance between two 
         *   vectors. The amt parameter is the amount to 
         *   interpolate between the old vector and the new 
         *   vector. 0.0 keeps all components equal to the old 
         *   vector's, 0.5 is halfway between, and 1.0 sets all 
         *   components equal to the new vector's. 
         * 
         *   The static version of lerp(), as in 
         *   p5.Vector.lerp(v0, v1, 0.5), returns a new 
         *   p5.Vector object and doesn't change the original.
         *   @param x x component.
         *   @param y y component.
         *   @param z z component.
         *   @param amt amount of interpolation between 0.0 
         *   (old vector) and 1.0 (new vector). 0.5 is halfway 
         *   between.
         */
        lerp(x: number, y: number, z: number, amt: number): void

        /**
         *   Calculates new x, y, and z components that are 
         *   proportionally the same distance between two 
         *   vectors. The amt parameter is the amount to 
         *   interpolate between the old vector and the new 
         *   vector. 0.0 keeps all components equal to the old 
         *   vector's, 0.5 is halfway between, and 1.0 sets all 
         *   components equal to the new vector's. 
         * 
         *   The static version of lerp(), as in 
         *   p5.Vector.lerp(v0, v1, 0.5), returns a new 
         *   p5.Vector object and doesn't change the original.
         *   @param v p5.Vector to lerp toward.
         *   @param amt amount of interpolation between 0.0 
         *   (old vector) and 1.0 (new vector). 0.5 is halfway 
         *   between.
         */
        lerp(v: Vector, amt: number): void

        /**
         *   Calculates a new heading and magnitude that are 
         *   between two vectors. The amt parameter is the 
         *   amount to interpolate between the old vector and 
         *   the new vector. 0.0 keeps the heading and 
         *   magnitude equal to the old vector's, 0.5 sets them 
         *   halfway between, and 1.0 sets the heading and 
         *   magnitude equal to the new vector's. 
         * 
         *   slerp() differs from lerp() because it 
         *   interpolates magnitude. Calling v0.slerp(v1, 0.5) 
         *   sets v0's magnitude to a value halfway between its 
         *   original magnitude and v1's. Calling v0.lerp(v1, 
         *   0.5) makes no such guarantee. 
         * 
         *   The static version of slerp(), as in 
         *   p5.Vector.slerp(v0, v1, 0.5), returns a new 
         *   p5.Vector object and doesn't change the original.
         *   @param v p5.Vector to slerp toward.
         *   @param amt amount of interpolation between 0.0 
         *   (old vector) and 1.0 (new vector). 0.5 is halfway 
         *   between.
         */
        slerp(v: Vector, amt: number): Vector

        /**
         *   Reflects a vector about a line in 2D or a plane in 
         *   3D. The orientation of the line or plane is 
         *   described by a normal vector that points away from 
         *   the shape. 
         * 
         *   The static version of reflect(), as in 
         *   p5.Vector.reflect(v, n), returns a new p5.Vector 
         *   object and doesn't change the original.
         *   @param surfaceNormal p5.Vector to reflect about.
         */
        reflect(surfaceNormal: Vector): void

        /**
         *   Returns the vector's components as an array of 
         *   numbers.
         *   @return array with the vector's components.
         */
        array(): number[]

        /**
         *   Checks whether all the vector's components are 
         *   equal to another vector's. equals() returns true 
         *   if the vector's components are all the same as 
         *   another vector's and false if not. 
         * 
         *   The version of equals() with one parameter 
         *   interprets it as another p5.Vector object. 
         * 
         *   The version of equals() with multiple parameters 
         *   interprets them as the components of another 
         *   vector. Any missing parameters are assigned the 
         *   value 0. 
         * 
         *   The static version of equals(), as in 
         *   p5.Vector.equals(v0, v1), interprets both 
         *   parameters as p5.Vector objects.
         *   @param [x] x component of the vector.
         *   @param [y] y component of the vector.
         *   @param [z] z component of the vector.
         *   @return whether the vectors are equal.
         */
        equals(x?: number, y?: number, z?: number): boolean

        /**
         *   Checks whether all the vector's components are 
         *   equal to another vector's. equals() returns true 
         *   if the vector's components are all the same as 
         *   another vector's and false if not. 
         * 
         *   The version of equals() with one parameter 
         *   interprets it as another p5.Vector object. 
         * 
         *   The version of equals() with multiple parameters 
         *   interprets them as the components of another 
         *   vector. Any missing parameters are assigned the 
         *   value 0. 
         * 
         *   The static version of equals(), as in 
         *   p5.Vector.equals(v0, v1), interprets both 
         *   parameters as p5.Vector objects.
         *   @param value vector to compare.
         */
        equals(value: Vector|any[]): boolean

        /**
         *   Replaces the components of a p5.Vector that are 
         *   very close to zero with zero. In computers, 
         *   handling numbers with decimals can give slightly 
         *   imprecise answers due to the way those numbers are 
         *   represented. This can make it hard to check if a 
         *   number is zero, as it may be close but not exactly 
         *   zero. This method rounds very close numbers to 
         *   zero to make those checks easier 
         * 
         *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
         *   @return with components very close to zero 
         *   replaced with zero.
         */
        clampToZero(): Vector

        /**
         *   Creates a new 2D vector from an angle.
         *   @param angle desired angle, in radians. Unaffected 
         *   by angleMode().
         *   @param [length] length of the new vector (defaults 
         *   to 1).
         *   @return new p5.Vector object.
         */
        fromAngle(angle: number, length?: number): Vector

        /**
         *   Creates a new 3D vector from a pair of ISO 
         *   spherical angles.
         *   @param theta polar angle in radians (zero is up).
         *   @param phi azimuthal angle in radians (zero is out 
         *   of the screen).
         *   @param [length] length of the new vector (defaults 
         *   to 1).
         *   @return new p5.Vector object.
         */
        fromAngles(theta: number, phi: number, length?: number): Vector

        /**
         *   Creates a new 2D unit vector with a random 
         *   heading.
         *   @return new p5.Vector object.
         */
        random2D(): Vector

        /**
         *   Creates a new 3D unit vector with a random 
         *   heading.
         *   @return new p5.Vector object.
         */
        random3D(): Vector

        /**
         *   The x component of the vector
         */
        x: number

        /**
         *   The y component of the vector
         */
        y: number

        /**
         *   The z component of the vector
         */
        z: number
    }
}
