import { useNotesStore } from "../../stores/useNotesStore";
import { useNoteStore } from "../../stores/useNoteStore";
import { useMount } from "../../util/use-mount";

const MidWatch: React.FC = () => {
    const { setCurrNote, getCurrNote } = useNoteStore.getState()
    const { getNoteByIndex } = useNotesStore.getState()
    // const lastNote = useNoteStore(state => state.getCurrNote())

    useMount(async () => {
        try {
            const { inputs } = await navigator.requestMIDIAccess()
            for (const input of inputs.values()) {
                input.onmidimessage = midiMessage => {
                    if (midiMessage?.data?.length) {
                        const [status, noteIndex = 0, velocity = 0] = midiMessage.data;
                        // console.log('Nota:', noteIndex, 'Velocidade:', velocity);
                        if ((status & 0xf0) === 0x80 || ((status & 0xf0) === 0x90 && velocity === 0)) {
                            console.log(`Tecla solta: ${noteIndex}`);
                            const currNote = getCurrNote()
                            if (currNote) {
                                setCurrNote({
                                    ...currNote,
                                    duration: new Date().getTime() - currNote.startAt
                                })
                            }
                            setCurrNote(undefined)
                        } else {
                            const note = getNoteByIndex(noteIndex)
                            if (note) {
                                setCurrNote({
                                    ...note,
                                    audioBuffer: undefined,
                                    startAt: new Date().getTime(),
                                })
                            }
                        }
                    }
                };
            }
        } catch (error) {
            console.error(error)
            alert((error as Error).message)
        }
    })

    return (
        // <div>teste:{JSON.stringify(lastNote)}</div>
        <div></div>
    )
}

export { MidWatch };

