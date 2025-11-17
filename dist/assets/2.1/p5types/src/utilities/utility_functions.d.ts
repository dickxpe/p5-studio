// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    interface p5InstanceExtensions {
        /**
         *   Converts a Number into a String with a given 
         *   number of digits. nf() converts numbers such as 
         *   123.45 into strings formatted with a set number of 
         *   digits, as in '123.4500'. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nf(123.45) 
         *   returns the string '123.45'. If an array of 
         *   numbers is passed, as in nf([123.45, 67.89]), an 
         *   array of formatted strings will be returned. 
         * 
         *   The second parameter, left, is optional. If a 
         *   number is passed, as in nf(123.45, 4), it sets the 
         *   minimum number of digits to include to the left of 
         *   the decimal place. If left is larger than the 
         *   number of digits in num, then unused digits will 
         *   be set to 0. For example, calling nf(123.45, 4) 
         *   returns the string '0123.45'. 
         * 
         *   The third parameter, right, is also optional. If a 
         *   number is passed, as in nf(123.45, 4, 1), it sets 
         *   the minimum number of digits to include to the 
         *   right of the decimal place. If right is smaller 
         *   than the number of decimal places in num, then num 
         *   will be rounded to the given number of decimal 
         *   places. For example, calling nf(123.45, 4, 1) 
         *   returns the string '0123.5'. If right is larger 
         *   than the number of decimal places in num, then 
         *   unused decimal places will be set to 0. For 
         *   example, calling nf(123.45, 4, 3) returns the 
         *   string '0123.450'. 
         * 
         *   When the number is negative, for example, calling 
         *   nf(-123.45, 5, 2) returns the string '-00123.45'.
         *   @param num number to format.
         *   @param [left] number of digits to include to the 
         *   left of the decimal point.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted string.
         */
        nf(num: number|string, left?: number|string, right?: number|string): string

        /**
         *   Converts a Number into a String with a given 
         *   number of digits. nf() converts numbers such as 
         *   123.45 into strings formatted with a set number of 
         *   digits, as in '123.4500'. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nf(123.45) 
         *   returns the string '123.45'. If an array of 
         *   numbers is passed, as in nf([123.45, 67.89]), an 
         *   array of formatted strings will be returned. 
         * 
         *   The second parameter, left, is optional. If a 
         *   number is passed, as in nf(123.45, 4), it sets the 
         *   minimum number of digits to include to the left of 
         *   the decimal place. If left is larger than the 
         *   number of digits in num, then unused digits will 
         *   be set to 0. For example, calling nf(123.45, 4) 
         *   returns the string '0123.45'. 
         * 
         *   The third parameter, right, is also optional. If a 
         *   number is passed, as in nf(123.45, 4, 1), it sets 
         *   the minimum number of digits to include to the 
         *   right of the decimal place. If right is smaller 
         *   than the number of decimal places in num, then num 
         *   will be rounded to the given number of decimal 
         *   places. For example, calling nf(123.45, 4, 1) 
         *   returns the string '0123.5'. If right is larger 
         *   than the number of decimal places in num, then 
         *   unused decimal places will be set to 0. For 
         *   example, calling nf(123.45, 4, 3) returns the 
         *   string '0123.450'. 
         * 
         *   When the number is negative, for example, calling 
         *   nf(-123.45, 5, 2) returns the string '-00123.45'.
         *   @param nums numbers to format.
         *   @param [left] number of digits to include to the 
         *   left of the decimal point.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted strings.
         */
        nf(nums: number[], left?: number|string, right?: number|string): string[]

        /**
         *   Converts a Number into a String with commas to 
         *   mark units of 1,000. nfc() converts numbers such 
         *   as 12345 into strings formatted with commas to 
         *   mark the thousands place, as in '12,345'. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nfc(12345) 
         *   returns the string '12,345'. 
         * 
         *   The second parameter, right, is optional. If a 
         *   number is passed, as in nfc(12345, 1), it sets the 
         *   minimum number of digits to include to the right 
         *   of the decimal place. If right is smaller than the 
         *   number of decimal places in num, then num will be 
         *   rounded to the given number of decimal places. For 
         *   example, calling nfc(12345.67, 1) returns the 
         *   string '12,345.7'. If right is larger than the 
         *   number of decimal places in num, then unused 
         *   decimal places will be set to 0. For example, 
         *   calling nfc(12345.67, 3) returns the string 
         *   '12,345.670'.
         *   @param num number to format.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted string.
         */
        nfc(num: number|string, right?: number|string): string

        /**
         *   Converts a Number into a String with commas to 
         *   mark units of 1,000. nfc() converts numbers such 
         *   as 12345 into strings formatted with commas to 
         *   mark the thousands place, as in '12,345'. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nfc(12345) 
         *   returns the string '12,345'. 
         * 
         *   The second parameter, right, is optional. If a 
         *   number is passed, as in nfc(12345, 1), it sets the 
         *   minimum number of digits to include to the right 
         *   of the decimal place. If right is smaller than the 
         *   number of decimal places in num, then num will be 
         *   rounded to the given number of decimal places. For 
         *   example, calling nfc(12345.67, 1) returns the 
         *   string '12,345.7'. If right is larger than the 
         *   number of decimal places in num, then unused 
         *   decimal places will be set to 0. For example, 
         *   calling nfc(12345.67, 3) returns the string 
         *   '12,345.670'.
         *   @param nums numbers to format.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted strings.
         */
        nfc(nums: number[], right?: number|string): string[]

        /**
         *   Converts a Number into a String with a plus or 
         *   minus sign. nfp() converts numbers such as 123 
         *   into strings formatted with a + or - symbol to 
         *   mark whether they're positive or negative, as in 
         *   '+123'. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nfp(123.45) 
         *   returns the string '+123.45'. If an array of 
         *   numbers is passed, as in nfp([123.45, -6.78]), an 
         *   array of formatted strings will be returned. 
         * 
         *   The second parameter, left, is optional. If a 
         *   number is passed, as in nfp(123.45, 4), it sets 
         *   the minimum number of digits to include to the 
         *   left of the decimal place. If left is larger than 
         *   the number of digits in num, then unused digits 
         *   will be set to 0. For example, calling nfp(123.45, 
         *   4) returns the string '+0123.45'. 
         * 
         *   The third parameter, right, is also optional. If a 
         *   number is passed, as in nfp(123.45, 4, 1), it sets 
         *   the minimum number of digits to include to the 
         *   right of the decimal place. If right is smaller 
         *   than the number of decimal places in num, then num 
         *   will be rounded to the given number of decimal 
         *   places. For example, calling nfp(123.45, 4, 1) 
         *   returns the string '+0123.5'. If right is larger 
         *   than the number of decimal places in num, then 
         *   unused decimal places will be set to 0. For 
         *   example, calling nfp(123.45, 4, 3) returns the 
         *   string '+0123.450'.
         *   @param num number to format.
         *   @param [left] number of digits to include to the 
         *   left of the decimal point.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted string.
         */
        nfp(num: number, left?: number, right?: number): string

        /**
         *   Converts a Number into a String with a plus or 
         *   minus sign. nfp() converts numbers such as 123 
         *   into strings formatted with a + or - symbol to 
         *   mark whether they're positive or negative, as in 
         *   '+123'. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nfp(123.45) 
         *   returns the string '+123.45'. If an array of 
         *   numbers is passed, as in nfp([123.45, -6.78]), an 
         *   array of formatted strings will be returned. 
         * 
         *   The second parameter, left, is optional. If a 
         *   number is passed, as in nfp(123.45, 4), it sets 
         *   the minimum number of digits to include to the 
         *   left of the decimal place. If left is larger than 
         *   the number of digits in num, then unused digits 
         *   will be set to 0. For example, calling nfp(123.45, 
         *   4) returns the string '+0123.45'. 
         * 
         *   The third parameter, right, is also optional. If a 
         *   number is passed, as in nfp(123.45, 4, 1), it sets 
         *   the minimum number of digits to include to the 
         *   right of the decimal place. If right is smaller 
         *   than the number of decimal places in num, then num 
         *   will be rounded to the given number of decimal 
         *   places. For example, calling nfp(123.45, 4, 1) 
         *   returns the string '+0123.5'. If right is larger 
         *   than the number of decimal places in num, then 
         *   unused decimal places will be set to 0. For 
         *   example, calling nfp(123.45, 4, 3) returns the 
         *   string '+0123.450'.
         *   @param nums numbers to format.
         *   @param [left] number of digits to include to the 
         *   left of the decimal point.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted strings.
         */
        nfp(nums: number[], left?: number, right?: number): string[]

        /**
         *   Converts a positive Number into a String with an 
         *   extra space in front. nfs() converts positive 
         *   numbers such as 123.45 into strings formatted with 
         *   an extra space in front, as in ' 123.45'. Doing so 
         *   can be helpful for aligning positive and negative 
         *   numbers. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nfs(123.45) 
         *   returns the string ' 123.45'. 
         * 
         *   The second parameter, left, is optional. If a 
         *   number is passed, as in nfs(123.45, 4), it sets 
         *   the minimum number of digits to include to the 
         *   left of the decimal place. If left is larger than 
         *   the number of digits in num, then unused digits 
         *   will be set to 0. For example, calling nfs(123.45, 
         *   4) returns the string ' 0123.45'. 
         * 
         *   The third parameter, right, is also optional. If a 
         *   number is passed, as in nfs(123.45, 4, 1), it sets 
         *   the minimum number of digits to include to the 
         *   right of the decimal place. If right is smaller 
         *   than the number of decimal places in num, then num 
         *   will be rounded to the given number of decimal 
         *   places. For example, calling nfs(123.45, 4, 1) 
         *   returns the string ' 0123.5'. If right is larger 
         *   than the number of decimal places in num, then 
         *   unused decimal places will be set to 0. For 
         *   example, calling nfs(123.45, 4, 3) returns the 
         *   string ' 0123.450'.
         *   @param num number to format.
         *   @param [left] number of digits to include to the 
         *   left of the decimal point.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted string.
         */
        nfs(num: number, left?: number, right?: number): string

        /**
         *   Converts a positive Number into a String with an 
         *   extra space in front. nfs() converts positive 
         *   numbers such as 123.45 into strings formatted with 
         *   an extra space in front, as in ' 123.45'. Doing so 
         *   can be helpful for aligning positive and negative 
         *   numbers. 
         * 
         *   The first parameter, num, is the number to convert 
         *   to a string. For example, calling nfs(123.45) 
         *   returns the string ' 123.45'. 
         * 
         *   The second parameter, left, is optional. If a 
         *   number is passed, as in nfs(123.45, 4), it sets 
         *   the minimum number of digits to include to the 
         *   left of the decimal place. If left is larger than 
         *   the number of digits in num, then unused digits 
         *   will be set to 0. For example, calling nfs(123.45, 
         *   4) returns the string ' 0123.45'. 
         * 
         *   The third parameter, right, is also optional. If a 
         *   number is passed, as in nfs(123.45, 4, 1), it sets 
         *   the minimum number of digits to include to the 
         *   right of the decimal place. If right is smaller 
         *   than the number of decimal places in num, then num 
         *   will be rounded to the given number of decimal 
         *   places. For example, calling nfs(123.45, 4, 1) 
         *   returns the string ' 0123.5'. If right is larger 
         *   than the number of decimal places in num, then 
         *   unused decimal places will be set to 0. For 
         *   example, calling nfs(123.45, 4, 3) returns the 
         *   string ' 0123.450'.
         *   @param nums numbers to format.
         *   @param [left] number of digits to include to the 
         *   left of the decimal point.
         *   @param [right] number of digits to include to the 
         *   right of the decimal point.
         *   @return formatted strings.
         */
        nfs(nums: any[], left?: number, right?: number): string[]

        /**
         *   Splits a String into pieces and returns an array 
         *   containing the pieces. splitTokens() is an 
         *   enhanced version of split(). It can split a string 
         *   when any characters from a list are detected. 
         * 
         *   The first parameter, value, is the string to 
         *   split. 
         * 
         *   The second parameter, delim, is optional. It sets 
         *   the character(s) that should be used to split the 
         *   string. delim can be a single string, as in 
         *   splitTokens('rock...paper...scissors...shoot', 
         *   '...'), or an array of strings, as in 
         *   splitTokens('rock;paper,scissors...shoot, [';', 
         *   ',', '...']). By default, if no delim characters 
         *   are specified, then any whitespace character is 
         *   used to split. Whitespace characters include tab 
         *   (\t), line feed (\n), carriage return (\r), form 
         *   feed (\f), and space.
         *   @param value string to split.
         *   @param [delim] character(s) to use for splitting 
         *   the string.
         *   @return separated strings.
         */
        splitTokens(value: string, delim?: string): string[]

        /**
         *   Shuffles the elements of an array. The first 
         *   parameter, array, is the array to be shuffled. For 
         *   example, calling shuffle(myArray) will shuffle the 
         *   elements of myArray. By default, the original 
         *   array won’t be modified. Instead, a copy will be 
         *   created, shuffled, and returned. 
         * 
         *   The second parameter, modify, is optional. If true 
         *   is passed, as in shuffle(myArray, true), then the 
         *   array will be shuffled in place without making a 
         *   copy.
         *   @param array array to shuffle.
         *   @param [bool] if true, shuffle the original array 
         *   in place. Defaults to false.
         *   @return shuffled array.
         */
        shuffle(array: any[], bool?: boolean): any[]
    }
}
