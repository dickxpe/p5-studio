// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        // TODO: Fix loadModel() errors in src/scripts/parsers/in/p5.js/src/webgl/loading.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Geometry>
        //
        // loadModel(path: string, fileType?: string, normalize?: boolean, successCallback?: (p1: Geometry) => any, failureCallback?: (p1: Event) => any): undefined

        // TODO: Fix loadModel() errors in src/scripts/parsers/in/p5.js/src/webgl/loading.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Geometry>
        //
        // loadModel(path: string, fileType?: string, successCallback?: (p1: Geometry) => any, failureCallback?: (p1: Event) => any): undefined

        // TODO: Fix loadModel() errors in src/scripts/parsers/in/p5.js/src/webgl/loading.js, line undefined:
        //
        //    return has invalid type: Promise<p5.Geometry>
        //
        // loadModel(path: string, options?: object): undefined

        /**
         *   Draws a p5.Geometry object to the canvas. The 
         *   parameter, model, is the p5.Geometry object to 
         *   draw. p5.Geometry objects can be built with 
         *   buildGeometry(), or beginGeometry() and 
         *   endGeometry(). They can also be loaded from a file 
         *   with loadGeometry(). 
         * 
         *   Note: model() can only be used in WebGL mode.
         *   @param model 3D shape to be drawn.
         *   @param [count] number of instances to draw.
         */
        model(model: Geometry, count?: number): void

        /**
         *   Load a 3d model from an OBJ or STL string. OBJ and 
         *   STL files lack a built-in sense of scale, causing 
         *   models exported from different programs to vary in 
         *   size. If your model doesn't display correctly, 
         *   consider using loadModel() with normalize set to 
         *   true to standardize its size. Further adjustments 
         *   can be made using the scale() function. 
         * 
         *   Also, the support for colored STL files is not 
         *   present. STL files with color will be rendered 
         *   without color properties. 
         * 
         *   - Options can include:
         * 
         *   - modelString: Specifies the plain text string of 
         *   either an stl or obj file to be loaded.
         *   - fileType: Defines the file extension of the 
         *   model.
         *   - normalize: Enables standardized size scaling 
         *   during loading if set to true.
         *   - successCallback: Callback for post-loading 
         *   actions with the 3D model object.
         *   - failureCallback: Handles errors if model loading 
         *   fails, receiving an event error.
         *   - flipU: Flips the U texture coordinates of the 
         *   model.
         *   - flipV: Flips the V texture coordinates of the 
         *   model.
         *   @param modelString String of the object to be 
         *   loaded
         *   @param [fileType] The file extension of the model 
         *   (.stl, .obj).
         *   @param [normalize] If true, scale the model to a 
         *   standardized size when loading
         *   @param [successCallback] Function to be called 
         *   once the model is loaded. Will be passed the 3D 
         *   model object.
         *   @param [failureCallback] called with event error 
         *   if the model fails to load.
         *   @return the p5.Geometry object
         */
        createModel(modelString: string, fileType?: string, normalize?: boolean, successCallback?: (p1: Geometry) => any, failureCallback?: (p1: Event) => any): Geometry

        /**
         *   Load a 3d model from an OBJ or STL string. OBJ and 
         *   STL files lack a built-in sense of scale, causing 
         *   models exported from different programs to vary in 
         *   size. If your model doesn't display correctly, 
         *   consider using loadModel() with normalize set to 
         *   true to standardize its size. Further adjustments 
         *   can be made using the scale() function. 
         * 
         *   Also, the support for colored STL files is not 
         *   present. STL files with color will be rendered 
         *   without color properties. 
         * 
         *   - Options can include:
         * 
         *   - modelString: Specifies the plain text string of 
         *   either an stl or obj file to be loaded.
         *   - fileType: Defines the file extension of the 
         *   model.
         *   - normalize: Enables standardized size scaling 
         *   during loading if set to true.
         *   - successCallback: Callback for post-loading 
         *   actions with the 3D model object.
         *   - failureCallback: Handles errors if model loading 
         *   fails, receiving an event error.
         *   - flipU: Flips the U texture coordinates of the 
         *   model.
         *   - flipV: Flips the V texture coordinates of the 
         *   model.
         *   @param modelString String of the object to be 
         *   loaded
         *   @param [fileType] The file extension of the model 
         *   (.stl, .obj).
         *   @param [successCallback] Function to be called 
         *   once the model is loaded. Will be passed the 3D 
         *   model object.
         *   @param [failureCallback] called with event error 
         *   if the model fails to load.
         *   @return the p5.Geometry object
         */
        createModel(modelString: string, fileType?: string, successCallback?: (p1: Geometry) => any, failureCallback?: (p1: Event) => any): Geometry

        /**
         *   Load a 3d model from an OBJ or STL string. OBJ and 
         *   STL files lack a built-in sense of scale, causing 
         *   models exported from different programs to vary in 
         *   size. If your model doesn't display correctly, 
         *   consider using loadModel() with normalize set to 
         *   true to standardize its size. Further adjustments 
         *   can be made using the scale() function. 
         * 
         *   Also, the support for colored STL files is not 
         *   present. STL files with color will be rendered 
         *   without color properties. 
         * 
         *   - Options can include:
         * 
         *   - modelString: Specifies the plain text string of 
         *   either an stl or obj file to be loaded.
         *   - fileType: Defines the file extension of the 
         *   model.
         *   - normalize: Enables standardized size scaling 
         *   during loading if set to true.
         *   - successCallback: Callback for post-loading 
         *   actions with the 3D model object.
         *   - failureCallback: Handles errors if model loading 
         *   fails, receiving an event error.
         *   - flipU: Flips the U texture coordinates of the 
         *   model.
         *   - flipV: Flips the V texture coordinates of the 
         *   model.
         *   @param modelString String of the object to be 
         *   loaded
         *   @param [fileType] The file extension of the model 
         *   (.stl, .obj).
         *   @return the p5.Geometry object
         */
        createModel(modelString: string, fileType?: string, options?: object): Geometry
    }
}
