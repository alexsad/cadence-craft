import { create } from "zustand";
import { INoteKey } from "../models/note-key";
import { bpmToMiliseconds } from "../util/bpm-to-duration";
import { cloneObject } from "../util/clone_object";
import { genUUID } from "../util/gen_uuid";


interface IUseRecordStore {
    _tracks: INoteKey[],
    _bpm: number,
    getBPM: () => number,
    setBPM: (bpm: number) => void,
    addNote: (note: INoteKey) => void,
    getTracks: () => INoteKey[],
    clear: () => Promise<void>,
    getNormalizeTracks: (bpm: number) => INoteKey[],
    setTracks: (tracks: INoteKey[]) => void,
    updateNote: (trackId: string, callback: (currNote: INoteKey) => INoteKey) => void,
    isProcessing: boolean,
    setIsProcessing: (on: boolean) => void,
}

const useRecordStore = create<IUseRecordStore>((set, get) => ({
    _tracks: [],
    _bpm: 100,
    isProcessing: false,
    setIsProcessing(on: boolean) {
        set({
            isProcessing: on,
        })
    },
    getBPM() {
        return get()._bpm
    },
    setBPM(bmp: number) {
        set({
            _bpm: bmp,
        })
    },
    addNote(note: INoteKey) {
        set(curr => ({
            _tracks: [
                ...curr._tracks,
                {
                    ...note,
                    id: genUUID(),
                    audioBuffer: undefined,
                },
            ]
        }))
    },
    updateNote(trackId: string, callback: (currNote: INoteKey) => INoteKey) {
        const { _tracks } = get()
        const trackIndex = _tracks.findIndex(item => item.id === trackId)
        console.log('track:', trackIndex)
        if (trackIndex > -1 && _tracks[trackIndex]) {
            _tracks[trackIndex] = {
                ...callback(_tracks[trackIndex])
            }
            set({
                _tracks: [
                    ..._tracks,
                ]
            })
        }
    },

    setTracks(tracks: INoteKey[]) {
        set({
            _tracks: tracks,
        })
    },
    getTracks() {
        const { _tracks } = get()
        const [firstNote] = _tracks
        if (!_tracks.length) {
            return []
        }
        return cloneObject(
            _tracks.reduce((prev, curr, currentIndex) => {
                const startAt = curr.startAt - firstNote.startAt
                prev.push({
                    ...curr,
                    startAt,
                })
                const nextIndex = currentIndex + 1
                if (nextIndex < _tracks.length) {
                    const nextTrack = _tracks[nextIndex]
                    const nextStartAt = startAt + curr.duration
                    const nextTrackStartAt = (nextTrack.startAt - firstNote.startAt)
                    const duration = nextTrackStartAt - nextStartAt
                    prev.push({
                        noteIndex: 0,
                        code: '',
                        path: '/samples/default/silent_quarter-second.wav',
                        volume: 0,
                        duration,
                        startAt: nextStartAt,
                    })
                }
                return prev
            }, [] as INoteKey[])
        )
    },
    clear: async () => {
        set({
            _tracks: [],
        })
    },
    getNormalizeTracks(bpm: number) {
        const { getTracks } = get()
        const tracks = getTracks()
        const regularDuration = bpmToMiliseconds(bpm)
        const startDate = new Date().getTime()
        const silinteDuration = 50
        return tracks
            .filter(track => track.noteIndex > 0)
            .map((track, trackIndex) => ({
                ...track,
                duration: regularDuration,
                startAt: (startDate + (trackIndex * regularDuration)) - silinteDuration,
            }))
            .reduce((prev, curr) => {
                return [
                    ...prev,
                    curr,
                    {
                        noteIndex: 0,
                        code: '',
                        path: '/samples/default/silent_quarter-second.wav',
                        volume: 0,
                        duration: silinteDuration,
                        startAt: curr.startAt,
                    },
                ]
            }, [] as INoteKey[])
    }
}))

export { useRecordStore };

