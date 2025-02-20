import { INoteKey } from "../models/note-key";

function exportWAV(audioBuffer: AudioBuffer) {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const numOfSamples = audioBuffer.length;

    const wavBuffer = new ArrayBuffer(44 + numOfSamples * numOfChannels * 2);
    const view = new DataView(wavBuffer);

    // Escrevendo o cabeçalho WAV
    const writeString = (offset: number, type: string) => {
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
            const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([view], { type: 'audio/wav' });
}


async function concatenateAudio(audioList: INoteKey[]) {
    const audioContext = new AudioContext();
    const totalDuration = audioList.reduce((sum, { duration }) => sum + duration, 0);

    const finalBuffer = audioContext.createBuffer(
        1,
        audioContext.sampleRate * (totalDuration / 1000),
        audioContext.sampleRate
    );

    let currentOffset = 0;

    for (const { path: soundURL, duration } of audioList) {
        const arrayBuffer = await fetch(soundURL).then(res => res.arrayBuffer());
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        finalBuffer.copyToChannel(audioBuffer.getChannelData(0), 0, currentOffset);
        currentOffset += audioContext.sampleRate * (duration / 1000);
    }

    return exportWAV(finalBuffer);
}

export { concatenateAudio };
