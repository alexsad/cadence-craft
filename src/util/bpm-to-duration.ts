const bpmToMiliseconds = (bpm: number) => {
    if (bpm <= 0) {
        throw new Error("O BPM deve ser maior que zero.")
    }
    return (60 * 1000) / bpm
}

export { bpmToMiliseconds }
