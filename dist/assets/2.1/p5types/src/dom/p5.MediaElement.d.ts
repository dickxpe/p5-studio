// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class MediaElement extends Element {
        constructor(elt: string);

        /**
         *   Plays audio or video from a media element.
         */
        play(): void

        /**
         *   Stops a media element and sets its current time to 
         *   0. Calling media.play() will restart playing 
         *   audio/video from the beginning.
         */
        stop(): void

        /**
         *   Pauses a media element. Calling media.play() will 
         *   resume playing audio/video from the moment it 
         *   paused.
         */
        pause(): void

        /**
         *   Plays the audio/video repeatedly in a loop.
         */
        loop(): void

        /**
         *   Stops the audio/video from playing in a loop. The 
         *   media will stop when it finishes playing.
         */
        noLoop(): void

        /**
         *   Sets the audio/video to play once it's loaded. The 
         *   parameter, shouldAutoplay, is optional. Calling 
         *   media.autoplay() without an argument causes the 
         *   media to play automatically. If true is passed, as 
         *   in media.autoplay(true), the media will 
         *   automatically play. If false is passed, as in 
         *   media.autoPlay(false), it won't play 
         *   automatically.
         *   @param [shouldAutoplay] whether the element should 
         *   autoplay.
         */
        autoplay(shouldAutoplay?: boolean): void

        /**
         *   Sets the audio/video volume. Calling 
         *   media.volume() without an argument returns the 
         *   current volume as a number in the range 0 (off) to 
         *   1 (maximum). 
         * 
         *   The parameter, val, is optional. It's a number 
         *   that sets the volume from 0 (off) to 1 (maximum). 
         *   For example, calling media.volume(0.5) sets the 
         *   volume to half of its maximum.
         *   @return current volume.
         */
        volume(): number

        /**
         *   Sets the audio/video volume. Calling 
         *   media.volume() without an argument returns the 
         *   current volume as a number in the range 0 (off) to 
         *   1 (maximum). 
         * 
         *   The parameter, val, is optional. It's a number 
         *   that sets the volume from 0 (off) to 1 (maximum). 
         *   For example, calling media.volume(0.5) sets the 
         *   volume to half of its maximum.
         *   @param val volume between 0.0 and 1.0.
         */
        volume(val: number): void

        /**
         *   Sets the audio/video playback speed. The 
         *   parameter, val, is optional. It's a number that 
         *   sets the playback speed. 1 plays the media at 
         *   normal speed, 0.5 plays it at half speed, 2 plays 
         *   it at double speed, and so on. -1 plays the media 
         *   at normal speed in reverse. 
         * 
         *   Calling media.speed() returns the current speed as 
         *   a number. 
         * 
         *   Note: Not all browsers support backward playback. 
         *   Even if they do, playback might not be smooth.
         *   @return current playback speed.
         */
        speed(): number

        /**
         *   Sets the audio/video playback speed. The 
         *   parameter, val, is optional. It's a number that 
         *   sets the playback speed. 1 plays the media at 
         *   normal speed, 0.5 plays it at half speed, 2 plays 
         *   it at double speed, and so on. -1 plays the media 
         *   at normal speed in reverse. 
         * 
         *   Calling media.speed() returns the current speed as 
         *   a number. 
         * 
         *   Note: Not all browsers support backward playback. 
         *   Even if they do, playback might not be smooth.
         *   @param speed speed multiplier for playback.
         */
        speed(speed: number): void

        /**
         *   Sets the media element's playback time. The 
         *   parameter, time, is optional. It's a number that 
         *   specifies the time, in seconds, to jump to when 
         *   playback begins. 
         * 
         *   Calling media.time() without an argument returns 
         *   the number of seconds the audio/video has played. 
         * 
         *   Note: Time resets to 0 when looping media 
         *   restarts.
         *   @param [time] time to jump to (in seconds).
         *   @return current time (in seconds).
         */
        time(time?: number): number

        /**
         *   Returns the audio/video's duration in seconds.
         *   @return duration (in seconds).
         */
        duration(): number

        /**
         *   Calls a function when the audio/video reaches the 
         *   end of its playback. The element is passed as an 
         *   argument to the callback function. 
         * 
         *   Note: The function won't be called if the media is 
         *   looping.
         *   @param callback function to call when playback 
         *   ends. The p5.MediaElement is passed as the 
         *   argument.
         */
        onended(callback: (...args: any[]) => any): void

        /**
         *   Sends the element's audio to an output. The 
         *   parameter, audioNode, can be an AudioNode or an 
         *   object from the p5.sound library. 
         * 
         *   If no element is provided, as in 
         *   myElement.connect(), the element connects to the 
         *   main output. All connections are removed by the 
         *   .disconnect() method. 
         * 
         *   Note: This method is meant to be used with the 
         *   p5.sound.js addon library.
         *   @param audioNode AudioNode from the Web Audio API, 
         *   or an object from the p5.sound library
         */
        connect(audioNode: AudioNode|object): void

        /**
         *   Disconnect all Web Audio routing, including to the 
         *   main output. This is useful if you want to 
         *   re-route the output through audio effects, for 
         *   example.
         */
        disconnect(): void

        /**
         *   Show the default HTMLMediaElement controls. Note: 
         *   The controls vary between web browsers.
         */
        showControls(): void

        /**
         *   Hide the default HTMLMediaElement controls.
         */
        hideControls(): void

        /**
         *   Schedules a function to call when the audio/video 
         *   reaches a specific time during its playback. The 
         *   first parameter, time, is the time, in seconds, 
         *   when the function should run. This value is passed 
         *   to callback as its first argument. 
         * 
         *   The second parameter, callback, is the function to 
         *   call at the specified cue time. 
         * 
         *   The third parameter, value, is optional and can be 
         *   any type of value. value is passed to callback. 
         * 
         *   Calling media.addCue() returns an ID as a string. 
         *   This is useful for removing the cue later.
         *   @param time cue time to run the callback function.
         *   @param callback function to call at the cue time.
         *   @param [value] object to pass as the argument to 
         *   callback.
         *   @return id ID of this cue, useful for 
         *   media.removeCue(id).
         */
        addCue(time: number, callback: (...args: any[]) => any, value?: object): number

        /**
         *   Removes a callback based on its ID.
         *   @param id ID of the cue, created by 
         *   media.addCue().
         */
        removeCue(id: number): void

        /**
         *   Removes all functions scheduled with 
         *   media.addCue().
         */
        clearCues(): void

        /**
         *   Path to the media element's source as a string.
         */
        src: any
    }
    interface p5InstanceExtensions {
        /**
         *   Helpers for create methods.
         */
        addElement(): void

        /**
         *   Helpers for create methods.
         */
        addElement(): void

        /**
         *   Creates a <video> element for simple audio/video 
         *   playback. createVideo() returns a new 
         *   p5.MediaElement object. Videos are shown by 
         *   default. They can be hidden by calling 
         *   video.hide() and drawn to the canvas using 
         *   image(). 
         * 
         *   The first parameter, src, is the path the video. 
         *   If a single string is passed, as in 
         *   'assets/topsecret.mp4', a single video is loaded. 
         *   An array of strings can be used to load the same 
         *   video in different formats. For example, 
         *   ['assets/topsecret.mp4', 'assets/topsecret.ogv', 
         *   'assets/topsecret.webm']. This is useful for 
         *   ensuring that the video can play across different 
         *   browsers with different capabilities. See MDN for 
         *   more information about supported formats. 
         * 
         *   The second parameter, callback, is optional. It's 
         *   a function to call once the video is ready to 
         *   play.
         *   @param [src] path to a video file, or an array of 
         *   paths for supporting different browsers.
         *   @param [callback] function to call once the video 
         *   is ready to play.
         *   @return new p5.MediaElement object.
         */
        createVideo(src?: string|string[], callback?: (...args: any[]) => any): MediaElement

        /**
         *   Creates a hidden <audio> element for simple audio 
         *   playback. createAudio() returns a new 
         *   p5.MediaElement object. 
         * 
         *   The first parameter, src, is the path the audio. 
         *   If a single string is passed, as in 
         *   'assets/audio.mp3', a single audio is loaded. An 
         *   array of strings can be used to load the same 
         *   audio in different formats. For example, 
         *   ['assets/audio.mp3', 'assets/video.wav']. This is 
         *   useful for ensuring that the audio can play across 
         *   different browsers with different capabilities. 
         *   See MDN for more information about supported 
         *   formats. 
         * 
         *   The second parameter, callback, is optional. It's 
         *   a function to call once the audio is ready to 
         *   play.
         *   @param [src] path to an audio file, or an array of 
         *   paths for supporting different browsers.
         *   @param [callback] function to call once the audio 
         *   is ready to play.
         *   @return new p5.MediaElement object.
         */
        createAudio(src?: string|string[], callback?: (...args: any[]) => any): MediaElement

        /**
         *   Creates a <video> element that "captures" the 
         *   audio/video stream from the webcam and microphone. 
         *   createCapture() returns a new p5.MediaElement 
         *   object. Videos are shown by default. They can be 
         *   hidden by calling capture.hide() and drawn to the 
         *   canvas using image(). 
         * 
         *   The first parameter, type, is optional. It sets 
         *   the type of capture to use. By default, 
         *   createCapture() captures both audio and video. If 
         *   VIDEO is passed, as in createCapture(VIDEO), only 
         *   video will be captured. If AUDIO is passed, as in 
         *   createCapture(AUDIO), only audio will be captured. 
         *   A constraints object can also be passed to 
         *   customize the stream. See the  W3C documentation 
         *   for possible properties. Different browsers 
         *   support different properties. 
         * 
         *   The 'flipped' property is an optional property 
         *   which can be set to {flipped:true} to mirror the 
         *   video output.If it is true then it means that 
         *   video will be mirrored or flipped and if nothing 
         *   is mentioned then by default it will be false. 
         * 
         *   The second parameter,callback, is optional. It's a 
         *   function to call once the capture is ready for 
         *   use. The callback function should have one 
         *   parameter, stream, that's a MediaStream object. 
         * 
         *   Note: createCapture() only works when running a 
         *   sketch locally or using HTTPS. Learn more here and 
         *   here.
         *   @param [type] type of capture, either AUDIO or 
         *   VIDEO, or a constraints object. Both video and 
         *   audio audio streams are captured by default.
         *   @param [flipped] flip the capturing video and 
         *   mirror the output with {flipped:true}. By default 
         *   it is false.
         *   @param [callback] function to call once the stream 
         *   has loaded.
         *   @return new p5.MediaElement object.
         */
        createCapture(type?: object, flipped?: object, callback?: (...args: any[]) => any): MediaElement
        VIDEO: any
        AUDIO: any
    }
}
