import { create } from "zustand";
import { INoteKey } from "../models/note-key";
import { cloneObject } from "../util/clone_object";


interface IUseRecordStore {
    _tracks: INoteKey[],
    addNote: (note: INoteKey) => void,
    getTrack: () => INoteKey[],
    clear: () => Promise<void>,
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
                    path: '',
                },
            ]
        }))
    },
    getTrack() {
        return cloneObject(get()._tracks)
    },
    clear: async () => {
        set({
            _tracks: [],
        })
    },
}))

export { useRecordStore };

