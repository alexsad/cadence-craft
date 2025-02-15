import { useState } from "react";
import { INoteKey } from "../../models/note-key";
import { useNotesStore } from "../../stores/useNotesStore";
import { useMount } from "../../util/use-mount";

let audioContext = new AudioContext();

const MidWatch: React.FC = () => {
    // const [notes, setNotes] = useState<INoteInput[]>([])
    const { getNoteByIndex } = useNotesStore.getState()
    const [lastNote, setLastNote] = useState<INoteKey | undefined>()

    const playKey = async (noteIndex: number) => {
        const note = getNoteByIndex(noteIndex)

        if (note?.audioBuffer) {
            setLastNote(note)
            if (audioContext.state === 'running') {
                await audioContext.close()
                audioContext = new AudioContext();
            }
            const source = audioContext.createBufferSource();
            source.buffer = note.audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        }
    }

    // const stop = async () => {
    //     await audioCenterInstance.stop()
    // }

    useMount(async () => {
        try {
            const { inputs } = await navigator.requestMIDIAccess()
            for (const input of inputs.values()) {
                input.onmidimessage = midiMessage => {
                    if (midiMessage?.data?.length) {
                        const [, noteIndex = 0, velocity = 0] = midiMessage.data;
                        console.log('Nota:', noteIndex, 'Velocidade:', velocity);
                        playKey(noteIndex)
                    }
                };
            }
        } catch (error) {
            console.error(error)
            alert((error as Error).message)
        }
    })

    return (
        <div>teste:{JSON.stringify(lastNote)}</div>
    )
}

export { MidWatch };

