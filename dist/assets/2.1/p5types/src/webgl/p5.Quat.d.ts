// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   Returns a Quaternion for the axis angle 
         *   representation of the rotation
         *   @param [angle] Angle with which the points needs 
         *   to be rotated
         *   @param [x] x component of the axis vector
         *   @param [y] y component of the axis vector
         *   @param [z] z component of the axis vector
         */
        fromAxisAngle(angle?: number, x?: number, y?: number, z?: number): void

        // TODO: Fix mult() errors in src/scripts/parsers/in/p5.js/src/webgl/p5.Quat.js, line undefined:
        //
        //    param "quat" has invalid type: p5.Quat
        //
        // mult(quat?: Quat): void

        // TODO: Fix rotateBy() errors in src/scripts/parsers/in/p5.js/src/webgl/p5.Quat.js, line undefined:
        //
        //    param "axesQuat" has invalid type: p5.Quat
        //
        // rotateBy(axesQuat?: Quat): void

    }
}
