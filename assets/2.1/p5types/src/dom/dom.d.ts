// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   Searches the page for the first element that 
         *   matches the given CSS selector string. The 
         *   selector string can be an ID, class, tag name, or 
         *   a combination. select() returns a p5.Element 
         *   object if it finds a match and null if not. 
         * 
         *   The second parameter, container, is optional. It 
         *   specifies a container to search within. container 
         *   can be CSS selector string, a p5.Element object, 
         *   or an HTMLElement object.
         *   @param selectors CSS selector string of element to 
         *   search for.
         *   @param [container] CSS selector string, 
         *   p5.Element, or HTMLElement to search within.
         *   @return p5.Element containing the element.
         */
        select(selectors: string, container?: string|Element|HTMLElement): Element

        /**
         *   Searches the page for all elements that matches 
         *   the given CSS selector string. The selector string 
         *   can be an ID, class, tag name, or a combination. 
         *   selectAll() returns an array of p5.Element objects 
         *   if it finds any matches and an empty array if none 
         *   are found. 
         * 
         *   The second parameter, container, is optional. It 
         *   specifies a container to search within. container 
         *   can be CSS selector string, a p5.Element object, 
         *   or an HTMLElement object.
         *   @param selectors CSS selector string of element to 
         *   search for.
         *   @param [container] CSS selector string, 
         *   p5.Element, or HTMLElement to search within.
         *   @return array of p5.Elements containing any 
         *   elements found.
         */
        selectAll(selectors: string, container?: string|Element|HTMLElement): Element[]

        /**
         *   Creates a new p5.Element object. The first 
         *   parameter, tag, is a string an HTML tag such as 
         *   'h5'. 
         * 
         *   The second parameter, content, is optional. It's a 
         *   string that sets the HTML content to insert into 
         *   the new element. New elements have no content by 
         *   default.
         *   @param tag tag for the new element.
         *   @param [content] HTML content to insert into the 
         *   element.
         *   @return new p5.Element object.
         */
        createElement(tag: string, content?: string): Element

        /**
         *   Removes all elements created by p5.js, including 
         *   any event handlers. There are two exceptions: 
         *   canvas elements created by createCanvas() and 
         *   p5.Render objects created by createGraphics().
         */
        removeElements(): void

        /**
         *   Creates a <div></div> element. <div></div> 
         *   elements are commonly used as containers for other 
         *   elements. 
         * 
         *   The parameter html is optional. It accepts a 
         *   string that sets the inner HTML of the new 
         *   <div></div>.
         *   @param [html] inner HTML for the new <div></div> 
         *   element.
         *   @return new p5.Element object.
         */
        createDiv(html?: string): Element

        /**
         *   Creates a paragraph element. <p></p> elements are 
         *   commonly used for paragraph-length text. 
         * 
         *   The parameter html is optional. It accepts a 
         *   string that sets the inner HTML of the new 
         *   <p></p>.
         *   @param [html] inner HTML for the new <p></p> 
         *   element.
         *   @return new p5.Element object.
         */
        createP(html?: string): Element

        /**
         *   Creates a <span></span> element. <span></span> 
         *   elements are commonly used as containers for 
         *   inline elements. For example, a <span></span> can 
         *   hold part of a sentence that's a different style. 
         * 
         *   The parameter html is optional. It accepts a 
         *   string that sets the inner HTML of the new 
         *   <span></span>.
         *   @param [html] inner HTML for the new <span></span> 
         *   element.
         *   @return new p5.Element object.
         */
        createSpan(html?: string): Element

        /**
         *   Creates an <img> element that can appear outside 
         *   of the canvas. The first parameter, src, is a 
         *   string with the path to the image file. src should 
         *   be a relative path, as in 'assets/image.png', or a 
         *   URL, as in 'https://example.com/image.png'. 
         * 
         *   The second parameter, alt, is a string with the 
         *   alternate text for the image. An empty string '' 
         *   can be used for images that aren't displayed. 
         * 
         *   The third parameter, crossOrigin, is optional. 
         *   It's a string that sets the crossOrigin property 
         *   of the image. Use 'anonymous' or 'use-credentials' 
         *   to fetch the image with cross-origin access. 
         * 
         *   The fourth parameter, callback, is also optional. 
         *   It sets a function to call after the image loads. 
         *   The new image is passed to the callback function 
         *   as a p5.Element object.
         *   @param src relative path or URL for the image.
         *   @param alt alternate text for the image.
         *   @return new p5.Element object.
         */
        createImg(src: string, alt: string): Element

        /**
         *   Creates an <img> element that can appear outside 
         *   of the canvas. The first parameter, src, is a 
         *   string with the path to the image file. src should 
         *   be a relative path, as in 'assets/image.png', or a 
         *   URL, as in 'https://example.com/image.png'. 
         * 
         *   The second parameter, alt, is a string with the 
         *   alternate text for the image. An empty string '' 
         *   can be used for images that aren't displayed. 
         * 
         *   The third parameter, crossOrigin, is optional. 
         *   It's a string that sets the crossOrigin property 
         *   of the image. Use 'anonymous' or 'use-credentials' 
         *   to fetch the image with cross-origin access. 
         * 
         *   The fourth parameter, callback, is also optional. 
         *   It sets a function to call after the image loads. 
         *   The new image is passed to the callback function 
         *   as a p5.Element object.
         *   @param src relative path or URL for the image.
         *   @param alt alternate text for the image.
         *   @param [crossOrigin] crossOrigin property to use 
         *   when fetching the image.
         *   @param [successCallback] function to call once the 
         *   image loads. The new image will be passed to the 
         *   function as a p5.Element object.
         *   @return new p5.Element object.
         */
        createImg(src: string, alt: string, crossOrigin?: string, successCallback?: (...args: any[]) => any): Element

        /**
         *   Creates an <a></a> element that links to another 
         *   web page. The first parmeter, href, is a string 
         *   that sets the URL of the linked page. 
         * 
         *   The second parameter, html, is a string that sets 
         *   the inner HTML of the link. It's common to use 
         *   text, images, or buttons as links. 
         * 
         *   The third parameter, target, is optional. It's a 
         *   string that tells the web browser where to open 
         *   the link. By default, links open in the current 
         *   browser tab. Passing '_blank' will cause the link 
         *   to open in a new browser tab. MDN describes a few 
         *   other options.
         *   @param href URL of linked page.
         *   @param html inner HTML of link element to display.
         *   @param [target] target where the new link should 
         *   open, either '_blank', '_self', '_parent', or 
         *   '_top'.
         *   @return new p5.Element object.
         */
        createA(href: string, html: string, target?: string): Element

        /**
         *   Creates a slider <input></input> element. Range 
         *   sliders are useful for quickly selecting numbers 
         *   from a given range. 
         * 
         *   The first two parameters, min and max, are numbers 
         *   that set the slider's minimum and maximum. 
         * 
         *   The third parameter, value, is optional. It's a 
         *   number that sets the slider's default value. 
         * 
         *   The fourth parameter, step, is also optional. It's 
         *   a number that sets the spacing between each value 
         *   in the slider's range. Setting step to 0 allows 
         *   the slider to move smoothly from min to max.
         *   @param min minimum value of the slider.
         *   @param max maximum value of the slider.
         *   @param [value] default value of the slider.
         *   @param [step] size for each step in the slider's 
         *   range.
         *   @return new p5.Element object.
         */
        createSlider(min: number, max: number, value?: number, step?: number): Element

        /**
         *   Creates a <button></button> element. The first 
         *   parameter, label, is a string that sets the label 
         *   displayed on the button. 
         * 
         *   The second parameter, value, is optional. It's a 
         *   string that sets the button's value. See MDN for 
         *   more details.
         *   @param label label displayed on the button.
         *   @param [value] value of the button.
         *   @return new p5.Element object.
         */
        createButton(label: string, value?: string): Element

        /**
         *   Creates a checkbox <input></input> element. 
         *   Checkboxes extend the p5.Element class with a 
         *   checked() method. Calling myBox.checked() returns 
         *   true if it the box is checked and false if not. 
         * 
         *   The first parameter, label, is optional. It's a 
         *   string that sets the label to display next to the 
         *   checkbox. 
         * 
         *   The second parameter, value, is also optional. 
         *   It's a boolean that sets the checkbox's value.
         *   @param [label] label displayed after the checkbox.
         *   @param [value] value of the checkbox. Checked is 
         *   true and unchecked is false.
         *   @return new p5.Element object.
         */
        createCheckbox(label?: string, value?: boolean): Element

        /**
         *   Creates a dropdown menu <select></select> element. 
         *   The parameter is optional. If true is passed, as 
         *   in let mySelect = createSelect(true), then the 
         *   dropdown will support multiple selections. If an 
         *   existing <select></select> element is passed, as 
         *   in let mySelect = createSelect(otherSelect), the 
         *   existing element will be wrapped in a new 
         *   p5.Element object. 
         * 
         *   Dropdowns extend the p5.Element class with a few 
         *   helpful methods for managing options: 
         * 
         *   - mySelect.option(name, [value]) adds an option to 
         *   the menu. The first paremeter, name, is a string 
         *   that sets the option's name and value. The second 
         *   parameter, value, is optional. If provided, it 
         *   sets the value that corresponds to the key name. 
         *   If an option with name already exists, its value 
         *   is changed to value.
         *   - mySelect.value() returns the currently-selected 
         *   option's value.
         *   - mySelect.selected() returns the 
         *   currently-selected option.
         *   - mySelect.selected(option) selects the given 
         *   option by default.
         *   - mySelect.disable() marks the whole dropdown 
         *   element as disabled.
         *   - mySelect.disable(option) marks a given option as 
         *   disabled.
         *   - mySelect.enable() marks the whole dropdown 
         *   element as enabled.
         *   - mySelect.enable(option) marks a given option as 
         *   enabled.
         *   @param [multiple] support multiple selections.
         *   @return new p5.Element object.
         */
        createSelect(multiple?: boolean): Element

        /**
         *   Creates a dropdown menu <select></select> element. 
         *   The parameter is optional. If true is passed, as 
         *   in let mySelect = createSelect(true), then the 
         *   dropdown will support multiple selections. If an 
         *   existing <select></select> element is passed, as 
         *   in let mySelect = createSelect(otherSelect), the 
         *   existing element will be wrapped in a new 
         *   p5.Element object. 
         * 
         *   Dropdowns extend the p5.Element class with a few 
         *   helpful methods for managing options: 
         * 
         *   - mySelect.option(name, [value]) adds an option to 
         *   the menu. The first paremeter, name, is a string 
         *   that sets the option's name and value. The second 
         *   parameter, value, is optional. If provided, it 
         *   sets the value that corresponds to the key name. 
         *   If an option with name already exists, its value 
         *   is changed to value.
         *   - mySelect.value() returns the currently-selected 
         *   option's value.
         *   - mySelect.selected() returns the 
         *   currently-selected option.
         *   - mySelect.selected(option) selects the given 
         *   option by default.
         *   - mySelect.disable() marks the whole dropdown 
         *   element as disabled.
         *   - mySelect.disable(option) marks a given option as 
         *   disabled.
         *   - mySelect.enable() marks the whole dropdown 
         *   element as enabled.
         *   - mySelect.enable(option) marks a given option as 
         *   enabled.
         *   @param existing select element to wrap, either as 
         *   a p5.Element or a HTMLSelectElement.
         */
        createSelect(existing: object): Element

        /**
         *   Creates a radio button element. The parameter is 
         *   optional. If a string is passed, as in let myRadio 
         *   = createSelect('food'), then each radio option 
         *   will have "food" as its name parameter: <input 
         *   name="food"></input>. If an existing <div></div> 
         *   or <span></span> element is passed, as in let 
         *   myRadio = createSelect(container), it will become 
         *   the radio button's parent element. 
         * 
         *   Radio buttons extend the p5.Element class with a 
         *   few helpful methods for managing options: 
         * 
         *   - myRadio.option(value, [label]) adds an option to 
         *   the menu. The first paremeter, value, is a string 
         *   that sets the option's value and label. The second 
         *   parameter, label, is optional. If provided, it 
         *   sets the label displayed for the value. If an 
         *   option with value already exists, its label is 
         *   changed and its value is returned.
         *   - myRadio.value() returns the currently-selected 
         *   option's value.
         *   - myRadio.selected() returns the 
         *   currently-selected option.
         *   - myRadio.selected(value) selects the given option 
         *   and returns it as an HTMLInputElement.
         *   - myRadio.disable(shouldDisable) enables the 
         *   entire radio button if true is passed and disables 
         *   it if false is passed.
         *   @param [containerElement] container HTML Element, 
         *   either a <div></div> or <span></span>.
         *   @return new p5.Element object.
         */
        createRadio(containerElement?: object): Element

        /**
         *   Creates a radio button element. The parameter is 
         *   optional. If a string is passed, as in let myRadio 
         *   = createSelect('food'), then each radio option 
         *   will have "food" as its name parameter: <input 
         *   name="food"></input>. If an existing <div></div> 
         *   or <span></span> element is passed, as in let 
         *   myRadio = createSelect(container), it will become 
         *   the radio button's parent element. 
         * 
         *   Radio buttons extend the p5.Element class with a 
         *   few helpful methods for managing options: 
         * 
         *   - myRadio.option(value, [label]) adds an option to 
         *   the menu. The first paremeter, value, is a string 
         *   that sets the option's value and label. The second 
         *   parameter, label, is optional. If provided, it 
         *   sets the label displayed for the value. If an 
         *   option with value already exists, its label is 
         *   changed and its value is returned.
         *   - myRadio.value() returns the currently-selected 
         *   option's value.
         *   - myRadio.selected() returns the 
         *   currently-selected option.
         *   - myRadio.selected(value) selects the given option 
         *   and returns it as an HTMLInputElement.
         *   - myRadio.disable(shouldDisable) enables the 
         *   entire radio button if true is passed and disables 
         *   it if false is passed.
         *   @param [name] name parameter assigned to each 
         *   option's <input></input> element.
         *   @return new p5.Element object.
         */
        createRadio(name?: string): Element

        /**
         *   Creates a radio button element. The parameter is 
         *   optional. If a string is passed, as in let myRadio 
         *   = createSelect('food'), then each radio option 
         *   will have "food" as its name parameter: <input 
         *   name="food"></input>. If an existing <div></div> 
         *   or <span></span> element is passed, as in let 
         *   myRadio = createSelect(container), it will become 
         *   the radio button's parent element. 
         * 
         *   Radio buttons extend the p5.Element class with a 
         *   few helpful methods for managing options: 
         * 
         *   - myRadio.option(value, [label]) adds an option to 
         *   the menu. The first paremeter, value, is a string 
         *   that sets the option's value and label. The second 
         *   parameter, label, is optional. If provided, it 
         *   sets the label displayed for the value. If an 
         *   option with value already exists, its label is 
         *   changed and its value is returned.
         *   - myRadio.value() returns the currently-selected 
         *   option's value.
         *   - myRadio.selected() returns the 
         *   currently-selected option.
         *   - myRadio.selected(value) selects the given option 
         *   and returns it as an HTMLInputElement.
         *   - myRadio.disable(shouldDisable) enables the 
         *   entire radio button if true is passed and disables 
         *   it if false is passed.
         *   @return new p5.Element object.
         */
        createRadio(): Element

        /**
         *   Creates a color picker element. The parameter, 
         *   value, is optional. If a color string or p5.Color 
         *   object is passed, it will set the default color. 
         * 
         *   Color pickers extend the p5.Element class with a 
         *   couple of helpful methods for managing colors: 
         * 
         *   - myPicker.value() returns the current color as a 
         *   hex string in the format '#rrggbb'.
         *   - myPicker.color() returns the current color as a 
         *   p5.Color object.
         *   @param [value] default color as a CSS color 
         *   string.
         *   @return new p5.Element object.
         */
        createColorPicker(value?: string|Color): Element

        /**
         *   Creates a text <input></input> element. Call 
         *   myInput.size() to set the length of the text box. 
         * 
         *   The first parameter, value, is optional. It's a 
         *   string that sets the input's default value. The 
         *   input is blank by default. 
         * 
         *   The second parameter, type, is also optional. It's 
         *   a string that specifies the type of text being 
         *   input. See MDN for a full list of options. The 
         *   default is 'text'.
         *   @param [value] default value of the input box. 
         *   Defaults to an empty string ''.
         *   @param [type] type of input. Defaults to 'text'.
         *   @return new p5.Element object.
         */
        createInput(value?: string, type?: string): Element

        /**
         *   Creates a text <input></input> element. Call 
         *   myInput.size() to set the length of the text box. 
         * 
         *   The first parameter, value, is optional. It's a 
         *   string that sets the input's default value. The 
         *   input is blank by default. 
         * 
         *   The second parameter, type, is also optional. It's 
         *   a string that specifies the type of text being 
         *   input. See MDN for a full list of options. The 
         *   default is 'text'.
         *   @param [value] default value of the input box. 
         *   Defaults to an empty string ''.
         */
        createInput(value?: string): Element

        /**
         *   Creates an <input></input> element of type 'file'. 
         *   createFileInput() allows users to select local 
         *   files for use in a sketch. It returns a p5.File 
         *   object. 
         * 
         *   The first parameter, callback, is a function 
         *   that's called when the file loads. The callback 
         *   function should have one parameter, file, that's a 
         *   p5.File object. 
         * 
         *   The second parameter, multiple, is optional. It's 
         *   a boolean value that allows loading multiple files 
         *   if set to true. If true, callback will be called 
         *   once per file.
         *   @param callback function to call once the file 
         *   loads.
         *   @param [multiple] allow multiple files to be 
         *   selected.
         *   @return The new input element.
         */
        createFileInput(callback: (...args: any[]) => any, multiple?: boolean): Element
    }
}
