import { create } from "zustand";
import { INoteKey } from "../models/note-key";
import { findClosestIndex, getNoteDurationByIndex } from "../util/bpm-to-duration";
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
        const { _bpm } = get()
        const closestIndex = 6 - findClosestIndex(_bpm, note.duration)

        set(curr => ({
            _tracks: [
                ...curr._tracks,
                {
                    ...note,
                    noteValue: closestIndex,
                    id: genUUID(),
                    audioBuffer: undefined,
                },
            ]
        }))
    },
    updateNote(trackId: string, callback: (currNote: INoteKey) => INoteKey) {
        const { _tracks } = get()
        const trackIndex = _tracks.findIndex(item => item.id === trackId)
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
        const { _tracks, _bpm } = get()
        const [firstNote] = _tracks
        if (!_tracks.length) {
            return []
        }
        return cloneObject(
            _tracks.reduce((prev, curr,) => {
                const startAt = curr.startAt - firstNote.startAt
                return [
                    ...prev,
                    {
                        ...curr,
                        startAt,
                        duration: getNoteDurationByIndex(_bpm, curr.noteValue),
                    }
                ]
            }, [] as INoteKey[])
        )
    },
    clear: async () => {
        set({
            _tracks: [],
        })
    },
}))

export { useRecordStore };

