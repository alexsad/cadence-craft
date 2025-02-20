import { INoteKey } from "../models/note-key";

function exportWAV(audioBuffer: AudioBuffer) {
    let numOfChannels = audioBuffer.numberOfChannels;
    let sampleRate = audioBuffer.sampleRate;
    let numOfSamples = audioBuffer.length;

    let wavBuffer = new ArrayBuffer(44 + numOfSamples * numOfChannels * 2);
    let view = new DataView(wavBuffer);

    // Escrevendo o cabeçalho WAV
    let writeString = (offset: number, type: string) => {
        for (let i = 0; i < type.length; i++) {
            view.setUint8(offset + i, type.charCodeAt(i));
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numOfSamples * numOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numOfSamples * numOfChannels * 2, true);

    // Escrever os samples
    let offset = 44;
    for (let i = 0; i < numOfSamples; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
            let sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([view], { type: 'audio/wav' });
}


async function concatenateAudio(audioList: INoteKey[]) {
    const audioContext = new AudioContext();
    let totalDuration = audioList.reduce((sum, { duration }) => sum + duration, 0);

    let finalBuffer = audioContext.createBuffer(
        1,
        audioContext.sampleRate * (totalDuration / 1000),
        audioContext.sampleRate
    );

    let currentOffset = 0;

    for (let { path: soundURL, duration } of audioList) {
        let arrayBuffer = await fetch(soundURL).then(res => res.arrayBuffer());
        let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        finalBuffer.copyToChannel(audioBuffer.getChannelData(0), 0, currentOffset);
        currentOffset += audioContext.sampleRate * (duration / 1000);
    }

    return exportWAV(finalBuffer);
}

export { concatenateAudio };
