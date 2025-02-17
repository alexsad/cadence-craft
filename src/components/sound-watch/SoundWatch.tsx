import { useRef } from "react";
import { useNoteStore } from "../../stores/useNoteStore";
import { useMount } from "../../util/use-mount";

let audioContext = new AudioContext();

const SoundWatch: React.FC = () => {
    const lastSource = useRef<AudioBufferSourceNode>(null)
    useMount(async () => {
        useNoteStore.subscribe(async ({ getCurrNote }) => {
            const currNote = getCurrNote()
            console.log('note:', currNote)
            if (audioContext.state === 'running') {
                lastSource.current?.stop()
                await audioContext.close()
                audioContext = new AudioContext();
            }
            if (currNote?.audioBuffer) {
                lastSource.current = audioContext.createBufferSource();
                lastSource.current.buffer = currNote.audioBuffer;
                lastSource.current.connect(audioContext.destination);
                lastSource.current.start();
            }
        })
    })
    return null
}

export { SoundWatch };

