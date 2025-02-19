import { useEffect, useState } from "react"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { sleep } from "../../util/sleep"

const TrackRecord: React.FC = () => {
    const { addNote, getTracks, clear } = useRecordStore.getState()
    const { setCurrNote } = useNoteStore.getState()
    const tracks = useRecordStore(state => state._tracks)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showTracks, setShowTracks] = useState(false)

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
            <button onClick={playRecord} disabled={isProcessing || tracks.length === 0}>Play</button>
            <button onClick={clearTracks} disabled={isProcessing || tracks.length === 0}>Clear</button>
            <button onClick={() => setShowTracks(!showTracks)}>Tracks</button>
            {showTracks && (
                <p>
                    {JSON.stringify(tracks)}
                </p>
            )}
        </div>
    )
}

export { TrackRecord }

