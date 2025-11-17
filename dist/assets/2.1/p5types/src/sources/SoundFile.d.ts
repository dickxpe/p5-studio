// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class SoundFile extends p5soundSource {
        constructor();

        /**
         *   Start the soundfile.
         */
        start(): void

        /**
         *   Start the soundfile.
         */
        play(): void

        /**
         *   Stop the soundfile.
         */
        stop(): void

        /**
         *   Pause the soundfile.
         */
        pause(): void

        /**
         *   Loop the soundfile.
         *   @param loopState Set to True or False in order to 
         *   set the loop state.
         */
        loop(loopState: boolean): void

        /**
         *   Set a loop region. The loop() method must be set 
         *   to true for this to work.
         *   @param [startTime] The start time of the loop 
         *   point in seconds.
         *   @param [duration] The duration of the loop point 
         *   in seconds.
         */
        setLoop(startTime?: number, duration?: number): void

        /**
         *   Change the path for the soundfile.
         *   @param path Path to the sound file.
         *   @param [successCallback] Function to call when the 
         *   sound file is loaded.
         */
        setPath(path: string, successCallback?: (...args: any[]) => any): void

        /**
         *   Set the playback rate of the soundfile.
         *   @param rate 1 is normal speed, 2 is double speed. 
         *   Negative values plays the soundfile backwards.
         */
        rate(rate: number): void

        /**
         *   Returns the duration of a sound file in seconds.
         *   @return duration
         */
        duration(): number

        /**
         *   Return the sample rate of the sound file.
         *   @return sampleRate
         */
        sampleRate(): number

        /**
         *   Move the playhead of a soundfile that is currently 
         *   playing to a new position.
         *   @param timePoint Time to jump to in seconds.
         */
        jump(timePoint: number): void

        /**
         *   Return the playback state of the soundfile.
         *   @return Playback state, true or false.
         */
        isPlaying(): boolean

        /**
         *   Return the playback state of the soundfile.
         *   @return Looping State, true or false.
         */
        isLooping(): boolean

        /**
         *   Define a function to call when the soundfile is 
         *   done playing.
         *   @param callback Name of a function that will be 
         *   called when the soundfile is done playing.
         */
        onended(callback: (...args: any[]) => any): void

        /**
         *   Return the number of samples in a sound file.
         *   @return The number of samples in the sound file.
         */
        frames(): number

        // TODO: Fix channels() errors in src/sources/SoundFile.js, line 429:
        //
        //    return has invalid type: undefined
        //
        // channels(): undefined

    }
}
