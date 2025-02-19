import { useRef } from "react";
import { useNotesStore } from "../../stores/useNotesStore";
import { useNoteStore } from "../../stores/useNoteStore";
import { useMount } from "../../util/use-mount";

let audioContext = new AudioContext();

const SoundWatch: React.FC = () => {
    const lastSource = useRef<AudioBufferSourceNode>(null)
    const { getNoteByIndex } = useNotesStore.getState()

    useMount(async () => {
        useNoteStore.subscribe(async ({ getCurrNote }) => {
            const track = getCurrNote()
            const currNote = getNoteByIndex(track?.noteIndex || 0)
            if (audioContext.state === 'running') {
                lastSource.current?.stop()
                await audioContext.close()
                audioContext = new AudioContext();
            }
            if (currNote?.audioBuffer && track?.duration === 0) {
                lastSource.current = audioContext.createBufferSource();
                lastSource.current.buffer = currNote.audioBuffer;
                lastSource.current.loop = true
                lastSource.current.connect(audioContext.destination);
                lastSource.current.start();
            }
        })
    })
    return null
}

export { SoundWatch };

