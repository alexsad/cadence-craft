import { useNotesStore } from "../../stores/useNotesStore";
import { useNoteStore } from "../../stores/useNoteStore";
import { useMount } from "../../util/use-mount";

const MidWatch: React.FC = () => {
    const { setCurrNote } = useNoteStore.getState()
    const { getNoteByIndex } = useNotesStore.getState()
    // const lastNote = useNoteStore(state => state.getCurrNote())

    useMount(async () => {
        try {
            const { inputs } = await navigator.requestMIDIAccess()
            for (const input of inputs.values()) {
                input.onmidimessage = midiMessage => {
                    if (midiMessage?.data?.length) {
                        const [, noteIndex = 0, velocity = 0] = midiMessage.data;
                        console.log('Nota:', noteIndex, 'Velocidade:', velocity);
                        setCurrNote(getNoteByIndex(noteIndex))
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

