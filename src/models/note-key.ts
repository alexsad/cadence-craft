export type INoteKey = {
    noteIndex: number,
    code: string,
    path: string,
    volume: number,
    duration: number,
    startAt: number,
    audioBuffer?: AudioBuffer,
}