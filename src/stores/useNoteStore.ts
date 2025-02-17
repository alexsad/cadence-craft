import { create } from "zustand";
import { INoteKey } from "../models/note-key";


interface IUseNoteStore {
    _currNote?: INoteKey,
    getCurrNote: () => INoteKey | undefined,
    setCurrNote: (note?: INoteKey) => void,
}

const useNoteStore = create<IUseNoteStore>((set, get) => ({
    getCurrNote() {
        const { _currNote } = get()
        // if (_currNote) {
        //     return cloneObject(_currNote)
        // }
        return _currNote
    },
    setCurrNote(note?: INoteKey) {
        set({
            _currNote: note
        })
    },
}))

export { useNoteStore };

