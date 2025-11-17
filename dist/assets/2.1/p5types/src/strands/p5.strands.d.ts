// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   Registers a callback to modify the world-space 
         *   properties of each vertex in a shader. This hook 
         *   can be used inside baseColorShader().modify() and 
         *   similar shader modify() calls to customize vertex 
         *   positions, normals, texture coordinates, and 
         *   colors before rendering. "World space" refers to 
         *   the coordinate system of the 3D scene, before any 
         *   camera or projection transformations are applied. 
         *   The callback receives a vertex object with the 
         *   following properties: 
         * 
         *   - position: a three-component vector representing 
         *   the original position of the vertex.
         *   - normal: a three-component vector representing 
         *   the direction the surface is facing.
         *   - texCoord: a two-component vector representing 
         *   the texture coordinates.
         *   - color: a four-component vector representing the 
         *   color of the vertex (red, green, blue, alpha).
         * 
         *   This hook is available in: 
         * 
         *   - baseMaterialShader()
         *   - baseNormalShader()
         *   - baseColorShader()
         *   - baseStrokeShader()
         *   @param callback A callback function which receives 
         *   a vertex object containing position (vec3), normal 
         *   (vec3), texCoord (vec2), and color (vec4) 
         *   properties. The function should return the 
         *   modified vertex object.
         */
        getWorldInputs(callback: (...args: any[]) => any): void

        /**
         *   Registers a callback to customize how color 
         *   components are combined in the fragment shader. 
         *   This hook can be used inside 
         *   baseMaterialShader().modify() and similar shader 
         *   modify() calls to control the final color output 
         *   of a material. The callback receives an object 
         *   with the following properties: - baseColor: a 
         *   three-component vector representing the base color 
         *   (red, green, blue).
         *   - diffuse: a single number representing the 
         *   diffuse reflection.
         *   - ambientColor: a three-component vector 
         *   representing the ambient color.
         *   - ambient: a single number representing the 
         *   ambient reflection.
         *   - specularColor: a three-component vector 
         *   representing the specular color.
         *   - specular: a single number representing the 
         *   specular reflection.
         *   - emissive: a three-component vector representing 
         *   the emissive color.
         *   - opacity: a single number representing the 
         *   opacity.
         * 
         *   The callback should return a vector with four 
         *   components (red, green, blue, alpha) for the final 
         *   color. 
         * 
         *   This hook is available in: 
         * 
         *   - baseMaterialShader()
         *   @param callback A callback function which receives 
         *   the object described above and returns a vector 
         *   with four components for the final color.
         */
        combineColors(callback: (...args: any[]) => any): void

        /**
         *   Registers a callback to modify the properties of 
         *   each fragment (pixel) before the final color is 
         *   calculated in the fragment shader. This hook can 
         *   be used inside baseMaterialShader().modify() and 
         *   similar shader modify() calls to adjust per-pixel 
         *   data before lighting/mixing. The callback receives 
         *   an Inputs object. Available fields depend on the 
         *   shader: 
         * 
         *   - In baseMaterialShader(): normal: a 
         *   three-component vector representing the surface 
         *   normal.texCoord: a two-component vector 
         *   representing the texture coordinates (u, 
         *   v).ambientLight: a three-component vector 
         *   representing the ambient light 
         *   color.ambientMaterial: a three-component vector 
         *   representing the material's ambient 
         *   color.specularMaterial: a three-component vector 
         *   representing the material's specular 
         *   color.emissiveMaterial: a three-component vector 
         *   representing the material's emissive color.color: 
         *   a four-component vector representing the base 
         *   color (red, green, blue, alpha).shininess: a 
         *   number controlling specular highlights.metalness: 
         *   a number controlling the metalness factor.
         *   - normal: a three-component vector representing 
         *   the surface normal.
         *   - texCoord: a two-component vector representing 
         *   the texture coordinates (u, v).
         *   - ambientLight: a three-component vector 
         *   representing the ambient light color.
         *   - ambientMaterial: a three-component vector 
         *   representing the material's ambient color.
         *   - specularMaterial: a three-component vector 
         *   representing the material's specular color.
         *   - emissiveMaterial: a three-component vector 
         *   representing the material's emissive color.
         *   - color: a four-component vector representing the 
         *   base color (red, green, blue, alpha).
         *   - shininess: a number controlling specular 
         *   highlights.
         *   - metalness: a number controlling the metalness 
         *   factor.
         *   - In baseStrokeShader(): color: a four-component 
         *   vector representing the stroke color (red, green, 
         *   blue, alpha).tangent: a two-component vector 
         *   representing the stroke tangent.center: a 
         *   two-component vector representing the cap/join 
         *   center.position: a two-component vector 
         *   representing the current fragment 
         *   position.strokeWeight: a number representing the 
         *   stroke weight in pixels.
         *   - color: a four-component vector representing the 
         *   stroke color (red, green, blue, alpha).
         *   - tangent: a two-component vector representing the 
         *   stroke tangent.
         *   - center: a two-component vector representing the 
         *   cap/join center.
         *   - position: a two-component vector representing 
         *   the current fragment position.
         *   - strokeWeight: a number representing the stroke 
         *   weight in pixels.
         * 
         *   Return the modified object to update the fragment. 
         * 
         *   This hook is available in: 
         * 
         *   - baseMaterialShader()
         *   - baseStrokeShader()
         *   @param callback A callback function which receives 
         *   the fragment inputs object and should return it 
         *   after making any changes.
         */
        getPixelInputs(callback: (...args: any[]) => any): void

        /**
         *   Registers a callback to change the final color of 
         *   each pixel after all lighting and mixing is done 
         *   in the fragment shader. This hook can be used 
         *   inside baseColorShader().modify() and similar 
         *   shader modify() calls to adjust the color before 
         *   it appears on the screen. The callback receives a 
         *   four component vector representing red, green, 
         *   blue, and alpha. Return a new color array to 
         *   change the output color. 
         * 
         *   This hook is available in: 
         * 
         *   - baseColorShader()
         *   - baseMaterialShader()
         *   - baseNormalShader()
         *   - baseStrokeShader()
         *   @param callback A callback function which receives 
         *   the color array and should return a color array.
         */
        getFinalColor(callback: (...args: any[]) => any): void

        /**
         *   Registers a callback to set the final color for 
         *   each pixel in a filter shader. This hook can be 
         *   used inside baseFilterShader().modify() and 
         *   similar shader modify() calls to control the 
         *   output color for each pixel. The callback receives 
         *   the following arguments: - inputs: an object with 
         *   the following properties: texCoord: a 
         *   two-component vector representing the texture 
         *   coordinates (u, v).canvasSize: a two-component 
         *   vector representing the canvas size in pixels 
         *   (width, height).texelSize: a two-component vector 
         *   representing the size of a single texel in texture 
         *   space.
         *   - texCoord: a two-component vector representing 
         *   the texture coordinates (u, v).
         *   - canvasSize: a two-component vector representing 
         *   the canvas size in pixels (width, height).
         *   - texelSize: a two-component vector representing 
         *   the size of a single texel in texture space.
         *   - canvasContent: a texture containing the sketch's 
         *   contents before the filter is applied.
         * 
         *   Return a four-component vector [r, g, b, a] for 
         *   the pixel. 
         * 
         *   This hook is available in: 
         * 
         *   - baseFilterShader()
         *   @param callback A callback function which receives 
         *   the inputs object and canvasContent, and should 
         *   return a color array.
         */
        getColor(callback: (...args: any[]) => any): void

        /**
         *   Registers a callback to modify the properties of 
         *   each vertex before any transformations are applied 
         *   in the vertex shader. This hook can be used inside 
         *   baseColorShader().modify() and similar shader 
         *   modify() calls to move, color, or otherwise modify 
         *   the raw model data. The callback receives an 
         *   object with the following properties: - position: 
         *   a three-component vector representing the original 
         *   position of the vertex.
         *   - normal: a three-component vector representing 
         *   the direction the surface is facing.
         *   - texCoord: a two-component vector representing 
         *   the texture coordinates.
         *   - color: a four-component vector representing the 
         *   color of the vertex (red, green, blue, alpha).
         * 
         *   Return the modified object to update the vertex. 
         * 
         *   This hook is available in: 
         * 
         *   - baseColorShader()
         *   - baseMaterialShader()
         *   - baseNormalShader()
         *   - baseStrokeShader()
         *   @param callback A callback function which receives 
         *   the vertex object and should return it after 
         *   making any changes.
         */
        getObjectInputs(callback: (...args: any[]) => any): void

        /**
         *   Registers a callback to adjust vertex properties 
         *   after the model has been transformed by the 
         *   camera, but before projection, in the vertex 
         *   shader. This hook can be used inside 
         *   baseColorShader().modify() and similar shader 
         *   modify() calls to create effects that depend on 
         *   the camera's view. The callback receives an object 
         *   with the following properties: - position: a 
         *   three-component vector representing the position 
         *   after camera transformation.
         *   - normal: a three-component vector representing 
         *   the normal after camera transformation.
         *   - texCoord: a two-component vector representing 
         *   the texture coordinates.
         *   - color: a four-component vector representing the 
         *   color of the vertex (red, green, blue, alpha).
         * 
         *   Return the modified object to update the vertex. 
         * 
         *   This hook is available in: 
         * 
         *   - baseColorShader()
         *   - baseMaterialShader()
         *   - baseNormalShader()
         *   - baseStrokeShader()
         *   @param callback A callback function which receives 
         *   the vertex object and should return it after 
         *   making any changes.
         */
        getCameraInputs(callback: (...args: any[]) => any): void
    }
}
