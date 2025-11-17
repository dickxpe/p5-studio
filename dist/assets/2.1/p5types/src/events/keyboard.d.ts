// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   A function that's called once when any key is 
         *   pressed. Declaring the function keyPressed() sets 
         *   a code block to run once automatically when the 
         *   user presses any key: 
         * 
         *   function keyPressed() { // Code to run. }
         * 
         *   The key and keyCode variables will be updated with 
         *   the most recently typed value when keyPressed() is 
         *   called by p5.js: 
         * 
         *   function keyPressed() { if (key === 'c') { // Code 
         *   to run. } if (keyCode === 13) { // Enter key // 
         *   Code to run. } }
         * 
         *   The parameter, event, is optional. keyPressed() is 
         *   always passed a KeyboardEvent object with 
         *   properties that describe the key press event: 
         * 
         *   function keyPressed(event) { // Code to run that 
         *   uses the event. console.log(event); }
         * 
         *   Browsers may have default behaviors attached to 
         *   various key events. For example, some browsers may 
         *   jump to the bottom of a web page when the SPACE 
         *   key is pressed. To prevent any default behavior 
         *   for this event, add return false; to the end of 
         *   the function.
         *   @param [event] optional KeyboardEvent callback 
         *   argument.
         */
        keyPressed(event?: KeyboardEvent): void

        /**
         *   A function that's called once when any key is 
         *   released. Declaring the function keyReleased() 
         *   sets a code block to run once automatically when 
         *   the user releases any key: 
         * 
         *   function keyReleased() { // Code to run. }
         * 
         *   The key and keyCode variables will be updated with 
         *   the most recently released value when 
         *   keyReleased() is called by p5.js: 
         * 
         *   function keyReleased() { if (key === 'c') { // 
         *   Code to run. } if (keyCode === 13) { // Enter key 
         *   // Code to run. } }
         * 
         *   The parameter, event, is optional. keyReleased() 
         *   is always passed a KeyboardEvent object with 
         *   properties that describe the key press event: 
         * 
         *   function keyReleased(event) { // Code to run that 
         *   uses the event. console.log(event); }
         * 
         *   Browsers may have default behaviors attached to 
         *   various key events. To prevent any default 
         *   behavior for this event, add return false; to the 
         *   end of the function.
         *   @param [event] optional KeyboardEvent callback 
         *   argument.
         */
        keyReleased(event?: KeyboardEvent): void

        /**
         *   A function that's called once when keys with 
         *   printable characters are pressed. Declaring the 
         *   function keyTyped() sets a code block to run once 
         *   automatically when the user presses any key with a 
         *   printable character such as a or 1. Modifier keys 
         *   such as SHIFT, CONTROL, and the arrow keys will be 
         *   ignored: 
         * 
         *   function keyTyped() { // Code to run. }
         * 
         *   The key and keyCode variables will be updated with 
         *   the most recently released value when keyTyped() 
         *   is called by p5.js: 
         * 
         *   function keyTyped() { // Check for the "c" 
         *   character using key. if (key === 'c') { // Code to 
         *   run. } // Check for "c" using keyCode. if (keyCode 
         *   === 67) { // 67 is the ASCII code for 'c' // Code 
         *   to run. } }
         * 
         *   The parameter, event, is optional. keyTyped() is 
         *   always passed a KeyboardEvent object with 
         *   properties that describe the key press event: 
         * 
         *   function keyReleased(event) { // Code to run that 
         *   uses the event. console.log(event); }
         * 
         *   Note: Use the keyPressed() function and keyCode 
         *   system variable to respond to modifier keys such 
         *   as ALT. 
         * 
         *   Browsers may have default behaviors attached to 
         *   various key events. To prevent any default 
         *   behavior for this event, add return false; to the 
         *   end of the function.
         *   @param [event] optional KeyboardEvent callback 
         *   argument.
         */
        keyTyped(event?: KeyboardEvent): void

        /**
         *   Returns true if the key it’s checking is pressed 
         *   and false if not. keyIsDown() is helpful when 
         *   checking for multiple different key presses. For 
         *   example, keyIsDown() can be used to check if both 
         *   LEFT_ARROW and UP_ARROW are pressed: 
         * 
         *   if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW)) 
         *   { // Move diagonally. }
         * 
         *   keyIsDown() can check for key presses using 
         *   strings based on KeyboardEvent.key or 
         *   KeyboardEvent.code values, such as keyIsDown('x') 
         *   or keyIsDown('ArrowLeft'). 
         * 
         *   Note: In p5.js 2.0 and newer, numeric keycodes 
         *   (such as 88 for 'X') are no longer supported. This 
         *   is a breaking change from previous versions. 
         * 
         *   You can still use the p5 constants like LEFT_ARROW 
         *   which now map to string values internally rather 
         *   than numeric codes.
         *   @param code key to check.
         *   @return whether the key is down or not.
         */
        keyIsDown(code: number|string): boolean

        /**
         *   A Boolean system variable that's true if any key 
         *   is currently pressed and false if not.
         */
        keyIsPressed: boolean

        /**
         *   A String system variable that contains the value 
         *   of the last key typed. The key variable is helpful 
         *   for checking whether an ASCII key has been typed. 
         *   For example, the expression key === "a" evaluates 
         *   to true if the a key was typed and false if not. 
         *   key doesn’t update for special keys such as 
         *   LEFT_ARROW and ENTER. Use keyCode instead for 
         *   special keys. The keyIsDown() function should be 
         *   used to check for multiple different key presses 
         *   at the same time.
         */
        key: string

        /**
         *   The code property represents a physical key on the 
         *   keyboard (as opposed to the character generated by 
         *   pressing the key). In other words, this property 
         *   returns a value that isn't altered by keyboard 
         *   layout or the state of the modifier keys. This 
         *   property is useful when you want to handle keys 
         *   based on their physical positions on the input 
         *   device rather than the characters associated with 
         *   those keys; 
         * 
         *   Unlike key, the code property differentiates 
         *   between physical keys that generate the same 
         *   character—for example, CtrlLeft and CtrlRight—so 
         *   each can be handled independently. Here's the MDN 
         *   docs for KeyboardEvent.code 
         * 
         *   Pressing the key physically labeled “A” always 
         *   yields KeyA, regardless of the current keyboard 
         *   layout (QWERTY, Dvorak, AZERTY, etc.) or the 
         *   character that appears in a text field. 
         * 
         *   The code property returns a plain string (e.g., 
         *   'ArrowRight'). You can compare it directly with 
         *   string literals: 
         * 
         *   if (keyIsDown(RIGHT_ARROW)) { // … } // The line 
         *   above is equivalent to: if (code === 'ArrowRight') 
         *   { // … } if (key === 'ArrowRight') { // … }
         * 
         *   The system variables BACKSPACE, DELETE, ENTER, 
         *   RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, 
         *   UP_ARROW, DOWN_ARROW, LEFT_ARROW, and RIGHT_ARROW 
         *   are all helpful shorthands the key codes of 
         *   special keys. These are simply shorthands for the 
         *   same string values: 
         * 
         *   if (code === RIGHT_ARROW) { // .. }
         * 
         *   The table below summarizes how the main 
         *   keyboard-related system variables changed between 
         *   p5.js 1.x and 2.x.    Variable p5.js 1.x  p5.js 
         *   2.x      key Text string (e.g., "ArrowUp"). Text 
         *   string (e.g., "ArrowUp", "f" or "F").   code Not 
         *   supported. Text String (e.g., "ArrowUp", "KeyF").   
         *   keyCode Number (e.g., 70). Number (unchanged; 
         *   e.g., 70).   System variables (BACKSPACE, 
         *   UP_ARROW, …) Number Text String (e.g., "ArrowUp").
         */
        code: string

        /**
         *   A Number system variable that contains the code of 
         *   the last key pressed. Every key has a numeric key 
         *   code. For example, the letter a key has the key 
         *   code 65. Use this key code to determine which key 
         *   was pressed by comparing it to the numeric value 
         *   of the desired key. 
         * 
         *   For example, to detect when the Enter key is 
         *   pressed: 
         * 
         *   if (keyCode === 13) { // Enter key // Code to run 
         *   if the Enter key was pressed. }
         * 
         *   Alternatively, you can use the key function to 
         *   directly compare the key value: 
         * 
         *   if (key === 'Enter') { // Enter key // Code to run 
         *   if the Enter key was pressed. }
         * 
         *   Use the following numeric codes for the arrow 
         *   keys: 
         * 
         *   Up Arrow: 38 Down Arrow: 40 Left Arrow: 37 Right 
         *   Arrow: 39 
         * 
         *   More key codes can be found at websites such as 
         *   keycode.info.
         */
        keyCode: number
    }
}
