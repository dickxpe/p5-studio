// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class Biquad extends p5soundNode {
        constructor(cutoff?: number, type?: string);

        /**
         *   The filter's resonance factor.
         *   @param resonance resonance of the filter. A number 
         *   between 0 and 100. Values closer to 100 can cause 
         *   the filter to self-oscillate and become loud!
         */
        res(resonance: number): void

        /**
         *   The gain of the filter in dB units.
         *   @param gain gain value in dB units. The gain is 
         *   only used for lowshelf, highshelf, and peaking 
         *   filters.
         */
        gain(gain: number): void

        /**
         *   Set the type of the filter.
         *   @param type type of the filter. Options: 
         *   "lowpass", "highpass", "bandpass", "lowshelf", 
         *   "highshelf", "notch", "allpass", and "peaking."
         */
        setType(type: string): void

        /**
         *   Set the cutoff frequency of the filter.
         *   @param cutoffFrequency the cutoff frequency of the 
         *   filter.
         */
        freq(cutoffFrequency: number): void
    }
    class LowPass extends Biquad {
        constructor(freq?: number);
    }
    class HighPass extends Biquad {
        constructor(freq?: number);
    }
    class BandPass extends Biquad {
        constructor(freq?: number);
    }
}
