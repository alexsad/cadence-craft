const bpmToMiliseconds = (bpm: number) => {
    if (bpm <= 0) {
        throw new Error("O BPM deve ser maior que zero.")
    }
    return (60 * 1000) / bpm
}

function getNoteDurationByIndex(bpm: number, index: number): number {
    if (index > 6 || index < 0) {
        return 0
    }
    const note = 4 * Math.pow(0.5, 6 - index);
    return (60 / bpm) * note * 1000;
}

function findClosestIndex(bpm: number, durationMs: number): number {
    const beatDuration = 60000 / bpm; // Duration of 1 beat in ms

    let closestIndex = 0;
    let smallestDifference = Infinity;

    for (let i = 0; i <= 6; i++) {
        const noteValue = 4 * Math.pow(0.5, i);
        const noteDuration = beatDuration * noteValue; // Note duration in ms

        const difference = Math.abs(noteDuration - durationMs);
        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestIndex = i;
        }
    }

    return closestIndex;
}


export { bpmToMiliseconds, findClosestIndex, getNoteDurationByIndex };

