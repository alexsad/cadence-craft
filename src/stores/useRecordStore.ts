import { create } from "zustand";
import { INoteKey } from "../models/note-key";
import { bpmToMiliseconds } from "../util/bpm-to-duration";
import { cloneObject } from "../util/clone_object";


interface IUseRecordStore {
    _tracks: INoteKey[],
    addNote: (note: INoteKey) => void,
    getTracks: () => INoteKey[],
    clear: () => Promise<void>,
    getNormalizeTracks: (bpm: number) => INoteKey[],
    setTracks: (tracks: INoteKey[]) => void,
}

const useRecordStore = create<IUseRecordStore>((set, get) => ({
    _tracks: [],
    addNote(note: INoteKey) {
        set(curr => ({
            _tracks: [
                ...curr._tracks,
                {
                    ...note,
                    audioBuffer: undefined,
                },
            ]
        }))
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
        return tracks.filter(track => track.noteIndex > 0).map((track, trackIndex) => ({
            ...track,
            duration: regularDuration,
            startAt: startDate + (trackIndex * regularDuration),
        }))
    }
}))

export { useRecordStore };

