// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class Element {
        // TODO: Fix p5.Element() errors in src/scripts/parsers/in/p5.js/src/dom/p5.Element.js, line 2493:
        //
        //    param "pInst" has invalid type: p5
        //
        // constructor(elt: HTMLElement, pInst?: p5);

        /**
         *   Removes the element, stops all audio/video 
         *   streams, and removes all callback functions.
         */
        remove(): void

        /**
         *   Attaches the element to a parent element. For 
         *   example, a <div></div> element may be used as a 
         *   box to hold two pieces of text, a header and a 
         *   paragraph. The <div></div> is the parent element 
         *   of both the header and paragraph. 
         * 
         *   The parameter parent can have one of three types. 
         *   parent can be a string with the parent element's 
         *   ID, as in myElement.parent('container'). It can 
         *   also be another p5.Element object, as in 
         *   myElement.parent(myDiv). Finally, parent can be an 
         *   HTMLElement object, as in 
         *   myElement.parent(anotherElement). 
         * 
         *   Calling myElement.parent() without an argument 
         *   returns the element's parent.
         *   @param parent ID, p5.Element, or HTMLElement of 
         *   desired parent element.
         */
        parent(parent: string|Element|object): void

        /**
         *   Attaches the element to a parent element. For 
         *   example, a <div></div> element may be used as a 
         *   box to hold two pieces of text, a header and a 
         *   paragraph. The <div></div> is the parent element 
         *   of both the header and paragraph. 
         * 
         *   The parameter parent can have one of three types. 
         *   parent can be a string with the parent element's 
         *   ID, as in myElement.parent('container'). It can 
         *   also be another p5.Element object, as in 
         *   myElement.parent(myDiv). Finally, parent can be an 
         *   HTMLElement object, as in 
         *   myElement.parent(anotherElement). 
         * 
         *   Calling myElement.parent() without an argument 
         *   returns the element's parent.
         */
        parent(): Element

        /**
         *   Attaches the element as a child of another 
         *   element. myElement.child() accepts either a string 
         *   ID, DOM node, or p5.Element. For example, 
         *   myElement.child(otherElement). If no argument is 
         *   provided, an array of children DOM nodes is 
         *   returned.
         *   @return an array of child nodes.
         */
        child(): Node[]

        /**
         *   Attaches the element as a child of another 
         *   element. myElement.child() accepts either a string 
         *   ID, DOM node, or p5.Element. For example, 
         *   myElement.child(otherElement). If no argument is 
         *   provided, an array of children DOM nodes is 
         *   returned.
         *   @param [child] the ID, DOM node, or p5.Element to 
         *   add to the current element
         */
        child(child?: string|Element): void

        /**
         *   Sets the inner HTML of the element, replacing any 
         *   existing HTML. The second parameter, append, is 
         *   optional. If true is passed, as in 
         *   myElement.html('hi', true), the HTML is appended 
         *   instead of replacing existing HTML. 
         * 
         *   If no arguments are passed, as in 
         *   myElement.html(), the element's inner HTML is 
         *   returned.
         *   @return the inner HTML of the element
         */
        html(): string

        /**
         *   Sets the inner HTML of the element, replacing any 
         *   existing HTML. The second parameter, append, is 
         *   optional. If true is passed, as in 
         *   myElement.html('hi', true), the HTML is appended 
         *   instead of replacing existing HTML. 
         * 
         *   If no arguments are passed, as in 
         *   myElement.html(), the element's inner HTML is 
         *   returned.
         *   @param [html] the HTML to be placed inside the 
         *   element
         *   @param [append] whether to append HTML to existing
         */
        html(html?: string, append?: boolean): void

        /**
         *   Sets the element's ID using a given string. 
         *   Calling myElement.id() without an argument returns 
         *   its ID as a string.
         *   @param id ID of the element.
         */
        id(id: string): void

        /**
         *   Sets the element's ID using a given string. 
         *   Calling myElement.id() without an argument returns 
         *   its ID as a string.
         *   @return ID of the element.
         */
        id(): string

        /**
         *   Adds a class attribute to the element using a 
         *   given string. Calling myElement.class() without an 
         *   argument returns a string with its current 
         *   classes.
         *   @param class class to add.
         */
        class(theClass: string): void

        /**
         *   Adds a class attribute to the element using a 
         *   given string. Calling myElement.class() without an 
         *   argument returns a string with its current 
         *   classes.
         *   @return element's classes, if any.
         */
        class(): string

        /**
         *   Adds a class to the element.
         *   @param class name of class to add.
         */
        addClass(theClass: string): void

        /**
         *   Removes a class from the element.
         *   @param class name of class to remove.
         */
        removeClass(theClass: string): void

        // TODO: Fix hasClass() errors in src/scripts/parsers/in/p5.js/src/dom/p5.Element.js, line undefined:
        //
        //    param "c" has invalid type: undefined
        //    return has invalid type: boolean
        //
        // hasClass(c: ): undefined

        // TODO: Fix toggleClass() errors in src/scripts/parsers/in/p5.js/src/dom/p5.Element.js, line undefined:
        //
        //    param "c" has invalid type: undefined
        //
        // toggleClass(c: ): void

        /**
         *   Centers the element either vertically, 
         *   horizontally, or both. center() will center the 
         *   element relative to its parent or according to the 
         *   page's body if the element has no parent. 
         * 
         *   If no argument is passed, as in myElement.center() 
         *   the element is aligned both vertically and 
         *   horizontally.
         *   @param [align] passing 'vertical', 'horizontal' 
         *   aligns element accordingly
         */
        center(align?: string): void

        /**
         *   Sets the element's position. The first two 
         *   parameters, x and y, set the element's position 
         *   relative to the top-left corner of the web page. 
         * 
         *   The third parameter, positionType, is optional. It 
         *   sets the element's positioning scheme. 
         *   positionType is a string that can be either 
         *   'static', 'fixed', 'relative', 'sticky', 
         *   'initial', or 'inherit'. 
         * 
         *   If no arguments passed, as in 
         *   myElement.position(), the method returns the 
         *   element's position in an object, as in { x: 0, y: 
         *   0 }.
         *   @return object of form { x: 0, y: 0 } containing 
         *   the element's position.
         */
        position(): object

        /**
         *   Sets the element's position. The first two 
         *   parameters, x and y, set the element's position 
         *   relative to the top-left corner of the web page. 
         * 
         *   The third parameter, positionType, is optional. It 
         *   sets the element's positioning scheme. 
         *   positionType is a string that can be either 
         *   'static', 'fixed', 'relative', 'sticky', 
         *   'initial', or 'inherit'. 
         * 
         *   If no arguments passed, as in 
         *   myElement.position(), the method returns the 
         *   element's position in an object, as in { x: 0, y: 
         *   0 }.
         *   @param [x] x-position relative to top-left of 
         *   window (optional)
         *   @param [y] y-position relative to top-left of 
         *   window (optional)
         *   @param [positionType] it can be static, fixed, 
         *   relative, sticky, initial or inherit (optional)
         */
        position(x?: number, y?: number, positionType?: string): void

        /**
         *   Shows the current element.
         */
        show(): void

        /**
         *   Hides the current element.
         */
        hide(): void

        /**
         *   Sets the element's width and height. Calling 
         *   myElement.size() without an argument returns the 
         *   element's size as an object with the properties 
         *   width and height. For example, { width: 20, 
         *   height: 10 }. 
         * 
         *   The first parameter, width, is optional. It's a 
         *   number used to set the element's width. Calling 
         *   myElement.size(10) 
         * 
         *   The second parameter, 'height, is also optional. 
         *   It's a number used to set the element's height. 
         *   For example, calling myElement.size(20, 10)` sets 
         *   the element's width to 20 pixels and height to 10 
         *   pixels. 
         * 
         *   The constant AUTO can be used to adjust one 
         *   dimension at a time while maintaining the aspect 
         *   ratio, which is width / height. For example, 
         *   consider an element that's 200 pixels wide and 100 
         *   pixels tall. Calling myElement.size(20, AUTO) sets 
         *   the width to 20 pixels and height to 10 pixels. 
         * 
         *   Note: In the case of elements that need to load 
         *   data, such as images, wait to call 
         *   myElement.size() until after the data loads.
         *   @return width and height of the element in an 
         *   object.
         */
        size(): object

        /**
         *   Sets the element's width and height. Calling 
         *   myElement.size() without an argument returns the 
         *   element's size as an object with the properties 
         *   width and height. For example, { width: 20, 
         *   height: 10 }. 
         * 
         *   The first parameter, width, is optional. It's a 
         *   number used to set the element's width. Calling 
         *   myElement.size(10) 
         * 
         *   The second parameter, 'height, is also optional. 
         *   It's a number used to set the element's height. 
         *   For example, calling myElement.size(20, 10)` sets 
         *   the element's width to 20 pixels and height to 10 
         *   pixels. 
         * 
         *   The constant AUTO can be used to adjust one 
         *   dimension at a time while maintaining the aspect 
         *   ratio, which is width / height. For example, 
         *   consider an element that's 200 pixels wide and 100 
         *   pixels tall. Calling myElement.size(20, AUTO) sets 
         *   the width to 20 pixels and height to 10 pixels. 
         * 
         *   Note: In the case of elements that need to load 
         *   data, such as images, wait to call 
         *   myElement.size() until after the data loads.
         *   @param [w] width of the element, either AUTO, or a 
         *   number.
         *   @param [h] height of the element, either AUTO, or 
         *   a number.
         */
        size(w?: number, h?: number): void

        /**
         *   Applies a style to the element by adding a CSS 
         *   declaration. The first parameter, property, is a 
         *   string. If the name of a style property is passed, 
         *   as in myElement.style('color'), the method returns 
         *   the current value as a string or null if it hasn't 
         *   been set. If a property:style string is passed, as 
         *   in myElement.style('color:deeppink'), the method 
         *   sets the style property to value. 
         * 
         *   The second parameter, value, is optional. It sets 
         *   the property's value. value can be a string, as in 
         *   myElement.style('color', 'deeppink'), or a 
         *   p5.Color object, as in myElement.style('color', 
         *   myColor).
         *   @param property style property to set.
         *   @return value of the property.
         */
        style(property: string): string

        /**
         *   Applies a style to the element by adding a CSS 
         *   declaration. The first parameter, property, is a 
         *   string. If the name of a style property is passed, 
         *   as in myElement.style('color'), the method returns 
         *   the current value as a string or null if it hasn't 
         *   been set. If a property:style string is passed, as 
         *   in myElement.style('color:deeppink'), the method 
         *   sets the style property to value. 
         * 
         *   The second parameter, value, is optional. It sets 
         *   the property's value. value can be a string, as in 
         *   myElement.style('color', 'deeppink'), or a 
         *   p5.Color object, as in myElement.style('color', 
         *   myColor).
         *   @param property style property to set.
         *   @param value value to assign to the property.
         *   @return value of the property.
         */
        style(property: string, value: string|Color): string

        /**
         *   Adds an attribute to the element. This method is 
         *   useful for advanced tasks. Most commonly-used 
         *   attributes, such as id, can be set with their 
         *   dedicated methods. For example, 
         *   nextButton.id('next') sets an element's id 
         *   attribute. Calling nextButton.attribute('id', 
         *   'next') has the same effect. 
         * 
         *   The first parameter, attr, is the attribute's name 
         *   as a string. Calling myElement.attribute('align') 
         *   returns the attribute's current value as a string 
         *   or null if it hasn't been set. 
         * 
         *   The second parameter, value, is optional. It's a 
         *   string used to set the attribute's value. For 
         *   example, calling myElement.attribute('align', 
         *   'center') sets the element's horizontal alignment 
         *   to center.
         *   @return value of the attribute.
         */
        attribute(): string

        /**
         *   Adds an attribute to the element. This method is 
         *   useful for advanced tasks. Most commonly-used 
         *   attributes, such as id, can be set with their 
         *   dedicated methods. For example, 
         *   nextButton.id('next') sets an element's id 
         *   attribute. Calling nextButton.attribute('id', 
         *   'next') has the same effect. 
         * 
         *   The first parameter, attr, is the attribute's name 
         *   as a string. Calling myElement.attribute('align') 
         *   returns the attribute's current value as a string 
         *   or null if it hasn't been set. 
         * 
         *   The second parameter, value, is optional. It's a 
         *   string used to set the attribute's value. For 
         *   example, calling myElement.attribute('align', 
         *   'center') sets the element's horizontal alignment 
         *   to center.
         *   @param attr attribute to set.
         *   @param value value to assign to the attribute.
         */
        attribute(attr: string, value: string): void

        /**
         *   Removes an attribute from the element. The 
         *   parameter attr is the attribute's name as a 
         *   string. For example, calling 
         *   myElement.removeAttribute('align') removes its 
         *   align attribute if it's been set.
         *   @param attr attribute to remove.
         */
        removeAttribute(attr: string): void

        /**
         *   Returns or sets the element's value. Calling 
         *   myElement.value() returns the element's current 
         *   value. 
         * 
         *   The parameter, value, is an optional number or 
         *   string. If provided, as in myElement.value(123), 
         *   it's used to set the element's value.
         *   @return value of the element.
         */
        value(): string|number

        /**
         *   Returns or sets the element's value. Calling 
         *   myElement.value() returns the element's current 
         *   value. 
         * 
         *   The parameter, value, is an optional number or 
         *   string. If provided, as in myElement.value(123), 
         *   it's used to set the element's value.
         */
        value(value: string|number): void

        /**
         *   Calls a function when the mouse is pressed over 
         *   the element. Calling myElement.mousePressed(false) 
         *   disables the function. 
         * 
         *   Note: Some mobile browsers may also trigger this 
         *   event when the element receives a quick tap.
         *   @param fxn function to call when the mouse is 
         *   pressed over the element. false disables the 
         *   function.
         */
        mousePressed(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse is pressed twice 
         *   over the element. Calling 
         *   myElement.doubleClicked(false) disables the 
         *   function.
         *   @param fxn function to call when the mouse is 
         *   double clicked over the element. false disables 
         *   the function.
         */
        doubleClicked(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse wheel scrolls over 
         *   the element. The callback function, fxn, is passed 
         *   an event object. event has two numeric properties, 
         *   deltaY and deltaX. event.deltaY is negative if the 
         *   mouse wheel rotates away from the user. It's 
         *   positive if the mouse wheel rotates toward the 
         *   user. event.deltaX is positive if the mouse wheel 
         *   moves to the right. It's negative if the mouse 
         *   wheel moves to the left. 
         * 
         *   Calling myElement.mouseWheel(false) disables the 
         *   function.
         *   @param fxn function to call when the mouse wheel 
         *   is scrolled over the element. false disables the 
         *   function.
         */
        mouseWheel(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse is released over 
         *   the element. Calling 
         *   myElement.mouseReleased(false) disables the 
         *   function. 
         * 
         *   Note: Some mobile browsers may also trigger this 
         *   event when the element receives a quick tap.
         *   @param fxn function to call when the mouse is 
         *   pressed over the element. false disables the 
         *   function.
         */
        mouseReleased(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse is pressed and 
         *   released over the element. Calling 
         *   myElement.mouseReleased(false) disables the 
         *   function. 
         * 
         *   Note: Some mobile browsers may also trigger this 
         *   event when the element receives a quick tap.
         *   @param fxn function to call when the mouse is 
         *   pressed and released over the element. false 
         *   disables the function.
         */
        mouseClicked(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse moves over the 
         *   element. Calling myElement.mouseMoved(false) 
         *   disables the function.
         *   @param fxn function to call when the mouse moves 
         *   over the element. false disables the function.
         */
        mouseMoved(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse moves onto the 
         *   element. Calling myElement.mouseOver(false) 
         *   disables the function.
         *   @param fxn function to call when the mouse moves 
         *   onto the element. false disables the function.
         */
        mouseOver(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the mouse moves off the 
         *   element. Calling myElement.mouseOut(false) 
         *   disables the function.
         *   @param fxn function to call when the mouse moves 
         *   off the element. false disables the function.
         */
        mouseOut(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when a file is dragged over the 
         *   element. Calling myElement.dragOver(false) 
         *   disables the function.
         *   @param fxn function to call when the file is 
         *   dragged over the element. false disables the 
         *   function.
         */
        dragOver(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when a file is dragged off the 
         *   element. Calling myElement.dragLeave(false) 
         *   disables the function.
         *   @param fxn function to call when the file is 
         *   dragged off the element. false disables the 
         *   function.
         */
        dragLeave(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the element changes. Calling 
         *   myElement.changed(false) disables the function.
         *   @param fxn function to call when the element 
         *   changes. false disables the function.
         */
        changed(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the element receives input. 
         *   myElement.input() is often used to with text 
         *   inputs and sliders. Calling myElement.input(false) 
         *   disables the function.
         *   @param fxn function to call when input is detected 
         *   within the element. false disables the function.
         */
        input(fxn: ((...args: any[]) => any)|boolean): void

        /**
         *   Calls a function when the user drops a file on the 
         *   element. The first parameter, callback, is a 
         *   function to call once the file loads. The callback 
         *   function should have one parameter, file, that's a 
         *   p5.File object. If the user drops multiple files 
         *   on the element, callback, is called once for each 
         *   file. 
         * 
         *   The second parameter, fxn, is a function to call 
         *   when the browser detects one or more dropped 
         *   files. The callback function should have one 
         *   parameter, event, that's a DragEvent.
         *   @param callback called when a file loads. Called 
         *   once for each file dropped.
         *   @param [fxn] called once when any files are 
         *   dropped.
         */
        drop(callback: (...args: any[]) => any, fxn?: (...args: any[]) => any): void

        /**
         *   Makes the element draggable. The parameter, elmnt, 
         *   is optional. If another p5.Element object is 
         *   passed, as in myElement.draggable(otherElement), 
         *   the other element will become draggable.
         *   @param [elmnt] another p5.Element.
         */
        draggable(elmnt?: Element): void

        /**
         *   A Number property that stores the element's width.
         */
        width: number

        /**
         *   A Number property that stores the element's 
         *   height.
         */
        height: number

        /**
         *   The element's underlying HTMLElement object. The 
         *   HTMLElement object's properties and methods can be 
         *   used directly.
         */
        elt: HTMLElement
    }
}
