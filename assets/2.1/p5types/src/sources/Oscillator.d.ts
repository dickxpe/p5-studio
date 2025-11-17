// This file was auto-generated. Please do not edit it.

import * as p5 from '../../index'

declare module '../../index' {
    class Oscillator extends p5soundSource {
        constructor(frequency?: number, type?: string);

        /**
         *   Adjusts the frequency of the oscillator.
         *   @param frequency frequency of the oscillator in Hz 
         *   (cycles per second).
         *   @param [rampTime] the time in seconds it takes to 
         *   ramp to the new frequency (defaults to 0).
         */
        freq(frequency: number, rampTime?: number): void

        /**
         *   Adjusts the phase of the oscillator.
         *   @param phase phase of the oscillator in degrees 
         *   (0-360).
         */
        phase(phase: number): void

        /**
         *   Sets the type of the oscillator.
         *   @param type type of the oscillator. Options: 
         *   'sine' (default), 'triangle', 'sawtooth', 'square'
         */
        setType(type: string): void
    }
    class SawOsc extends Oscillator {
        constructor(freq?: number);
    }
    class SqrOsc extends Oscillator {
        constructor(freq?: number);
    }
    class TriOsc extends Oscillator {
        constructor(freq?: number);
    }
    class SinOsc extends Oscillator {
        constructor(freq?: number);
    }
}
