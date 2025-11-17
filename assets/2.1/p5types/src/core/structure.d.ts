// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   Creates a new sketch in "instance" mode. All p5.js 
         *   sketches are instances of the p5 class. Put 
         *   another way, all p5.js sketches are objects with 
         *   methods including pInst.setup(), pInst.draw(), 
         *   pInst.circle(), and pInst.fill(). By default, 
         *   sketches run in "global mode" to hide some of this 
         *   complexity. 
         * 
         *   In global mode, a default instance of the p5 class 
         *   is created automatically. The default p5 instance 
         *   searches the web page's source code for 
         *   declarations of system functions such as setup(), 
         *   draw(), and mousePressed(), then attaches those 
         *   functions to itself as methods. Calling a function 
         *   such as circle() in global mode actually calls the 
         *   default p5 object's pInst.circle() method. 
         * 
         *   It's often helpful to isolate the code within 
         *   sketches from the rest of the code on a web page. 
         *   Two common use cases are web pages that use other 
         *   JavaScript libraries and web pages with multiple 
         *   sketches. "Instance mode" makes it easy to support 
         *   both of these scenarios. 
         * 
         *   Instance mode sketches support the same API as 
         *   global mode sketches. They use a function to 
         *   bundle, or encapsulate, an entire sketch. The 
         *   function containing the sketch is then passed to 
         *   the p5() constructor. 
         * 
         *   The first parameter, sketch, is a function that 
         *   contains the sketch. For example, the statement 
         *   new p5(mySketch) would create a new instance mode 
         *   sketch from a function named mySketch. The 
         *   function should have one parameter, p, that's a p5 
         *   object. 
         * 
         *   The second parameter, node, is optional. If a 
         *   string is passed, as in new p5(mySketch, 
         *   'sketch-one') the new instance mode sketch will 
         *   become a child of the HTML element with the id 
         *   sketch-one. If an HTML element is passed, as in 
         *   new p5(mySketch, myElement), then the new instance 
         *   mode sketch will become a child of the Element 
         *   object called myElement.
         *   @param sketch function containing the sketch.
         *   @param node ID or reference to the HTML element 
         *   that will contain the sketch.
         */
        p5(sketch: object, node: string|HTMLElement): void

        /**
         *   Stops the code in draw() from running repeatedly. 
         *   By default, draw() tries to run 60 times per 
         *   second. Calling noLoop() stops draw() from 
         *   repeating. The draw loop can be restarted by 
         *   calling loop(). draw() can be run once by calling 
         *   redraw(). 
         * 
         *   The isLooping() function can be used to check 
         *   whether a sketch is looping, as in isLooping() === 
         *   true.
         */
        noLoop(): void

        /**
         *   Resumes the draw loop after noLoop() has been 
         *   called. By default, draw() tries to run 60 times 
         *   per second. Calling noLoop() stops draw() from 
         *   repeating. The draw loop can be restarted by 
         *   calling loop(). 
         * 
         *   The isLooping() function can be used to check 
         *   whether a sketch is looping, as in isLooping() === 
         *   true.
         */
        loop(): void

        // TODO: Fix isLooping() errors in src/scripts/parsers/in/p5.js/src/core/structure.js, line undefined:
        //
        //    return has invalid type: boolean
        //
        // isLooping(): undefined

        // TODO: Fix redraw() errors in src/scripts/parsers/in/p5.js/src/core/structure.js, line undefined:
        //
        //    return has invalid type: Promise<void>
        //
        // redraw(n?: number): undefined

    }
}
