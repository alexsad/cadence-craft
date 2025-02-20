import { useEffect, useRef, useState } from "react"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { sleep } from "../../util/sleep"

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
    const { addNote, getTracks, clear, normalizeTracks } = useRecordStore.getState()
    const { setCurrNote } = useNoteStore.getState()
    const tracksCount = useRecordStore(state => state._tracks.length)
    const [isProcessing, setIsProcessing] = useState(false)
    const bpmnRef = useRef<HTMLInputElement>(null)

    const onNormalizeTrack = async () => {
        const bpm = Number(bpmnRef.current?.value || 100)
        setIsProcessing(true)
        await normalizeTracks(bpm)
        setIsProcessing(false)
    }

    const playRecord = async () => {
        setIsProcessing(true)
        const tracks = getTracks()
        for await (const track of tracks) {
            setCurrNote({
                ...track,
                duration: 0,
            })
            await sleep(track.duration / 1000)
            setCurrNote(undefined)
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
                <button onClick={playRecord} disabled={isProcessing || tracksCount === 0}>Play</button>
                <button onClick={clearTracks} disabled={isProcessing || tracksCount === 0}>Clear</button>
                <input
                    type="number"
                    min={20}
                    max={200}
                    name="bpm"
                    defaultValue={100}
                    ref={bpmnRef}
                    disabled={isProcessing || tracksCount === 0}
                />
                <button onClick={onNormalizeTrack}>normalize</button>
            </div>
            <TrackRecordTimeLine />
        </div>
    )
}

export { TrackRecord }

