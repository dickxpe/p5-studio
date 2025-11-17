// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class File {
        constructor(file: File);

        /**
         *   Underlying File object. All File properties and 
         *   methods are accessible.
         */
        file: File

        /**
         *   The file MIME type as a string. For example, 
         *   'image' and 'text' are both MIME types.
         */
        type: string

        /**
         *   The file subtype as a string. For example, a file 
         *   with an 'image' MIME type may have a subtype such 
         *   as png or jpeg.
         */
        subtype: string

        /**
         *   The file name as a string.
         */
        name: string

        /**
         *   The number of bytes in the file.
         */
        size: number

        /**
         *   A string containing the file's data. Data can be 
         *   either image data, text contents, or a parsed 
         *   object in the case of JSON and p5.XML objects.
         */
        data: any
    }
}
