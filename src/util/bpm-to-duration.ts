const bpmToMiliseconds = (bpm: number) => {
    if (bpm <= 0) {
        throw new Error("O BPM deve ser maior que zero.")
    }
    return (60 * 1000) / bpm
}

function getNoteDurationByIndex(bpm: number, indice: number): number {
    if (indice > 6 || indice < 0) {
        return 0
    }
    const nota = 4 * Math.pow(0.5, 6 - indice);
    return (60 / bpm) * nota * 1000;
}

export { bpmToMiliseconds, getNoteDurationByIndex };

