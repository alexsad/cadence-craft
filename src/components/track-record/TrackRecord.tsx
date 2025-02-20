import { useEffect, useRef, useState } from "react"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { Flex } from "../../ui/flex"
import { concatenateAudio } from "../../util/concatenate-audio"
import { TrackRecordTimeLine } from "./TrackRecordTimeLine"

const TrackRecord: React.FC = () => {
    const { addNote, getTracks, clear, getNormalizeTracks } = useRecordStore.getState()
    const tracksCount = useRecordStore(state => state._tracks.length)
    const [isProcessing, setIsProcessing] = useState(false)
    const bpmnRef = useRef<HTMLInputElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const playRecord = (type: 'RAW' | 'NORMALIZED') => async () => {

        setIsProcessing(true)
        try {
            const bpm = Number(bpmnRef.current?.value || 100)
            const tracks = type === 'RAW' ? getTracks() : getNormalizeTracks(bpm)

            const blob = await concatenateAudio(
                tracks
            )

            const url = URL.createObjectURL(blob);
            // Criar o elemento de áudio e adicionar à página
            const audio = audioRef.current;
            if (audio) {
                audio.controls = true;
                audio.src = url;
                await audio.play();
            }
        } catch (error) {
            console.error(error)
        }

        setIsProcessing(false)
    }

    const clearTracks = async () => {
        setIsProcessing(true)
        await clear()
        setIsProcessing(false)
    }

    useEffect(() => {
        const sub = useNoteStore.subscribe(({ getCurrNote }) => {
            const currNote = getCurrNote()
            if (currNote && currNote?.duration > 0 && !isProcessing) {
                addNote(currNote)
            }
        })
        return sub
    }, [addNote, isProcessing])

    return (
        <Flex vertical>
            <Flex padding=".5rem 0" gap=".5rem">
                <label>
                    BPM:
                    <input
                        type="number"
                        min={20}
                        max={200}
                        name="bpm"
                        defaultValue={100}
                        ref={bpmnRef}
                        disabled={isProcessing || tracksCount === 0}
                    />
                </label>
            </Flex>
            <TrackRecordTimeLine />
            <Flex gap=".5rem" padding=".5rem 0" >
                <button onClick={playRecord('RAW')} disabled={isProcessing || tracksCount === 0}>Play</button>
                <button onClick={playRecord('NORMALIZED')} disabled={isProcessing || tracksCount === 0}>Play Normalized</button>
                <button onClick={clearTracks} disabled={isProcessing || tracksCount === 0}>Clear</button>
            </Flex>
            <Flex align="center" justify="center" padding=".5rem">
                <audio ref={audioRef} />
            </Flex>
        </Flex>
    )
}

export { TrackRecord }

