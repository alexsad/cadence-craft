import { create } from "zustand";
import { INoteKey } from "../models/note-key";
import { cloneObject } from "../util/clone_object";

interface IUseNotesStore {
    _notes: Map<number, INoteKey>,
    getNotes: () => INoteKey[],
    getNoteByIndex: (noteIndex: number) => INoteKey | undefined,
    updateNote: (note: INoteKey) => void,
}

const useNotesStore = create<IUseNotesStore>((set, get) => ({
    _notes: [
        {
            code: 'c1',
            path: '/samples/nokia-3310/c1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 60,
        },
        {
            code: 'c#1',
            path: '/samples/nokia-3310/c_1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 61,
        },
        {
            code: 'd1',
            path: '/samples/nokia-3310/d1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 62,
        },
        {
            code: 'd#1',
            path: '/samples/nokia-3310/d_1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 63,
        },
        {
            code: 'e1',
            path: '/samples/nokia-3310/e1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 64,
        },
        {
            code: 'f1',
            path: '/samples/nokia-3310/f1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 65,
        },
        {
            code: 'f#1',
            path: '/samples/nokia-3310/f_1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 66,
        },
        {
            code: 'g1',
            path: '/samples/nokia-3310/g1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 67,
        },
        {
            code: 'g#1',
            path: '/samples/nokia-3310/g_1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 68,
        },
        {
            code: 'a1',
            path: '/samples/nokia-3310/a1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 69,
        },
        {
            code: 'a#1',
            path: '/samples/nokia-3310/a_1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 70,
        },
        {
            code: 'b1',
            path: '/samples/nokia-3310/b1.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 71,
        },
        {
            code: 'c2',
            path: '/samples/nokia-3310/c2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 72,
        },
        {
            code: 'c#2',
            path: '/samples/nokia-3310/c_2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 73,
        },
        {
            code: 'd2',
            path: '/samples/nokia-3310/d2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 74,
        },
        {
            code: 'd#2',
            path: '/samples/nokia-3310/d_2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 75,
        },
        {
            code: 'e2',
            path: '/samples/nokia-3310/e2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 76,
        },
        {
            code: 'f2',
            path: '/samples/nokia-3310/f2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 77,
        },
        {
            code: 'f#2',
            path: '/samples/nokia-3310/f_2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 78,
        },
        {
            code: 'g2',
            path: '/samples/nokia-3310/g2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 79,
        },
        {
            code: 'g#2',
            path: '/samples/nokia-3310/g_2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 80,
        },
        {
            code: 'a2',
            path: '/samples/nokia-3310/a2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 81,
        },
        {
            code: 'a#2',
            path: '/samples/nokia-3310/a_2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 82,
        },
        {
            code: 'b2',
            path: '/samples/nokia-3310/b2.wav',
            duration: 0,
            startAt: 0,
            volume: 1,
            noteIndex: 83,
        },
        // {
        //     code: '_',
        //     path: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=',
        //     duration: 0,
        //     startAt: 0,
        //     volume: 1,
        //     noteIndex: 0,
        // },
    ].reduce((acc, item) => {
        acc.set(item.noteIndex, item);
        return acc;
    }, new Map<number, INoteKey>()),
    getNotes() {
        return cloneObject([
            ...get()._notes.values(),
        ])
    },
    getNoteByIndex: (noteIndex: number) => {
        const note = get()._notes.get(noteIndex)
        if (note) {
            return cloneObject(note)
        }
    },
    updateNote: (note: INoteKey) => {
        const { _notes } = get()
        _notes.set(note.noteIndex, note)

        set({
            _notes,
        })
    },
}))

export { useNotesStore };
