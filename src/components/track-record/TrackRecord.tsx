import { useEffect, useRef, useState } from "react"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { concatenateAudio } from "../../util/concatenate-audio"

const trackRecordTimeLineStyle: React.CSSProperties = {
    border: '1px solid red',
    display: 'flex',
}

const rowTrackTimeLineStyle: React.CSSProperties = {
    border: '1px solid green',
    display: 'flex',
    position: 'absolute',
    height: '.5rem',
    width: '1rem',
    fontSize: '.5rem',
    textAlign: 'center',
}

const trackRecordContentStyle: React.CSSProperties = {
    border: '1px solid green',
    display: 'flex',
    position: 'relative',
    height: '266px',
    // overflowX: 'auto',
}

const TrackRecordTimeLine: React.FC = () => {
    const tracks = useRecordStore(state => state._tracks)
    const { getTracks } = useRecordStore.getState()
    const [showTracks, setShowTracks] = useState(false)


    return (
        <div
            style={trackRecordTimeLineStyle}
        >
            <button onClick={() => setShowTracks(!showTracks)}>Tracks</button>
            <div style={trackRecordContentStyle}>
                {getTracks().map((item, index) => (
                    <div
                        key={`${item.noteIndex}_${index}`}
                        style={{
                            ...rowTrackTimeLineStyle,
                            bottom: `${(item.noteIndex - 60) * 11}px`,
                            left: `${index * 10}px`,
                        }}
                    >
                        {item.code}
                    </div>
                ))}
            </div>
            {showTracks && (
                <p>
                    {JSON.stringify(tracks)}
                </p>
            )}
        </div>
    )
}


const TrackRecord: React.FC = () => {
    const { addNote, getTracks, clear, getNormalizeTracks } = useRecordStore.getState()
    const tracksCount = useRecordStore(state => state._tracks.length)
    const [isProcessing, setIsProcessing] = useState(false)
    const bpmnRef = useRef<HTMLInputElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const playRecord = (type: 'RAW' | 'NORMALIZED') => async () => {

        setIsProcessing(true)
        const bpm = Number(bpmnRef.current?.value || 100)
        const tracks = type === 'RAW' ? getTracks() : getNormalizeTracks(bpm)

        const blob = await concatenateAudio(
            tracks
        )

        let url = URL.createObjectURL(blob);
        // Criar o elemento de áudio e adicionar à página
        let audio = audioRef.current;
        if (audio) {
            audio.controls = true;
            audio.src = url;
            await audio.play().catch(e => console.error('Erro ao reproduzir áudio:', e));
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
        <div>
            <div style={{
                display: 'flex',
            }}>
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
                <button onClick={playRecord('RAW')} disabled={isProcessing || tracksCount === 0}>Play</button>
                <button onClick={playRecord('NORMALIZED')} disabled={isProcessing || tracksCount === 0}>Play Normalized</button>
                <button onClick={clearTracks} disabled={isProcessing || tracksCount === 0}>Clear</button>
            </div>
            <audio ref={audioRef} />
            <TrackRecordTimeLine />
        </div>
    )
}

export { TrackRecord }

