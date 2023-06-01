export enum BuzzerWaveformType {
    Sine,
    Square,
    Sawtooth,
    Triangle
}
export const BuzzerWaveformObject: OscillatorType[] = [
    "sine",
    "square",
    "sawtooth",
    "triangle",
]

export function beep(hertz: number, waveform: OscillatorType, timeinms: number) {
    const audioContext = new (window.AudioContext)();

    const oscillator = audioContext.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.value = hertz; // value in hertz

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, timeinms);
}